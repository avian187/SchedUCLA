import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function ProtectedRoute({ children }) { // Check for authentication before rendering children
  const [user, setUser] = useState(undefined); // Start with undefined
  const [loading, setLoading] = useState(true); // 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { // Listen for authentication state changes
      setUser(firebaseUser); // Will be null if not logged in
      setLoading(false); // Set loading to false once we have the auth state
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  if (loading) { // If still loading, show a loading state
    return <div className="text-center p-10">Loading...</div>;  
  }

  if (!user) { // If user is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
