// client/src/routing/Settings.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig.js";
import {
  doc, writeBatch, serverTimestamp, getDoc
} from "firebase/firestore";
import {
  updateProfile, reauthenticateWithCredential,
  EmailAuthProvider, updatePassword, reload
} from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import ReturnHomeButton from "../components/ReturnHomeButton.jsx";

export default function Settings() {
  const [user, loading] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [usernameLower, setUsernameLower] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUsername(snap.data().username || "");
        setUsernameLower(snap.data()?.usernameLower || "");
      }
    })();
  }, [user]);

  if (loading) return null;

  const saveUsername = async () => {
    const handle = username.trim();
    if (!handle) return alert("Username cannot be empty");

    const lower = handle.toLowerCase();
    const prevLower = usernameLower;
    if (lower === prevLower) return alert("Username is unchanged.");

    setSavingName(true);
    try {
      const usernameDoc = await getDoc(doc(db, "usernames", lower));
      if (usernameDoc.exists() && usernameDoc.data().uid !== user.uid) {
        return alert("Username is already taken!");
      }

      const batch = writeBatch(db);
      batch.set(doc(db, "usernames", lower), { uid: user.uid });
      if (prevLower && prevLower !== lower) {
        batch.delete(doc(db, "usernames", prevLower));
      }

      batch.set(
        doc(db, "users", user.uid),
        {
          username: handle,
          usernameLower: lower,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();
      await updateProfile(user, { displayName: handle });
      await reload(user);

      setUsernameLower(lower);
      alert("Username updated!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async () => {
    if (newPw.length < 6) return alert("Password must be ≥ 6 chars");
    setChangingPw(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setCurrentPw(""); setNewPw("");
      alert("Password changed!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md space-y-8 text-gray-900 dark:text-white">
          <h2 className="text-2xl font-semibold text-center text-blue-700 dark:text-yellow-300">
            Account Settings
          </h2>

          {/* Username */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveUsername();
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={saveUsername}
              disabled={savingName}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-md"
            >
              {savingName ? "Saving…" : "Save Username"}
            </button>
          </div>

          <hr className="border-gray-300 dark:border-gray-600" />

          {/* Password */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Current Password
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentPw && newPw && !changingPw) {
                  changePassword();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />

            <button
              onClick={changePassword}
              disabled={changingPw}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-md"
            >
              {changingPw ? "Saving…" : "Change Password"}
            </button>
          </div>

          <div className="mt-6">
            <ReturnHomeButton />
          </div>
        </div>
      </div>
    </div>
  );
}
