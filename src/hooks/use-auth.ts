import { useEffect } from "react";
import { setUser, removeUser } from "@/src/redux/slices/userSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirebaseApp } from "@/src/firebase";
import { useAppDispatch, useAppSelector } from "./redux-hooks";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { email, token, id } = useAppSelector((state) => state.user);

  useEffect(() => {
    getFirebaseApp();
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          email: user.email,
          id: user.uid,
          token: user.refreshToken,
        }));
      } else {
        dispatch(removeUser());
      }
    });
    return unsub;
  }, [dispatch]);

  return {
    isAuth: !!email,
    email,
    token,
    id,
  };
}