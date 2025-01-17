import { createAsyncThunk } from '@reduxjs/toolkit';
import { SwapAddressDetail, SwapAmountDetail } from '.';

export const setSwapAmountDetail = createAsyncThunk(
  'setSwapAmountDetail',
  async (swapAmountInfo: SwapAmountDetail) => swapAmountInfo
);

export const setSwapAddressDetail = createAsyncThunk(
  'setSwapAddressDetail',
  async (swapAddressInfo: SwapAddressDetail) => swapAddressInfo
);
