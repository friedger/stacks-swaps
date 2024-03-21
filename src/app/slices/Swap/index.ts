import { createSlice } from "@reduxjs/toolkit";
import { setSwapAddressDetail, setSwapAmountDetail } from "./thunks";

export interface SwapAmountDetail {
  sendAmount: number;
  receiveAmount: number;
}

export interface SwapAddressDetail {
  userBTCAddress: string;
  receiverSTXAddress: string;
}

export interface SwapDetail {
  amountInfo: SwapAmountDetail;
  addressInfo: SwapAddressDetail;
}

const initialState: SwapDetail = {
  amountInfo: {
    sendAmount: 0,
    receiveAmount: 0,
  },
  addressInfo: {
    userBTCAddress: "",
    receiverSTXAddress: "",
  },
};

export const swapSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setSwapAmountDetail.fulfilled, (state, action) => {
        return {
          ...state,
          amountInfo: {
            ...state.amountInfo,
            ...action.payload,
          },
        };
      })
      .addCase(setSwapAddressDetail.fulfilled, (state, action) => {
        return {
          ...state,
          addressInfo: {
            ...state.addressInfo,
            ...action.payload,
          },
        };
      });
  },
});

export default swapSlice.reducer;
