import React from "react";

const AssetsItem = ({
  imgSource,
  name,
}: {
  imgSource: string;
  name: String;
}) => {
  return (
    <div className="flex gap-2.5 items-center">
      <img className="h-10 w-10" src={imgSource} alt="" />
      <p className="font-medium text-[36px] leading-[43px]">{name}</p>
    </div>
  );
};

export default AssetsItem;
