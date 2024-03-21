import React, { useEffect, useState } from 'react';

import { AccountsApi, Configuration } from '@stacks/blockchain-api-client';
import axios from 'axios';
import { fetch } from 'cross-fetch';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../app/hooks';
import { setSwapAddressDetail, setSwapAmountDetail } from '../../../app/slices/Swap/thunks';
import { AppDispatch } from '../../../app/store';
import { SwapProgress } from '../../../lib/swap';
import { userSession } from '../../../lib/userSession';
import BtcImg from '/src/assets/img/btc.png';
import ChevronDownImg from '/src/assets/img/chevron-down.svg?react';
import InfoImg from '/src/assets/img/info.svg?react';
import StxImg from '/src/assets/img/stx.png';

interface AccountBalance {
  balance: number;
  total_fees_sent: string;
  total_received: string;
  total_sent: string;
}

const isInvalidNuber = (number: number) => {
  const regex = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;
  return (
    !regex.test(number.toString()) ||
    (number.toString().charAt(0) === '0' &&
      number.toString().charAt(1) !== '.' &&
      number.toString().length >= 2) ||
    number.toString().charAt(0) === '.'
  );
};

const CatamaranSwap = ({
  setSwapProgress,
}: {
  setSwapProgress: React.Dispatch<React.SetStateAction<SwapProgress>>;
}) => {
  const [amounts, setAmounts] = useState({
    sendAmount: 1,
    receiveAmount: 0,
  });
  const [error, setError] = useState({
    sendAmount: '',
    receiveAmount: '',
  });
  const [accountBalance, setAccountBalance] = useState<AccountBalance>({
    balance: 0,
    total_fees_sent: '',
    total_received: '',
    total_sent: '',
  });
  const [btcAddress, setBtcAddress] = useState<string>('');
  const [stxAddress, setStxAddress] = useState<string>('');
  const [usdCurrencies, setUSDCurrencies] = useState({
    stx: 0,
    btc: 0,
  });
  const { sendAmount, receiveAmount } = amounts;
  const { balance } = accountBalance;
  const dispatch = useDispatch<AppDispatch>();
  const swapInfo = useAppSelector(state => state.swap);
  const isAuthenticated = userSession.isUserSignedIn();

  const userWalletData = isAuthenticated ? userSession.loadUserData() : undefined;
  const userSTXAddress = userWalletData ? userWalletData.profile.stxAddress.mainnet : '';
  const userBTCAddress = userWalletData
    ? (userWalletData.profile.btcAddress.p2wpkh.mainnet as string)
    : '';

  useEffect(() => {
    if (userBTCAddress) {
      setBtcAddress(userBTCAddress);
    }
  }, [userBTCAddress]);

  useEffect(() => {
    console.log('axios');
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/${
          import.meta.env.VITE_COINMARKETCAP_ENDPOINT
        }/v2/cryptocurrency/quotes/latest`,
        {
          params: {
            id: '1,4847',
            // id: `${import.meta.env.VITE_COINMARKETCAP_BITCOIN_ID},${import.meta.env.VITE_COINMARKETCAP_STACKS_ID}`,
          },
          headers: {
            'X-CMC_PRO_API_KEY': 'da99cac8-e58c-446a-8047-115f740d3550',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then(res => {
        setUSDCurrencies(usdCurrencies => {
          return {
            ...usdCurrencies,
            btc: res.data.data['1'].quote.USD.price,
            stx: res.data.data['4847'].quote.USD.price,
          };
        });
      })
      .catch(err => {
        toast.error(
          `Issue occured while fetching current STX price, please refresh again.\n${err.response.data}`
        );
      });
  }, []);

  useEffect(() => {
    if (userSTXAddress) {
      void (async () => {
        const apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: import.meta.env.VITE_STACKS_API_ENDPOINT,
        });

        const accounts = new AccountsApi(apiConfig);

        const balanceInfo = await accounts.getAccountBalance({
          principal: userSTXAddress,
        });
        setAccountBalance({
          ...balanceInfo.stx,
          balance: Number(balanceInfo.stx.balance) / 10 ** 6,
        } as AccountBalance);
      })();
    }
  }, [userSTXAddress]);
  useEffect(() => {
    if (isInvalidNuber(sendAmount)) {
      setError({
        ...error,
        sendAmount: 'Invalid number',
      });
    } else if (sendAmount > balance) {
      setError({
        ...error,
        sendAmount: 'You cannot send more than your balance.',
      });
    } else if (error.sendAmount) {
      setError({
        ...error,
        sendAmount: '',
      });
    }
  }, [sendAmount, balance, error]);

  useEffect(() => {
    if (isInvalidNuber(receiveAmount)) {
      setError(error => {
        return {
          ...error,
          receiveAmount: 'Invalid number',
        };
      });
    }
  }, [receiveAmount]);

  useEffect(() => {
    if (swapInfo && isAuthenticated) {
      setAmounts(swapInfo.amountInfo);
      setBtcAddress(swapInfo.addressInfo.userBTCAddress);
      setStxAddress(swapInfo.addressInfo.receiverSTXAddress);
    }
  }, [swapInfo, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = ev;
    setAmounts({ ...amounts, [name]: value });
  };
  const onPreviewSwap = () => {
    if (Object.values(error).some(msg => !!msg)) {
      toast('Please fix the errors.', {
        type: 'error',
      });
      return;
    }
    dispatch(setSwapAmountDetail(amounts));
    dispatch(
      setSwapAddressDetail({
        userBTCAddress: btcAddress,
        receiverSTXAddress: stxAddress,
      })
    );
    setSwapProgress(SwapProgress.SWAP_CONFIRM);
  };
  return (
    <div className="w-full p-5 flex flex-col gap-3 bg-white dark:bg-[rgba(11,11,15,0.9)] rounded-[18px]">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-base leading-6 font-normal">Catamaran Swap</p>
          <div className="group flex justify-center">
            <button data-tooltip-target="tooltip-default">
              <InfoImg className="dark:stroke-white stroke-special-black" />
            </button>
            <div className="relative">
              <span className="absolute w-40 -ml-20 transition-all duration-300 bottom-7 left-0 opacity-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:opacity-100">
                This is a Catamaran Swap. You can exchange between BTC and STX.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 flex justify-between items-center rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A] border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <div className="w-full">
          <p className="text-xs font-light leading-[14px] opacity-50">You send</p>
          <div className="mt-2 w-full flex justify-between items-center">
            <div className="flex flex-col">
              <input
                className={`w-full text-[28px] leading-6 font-light bg-transparent outline-none w-1/2 ${
                  error.sendAmount ? 'outline-1 outline-red-500' : ''
                }`}
                type="number"
                name="sendAmount"
                value={sendAmount}
                onChange={onChange}
              />
              <p className="text-xs mt-1 text-red-500">{error.sendAmount}</p>
            </div>
            <div className="flex gap-2 items-center">
              <img className="h-7 w-7" src={StxImg} alt="" />
              <p className="text-xl font-medium leading-6">STX</p>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <p className="mt-4 text-xs leading-[14px] font-light opacity-50">
              ≈${sendAmount * usdCurrencies.stx}
            </p>
            <p className="mt-4 text-xs leading-[14px] font-light opacity-50">
              {`Balance: ${balance.toFixed(6)} STX`}
            </p>
          </div>
          <div className="mt-2.5 mb-1 rounded-lg w-full flex flex-col sm:flex-row sm:gap-2 p-4 pl-3 border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[rgba(7,7,10,0.04)] text-sm leading-[17px] font-normal">
            <div className="flex gap-1.5 items-center opacity-50">
              <p>Your BTC address</p>
              <InfoImg className="w-3 h-3 dark:stroke-white stroke-special-black" />
            </div>
            <input
              className="w-full outline-none bg-transparent grow"
              name="btcAddress"
              value={btcAddress}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setBtcAddress(ev.target.value)}
            />
            <p className="text-xs mt-1 text-red-500">{error.sendAmount}</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex justify-between items-center rounded-lg bg-[rgba(7,7,10,0.03)] dark:bg-[#14151A] border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <div className="w-full">
          <p className="text-xs font-light leading-[14px] opacity-50">You receive</p>
          <div className="w-full flex justify-between">
            <input
              type="number"
              name="receiveAmount"
              value={receiveAmount}
              onChange={onChange}
              className="mt-2 text-[28px] bg-transparent outline-none leading-6 font-light"
            />
            <div className="flex gap-2 items-center">
              <img className="h-7 w-7" src={BtcImg} alt="" />
              <p className="text-xl font-medium leading-6">BTC</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-[14px] font-light opacity-50">
            ≈${receiveAmount * usdCurrencies.btc}
            <span className="ml-1 text-[#559276]">(0.0965%)</span>
          </p>
          <div className="mt-2.5 mb-1 rounded-lg w-full flex flex-col sm:flex-row sm:gap-2 p-4 pl-3 border-[1px] border-[rgba(7,7,10,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[rgba(7,7,10,0.04)] text-sm leading-[17px] font-normal">
            <div className="flex gap-1.5 items-center opacity-50">
              <p>Receiver STX address</p>
              <InfoImg className="w-3 h-3 dark:stroke-white stroke-special-black" />
            </div>
            <input
              className="outline-none bg-transparent grow"
              name="stxAddress"
              value={stxAddress}
              placeholder="Type here..."
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setStxAddress(ev.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center px-10">
        <p className="py-2 text-sm leading-5 font-light">
          1 BTC = 0.0004354 STX
          <span className="opacity-50"> ($1.00043) </span>
        </p>
        <ChevronDownImg className="dark:fill-white fill-special-black flex-none" />
      </div>
      <button
        className="mt-5 rounded-full w-full py-3 dark:bg-white bg-special-black text-base font-medium leading-5 text-white dark:text-special-black"
        onClick={onPreviewSwap}
      >
        Preview Swap
      </button>
    </div>
  );
};

export default CatamaranSwap;
