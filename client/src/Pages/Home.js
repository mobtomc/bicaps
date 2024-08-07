import React from 'react';
import bicapslogo from "../Components/bicapslogo.png";
import { useUser } from '@clerk/clerk-react';

export default function Home() {
  const { isSignedIn, user } = useUser();
  const allow = true; 

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative h-screen flex items-center justify-center p-2">
      {allow && (
        <div className="flex flex-col items-center">
          <div className="blur absolute h-[600px] w-[200px]"></div>
          <img src={bicapslogo} alt="BICAPS Logo" className="w-1/2" />
          <div className="bg-black backdrop-blur-lg rounded-full px-24 py-3 flex flex-col items-center">
            <h1 className="md:text-4xl text-3xl text-white text-center">
              {/* {user.primaryEmailAddress.emailAddress.split('@')[0]} */}
              Welcome, {user.username}
            </h1>
            <p className="md:text-lg text-xs text-white text-center">
              Manage Timesheets,Client Projects and More
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
