import { useState, useEffect } from 'react';
import { DEADLINE_ISO } from './config';

const DEADLINE = new Date(DEADLINE_ISO).getTime();

/**
 * Countdown to the founding deadline, shared by the sales page and the
 * checkout page so the two can never show different times.
 *
 * Starts as null rather than reading the clock during render, so the server
 * and the first client render agree. Cells show a dash for that one frame.
 */
export const useCountdown = () => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return { days: null, hours: null, mins: null, secs: null, expired: false };
  }
  const diff = Math.max(0, DEADLINE - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    expired: DEADLINE - now <= 0,
  };
};

export const pad = (n: number | null) => (n === null ? '--' : String(n).padStart(2, '0'));
