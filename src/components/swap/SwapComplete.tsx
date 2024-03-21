import React from 'react';

import UpImg from '/src/assets/img/up.svg?react';
import { Link } from 'react-router-dom';
import { SwapProgress } from '../../lib/swap';

const SwapComplete = ({
  setSwapProgress,
}: {
  setSwapProgress: React.Dispatch<React.SetStateAction<SwapProgress>>;
}) => {
  const onGoSwapsBtnClicked = () => {
    setSwapProgress(SwapProgress.PREVEIW_SWAP);
  };

  return (
    <div className="w-full p-5 flex flex-col gap-6 bg-white dark:bg-[rgba(11,11,15,0.9)] rounded-[18px] items-center">
      <div className="w-[240px] h-[240px] flex items-center justify-center">
        <img src={UpImg} alt="up" className="dark:stroke-white stroke-special-black w-20 h-20" />
      </div>
      <p className="w-full text-center text-[28px] leading-10">Transation Submitted</p>
      <div className="text-sm w-full leading-[14px] p-5 border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-lg flex flex-col sm:flex-row justify-between items-center">
        <p className="opacity-50">Transaction ID</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a href="/" target="_blank" className="underline pt-2 sm:p-0">
            0xcf854186fe717fbb4ab6d...
          </a>
          <button className="rounded-full py-2 px-5 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black">
            Copy
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <button
          className="text-center w-full rounded-full py-3 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black"
          onClick={onGoSwapsBtnClicked}
        >
          Go to Your Swaps
        </button>
        <Link
          to="/"
          className="text-center w-full rounded-full py-3 text-base font-medium leading-5"
        >
          Close
        </Link>
      </div>
    </div>
  );
};

export default SwapComplete;
