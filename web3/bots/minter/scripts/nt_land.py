import os
import json

from web3 import Web3
from flashbots import flashbot
from brownie import NTLandDeploy, Contract, accounts
    
OLD_PROXY_CONTRACT = "0x3c54b798b3aad4f6089533af3bdbd6ce233019bb"
LAND_CONTRACT_OWNER = '0xa8da6166cbd2876ccde424ee2a717c355be4702b'

def main():
  account =  accounts.at("0x83e7fc69d7c99943afd9122ad0f8bb575e00597c", force=True)
  owner =  accounts.at(LAND_CONTRACT_OWNER, force=True)
  nt_land = Contract.from_abi(NTLandDeploy._name, OLD_PROXY_CONTRACT, NTLandDeploy.abi)
  print(account)
  # nt_land.setContract("0x5ecf768c2cfbeea58f5192ebb96d239425592c67", {"from": owner})
  tx = nt_land.buyLand({"from": account })
  tx.wait(1)
  print(tx.events)
  print(nt_land.balanceOf(account))
  print(nt_land.ownerOf("2582"))
  print(nt_land.getLocation("2582"))

if __name__ == '__main__':
  main()

