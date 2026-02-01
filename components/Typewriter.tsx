"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
};

export default function Typewriter({
  text,
  speed = 80,
  className = "",
}: Props) {
  const [idx, setIdx] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    setIdx(0);
    const timer = setInterval(() => {
      setIdx((i) => {
        if (i < text.length) return i + 1;
        clearInterval(timer);
        return text.length;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  useEffect(() => {
    const cur = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(cur);
  }, []);

  return (
    <h1 className={className}>
      {text.slice(0, idx)}
      <span aria-hidden style={{ opacity: cursorVisible ? 1 : 0 }}>
        |
      </span>
    </h1>
  );
}
