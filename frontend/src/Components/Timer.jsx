import React from "react";
import { useState, useEffect, useRef } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
    } else {
      setIsPaused(false);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="border p-4 mt-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">⏰ Cooking Timer</h2>
      <p className="text-3xl font-bold mb-3">{seconds} sec</p>
      <div className="flex justify-center gap-4">
        {!isRunning && !isPaused && (
          <button
            onClick={handleStart}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Start
          </button>
        )}
        {(isRunning || isPaused) && (
          <button
            onClick={handlePauseResume}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
        {(isRunning || isPaused) && (
          <button
            onClick={resetTimer}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
