// client/src/components/LiveEvents.jsx
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useGoogleMap } from "@react-google-maps/api";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, getDocs } from "firebase/firestore";

export default function LiveEvents({ refreshKey, initialEventId, isDarkMode }) {
  const map = useGoogleMap();
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const circlesRef = useRef([]);
  const overlayRef = useRef(null);
  const containerRef = useRef(document.createElement("div"));
  const hasOpenedInitial = useRef(false);

  // 1. Real-time listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const newEvents = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((event) => {
          const doneDate = event.doneBy?.toDate?.() || new Date(event.doneBy);
          return doneDate > new Date();
        })
      setAllEvents(newEvents);
    });
    return () => unsub();
  }, []);

  // 2. Draw circles
  useEffect(() => {
    if (!map || !window.google) return;

    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    events.forEach((event) => {
      if (!event.location) return;

      const circle = new window.google.maps.Circle({
        map,
        center: event.location,
        radius: 12,
        fillColor: "#3b82f6",
        fillOpacity: 0.7,
        strokeColor: "#1d4ed8",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true,
        zIndex: 2,
      });

      circle.addListener("click", () => setActiveEvent(event));
      circlesRef.current.push(circle);
    });
  }, [map, events]);

  // 3. Load initial ?eventId
  useEffect(() => {
    if (initialEventId && events.length > 0 && !hasOpenedInitial.current) {
      const found = events.find((e) => e.id === initialEventId);
      if (found) {
        setActiveEvent(found);
        hasOpenedInitial.current = true;
      }
    }
  }, [initialEventId, events]);

  // 4. Periodic refresh
  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const fetched = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((event) => event.doneBy.toDate() > new Date());
        setAllEvents(fetched);
      } catch (err) {
        console.error("Error refreshing events:", err);
      }
    };

    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 30000);
    return () => clearInterval(interval);
  }, []);

  // 5. OverlayView for popup
  useEffect(() => {
    if (!map || !activeEvent) return;

    class CustomOverlay extends window.google.maps.OverlayView {
      onAdd() {
        this.getPanes().floatPane.appendChild(containerRef.current);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const point = projection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(
            activeEvent.location.lat,
            activeEvent.location.lng
          )
        );

        if (point) {
          const el = containerRef.current;
          el.style.position = "absolute";
          el.style.left = `${point.x}px`;
          el.style.top = `${point.y}px`;
          el.style.transform = "translate(-50%, -100%) translateY(-8px)";
        }
      }

      onRemove() {
        containerRef.current.remove();
      }
    }

    overlayRef.current = new CustomOverlay();
    overlayRef.current.setMap(map);
    return () => overlayRef.current?.setMap(null);
  }, [map, activeEvent]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  // Filter events based on search
  useEffect(() => {
    const filteredEvents = allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        event.description.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
    );
    setEvents(filteredEvents);
  }, [debouncedSearchKeyword, allEvents]);

  if (!activeEvent) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full p-4 bg-white dark:bg-zinc-900 z-50 shadow-md">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search events..."
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        />
      </div>
      <div className="pt-20"> {/* Add padding to prevent map from being hidden under the fixed bar */}
        {createPortal(
          <div
            className={`
              relative w-72 p-4 z-50 rounded-lg shadow-lg
              border border-gray-300 bg-white text-gray-900
              dark:border-gray-600 dark:bg-gray-800 dark:text-white
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

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveEvent(null);
              }}
              className="absolute top-2 right-2 text-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-label="Close"
            >
              ×
            </button>

            {/* Event Info */}
            <div className="mb-3">
              <h3 className="font-semibold text-base mb-1">{activeEvent.title}</h3>
              <p className="text-base mb-1">{activeEvent.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                {activeEvent.date} — {activeEvent.type}
              </p>
              <p className="text-sm text-gray-400">by {activeEvent.organizer}</p>
            </div>

            {/* Share URL Button */}
            <button
              className="mt-2 px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={async (e) => {
                e.stopPropagation();
                const url = `${window.location.origin}/?eventId=${activeEvent.id}`;
                try {
                  await navigator.clipboard.writeText(url);
                  alert("Link copied!");
                } catch {
                  const input = document.createElement("input");
                  input.value = url;
                  document.body.appendChild(input);
                  input.select();
                  document.execCommand("copy");
                  document.body.removeChild(input);
                  alert("Copied fallback!");
                }
              }}
            >
              Share URL
            </button>
          </div>,
          containerRef.current
        )}
      </div>
    </>
  );
}
