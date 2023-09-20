import { IUser } from "../types";
import { CS_LOCAL_STORAGE } from "./constants";

export const getUser = () => {
  const serializedUser = localStorage.getItem(CS_LOCAL_STORAGE);
  if (serializedUser != 'undefined' && serializedUser && serializedUser != null){
    return JSON.parse(serializedUser) as IUser;
  }
  return undefined
};

export const saveUser = (user: IUser) => {
  const serializedUser = JSON.stringify(user);
  localStorage.setItem(CS_LOCAL_STORAGE, serializedUser);

};

export const clearState = () => {
  const user = getUser()
  if (user) {
    localStorage.removeItem(CS_LOCAL_STORAGE);
  }

};
