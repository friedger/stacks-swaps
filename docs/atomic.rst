Atomic Swaps
============
Atomic swaps are trustless exchanges between digital assets of
two users of the Stacks blockchain.

Currently, exchanges between STX and any SIP-010 compliant fungible tokens (FT)
are supported.

STX - any FT
------------

A swap consists of two steps:

#. the buyer of the fungible token has to put STX into escrow.
#. the seller of the fungible token sends the fungible token to the buyer
   and receives the STX in the same transaction.

A fee of 1% is applied. It is paid by the buyer in STX or FRIE tokens. It is
hold in escrow and released when the swap was completed.

All swaps can be canceled after 100 blocks.

Create a Swap
^^^^^^^^^^^^^^
The buyer of the fungible token creates the swap.

.. image:: /_static/create-stx-ft.png

After the clicking on "Buy FT", the Hiro Wallet will popup and ask the buyer to confirm the tx.

.. image:: /_static/create-stx-ft-wallet.png

If you as a seller want to buy from a particular user, you can enter the stx address or the username
of the user in the optional seller field.

Swap ID
"""""""
The transaction result contains the **swap id** that must be shared with the seller.
The transaction result looks something like this:

.. image:: /_static/tx-result.png

The details of the swap with id *8* can then be found at `https://catmaranswaps.org/stx-ft/swap/8 <https://catmaranswaps.org/stx-ft/swap/8>`_.
For other swaps, just replace the id at the end of the link.

Finalize Swap
^^^^^^^^^^^^^
The seller of the FT have to confirm the swap conditions

STX - MIA
---------
Follow the steps of any fungible token. For the links to a swap, you can use ``stx-mia``
instead of the ``stx-ft``.

STX - FARI
----------
Follow the steps of any fungible token. The token identifier is prefilled if used ``stx-fari``
instead of the ``stx-ft``. The start url is
`https://catmaranswaps.org/stx-fari <https://catmaranswaps.org/stx-fari>`_.

Example of a completed swap: `https://catmaranswaps.org/stx-fari/swap/15 <https://catmaranswaps.org/stx-fari/swap/15>`_.

STX - NYCC
----------
Follow the steps of any fungible token using the follwoing url:

`https://www.catamaranswaps.org/stx-ft/SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5.newyorkcitycoin-token::newyorkcitycoin <https://www.catamaranswaps.org/stx-ft/SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5.newyorkcitycoin-token::newyorkcitycoin>`_.

Example of a completed swap: `https://catmaranswaps.org/stx-ft/swap/77 <https://catmaranswaps.org/stx-ft/swap/77>`_.


Smart Contract
--------------
The smart contract was deployed at [stx-ft-swap-v1](https://explorer.stacks.co/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.stx-ft-swap-v1?chain=mainnet) by
SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.

The fee contracts are
* [STX fees](https://explorer.stacks.co/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.stx-ft-swap-v1-fixed-fees?chain=mainnet): stx-ft-swap-v1-fixed-fees by SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9
* [FRIE fees](https://explorer.stacks.co/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.stx-ft-swap-v1-fixed-frie-fees?chain=mainnet): stx-ft-swap-v1-fixed-frie-fees by SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9
