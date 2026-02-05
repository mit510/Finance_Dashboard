import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

// ➕ Add transaction
export const addTransaction = async (transaction) => {
  await addDoc(collection(db, "transactions"), {
    ...transaction,
    createdAt: serverTimestamp()
  });
};

// 📥 Get transactions for user
export const getTransactions = async (userId) => {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ❌ Delete transaction
export const deleteTransaction = async (id) => {
  await deleteDoc(doc(db, "transactions", id));
};

// ✏️ Update transaction
export const updateTransaction = async (id, data) => {
  await updateDoc(doc(db, "transactions", id), data);
};
