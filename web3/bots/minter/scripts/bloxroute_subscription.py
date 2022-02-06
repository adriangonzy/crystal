import uvloop
import asyncio
from bloxroute_cli.provider.ws_provider import WsProvider

from eth_account.signers.local import LocalAccount
from web3 import Web3, HTTPProvider
from flashbots import flashbot
from eth_account.account import Account
import os

BLOXROUTE_AUTH_HEADER="YzBkZDZhOTgtZjQ5YS00MWZhLTgyZDItMDY4ODhkZTc1OWQ1OjQ0Y2VjOTFmYTRjYTdhMTE4YjI4N2NmMzc0YWI0YWRm"

# https://etherscan.io/address/0xd2f668a8461d6761115daf8aeb3cdf5f40c532c6#code
KARAFURU_ADDRESS="0xd2f668a8461d6761115daf8aeb3cdf5f40c532c6"

# Create a web3 object with a standard json rpc provider, such as Infura, Alchemy, or your own node.
w3 = Web3(HTTPProvider("http://localhost:8545"))

# ETH_ACCOUNT_SIGNATURE is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.
# This is an identifying key for signing payloads to establish reputation and whitelisting
ETH_ACCOUNT_SIGNATURE: LocalAccount = Account.from_key(os.environ.get("ETH_SIGNATURE_KEY"))

# Real account doing the transactions
ETH_ACCOUNT_FROM: LocalAccount = Account.from_key(os.environ.get("TEST_PRIVATE_KEY"))

# Flashbots providers require both a standard provider and ETH_ACCOUNT_SIGNATURE (to establish reputation)
flashbot(w3, ETH_ACCOUNT_SIGNATURE)

def handle_notification(notification):
    print("Setting up flashbots Snipe Mint")
    nonce = w3.eth.get_transaction_count(ETH_ACCOUNT_FROM.address)
    
    # TODO: Change the bribe here to a better answer
    bribe = w3.toWei("0.01", "ether")

    # TODO: COMPUTE GAS"
    gas = 25000

    bundle = [
        # TODO : Add open_public_mint switch  in bundle before this one from notification param
        # contract method name is publicSalesMint
        # PUBLIC_SALES_START_PRICE 500000000000000000
        {
            "signer": ETH_ACCOUNT_FROM,
            "transaction": {
                "to": "",
                "value": bribe,
                "nonce": nonce + 1,
                "gasPrice": 0,
                "gas": gas,
            },
        },
    ]

    result = w3.flashbots.send_bundle(bundle, target_block_number=w3.eth.blockNumber + 3)
    result.wait()
    receipts = result.receipts()
    block_number = receipts[0].blockNumber

async def main():
    async with WsProvider(
        uri="wss://api.blxrbdn.com/ws",
        headers={"Authorization": BLOXROUTE_AUTH_HEADER}
    ) as ws:
        subscription_id = await ws.subscribe("newTxs", {
            "include": ["tx_hash"], 
            # "filters": f'to = {KARAFURU_ADDRESS}' -> needs paying account
        })
        while True:
            next_notification = await ws.get_next_subscription_notification_by_id(subscription_id)
            print(next_notification)
        await ws.unsubscribe(subscription_id)

if __name__ == '__main__':
    asyncio.set_event_loop(uvloop.new_event_loop())
    asyncio.get_event_loop().run_until_complete(main())
