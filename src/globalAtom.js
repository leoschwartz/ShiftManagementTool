import { atom } from "jotai";

export const userTokenAtom = atom(null);

export const setUserTokenAtom = atom(
  null,
  (get, set, newValue) => {
    set(userTokenAtom, newValue);
  }
);

export const userIdAtom = atom(null);

export const userAccessLevelAtom = atom(-1);

export const isLoggedInAtom = atom((get) => {
  const token = get(userTokenAtom);
  return token !== null;
});

export const homeRedirectAtom = atom((get) => {
  const accessLevel = get(userAccessLevelAtom);
  if (accessLevel === 0) {
    return "/schedule";
  } else if (accessLevel === 1) {
    return "/employeeList";
  } else if (accessLevel === 2) {
    return "/addNewUser";
  } else {
    return "/unauthorize";
  }
});
