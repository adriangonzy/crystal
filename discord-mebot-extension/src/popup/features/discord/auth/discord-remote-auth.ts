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
    this._ping = 0;
    this.debug = debug;
    this.canceled = false;
    this.intervals = [];
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

  async exportKey(): Promise<string> {
    if (!this.keyPair) throw new Error("Must initialize keypair");

    const spki = await window.crypto.subtle.exportKey(
      "spki",
      this.keyPair.publicKey
    );

    return Base64.fromUint8Array(new Uint8Array(spki));
  }

  async decryptPayload(payload: string): Promise<[ArrayBuffer, string]> {
    if (!this.keyPair) throw new Error("Must initialize keypair");

    const buffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      this.keyPair.privateKey,
      Base64.toUint8Array(payload)
    );

    return [buffer, String.fromCharCode(...new Uint8Array(buffer))];
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
        if (!p.heartbeat_interval) return;
        const encodedPublicKey = await this.exportKey();
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
        break;
      case "nonce_proof":
        if (!p.encrypted_nonce) return;
        const [buffer] = await this.decryptPayload(p.encrypted_nonce);
        const nonceHash = await window.crypto.subtle.digest("SHA-256", buffer);
        this.send({
          op: "nonce_proof",
          proof: Base64.fromUint8Array(new Uint8Array(nonceHash), true),
        });
        break;
      case "pending_remote_init":
        this.emit("pendingRemoteInit", p.fingerprint);
        break;
      case "pending_finish":
        if (!p.encrypted_user_payload) return;
        const [, user] = await this.decryptPayload(p.encrypted_user_payload);
        const userData = user.toString().split(":");
        this.emit("pendingFinish", {
          id: userData[0],
          discriminator: userData[1],
          avatar: userData[2],
          username: userData[3],
        });
        break;
      case "finish":
        if (!p.encrypted_token) return;
        const [, token] = await this.decryptPayload(p.encrypted_token);
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
