import React from 'react';

import StxImg from '/src/assets/img/stx.png';
import BtcImg from '/src/assets/img/btc.png';

const SwapAssets = () => {
  return (
    <div className="max-w-[520px] w-full mt-24 flex flex-col gap-5">
      <div className="w-full flex rounded-[18px] bg-white dark:bg-[rgba(11,11,15,0.9)] p-2 gap-2.5 text-center">
        <p className="flex-1 flex items-center justify-center py-2 bg-[rgba(7,7,10,0.07)] dark:bg-[#14151A] rounded-2xl text-base font-normal">
          Catamaran Swap
        </p>
        <p className="flex-1 flex items-center justify-center py-2 rounded-2xl text-base font-normal">
          STX Swap
        </p>
        <p className="flex-1 flex items-center justify-center py-2 rounded-2xl text-base font-normal">
          NFT Swap
        </p>
      </div>
      <div className="w-full p-5 flex flex-col gap-3 bg-white dark:bg-[rgba(11,11,15,0.9)] rounded-[18px]">
        <div className="p-5 flex justify-between items-center rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A]">
          <div>
            <p className="text-xs font-light leading-[14px] opacity-50">You send</p>
            <p className="mt-2 text-[28px] leading-6 font-light">1</p>
            <p className="mt-4 text-xs leading-[14px] font-light opacity-50">≈$275,208</p>
          </div>
          <div className="flex gap-2 items-center">
            <img className="h-7 w-7" src={StxImg} alt="" />
            <p className="text-xl font-medium leading-6">STX</p>
          </div>
        </div>
        <div className="p-5 flex justify-between items-center rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A]">
          <div>
            <p className="text-xs font-light leading-[14px] opacity-50">You receive</p>
            <p className="mt-2 text-[28px] leading-6 font-light">0.000035</p>
            <p className="mt-4 text-xs leading-[14px] font-light opacity-50">
              ≈$275,469
              <span className="ml-1 text-[#559276]">(0.0965%)</span>
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <img className="h-7 w-7" src={BtcImg} alt="" />
            <p className="text-xl font-medium leading-6">BTC</p>
          </div>
        </div>
        <p className="px-10 py-2 text-sm leading-5 font-light">
          1 BTC = 0.0004354 STX
          <span className="opacity-50"> ($1.00043)</span>
        </p>
      </div>
    </div>
  );
};

export default SwapAssets;
