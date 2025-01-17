import React from 'react';

import StxImg from '/src/assets/img/stx.png';
import BtcImg from '/src/assets/img/btc.png';
import DownImg from '/src/assets/img/down.svg?react';
import { useAppSelector } from '../../app/hooks';
import { SwapProgress } from '../../lib/swap';

const SwapConfirm = ({
  setSwapProgress,
}: {
  setSwapProgress: React.Dispatch<React.SetStateAction<SwapProgress>>;
}) => {
  const swapInfo = useAppSelector(state => state.swap);
  const {
    amountInfo: { sendAmount, receiveAmount },
    addressInfo: { userBTCAddress, receiverSTXAddress },
  } = swapInfo;

  const onGoBackBtnClicked = () => {
    setSwapProgress(SwapProgress.PREVEIW_SWAP);
  };

  const onConfirmBtnClicked = async () => {
    setSwapProgress(SwapProgress.SWAP_COMPLETED);
  };

  return (
    <div className="w-full p-5 flex flex-col gap-3 bg-white dark:bg-[rgba(11,11,15,0.9)] rounded-[18px]">
      <p className="text-base leading-6 font-normal">Catamaran Swap</p>
      <div className="p-5 flex flex-col gap-5 rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A] border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <img className="h-7 w-7" src={StxImg} alt="" />
            <p className="text-2xl font-medium leading-6">{sendAmount}</p>
          </div>
          <p className="text-[28px] leading-6">STX</p>
        </div>
        <div className="w-7 h-7 flex items-center justify-center">
          <DownImg className="dark:stroke-white stroke-special-black" />
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <img className="h-7 w-7" src={BtcImg} alt="" />
            <p className="text-2xl font-medium leading-6">{receiveAmount}</p>
          </div>
          <p className="text-[28px] leading-6">BTC</p>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between sm:items-center text-sm leading-[17px] opacity-50 font-normal">
          <p>Your BTC address</p>
          <p className="text-xs">{userBTCAddress}</p>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between sm:items-center text-sm leading-[17px] opacity-50 font-normal">
          <p>Receiver STX address</p>
          <p className="text-xs">{receiverSTXAddress}</p>
        </div>
        <div className="h-[1px] bg-[rgba(255,255,255,0.1)]" />
        <p className="text-sm leading-5 font-extralight">
          You will recive {receiveAmount} BTC. Transaction can be cancelled after 100 blocks.
        </p>
      </div>
      <div className="text-sm leading-[14px] flex flex-col gap-5 p-5 rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A] border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <div className="w-full flex justify-between items-center">
          <p className="opacity-50">Price</p>
          <p>
            {receiveAmount} BTC/{sendAmount} STX
          </p>
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="opacity-50">Network Fee</p>
          <p>~$14.90</p>
        </div>
      </div>

      <div className="w-full flex justify-between gap-3">
        <button
          className="mt-5 flex-1 rounded-full py-3 bg-white dark:bg-special-black text-base font-medium leading-5 dark:text-white text-special-black border-[1px] dark:border-[white] border-special-black"
          onClick={onGoBackBtnClicked}
        >
          Go back
        </button>
        <button
          className="mt-5 flex-1 rounded-full py-3 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black"
          onClick={onConfirmBtnClicked}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SwapConfirm;
