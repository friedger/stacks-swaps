import React, { useState } from 'react';
import CatamaranSwap from './catamaran-swap/CatamaranSwap';
import SwapButton from './SwapButton';
import SwapConfirm from './SwapConfirm';
import SwapComplete from './SwapComplete';
import StxSwap from './stx-swap/StxSwap';
import NftSwap from './nft-swap/NftSwap';
import { SwapItems, SwapProgress } from '../../lib/swap';

const Swap = () => {
  const [swapProgress, setSwapProgress] = useState<SwapProgress>(SwapProgress.PREVEIW_SWAP);
  const [selectedHeaderItem, setSelectedHeaderItem] = useState<SwapItems>(
    SwapItems.CANTAMARAN_SWAP
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1440px] flex justify-center px-5 pb-8">
        <div className="max-w-[590px] w-full mg-18 sm:mt-24 flex flex-col gap-5">
          {SwapProgress.PREVEIW_SWAP === swapProgress ? (
            <>
              <div className="w-full flex rounded-[18px] bg-white dark:bg-[rgba(11,11,15,0.9)] p-2 gap-2.5 text-center">
                <SwapButton
                  name={SwapItems.CANTAMARAN_SWAP}
                  setSelectedHeaderItem={setSelectedHeaderItem}
                  selectedHeaderItem={selectedHeaderItem}
                />
                <SwapButton
                  name={SwapItems.STX_SWAP}
                  setSelectedHeaderItem={setSelectedHeaderItem}
                  selectedHeaderItem={selectedHeaderItem}
                />
                <SwapButton
                  name={SwapItems.NFT_SWAP}
                  setSelectedHeaderItem={setSelectedHeaderItem}
                  selectedHeaderItem={selectedHeaderItem}
                />
              </div>
              {(() => {
                switch (selectedHeaderItem) {
                  case SwapItems.CANTAMARAN_SWAP:
                    return <CatamaranSwap setSwapProgress={setSwapProgress} />;
                  case SwapItems.STX_SWAP:
                    return <StxSwap setSwapProgress={setSwapProgress} />;
                  case SwapItems.NFT_SWAP:
                    return <NftSwap setSwapProgress={setSwapProgress} />;
                }
              })()}
            </>
          ) : (
            <>
              {(() => {
                switch (swapProgress) {
                  case SwapProgress.SWAP_CONFIRM:
                    return <SwapConfirm setSwapProgress={setSwapProgress} />;
                  case SwapProgress.SWAP_COMPLETED:
                    return <SwapComplete setSwapProgress={setSwapProgress} />;
                }
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Swap;
