import React from "react";

import FaqItem from "./FaqItem";

const Faq = () => {
  return (
    <div className="w-full mt-[120px] mb-[184px]">
      <h1 className="text-[28px] leading-[33px] font-medium text-center">
        FAQ
      </h1>
      <div className="mt-10 w-full flex flex-col gap-3">
        <FaqItem title="What can go wrong with catamaran swaps (BTC - STX)?">
          With Stacks 2.0x, it can happen that Bitcoin transactions can't be
          verified on the Stacks blockchain due to so-called flash blocks. These
          Bitcoin blocks were not mined by Stacks miners and they are not
          visible to the Stacks blockchain. This changes with Stacks 2.1.
          Therefore, only use these swaps with users that you trust to resolve
          such a case off-chain.
        </FaqItem>
        <FaqItem title="What can go wrong with atomic swaps?">
          * When creating the swap, you could enter the wrong token, you could
          enter the wrong amount, the UI could calculate the smallest unit of
          tokens incorrectly. **Check all details when signing the
          transaction!**
          <br />* When finalizing the swap, you could have used the wrong swap
          id. **Check all details when signing the transaction!**
          <br />
          The swap can be canceled after 100 blocks. Therefore, make sure that
          the swap is finalized before. Use a suitable fee.
        </FaqItem>
        <FaqItem title="Where can I get FRIE tokens to pay fees?">
          FRIE tokens can be minted at a price of 1 STX = 1 FRIE. The token
          contract can be found e.g. at{" "}
          <a
            href="https://explorer.stacks.co/txid/SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X.friedger-token-v1?chain=mainnet"
            className="text-blue-500"
          >
            Stacks explorer (friedger.btc.friedger-token-v1)
          </a>
          . All minting fees go to friedger.btc. Currently, there is no UI to
          mint FRIE tokens. Some tokens were distributed as a bonus by Friedger
          Pool during cycle #16.
        </FaqItem>
        <FaqItem title="Where can I find more details about the used smart contracts?">
          The smart contracts are open source and contains several tests. You
          find the git repo at{" "}
          <a
            href="https://github.com/friedger/clarity-catamaranswaps"
            className="text-blue-500"
          >
            github.com/friedger/clarity-catamaranswaps
          </a>
          .
        </FaqItem>
        <FaqItem title="What was the first swap?">
          Read about the first swap of an NFT on Stacks for Bitcoins{" "}
          <a
            href="https://app.sigle.io/friedger.id/A-l0d8h0Bq7uEGTWl004B"
            className="text-blue-500"
          >
            here
          </a>
          .
        </FaqItem>
      </div>
    </div>
  );
};

export default Faq;
