// CustomEventPopup.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGoogleMap } from "@react-google-maps/api";

export default function EventPopup({ position, onConfirm, onCancel, isDarkMode }) {
  const map = useGoogleMap();
  const containerRef = useRef(document.createElement("div"));
  const overlayRef = useRef();

  useEffect(() => {
    if (!map || !position) return;

    class CustomOverlay extends window.google.maps.OverlayView {
      onAdd() {
        const panes = this.getPanes();
        panes.floatPane.appendChild(containerRef.current);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const point = projection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(position.lat, position.lng)
        );
        if (point) {
          containerRef.current.style.position = "absolute";
          containerRef.current.style.left = `${point.x}px`;
          containerRef.current.style.top = `${point.y}px`;
          containerRef.current.style.transform = "translate(-50%, -100%) translateY(-8px)";
        }
      }

      onRemove() {
        if (containerRef.current.parentNode) {
          containerRef.current.parentNode.removeChild(containerRef.current);
        }
      }
    }

    overlayRef.current = new CustomOverlay();
    overlayRef.current.setMap(map);

    return () => {
      overlayRef.current?.setMap(null);
    };
  }, [map, position]);

  if (!position) return null;

  return createPortal(
    <div
      className={`
        relative w-72 p-4 rounded-lg shadow-lg z-50
        bg-white text-gray-900 border border-gray-300
        dark:bg-gray-800 dark:text-white dark:border-gray-600
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tail */}
      <div
        className={`
          absolute left-1/2 -bottom-2.5 transform -translate-x-1/2
          w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px]
          border-l-transparent border-r-transparent
          ${isDarkMode ? "border-t-gray-800" : "border-t-white"}
        `}
      />

      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
      >
        ×
      </button>

      <h3 className="font-semibold text-base mb-3">Create event at this location?</h3>
      <div className="flex justify-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          className="px-4 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Yes
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="px-4 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>,
    containerRef.current
  );
}
