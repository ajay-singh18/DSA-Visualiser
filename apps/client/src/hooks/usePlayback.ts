import { useState, useCallback, useRef, useEffect } from 'react';
import type { Snapshot } from '@dsa-visualizer/shared';

interface PlaybackState {
  snapshots: Snapshot[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;
}

export function usePlayback() {
  const [state, setState] = useState<PlaybackState>({
    snapshots: [],
    currentIndex: 0,
    isPlaying: false,
    speed: 1,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const loadSnapshots = useCallback((snapshots: Snapshot[], autoPlay: boolean = false) => {
    clearTimer();
    setState({ snapshots, currentIndex: 0, isPlaying: autoPlay, speed: 1 });
  }, [clearTimer]);

  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentIndex: Math.min(prev.currentIndex + 1, prev.snapshots.length - 1),
    }));
  }, [clearTimer]);

  const stepBackward = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, [clearTimer]);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const goToStep = useCallback((index: number) => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentIndex: Math.max(0, Math.min(index, prev.snapshots.length - 1)),
    }));
  }, [clearTimer]);

  // Auto-play effect
  useEffect(() => {
    if (state.isPlaying && state.snapshots.length > 0) {
      const delay = 800 / state.speed;
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.currentIndex >= prev.snapshots.length - 1) {
            clearTimer();
            return { ...prev, isPlaying: false };
          }
          return { ...prev, currentIndex: prev.currentIndex + 1 };
        });
      }, delay);
    }
    return clearTimer;
  }, [state.isPlaying, state.speed, clearTimer]);

  const currentSnapshot = state.snapshots[state.currentIndex] ?? null;
  const isFinished = state.snapshots.length > 0 && state.currentIndex >= state.snapshots.length - 1 && !state.isPlaying;

  const replay = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, currentIndex: 0, isPlaying: true }));
  }, [clearTimer]);

  return {
    ...state,
    currentSnapshot,
    totalSteps: state.snapshots.length,
    isFinished,
    loadSnapshots,
    play,
    pause,
    stepForward,
    stepBackward,
    setSpeed,
    goToStep,
    replay,
  };
}
