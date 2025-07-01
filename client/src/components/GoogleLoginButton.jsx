import React from 'react';
import { FaGoogle } from 'react-icons/fa'; // Make sure to install react-icons

const GOOGLE_AUTH_URL = 'http://localhost:3000/auth/google';

export default function GoogleLoginButton() {
  return (
    <a href={GOOGLE_AUTH_URL} className="w-full block">
      <button
        className="w-full flex items-center justify-center gap-5 pointer px-4 py-3 text-white font-semibold cursor-pointer  duration-300"
      >
        <FaGoogle className="text-white" />
        Sign in with Google
      </button>
    </a>
  );
}