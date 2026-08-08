"use client";
import { useState } from "react";
const Counter = () => {
  const [count, setCount] = useState(0);
  const addCount = () => {
    setCount(count + 1);
  };

  return (
    <>
      <button onClick={addCount} className="cursor-pointer">
        {count}
      </button>
    </>
  );
};

export default Counter;
