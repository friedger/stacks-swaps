import React from "react";

import Faq from "./faq/Faq";
import LandingView from "./landing-view/LandingView";
import SwapFlow from "./swap-flow/SwapFlow";
import SwapType from "./swap-type/SwapType";

const Home = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1440px] px-6 sm:px-20">
        <LandingView />
        <SwapFlow />
        <SwapType />
        <Faq />
      </div>
    </div>
  );
};

export default Home;
