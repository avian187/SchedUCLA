import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function SidePanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [user] = useAuthState(auth);
  const [profileSnap] = useDocument(user ? doc(db, "users", user.uid) : null);
  const [cachedUsername, setCachedUsername] = useState("");

  useEffect(() => {
    const newUsername = profileSnap?.data()?.username;
    if (newUsername) {
      setCachedUsername(newUsername);
    }
  }, [profileSnap]);

  const handleLogout = () => signOut(auth);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 z-50 bg-blue-600 text-white p-2 rounded-r-md shadow-md hover:bg-blue-700 transition-all duration-300 ${
          isOpen ? "left-64" : "left-0"
        }`}
      >
        <FiMenu size={20} />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64
          bg-white dark:bg-zinc-900
          text-gray-800 dark:text-gray-100
          border-r dark:border-zinc-700
          shadow-md z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full px-6 py-6">
          <div className="mb-8 text-xl font-bold text-blue-700 dark:text-blue-400 tracking-wide border-b pb-4 dark:border-zinc-700">
            SchedUCLA
          </div>

          <nav className="flex flex-col space-y-3 mb-6">
            <Link
              to="/"
              className="text-base px-3 py-2 rounded-md transition text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-base px-3 py-2 rounded-md transition text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-base px-3 py-2 rounded-md transition text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800"
            >
              Contact
            </Link>
            <Link
              to="/settings"
              className="text-base px-3 py-2 rounded-md transition text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800"
            >
              Settings
            </Link>
            <Link
              to="/events"
              className="text-base px-3 py-2 rounded-md transition text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800"
            >
              All Events
            </Link>
          </nav>

          <div className="flex-grow border-t pt-4 dark:border-zinc-700">
            {user && (
              <div className="text-sm dark:text-zinc-300">
                <div className="h-5 font-semibold truncate text-gray-800 dark:text-white mb-1">
                  {cachedUsername}
                </div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 truncate mb-3">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-md transition"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
