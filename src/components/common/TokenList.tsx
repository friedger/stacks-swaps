import React, { useEffect, useRef } from 'react';
import TokenItem from './TokenItem';

import CloseImg from '/src/assets/img/close.svg?react';
import StxImg from '/src/assets/img/stx.png';

const TokenList = ({
  setTokenListVisible,
}: {
  setTokenListVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as any)) {
        setTokenListVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setTokenListVisible]);

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-20 flex items-center justify-center backdrop-blur-sm">
      <div
        ref={wrapperRef}
        className="w-full max-w-[414px] bg-white dark:bg-[#14151A] flex flex-col gap-3 p-5 rounded-[18px] shadow-sm border-[1px] border-[rgba(7,7,10,0.1)]"
      >
        <div className="w-full flex justify-between">
          <p className="text-base leading-6">Select a token</p>
          <button onClick={() => setTokenListVisible(false)}>
            <CloseImg className="w-4 h-4 dark:stroke-white stroke-special-black" />
          </button>
        </div>
        <input
          type="text"
          className="border-[rgba(255,255,255,0.1)] border-[1px] bg-[rgba(7,7,10,0.07)] dark:bg-[#191A20] px-3 py-4 rounded-md outline-none"
          placeholder="Seach name"
        />
        <div className="h-[1px] w-full bg-[rgba(255,255,255,0.1)]" />
        <div className="flex flex-col gap-6">
          <TokenItem name="STX" imgSource={StxImg} descrption="Stack’s native token" />
          <TokenItem name="STX" imgSource={StxImg} descrption="Stack’s native token" />
          <TokenItem name="STX" imgSource={StxImg} descrption="Stack’s native token" />
          <TokenItem name="STX" imgSource={StxImg} descrption="Stack’s native token" />
          <TokenItem name="STX" imgSource={StxImg} descrption="Stack’s native token" />
        </div>
      </div>
    </div>
  );
};

export default TokenList;
