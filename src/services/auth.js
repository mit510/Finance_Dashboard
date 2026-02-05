import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Google login
export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

// Email signup
export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Email login
export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = async () => {
  await signOut(auth);
};
