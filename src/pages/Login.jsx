import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/firebase";

const provider = new GoogleAuthProvider();

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 border rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
