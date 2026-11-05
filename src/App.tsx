/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopBar3D } from './components/TopBar3D';
import { GlassPanels } from './components/GlassPanels';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ThemeProvider } from './context/ThemeContext';
import { Project } from './types/portfolio';
import { RoomScene } from './three/roomScene';

const TOTAL_STATIONS = 8;

export default function App() {
  const [currentStation, setCurrentStation] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const roomSceneRef = useRef<RoomScene | null>(null);

  // Monitor scroll progress to identify the active camera station
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      const station = Math.min(
        TOTAL_STATIONS - 1,
        Math.floor(progress * (TOTAL_STATIONS - 1) + 0.35)
      );
      setCurrentStation(station);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToStation = (stationIdx: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (stationIdx / (TOTAL_STATIONS - 1)) * maxScroll;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-[#050505] text-[#edeae4] overflow-x-hidden selection:bg-[#d5ae70] selection:text-black">
        {/* Top Reading Progress Bar */}
        <ScrollProgressBar />

        {/* 3D WebGL Scene in Background */}
        <ThreeCanvas
          onSceneReady={(scene) => {
            roomSceneRef.current = scene;
            setSceneReady(true);
          }}
        />

        {/* Studio Vignette & Film Grain */}
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        {/* Top Navigation Bar with Avatar, Audio SFX Toggle & Navigation Dots */}
        <TopBar3D
          currentStation={currentStation}
          onNavigate={navigateToStation}
          onOpenResume={() => setResumeOpen(true)}
        />

        {/* Floating Liquid Glass UI Panels (One per camera station) */}
        <GlassPanels
          currentStation={currentStation}
          onNavigate={navigateToStation}
          onOpenProject={(proj) => setSelectedProject(proj)}
          onOpenResume={() => setResumeOpen(true)}
          roomScene={roomSceneRef.current}
        />

        {/* Scroll Track: Each stop provides height to drive the 3D camera stations smoothly */}
        <main id="track" className="relative z-0 pointer-events-none select-none">
          <section id="intro" className="h-[120vh]" />
          <section id="about" className="h-[120vh]" />
          <section id="projects" className="h-[120vh]" />
          <section id="open-source" className="h-[120vh]" />
          <section id="skills" className="h-[120vh]" />
          <section id="achievements" className="h-[120vh]" />
          <section id="stats" className="h-[120vh]" />
          <section id="contact" className="h-[120vh]" />
        </main>

        {/* Project Architecture Detail Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Curriculum Vitae & Resume Modal */}
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
