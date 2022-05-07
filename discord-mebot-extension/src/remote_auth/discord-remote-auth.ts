import { Base64 } from "js-base64";

export class RemoteAuthClient extends EventTarget {
  debug: boolean;
  intervals: NodeJS.Timer[];
  keyPair?: CryptoKeyPair;
  canceled: boolean;
  ws?: WebSocket;
  _ping: number;
  _lastHeartbeat: number;

  constructor(debug: boolean) {
    super();
    this.debug = debug;
    this.intervals = [];

    this.canceled = false;
    this._ping = 0;
    this._lastHeartbeat = 0;
  }

  async init() {
    this.keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  log(info: string) {
    console.log("[RemoteAuthClient]", info);
  }
  emit(type: string, detail?: unknown) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
  connect() {
    this.ws = new WebSocket("wss://remote-auth-gateway.discord.gg/?v=1");
    this.ws.onmessage = (message) => {
      if (this.debug) this.log(`<- ${message.data}}`);
      try {
        this.onMessage(JSON.parse(message.data));
      } catch (error) {
        if (this.debug && error instanceof Error) this.log(error.message);
        else throw error;
      }
    };
    this.ws.onclose = () => {
      if (this.debug) this.log("DISCONNECTED");
      this.intervals.forEach((x) => clearInterval(x));
      this.emit("close");
    };
  }
  send(data: unknown) {
    const dataStr = JSON.stringify(data);
    if (this.debug) this.log(`-> ${dataStr}`);
    this.ws?.send(dataStr);
  }
  sendHeartbeat() {
    this._lastHeartbeat = Date.now();
    this.send({ op: "heartbeat" });
  }
  async decryptPayload(payload?: string) {
    if (this.keyPair && payload) {
      return await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        this.keyPair?.privateKey,
        Base64.toUint8Array(payload)
      );
    }
  }
  async onMessage(p: {
    op: string;
    heartbeat_interval?: number;
    encrypted_nonce?: string;
    encrypted_token?: string;
    encrypted_user_payload?: string;
    fingerprint?: string;
  }) {
    switch (p.op) {
      case "hello":
        console.log("keypair", this.keyPair);
        if (this.keyPair) {
          const spki = await window.crypto.subtle.exportKey(
            "spki",
            this.keyPair?.publicKey
          );
          const encodedPublicKey = Base64.fromUint8Array(new Uint8Array(spki));
          this.intervals.push(
            setInterval(
              this.sendHeartbeat.bind(this),
              p.heartbeat_interval as number
            )
          );
          this.send({
            op: "init",
            encoded_public_key: encodedPublicKey,
          });
        }

        break;
      case "nonce_proof":
        const decryptedNonce = await this.decryptPayload(p.encrypted_nonce);
        console.log(decryptedNonce);
        const nonceHash = await window.crypto.subtle.digest(
          "SHA-256",
          decryptedNonce
        );
        this.send({
          op: "nonce_proof",
          proof: Base64.fromUint8Array(new Uint8Array(nonceHash), true),
        });
        break;
      case "pending_remote_init":
        console.log(p.fingerprint);
        this.emit("pendingRemoteInit", p.fingerprint);
        break;
      case "pending_finish":
        const decryptedUserBuffer = await this.decryptPayload(
          p.encrypted_user_payload
        );
        const user = String.fromCharCode(
          ...new Uint8Array(decryptedUserBuffer)
        );
        const userData = user.toString().split(":");
        this.emit("pendingFinish", {
          id: userData[0],
          discriminator: userData[1],
          avatar: userData[2],
          username: userData[3],
        });
        break;
      case "finish":
        const decryptedTokenBuffer = await this.decryptPayload(
          p.encrypted_token
        );
        const token = String.fromCharCode(
          ...new Uint8Array(decryptedTokenBuffer)
        );
        this.emit("finish", token);
        break;
      case "cancel":
        this.canceled = true;
        this.emit("cancel");
        break;
      case "heartbeat_ack":
        this._ping = Date.now() - this._lastHeartbeat;
        break;
    }
    this.emit("raw", p);
  }
}
