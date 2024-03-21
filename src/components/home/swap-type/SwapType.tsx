import React from "react";

import SwapItem from "./SwapItem";

const SwapType = () => {
  return (
    <div className="w-full flex flex-col items-center mt-[120px]]">
      <>
        <h1 className="text-[28px] leading-[33px] font-medium text-center">
          Swap your digital assets
        </h1>
        <p className="mt-4 text-sm leading-7 text-center font-light">
          You can use Catamaran swaps in three ways.
        </p>
      </>
      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-[30px]">
        <SwapItem />
        <SwapItem />
        <SwapItem />
      </div>
    </div>
  );
};

export default SwapType;
