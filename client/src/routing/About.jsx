// client/src/routing/About.jsx
import React from 'react';
import ReturnHomeButton from '../components/ReturnHomeButton';

export default function About() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#2774AE] dark:bg-gray-900 px-6 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold text-[#2774AE] dark:text-yellow-400 mb-4">
            About Us
          </h1>
          <p className="text-lg">
            Welcome to <span className="font-semibold text-[#FFD100] dark:text-yellow-300">SchedUCLA</span>! We hope you find our app useful in scheduling events at UCLA. Whether you're planning club meetings, academic workshops, or social gatherings, SchedUCLA helps you stay organized and connected.
          </p>
          <div className="mt-6">
            <ReturnHomeButton />
          </div>
        </div>
      </div>
    </div>
  );
}
