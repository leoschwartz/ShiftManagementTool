import { atom } from "jotai";

export const userTokenAtom = atom(null);

export const userAccessLevelAtom = atom(-1);

export const isLoggedInAtom = atom((get) => {
  const token= get(userTokenAtom);
  return token !== null;
});
