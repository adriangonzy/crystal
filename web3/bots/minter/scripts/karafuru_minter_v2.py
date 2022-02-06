from flashbots import flashbot
from brownie import web3, chain
from scripts.utils import get_contract, get_account


def init_flashbots():
  # ETH_ACCOUNT_SIGNATURE is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.
  # This is an identifying key for signing payloads to establish reputation and whitelisting
  flashbot_signer = get_account(id="flashbot-signer")
  print(flashbot(web3, flashbot_signer))


def test_mint():
  tx_signer = get_account(0)
  karafuru = get_contract("karafuru")
  print(f'tx_signer: {tx_signer}')
  print(f'karafuru: {karafuru}')

  current_ts = chain[web3.eth.block_number]['timestamp']
  publicSalesTime = current_ts - 1000
  print(f'Current block {web3.eth.block_number} and current time {current_ts} ')
  print(f'Setting public sales time to: {publicSalesTime}')
  karafuru.setPublicSalesTime(publicSalesTime)
  
  print(f'Minting 2 with: {tx_signer}')
  tx = karafuru.publicSalesMint(2, { 'from': tx_signer, 'amount': web3.toWei(1, "ether")})
  tx.wait(1)
  print(f'Receipt: {tx}')

  assert karafuru.balanceOf(tx_signer) == 2


def main():
  test_mint()


if __name__ == '__main__':
  main()