# fire_bundle = None

def land_bought(nft_id):
    try:
        land.functions.ownerOf(nft_id).call()
        return True
    except:
        return False

def get_owner_land_mev_tx(account, nft_id, bribe=0.01):
    land_owner_function = land.functions.ownerOf(nft_id)
    land_owner_tx = land_owner_function.buildTransaction({'gas': 100000})
#     land_owner_res = land_owner_function.call()

    return (
        mev.functions.check32BytesAndSend(
            land_owner_tx['to'],
            land_owner_tx['data'],
            w3.toHex(w3.toBytes(hexstr=account.address).rjust(32, b'\0')),
        )
        .buildTransaction({
            'gas': 100000,  # 38,336
            'value': w3.toWei(bribe, 'ether')
        })
    )

def fire_bundle(bundle, many_blocks=20):
    current_block = eth.block_number
    res = []
    for i in range(1, many_blocks):
        res.append(flash.send_bundle(bundle, target_block_number=current_block + i))
#         res.append(flash.simulate(bundle, block_tag=current_block + i))
    return res

# buy land
buy_land_tx = (
    land.functions.buyLand()
    .buildTransaction({
        'gas': 200000,  # 172,733
        'value': 0
    })    
)

# bundles
bundle_buy_3 = get_bundle([
    fill_from_sign(buy_land_tx, account_3, nonce_offset=0),
    fill_from_sign(buy_land_tx, account_adrian, nonce_offset=0),
    fill_from_sign(buy_land_tx, account_omni, nonce_offset=0),
    fill_from_sign(get_owner_land_mev_tx(
        account_omni, 2574, bribe=0.3
    ), account_3, nonce_offset=1),
])

bundle_buy_2 = get_bundle([
    fill_from_sign(buy_land_tx, account_adrian, nonce_offset=0),
    fill_from_sign(buy_land_tx, account_omni, nonce_offset=0),
    fill_from_sign(get_owner_land_mev_tx(
        account_omni, 2574, bribe=0.3
    ), account_3, nonce_offset=0),
])

bundle_buy_1 = get_bundle([
    fill_from_sign(buy_land_tx, account_omni, nonce_offset=0),
    fill_from_sign(get_owner_land_mev_tx(
        account_omni, 2574, bribe=0.3
    ), account_3, nonce_offset=0),
])

# fire
import time

# fire strategy
j = 0
while True:
    bought_lands = {i: land_bought(i) for i in [2571, 2572, 2573]}
#     total_bought = sum(bought_lands.values())
    
    if bought_lands[2571] and (not bought_lands[2572]) and (not bought_lands[2573]):
        print('fire 3')
        res = fire_bundle(bundle_buy_3)
    elif bought_lands[2571] and bought_lands[2572] and (not bought_lands[2573]):
        print('fire 2')
        res = fire_bundle(bundle_buy_2)
    elif bought_lands[2571] and bought_lands[2572] and bought_lands[2573]:
        print('fire 1')
        res = fire_bundle(bundle_buy_1)
    
    if j % 60 == 0:
        print('sleep')
    j += 1
    time.sleep(3)        

import time

def fill_tx_with_from(tx_dict, account, nonce_offset=0, block='latest'):
    t = tx_dict.copy()
    t['from'] = account.address
    t['nonce'] = w3.eth.get_transaction_count(account.address, block) + nonce_offset
    t['type'] = 2
    return t

def sign_tx_with_from(tx_dict, account):
    return eth.account.sign_transaction(tx_dict, account.privateKey)

def fill_from_sign(tx_dict, account, nonce_offset=0, block='latest', verbose=False):
    fromed = fill_tx_with_from(tx_dict, account, nonce_offset=nonce_offset, block=block)
    if verbose:
        display(fromed)
    return sign_tx_with_from(fromed, account)

def get_bundle(signed_txs):
    return [
        {'signed_transaction': signed_tx.rawTransaction}
        for signed_tx in signed_txs
    ]

# fire strategy
j = 0
while True:
    bought_lands = {i: land_bought(i) for i in [2571, 2572, 2573]}
#     total_bought = sum(bought_lands.values())
    
    if bought_lands[2571] and (not bought_lands[2572]) and (not bought_lands[2573]):
        print('fire 3')
        bundle_buy_3 = get_bundle([
            fill_from_sign(buy_land_tx, account_3, nonce_offset=0),
            fill_from_sign(buy_land_tx, account_adrian, nonce_offset=0),
            fill_from_sign(buy_land_tx, account_omni, nonce_offset=0),
            fill_from_sign(get_owner_land_mev_tx(
                account_omni, 2574, bribe=0.3
            ), account_3, nonce_offset=1),
        ])

        res = fire_bundle(bundle_buy_3)
    elif bought_lands[2571] and bought_lands[2572] and (not bought_lands[2573]):
        print('fire 2')
        bundle_buy_2 = get_bundle([
            fill_from_sign(buy_land_tx, account_adrian, nonce_offset=0),
            fill_from_sign(buy_land_tx, account_omni, nonce_offset=0),
            fill_from_sign(get_owner_land_mev_tx(
                account_omni, 2574, bribe=0.3
            ), account_3, nonce_offset=0),
        ])
        res = fire_bundle(bundle_buy_2)
    elif bought_lands[2571] and bought_lands[2572] and bought_lands[2573]:
        print('fire 1')
        bundle_buy_1 = get_bundle([
            fill_from_sign(buy_land_tx, account_omni, nonce_offset=0),
            fill_from_sign(get_owner_land_mev_tx(
                account_omni, 2574, bribe=0.3
            ), account_3, nonce_offset=0),
        ])
        res = fire_bundle(bundle_buy_1)
    
    if j % 60 == 0:
        print('sleep')
    j += 1
    time.sleep(3)        