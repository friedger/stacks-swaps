// imports
import React, { useState } from 'react';
import ChevronUpImg from '/src/assets/img/chevron-up.svg?react';
import ChevronDownImg from '/src/assets/img/chevron-down.svg?react';

// prop types
type FaqItemPropsType = {
  title?: string;
  children?: React.ReactNode;
};

// @component FaqItem
const FaqItem = ({ title, children }: FaqItemPropsType) => {
  // hooks
  const [showAnswer, setShowAnswer] = useState(false);

  // functions
  const handleClick = () => {
    setShowAnswer(!showAnswer);
  };

  // render component
  return (
    <div>
      <div
        className="flex px-6 py-4 items-center justify-between bg-white dark:bg-[rgba(11,11,15,0.9)] rounded-[18px] cursor-pointer"
        onClick={handleClick}
      >
        <p className="text-base leading-6 font-medium">{title}</p>
        {showAnswer ? (
          <ChevronUpImg className="dark:fill-white fill-special-black flex-none" />
        ) : (
          <ChevronDownImg className="dark:fill-white fill-special-black flex-none" />
        )}
      </div>
      {children && (
        <div
          className={`flex items-center px-6 justify-between bg-transparent rounded-[18px] overflow-hidden transition-all ${
            showAnswer ? 'mt-4 py-4 h-24 opacity-1' : 'h-0 opacity-0'
          }`}
        >
          <p>{children}</p>
        </div>
      )}
    </div>
  );
};

// exports
export default FaqItem;
