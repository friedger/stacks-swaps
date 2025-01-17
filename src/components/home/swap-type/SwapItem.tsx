import React from 'react';
import { Link } from 'react-router-dom';

import StxImg from '/src/assets/img/stx.png';
import BtcImg from '/src/assets/img/btc.png';
import SwapImg from '/src/assets/img/swap.svg?react';

const SwapItem = () => {
  return (
    <div className="flex-1 flex flex-col items-center bg-white dark:bg-[rgba(11,11,15,0.9)] border-[1px] border-[rgba(255,255,255,0.1)] rounded-[18px] px-[18px] py-10">
      <div className="flex gap-3">
        <img src={BtcImg} alt="" className="w-[52px] h-[52px] rotate-[15deg]" />
        <SwapImg className="w-6" />
        <img src={StxImg} alt="" className="w-[52px] h-[52px]" />
      </div>
      <p className="text-base leading-6 text-center mt-[18px]">
        Swap between BTC and STC chain using catamaran swaps
      </p>
      <Link
        to="/swaps"
        className="mt-5 rounded-full px-6 py-3 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black"
      >
        Swap now
      </Link>
    </div>
  );
};

export default SwapItem;
