import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserState } from ".";

export const userConnected = createAsyncThunk(
  "connect",
  async (userInfo: UserState) => userInfo
);
