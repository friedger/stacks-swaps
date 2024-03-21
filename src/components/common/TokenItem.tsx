import React from "react";

const TokenItem = ({
  name,
  descrption,
  imgSource,
}: {
  name: string;
  descrption: string;
  imgSource: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <img src={imgSource} alt="" className="w-7 h-7" />
      <div>
        <p className="text-sm leading-[18px]">{name}</p>
        <p className="text-xs leading-[14px] opacity-50">{descrption}</p>
      </div>
    </div>
  );
};

export default TokenItem;
