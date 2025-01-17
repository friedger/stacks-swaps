import React, { useState } from 'react';

import ChevronDownImg from '/src/assets/img/chevron-down.svg?react';
import InfoImg from '/src/assets/img/info.svg?react';
import MiaImg from '/src/assets/img/mia.png';
import SettingImg from '/src/assets/img/setting.svg?react';
import TokenList from '../../common/TokenList';
import { SwapProgress } from '../../../lib/swap';

const NftSwap = ({
  setSwapProgress,
}: {
  setSwapProgress: React.Dispatch<React.SetStateAction<SwapProgress>>;
}) => {
  const [fromTokenListVisible, setFromTokenListVisible] = useState(false);
  const [toTokenListVisible, setToTokenListVisible] = useState(false);

  const onFromTokenSelectBtnClicked = () => setFromTokenListVisible(!fromTokenListVisible);

  const onToTokenSelectBtnClicked = () => setFromTokenListVisible(!toTokenListVisible);

  return (
    <div className="w-full p-5 flex flex-col gap-3 bg-white dark:bg-[rgba(11,11,15,0.9)] rounded-[18px]">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-base leading-6 font-normal">STX Swap</p>
          <InfoImg className="dark:stroke-white stroke-special-black" />
        </div>
        <SettingImg className="dark:stroke-white stroke-special-black" />
      </div>
      <div className="p-5 flex justify-between items-center rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A] border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <div className="w-full">
          <p className="text-xs font-light leading-[14px] opacity-50">You send</p>
          <div className="mt-2 w-full flex justify-between items-center">
            <input
              className="text-[28px] leading-6 font-light outline-none bg-transparent w-1/2"
              defaultValue={1}
            />
            <button
              className="flex gap-2 items-center bg-[rgba(7,7,10,0.07)] dark:bg-[#25262B] rounded-lg px-3 py-2"
              onClick={onFromTokenSelectBtnClicked}
            >
              <img className="h-7 w-7" src={MiaImg} alt="" />
              <p className="text-xl font-medium leading-6">MIA</p>
              <ChevronDownImg className="dark:fill-white fill-special-black flex-none" />
            </button>
            {fromTokenListVisible && <TokenList setTokenListVisible={setFromTokenListVisible} />}
          </div>
          <p className="mt-4 text-xs leading-[14px] font-light opacity-50">≈$275,208</p>
          <div className="mt-2.5 mb-1 rounded-lg w-full flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between p-4 pl-3 border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[rgba(7,7,10,0.04)] text-sm leading-[17px] font-normal">
            <div className="flex gap-1.5 items-center opacity-50">
              <p>Receiver BTCMonkey address</p>
              <InfoImg className="w-3 h-3 dark:stroke-white stroke-special-black" />
            </div>
            <p className="text-xs">1LdSd6KTEvJcy...REuLzczMYC1</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex justify-between items-center rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A] border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <div className="w-full">
          <p className="text-xs font-light leading-[14px] opacity-50">You receive</p>
          <div className="w-full flex justify-between">
            <p className="mt-2 text-[28px] leading-6 font-light">0.000035</p>
            <button
              className="flex gap-2 items-center bg-[rgba(7,7,10,0.07)] dark:bg-[#25262B] rounded-lg px-3 py-2"
              onClick={onToTokenSelectBtnClicked}
            >
              <img className="h-7 w-7" src={MiaImg} alt="" />
              <p className="text-xl font-medium leading-6">MIA</p>
              <ChevronDownImg className="dark:fill-white fill-special-black flex-none" />
            </button>
            {toTokenListVisible && <TokenList setTokenListVisible={setToTokenListVisible} />}
          </div>
          <p className="mt-4 text-xs leading-[14px] font-light opacity-50">
            ≈$275,469
            <span className="ml-1 text-[#559276]">(0.0965%)</span>
          </p>
          <div className="mt-2.5 mb-1 rounded-lg w-full flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between p-4 pl-3 border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[rgba(7,7,10,0.04)] text-sm leading-[17px] font-normal">
            <div className="flex gap-1.5 items-center opacity-50">
              <p>Receiver Satoshi address</p>
              <InfoImg className="w-3 h-3 dark:stroke-white stroke-special-black" />
            </div>
            <p className="text-xs">1LdSd6KTEvJcy...REuLzczMYC1</p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center px-10">
        <p className="py-2 text-sm leading-5 font-light">
          1 MIA = 0.0004354 STX
          <span className="opacity-50"> ($1.00043) </span>
        </p>
        <ChevronDownImg className="dark:fill-white fill-special-black flex-none" />
      </div>
      <button
        className="mt-5 rounded-full w-full py-3 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black"
        onClick={() => setSwapProgress(SwapProgress.SWAP_CONFIRM)}
      >
        Preview Swap
      </button>
    </div>
  );
};

export default NftSwap;
