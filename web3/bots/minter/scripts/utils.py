import os
from re import L
from brownie import Contract, Karafuru, network, config, accounts
from pathlib import Path

NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["hardhat", "development", "ganache"]
FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["mainnet-fork"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS + FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS

contract_to_mock = {
  "karafuru": Karafuru,
}

def get_account(index=None, id=None):
  # faster scripts without having to input password manually just for tests
  if id and network.show_active() in FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS:
    return accounts.add(config["wallets"][id])

  # access to generated test accounts
  if index:
    return accounts[index]

  # default fallback
  if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
    return accounts[0]

  # only for non local environnements and named accounts
  if id:
    return accounts.load(id)

  return None


def get_contract(contract_name):
  contract_type = contract_to_mock[contract_name]
  if network.show_active() in NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS:
    if len(contract_type) <= 0:
      deploy_mocks()
    contract = contract_type[-1]
  else:
    try:
      contract_address = config["networks"][network.show_active()][contract_name]
      contract = Contract.from_abi(
          contract_type._name, contract_address, contract_type.abi
      )
    except KeyError:
      print(
        f"{network.show_active()} address not found, perhaps you should add it to the config or deploy mocks?"
      )
      print(
        f"brownie run scripts/deploy_mocks.py --network {network.show_active()}"
      )
  return contract


def deploy_mocks():
  print(f"The active network is {network.show_active()}")
  account = get_account()
  print("Deploying Mock Karafuru...")
  karafuru = Karafuru.deploy({"from": account})
  print(f"Deployed Mock Karafuru to {karafuru.address}...")
  

def download_contract_from_explorer(address):
  contract = Contract.from_explorer(address)
  
  # make sure folder exists for contract sources
  contract_folder = f'contracts/{contract._name.lower()}'
  if not os.path.exists(contract_folder):
    os.makedirs(contract_folder)

  for path, source in contract._sources.items():
      # We omit dependencies because Brownie will download dependencies by himself
      if path.startswith('@'):
        print(f'Omitting {path}')
        continue

      print(f'Downloading {path}')
      with open(f'{contract_folder}/{Path(path).name}', 'w+') as file:
        file.write(source)

  return contract
  
