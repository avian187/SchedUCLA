import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {db} from "../firebaseConfig.js"; // Import db if needed later
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"; // Import Firestore functions if needed later

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const navigate = useNavigate();

  /* helpers */
  const isUCLA = (e) =>
    e.endsWith("@g.ucla.edu") || e.endsWith("@cs.ucla.edu") || e.endsWith("@ucla.edu");

  const login = async () => {
    if (!isUCLA(email)) return alert("You have to use a UCLA email!");
    if (!password.trim()) { alert("Password is required."); return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Successfully logged in!  Re-routing…");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const badCred = [
        "auth/invalid-credential",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/invalid-email",
        "auth/missing-password"
      ];
      if (badCred.includes(err.code)) {
        alert("Invalid e-mail or password.");
      } else {
        /* leave the original text for rare or dev-side errors */
        alert("Unable to log in: " + err.message);
      }
    }
  };

  const signup = async () => {
    if (!isUCLA(email)) return alert("You have to use a UCLA email!");
  try {
    // 1 create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid  = cred.user.uid;

    // 2 initialise a profile document for this user
    await setDoc(
      doc(db, "users", uid),
      {
        username: "",          // user chooses later in Settings
        createdAt: serverTimestamp()
      },
      { merge: true }
    );
    setMessage("Successfully signed up!  Re-routing…");
    setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      alert("Unable to sign up: " + err.message);
    }
  };

  /* UI */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* wrap everything in a form so Enter triggers onSubmit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-700">
          UCLA Login
        </h2>

        <input
          type="email"
          placeholder="UCLA email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex flex-col space-y-3">
          {/* submit button triggers form’s onSubmit plus Enter-key submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Login
          </button>

          {/* plain button so it doesn’t submit the form */}
          <button
            type="button"
            onClick={signup}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition-colors"
          >
            Sign Up
          </button>
        </div>

        {message && (
          <p className="text-green-600 text-center font-medium mt-4">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
