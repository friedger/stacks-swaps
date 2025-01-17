import { createSlice } from "@reduxjs/toolkit";
import { userConnected } from "./thunks";

export interface UserState {
  isAuthenticated: boolean;
  wallet: {
    stxAddress: string;
    btcAddress: string;
    stxPublicKey: string;
  };
}

const initialState: UserState = {
  isAuthenticated: false,
  wallet: {
    stxAddress: "",
    btcAddress: "",
    stxPublicKey: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userConnected.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export default userSlice.reducer;
