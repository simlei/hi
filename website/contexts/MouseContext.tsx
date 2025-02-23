import React, { createContext, useContext, useRef, useCallback } from 'react';
import { MouseState } from '../components/forces/GraphForces';
import { calculateViewport, pixelToGraph } from '../components/forces/GraphSpace';

interface MouseContextType {
  mouseState: React.MutableRefObject<MouseState>;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerDown: (e: React.PointerEvent) => void;
}

const MouseContext = createContext<MouseContextType | null>(null);

export function MouseProvider({ children }: { children: React.ReactNode }) {
  const mouseState = useRef<MouseState>({
    position: null,
    lastMoved: 0,
    waves: []
  });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const viewport = calculateViewport(target.clientWidth, target.clientHeight);
    mouseState.current.position = pixelToGraph({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }, viewport);
    mouseState.current.lastMoved = performance.now();
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Check if we clicked an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.tagName === 'BUTTON' || 
      target.tagName === 'A' || 
      target.tagName === 'INPUT' ||
      target.closest('[role="button"]') ||
      target.closest('a') ||
      target.closest('button');

    // If it's an interactive element, let the event pass through
    if (isInteractive) return;

    const currentTarget = e.currentTarget;
    const rect = currentTarget.getBoundingClientRect();
    const viewport = calculateViewport(currentTarget.clientWidth, currentTarget.clientHeight);
    const clickPos = pixelToGraph({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }, viewport);
    
    if (!mouseState.current.waves) {
      mouseState.current.waves = [];
    }
    
    mouseState.current.waves.push({
      center: clickPos,
      startTime: performance.now(),
      amplitude: 1.0
    });
  }, []);

  return (
    <MouseContext.Provider value={{ mouseState, handlePointerMove, handlePointerDown }}>
      {children}
    </MouseContext.Provider>
  );
}

export function useMouseContext() {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error('useMouseContext must be used within a MouseProvider');
  }
  return context;
}