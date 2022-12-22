import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";

export const useLogin = () => {
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const login = async (token) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithCustomToken(auth, token);
      if (!res) {
        throw new Error("Could not complete signup");
      }
      const docRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(docRef);
      const user = docSnap.data();

      dispatch({ type: "LOGIN", payload: user });
      console.log(user);
      setIsPending(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
