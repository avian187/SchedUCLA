// client/src/routing/Home.jsx
import React from "react";
import UclaMap from "../components/UclaMap";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* full-screen map behind it */}
      <UclaMap />
    </div>
  );
}