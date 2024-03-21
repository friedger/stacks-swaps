import React from "react";

import SwapAssets from "./SwapAssets";

const SwapFlow = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center py-[120px]">
      <div className="max-w-[610px] w-full flex flex-col">
        <h1 className="font-medium text-xl sm:text-[28px] leading-[33px] mb-[56px]">
          Looking to swap cryptocurrency on STX?
          <br /> Here's how.
        </h1>
        <div className="flex gap-6 h-10 items-center">
          <div className="w-10 h-10 flex flex-none justify-center items-center border-[1px] rounded-full border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="w-1.5 h-1.5 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] rounded-full" />
          </div>
          <p className="text-sm font-normal leading-7">
            Seller of STX has to put STX into escrow.
          </p>
        </div>
        <div className="w-[1px] h-[56px] ml-5 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
        <div className="flex gap-6 h-10">
          <div className="flex-none w-10 h-10 flex justify-center items-center border-[1px] rounded-full border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="w-1.5 h-1.5 bg-special-black dark:bg-white rounded-full" />
          </div>
          <p className="text-sm font-normal leading-7">
            The buyer of BTC makes a btc transaction to the specified BTC
            address of the seller.
          </p>
        </div>
        <div className="w-[1px] h-[56px] ml-5 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
        <div className="flex gap-6 h-10 sm:pb-0 pb-8">
          <div className="flex-none w-10 h-10 flex justify-center items-center border-[1px] rounded-full bg-white dark:bg-[#191A20] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="w-1.5 h-1.5 bg-special-black dark:bg-white rounded-full" />
          </div>
          <p className="text-sm font-normal leading-7">
            The seller or buyer submits the transaction id of the bitcoin
            transaction and the escrowed STX is released.
          </p>
        </div>
      </div>
      <SwapAssets />
    </div>
  );
};

export default SwapFlow;
