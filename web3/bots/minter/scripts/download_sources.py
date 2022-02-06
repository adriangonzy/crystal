from brownie import network, config
from scripts.utils import download_contract_from_explorer  

def main():
  download_contract_from_explorer(config["networks"][network.show_active()]["karafuru"])

if __name__ == '__main__':
  main()