import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveuser = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: new Date()
  });
};
