// client/src/routing/Contact.jsx
import React from 'react';
import ReturnHomeButton from '../components/ReturnHomeButton';

export default function Contact() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#2774AE] dark:bg-gray-900 px-6 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold text-[#2774AE] dark:text-yellow-400 mb-4">
            Contact Us
          </h1>
          <p className="text-lg mb-1">
            If you are interested in contacting us, please reach out at:
          </p>
          <p className="text-[#FFD100] dark:text-yellow-300 font-semibold mb-4">
            Feedbackemail@domain
          </p>
          <ReturnHomeButton />
        </div>
      </div>
    </div>
  );
}
