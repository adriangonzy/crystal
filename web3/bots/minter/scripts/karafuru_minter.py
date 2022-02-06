import os
import json

from web3 import Web3
from flashbots import flashbot
from web3.auto.infura import w3
from eth_account.account import Account
from eth_account.signers.local import LocalAccount


# https://etherscan.io/address/0xc4595e3966e0ce6e3c46854647611940a09448d3
# MEVBot for bribing with coinbase address
MEV_BOT_ADDRESS="0xc4595e3966e0ce6e3c46854647611940a09448d3"

with open('mev_bot_abi.json') as abi_file:
    abi = json.load(abi_file)

Mevbot = w3.eth.contract(address=Web3.toChecksumAddress(MEV_BOT_ADDRESS), abi=abi)

# https://etherscan.io/address/0xd2f668a8461d6761115daf8aeb3cdf5f40c532c6#code
# 1 - This contract use time to open the public minting so we cant really use
# bloxroute, or we dont really need, just mint like a champ when the bell aka timestamp rings
# 2 - Another thing, publicMintSale has a protection against contracts minting, only account transactions work
KARAFURU_ADDRESS="0xd2f668a8461d6761115daf8aeb3cdf5f40c532c6"

with open('karafuru_contract_abi.json') as abi_file:
    abi = json.load(abi_file)

Karafuku = w3.eth.contract(address=Web3.toChecksumAddress(KARAFURU_ADDRESS), abi=abi)

# ETH_ACCOUNT_SIGNATURE is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.
# This is an identifying key for signing payloads to establish reputation and whitelisting
ETH_ACCOUNT_SIGNATURE: LocalAccount = Account.from_key(os.environ.get("ETH_SIGNATURE_KEY"))

# Real account doing the transactions
ETH_ACCOUNT_FROM: LocalAccount = Account.from_key(os.environ.get("TEST_PRIVATE_KEY"))

# Flashbots providers require both a standard provider and ETH_ACCOUNT_SIGNATURE (to establish reputation)
flashbot(w3, ETH_ACCOUNT_SIGNATURE)
    
def sign(tx):
    # set all the fields
    signer = tx["signer"]
    tx = tx["transaction"]
    # if tx["nonce"] is None:
    #     nonce = nonces.get(signer.address) or Nonce(0)
    #     tx["nonce"] = nonce
    # else:
    #     nonce = tx["nonce"]

    # store the new nonce
    # nonces[signer.address] = nonce + 1

    # and update the tx details
    tx["from"] = signer.address
    # tx["gasPrice"] = 0
    # if "gas" not in tx:
    #     tx["gas"] = self.web3.eth.estimateGas(tx)
    # sign the tx
    signed_tx = signer.sign_transaction(tx)
    return signed_tx

def main():

    # TODO find a way to monitor blockchain timestamp and start busting its balls with transactions, make em hurt
    # -> public time stamp = 1644069540
    # GMT: Saturday, February 5, 2022 1:59:00 PM
    # Your time zone: Saturday, February 5, 2022 2:59:00 PM GMT+01:00
    
    # TODO: Change the bribe here to a better answer
    # -> at least more that the gas of the tail txs 
    # -> see https://docs.flashbots.net/flashbots-auction/searchers/advanced/troubleshooting
    bribe = w3.toWei("1", "ether")

    # Mint limitations
    # TODO: find a way to loop over many accounts at the same time, 
    # maybe different bundles, maybe the same ? 
    # more means more risk not to mint but better gas efficiency probably ?
    max_mint_quantity_by_account = 2
    public_mint_price = w3.toWei(0.5, unit="ether") # in eth -> dutch auction, decreases progressively, see source code

    nonce = w3.eth.get_transaction_count(ETH_ACCOUNT_FROM.address)

    # args for MEV_BOT checkAndSend for bribing
    # we check that the minting account has a balanceOf 2 to pay
    check_and_send_args = [Karafuku.address, Karafuku.encodeABI(fn_name="balanceOf", args=[ETH_ACCOUNT_FROM.address]), Web3.toBytes(2)]

    signed_tx = sign({
        "signer": ETH_ACCOUNT_FROM,
        "transaction": {
            "to": Web3.toChecksumAddress(KARAFURU_ADDRESS),
            "data": Karafuku.encodeABI(fn_name="publicSalesMint", args=[2]),
            "value": max_mint_quantity_by_account * public_mint_price,
            "nonce": nonce + 1,
            "gasPrice": 0,
            "gas": 5000000,
        }
    })

    print(signed_tx)

    bundle = [
      # {
      #   "signed_transaction": signed_tx.rawTransaction
      # },
        {
            "signer": ETH_ACCOUNT_FROM,
            "transaction": {
                "to": Karafuku.address,
                "data": Karafuku.encodeABI(fn_name="publicSalesMint", args=[2]),
                "value": max_mint_quantity_by_account * public_mint_price,
                "nonce": nonce + 1,
                "gasPrice": 0
            }
        },
        # {
        #     "signer": ETH_ACCOUNT_FROM,
        #     "transaction": {
        #         "to": MEV_BOT_ADDRESS,
        #         "data": Mevbot.encodeABI(fn_name="checkBytesAndSend", args=check_and_send_args),
        #         "value": bribe,
        #         "nonce": nonce + 2,
        #         "maxPriorityFeePerGas": 0
        #     }
        # }
    ]

    signed_bundle = w3.flashbots.sign_bundle(bundle)
    simulation = w3.flashbots.simulate(signed_bundle, block_tag=w3.eth.blockNumber)
    print(simulation)

    # TODO: maybe need to send the bundle to multiple consecutive blocks and not just the current block + 1
    # result = w3.flashbots.send_bundle(bundle, target_block_number=w3.eth.blockNumber + 3)
    # result.wait()
    # receipts = result.receipts()
    # block_number = receipts[0].blockNumber

if __name__ == '__main__':
  main()



# TODO
#  - Add flashbots network to brownie 
#  - 
# 