import React, { useEffect, useRef } from 'react';
import { RoomScene } from '../three/roomScene';

interface ThreeCanvasProps {
  onSceneReady?: (scene: RoomScene) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ onSceneReady }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoomScene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new RoomScene(mountRef.current);
    sceneRef.current = scene;
    if (onSceneReady) onSceneReady(scene);

    const handleResize = () => {
      if (mountRef.current && sceneRef.current) {
        sceneRef.current.onResize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (sceneRef.current) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        sceneRef.current.setPointerOffset(x, y);
      }
    };

    const handleScroll = () => {
      if (sceneRef.current) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        sceneRef.current.setScrollProgress(progress);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial scroll setup
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      scene.destroy();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    />
  );
};
