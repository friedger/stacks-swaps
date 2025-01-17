import { createSlice } from "@reduxjs/toolkit";
import { userConnected } from "./thunks";

export interface UserState {
  isAuthenticated: boolean;
  wallet: {
    address: string;
  };
}

const initialState: UserState = {
  isAuthenticated: false,
  wallet: {
    address: "",
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
