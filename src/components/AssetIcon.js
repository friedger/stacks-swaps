import React from 'react';
import {
  BOOMBOX,
  FARI_TOKEN,
  MIA_TOKEN,
  THIS_IS_NUMBER_ONE,
  CRASHPUNKS,
  BANANA_TOKEN,
  USDA_TOKEN,
  DIKO_TOKEN,
  SATOSHIBLES,
} from './assets';
export function AssetIcon({ type, trait }) {
  switch (type) {
    case 'btc':
      return <img className="m-1" src="/bitcoin.webp" width="50" height="50" alt="BTC" />;
    case 'ft':
      switch (trait) {
        case MIA_TOKEN:
          return <img src="/mia.png" className="m-1" width="50" height="50" alt="mia" />;
        case FARI_TOKEN:
          return <img src="/fari.png" className="m-1" width="50" height="50" alt="fari" />;
        case BANANA_TOKEN:
          return <img src="/banana.png" className="m-1" width="50" height="50" alt="banana" />;
        case USDA_TOKEN:
          return <img src="/usda.svg" className="m-1" width="50" height="50" alt="usda" />;
        case DIKO_TOKEN:
          return <img src="/diko.svg" className="m-1" width="50" height="50" alt="diko" />;
        default:
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              className="bi bi-coin m-1"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
              />
            </svg>
          );
      }
    case 'stx':
      return (
        <img src="/Stacks_logo_full.webp" className="m-1" width="50" height="50" alt="token" />
      );
    case 'banana':
      return <img src="/banana.png" className="m-1" width="50" height="50" alt="banana" />;
    case 'xbtc':
      return <img src="/xbtc.svg" className="m-1" width="50" height="50" alt="xbtc" />;
    case 'satoshible':
      return <img src="/satoshibles.gif" className="m-1" width="50" height="50" alt="diko" />;
    default:
      switch (trait) {
        case BOOMBOX:
          return <img src="/boom.png" className="m-1" width="50" height="50" alt="token" />;

        case THIS_IS_NUMBER_ONE:
          return (
            <img src="/thisisnumberone.png" className="m-1" width="50" height="50" alt="token" />
          );
        case CRASHPUNKS:
          return <img src="/crashpunks.gif" className="m-1" width="50" height="50" alt="token" />;
        case SATOSHIBLES:
          return <img src="/satoshibles.gif" className="m-1" width="50" height="50" alt="diko" />;
        default:
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              className="bi bi-easel m-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a.5.5 0 0 1 .473.337L9.046 2H14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1.85l1.323 3.837a.5.5 0 1 1-.946.326L11.092 11H8.5v3a.5.5 0 0 1-1 0v-3H4.908l-1.435 4.163a.5.5 0 1 1-.946-.326L3.85 11H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.954L7.527.337A.5.5 0 0 1 8 0zM2 3v7h12V3H2z" />
            </svg>
          );
      }
  }
}
