import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

export default function EventCreator({ location, onClose, triggerRefresh }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Missing location data.");

    const data = {
      title: e.target.title.value.trim(),
      description: e.target.description.value.trim(),
      date: e.target.date.value,
      doneBy: e.target.doneBy.value,
      organizer: e.target.organizer.value.trim(),
      type: e.target.type.value,
      location,
    };

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");
      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error("Non-JSON response: " + text);
      }

      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Event creation failed");

      alert("Event created!");
      triggerRefresh();
      // Only hide the form, don't clear the selection yet
      setVisible(false); // Hide side panel
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(600); // match delay with UclaMap
    }, 300);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 z-50 p-6 overflow-y-auto
        bg-white border-l border-gray-200 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${visible ? "translate-x-0" : "translate-x-full"}
        dark:bg-zinc-900 dark:border-zinc-700`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Create Event
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          required
          placeholder="Title"
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        />
        <input
          type="date"
          name="date"
          required
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        />
        <input
          type="date"
          name="doneBy"
          required
          placeholder="Expiration Date"
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        />
        <input
          name="organizer"
          placeholder="Organizer"
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        />
        <select
          name="type"
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
        >
          <option value="general">General</option>
          <option value="tech">Tech</option>
          <option value="social">Social</option>
          <option value="academic">Academic</option>
        </select>
        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
