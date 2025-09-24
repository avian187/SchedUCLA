import { useState, useLayoutEffect } from "react";
import { nightModeStyle } from "../style/nightMode";

export default function MapStyleToggle({ map, setIsDarkMode }) {
  const [dark, setDark] = useState(() => {
    // Read from localStorage on first load
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useLayoutEffect(() => {
    if (!map) return;

    // 1) Update Google Maps style
    map.setOptions({ styles: dark ? nightModeStyle : null });

    // 2) Toggle <body class="dark">
    document.body.classList.toggle("dark", dark);

    // 3) Store in localStorage
    localStorage.setItem("darkMode", dark);

    // 4) Notify parent (optional)
    setIsDarkMode(dark);
  }, [dark, map, setIsDarkMode]);

  return (
    <div
      onClick={() => setDark((prev) => !prev)}
      className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10
        px-4 py-2 rounded-md shadow text-sm font-semibold cursor-pointer
        transition-colors duration-300
        ${dark
          ? "bg-zinc-800 text-white hover:bg-zinc-700"
          : "bg-white text-black hover:bg-gray-100"}
      `}
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </div>
  );
}
