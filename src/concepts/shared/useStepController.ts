import { useCallback, useEffect, useMemo, useState } from "react";

export function useStepController(stepCount: number, playDelayMs = 900) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastIndex = Math.max(stepCount - 1, 0);

  const goPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
    setIsPlaying(false);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, lastIndex));
  }, [lastIndex]);

  const goToStep = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(Math.max(index, 0), lastIndex));
      setIsPlaying(false);
    },
    [lastIndex]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  useEffect(() => {
    if (currentIndex > lastIndex) {
      setCurrentIndex(lastIndex);
      setIsPlaying(false);
    }
  }, [currentIndex, lastIndex]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (currentIndex >= lastIndex) {
      setIsPlaying(false);
      return;
    }

    const timerId = window.setInterval(() => {
      setCurrentIndex((index) => {
        if (index >= lastIndex) {
          window.clearInterval(timerId);
          setIsPlaying(false);
          return index;
        }

        return index + 1;
      });
    }, playDelayMs);

    return () => {
      window.clearInterval(timerId);
    };
  }, [currentIndex, isPlaying, lastIndex, playDelayMs]);

  return useMemo(
    () => ({
      currentIndex,
      isFirstStep: currentIndex === 0,
      isLastStep: currentIndex === lastIndex,
      isPlaying,
      goPrevious,
      goNext,
      goToStep,
      reset,
      togglePlay
    }),
    [
      currentIndex,
      goNext,
      goPrevious,
      goToStep,
      isPlaying,
      lastIndex,
      reset,
      togglePlay
    ]
  );
}
