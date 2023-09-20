import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearState, saveUser } from "../../utils/localStorage";
import { IUser } from "../../types";
import Cookies from "js-cookie";
import { CS_TOKEN } from "../../utils/constants";

interface Initialstate {
  user: IUser | null;
}

const initial: Initialstate = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    setCredentials: (state, action: PayloadAction<Initialstate>) => {
      if (action.payload.user?.token) {
        Cookies.set(CS_TOKEN, action.payload.user?.token)
        delete action.payload.user?.token
      }
      state.user = action.payload.user;
      saveUser(action.payload.user!)
    },
    logOut: (state) => {
      state.user = null;
      clearState()
      Cookies.remove(CS_TOKEN)
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
