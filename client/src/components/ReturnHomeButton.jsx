import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReturnHomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Return Home
    </button>
  );
}
