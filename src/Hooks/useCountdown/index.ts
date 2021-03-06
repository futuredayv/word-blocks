import { useEffect, useRef, useState } from 'preact/hooks';

import { toClock } from './helpers';
import { Countdown, CountdownProps } from './types';

export const useCountdown = ({ duration, frequency = 1_000, onEnd }: CountdownProps): Countdown => {
  const interval = useRef<NodeJS.Timer>();

  const [countdown, setCountdown] = useState({
    remaining: duration,
    totalElapsed: 0,
  });

  const reset = (keepTotalElapsed = false) => {
    stopTicking();

    setCountdown((prev) => ({
      remaining: duration,
      totalElapsed: keepTotalElapsed ? prev.totalElapsed : 0,
    }));
  };

  const tick = () => {
    setCountdown((prev) => {
      const remaining = prev.remaining - frequency;
      const totalElapsed = prev.totalElapsed + frequency;

      return { remaining, totalElapsed };
    });
  };

  const start = () => {
    const isDone = countdown.remaining === 0;

    stopTicking();

    if (isDone) reset();

    startTicking();
  };

  const lapse = () => {
    reset(true);
    startTicking();
  };

  const startTicking = () => {
    interval.current = setInterval(tick, frequency);
  };

  const stopTicking = () => {
    clearInterval(interval.current);
  };

  useEffect(() => {
    const { remaining, totalElapsed } = countdown;

    if (remaining === 0) {
      stopTicking();
      onEnd(toClock(totalElapsed));
    }
  }, [countdown, onEnd]);

  useEffect(() => {
    return () => stopTicking();
  }, []);

  const returnValue = {
    lapse,
    pause: stopTicking,
    remaining: toClock(countdown.remaining),
    reset,
    start,
    totalElapsed: toClock(countdown.totalElapsed),
  };

  return returnValue;
};
