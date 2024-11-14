import localStore from "./localstore.util";
// import { updateHeaders } from "../services";
// import { removeUserInfo } from "./user.util";
// import { upda  teHeaders } from "../services";

export const getToken = () => localStore.get_data("token");

export const setToken = (token) => localStore.store_data("token", token);

export const getAdminToken = () => localStore.get_data("Admintoken");

export const setAdminToken = (token) =>
  localStore.store_data("Admintoken", token);

export const get2FA = () => localStore.get_data("2FA");

export const set2FA = (value) => localStore.store_data("2FA", value);

// export const getCategories = () => localStore.get_data("categories");

// export const setCategories = categories =>
//   localStore.store_data("categories", categories);

export const logout = () => {
  // updateHeaders();
  // localStore.remove_data("token");
  localStore.remove_all();
  return true;
};

export const isLoggedIn = () => {
  const token = getToken();
  return !!token;
  // return Promise.resolve(response);
};
