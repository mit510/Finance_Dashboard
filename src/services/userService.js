import { doc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "./firebase";

export const saveuser = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: new Date()
  });
};

// Update user display name
export const updateUserDisplayName = async (userId, displayName) => {
  try {
    // Update Firebase Auth profile
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: displayName
      });
    }

    // Update Firestore document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: displayName,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `profile-pictures/${userId}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const photoURL = await getDownloadURL(snapshot.ref);
    
    // Update Firebase Auth profile
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        photoURL: photoURL
      });
    }

    // Update Firestore document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      photoURL: photoURL,
      updatedAt: new Date()
    });

    return { success: true, photoURL };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};