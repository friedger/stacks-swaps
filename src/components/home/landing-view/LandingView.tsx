import React from 'react';
import { Link } from 'react-router-dom';

import AssetsItem from './AssetsItem';

import StxImg from '/src/assets/img/stx.png';
import BtcImg from '/src/assets/img/btc.png';
import MiaImg from '/src/assets/img/mia.png';

const LandingView = () => {
  return (
    <div className="w-full flex flex-col items-center mt-[120px] sm:mb-[64px] text-center">
      <h1 className="font-semibold text-[36px] sm:text-[44px] leading-[40px] sm:leading-[60px] tracking-[1px]">
        Trustless exchange of digital assets
      </h1>
      <p className="max-w-[738px] mt-5 font-medium text-sm leading-7 text-center">
        Catamaran Swap gives you the guarantee that your assets will be transferred to the other
        party only after the transaction has been verified on the other side.
      </p>
      <Link
        to="/swaps"
        className="mt-5 rounded-full px-6 py-3 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black"
      >
        Swap now
      </Link>
      <div className="max-w-[590px] w-full mt-[67px] dark:bg-special-black bg-white rounded-[18px] flex flex-col items-center p-5 gap-10">
        <p className="font-medium text-xl leading-6 mt-[24px]">Swap your digital assets..</p>
        <div className="w-full flex flex-col gap-3 items-center sm:items-start sm:flex-row sm:justify-around mb-[26px]">
          <AssetsItem imgSource={StxImg} name="STX" />
          <AssetsItem imgSource={BtcImg} name="BTC" />
          <AssetsItem imgSource={MiaImg} name="MIA" />
        </div>
      </div>
    </div>
  );
};

export default LandingView;
