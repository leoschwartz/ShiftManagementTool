import { atom } from "jotai";

export const userCredentialsAtom = atom({ token: null, accessLevel: -1 });

export const isLoggedInAtom = atom((get) => {
  const { token } = get(userCredentialsAtom);
  return token !== null;
});
