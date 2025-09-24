import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Helper to build Static Maps URL
const getStaticMapUrl = (lat, lng) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=300x180&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
};

export default function EventDetails() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllEvents(list); // Set allEvents first
      setEvents(list);    // Then set initial events
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  useEffect(() => {
    const filteredEvents = allEvents.filter(
      (event) =>
        debouncedSearchKeyword === "" ||
        event.title.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        event.description.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
    );
    setEvents(filteredEvents);
  }, [debouncedSearchKeyword, allEvents]);

  return (
    <div>
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#2774AE] dark:bg-gray-900 px-6 pt-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-4xl w-full text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold text-[#2774AE] dark:text-yellow-400 mb-6">
            All Events
          </h1>

          <div className="mb-6" role="search" aria-label="Search events">
            <label htmlFor="event-search" className="sr-only">
              Search events by title or description
            </label>
            <input
              id="event-search"
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search events..."
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              {debouncedSearchKeyword ? "No events found matching your search" : "No events found"}
            </p>
          ) : (
            <div className="space-y-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="text-left border-b border-gray-300 dark:border-gray-700 pb-6"
                >
                  <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    {event.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📅 {event.date} &nbsp;&nbsp; 🏷 {event.type}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    🧑 Organizer: {event.organizer}
                  </p>

                  {event.location && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        📍 {event.location.lat}, {event.location.lng}
                      </p>
                      <img
                        src={getStaticMapUrl(event.location.lat, event.location.lng)}
                        alt="Map preview"
                        className="w-full max-w-xs rounded border dark:border-zinc-700 shadow-sm"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
