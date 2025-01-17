import React from "react";

import { SwapItems } from "./Swap";

const SwapButton = ({
  name,
  selectedHeaderItem,
  setSelectedHeaderItem,
}: {
  name: SwapItems;
  selectedHeaderItem: SwapItems;
  setSelectedHeaderItem: React.Dispatch<React.SetStateAction<SwapItems>>;
}) => {
  const selected = name === selectedHeaderItem;

  return (
    <button
      className={`flex-1 flex items-center justify-center py-2 ${
        selected ? "bg-[rgba(7,7,10,0.07)] dark:bg-[#14151A]" : ""
      }  rounded-2xl text-base font-normal`}
      onClick={() => setSelectedHeaderItem(name)}
    >
      {name}
    </button>
  );
};

export default SwapButton;
