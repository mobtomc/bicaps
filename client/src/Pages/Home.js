import React, { useState, useEffect } from 'react';
import bicapslogo from "../Components/bicapslogo.png";
import { useUser } from '@clerk/clerk-react';
import { Typewriter } from 'react-simple-typewriter';

export default function Home() {
  const { isSignedIn, user } = useUser();
  const allow = true;

  const [reversedText, setReversedText] = useState("");

  useEffect(() => {
    const text = "Manage Timesheets, Client Projects, and More";
    let currentText = "";

    const reverseTyping = (index) => {
      if (index < text.length) {
        currentText = text[text.length - 1 - index] + currentText;
        setReversedText(currentText);
        setTimeout(() => reverseTyping(index + 1), 20);
      }
    };

    setTimeout(() => reverseTyping(0), 2000); // Delay the start of the reverse typing
  }, []);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative h-screen flex items-center justify-center p-2">
      {allow && (
        <div className="flex flex-col items-center">
          <div className="blur absolute h-[600px] w-[200px]"></div>
          <img src={bicapslogo} alt="BICAPS Logo"  className="w-1/2 transform transition-transform duration-500 ease-in-out animate-bounce hover:scale-105" />
          <div className="bg-black backdrop-blur-lg rounded-full px-24 py-3 flex flex-col items-center">
            <h1 className="md:text-4xl text-xl text-white text-center">
              <Typewriter
                words={[`Welcome, ${user.username}`]}
                loop={false}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="md:text-lg text-xs text-white text-center">
              {reversedText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
