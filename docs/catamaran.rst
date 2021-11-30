Catamaran Swaps
===============
Catamaran Swaps are trustless exchanges between owners of Bitcoins
and owners of digital assets on the Stacks blockchain.

Currently, only swaps between BTC and STX are supported in the web app.

BTC - STX
^^^^^^^^^

A swap consists of three steps:

#. the seller of STX has to put STX into escrow.
#. the buyer of BTC makes a btc transaction to the specified BTC address of the seller.
#. the seller or buyer submits the transaction id of the bitcoin transaction and the escrowed STX are released.

:note: currently, many restrictions apply to the bitcoin transaction for catamaran swaps. This means that swapping partners need to trust each other in case the BTC tx could not be verified.

Segwit transactions are not supported. Transaction with many inputs or outputs
can't be verified neither. These restrictions will be hopefully lifted
with Stacks 2.1.

Create a Swap
-----------------
The seller of STX creates the swap.

.. image:: /_static/create-btc-stx.png

After the clicking on "Sell STX", the Hiro Wallet will popup and ask the seller to confirm the tx.
The transaction result contains the swap id that must be shared with the buyer.
The result looks something like this:

    (ok u72)

The details of the swap can then be found at `https://catamaranswaps.org/stx/swap/72 <https://catamaranswaps.org/stx/swap/72>`_.

Make a Bitcoin transaction
--------------------------
The buyer of STX makes a Bitcoin transaction of the agreed amount to the BTC address of the seller.
The buyer can choose any Bitcoin wallet that supports legacy transactions.
Note, that restrictions apply, therefore, the BTC transactions have to be created carefully.

Finalize Swap
-------------
The last step requires to submit the Bitcoin transaction to the Stacks network.

Smart Contract
--------------
The smart contract was deployed at [btc-stx-swap-v1](https://explorer.stacks.co/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.btc-stx-swap-v1?chain=mainnet) by
SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.
