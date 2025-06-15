import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, removeUser } from "@/src/redux/slices/userSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirebaseApp } from "@/src/firebase";

export function useAuth() {
  const dispatch = useDispatch();
  const { email, token, id } = useSelector((state: any) => state.user);

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