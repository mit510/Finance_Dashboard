import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "./firebase";

/**
 * Save a new user to Firestore
 */
export const saveuser = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL || null,
    createdAt: new Date()
  });
};

/**
 * Update user display name
 * This will CREATE the document if it doesn't exist, or UPDATE if it does
 */
export const updateUserDisplayName = async (userId, displayName) => {
  try {
    // Update Firebase Auth profile
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: displayName
      });
    }

    // Check if user document exists
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Document exists - UPDATE it
      await updateDoc(userRef, {
        name: displayName,
        updatedAt: new Date()
      });
    } else {
      // Document doesn't exist - CREATE it
      await setDoc(userRef, {
        uid: userId,
        name: displayName,
        email: currentUser?.email || '',
        photoURL: currentUser?.photoURL || null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
};

/**
 * Upload profile picture - DISABLED
 * This function is kept for compatibility but does nothing
 */

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};