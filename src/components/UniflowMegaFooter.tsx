import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const UniflowMegaFooter: React.FC = () => {
  const { setActiveTab, themeConfig } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAppDownload = (platform: 'apple' | 'google') => {
    sound.playSuccess();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ffffff', themeConfig.primary, '#38bdf8'],
    });
    if (platform === 'apple') {
      showToast('✦ Uniflow for Apple VisionOS & iOS TestFlight build initialized (v2.6.4)');
    } else {
      showToast('✦ Uniflow Android APK & Google Play Beta channel ready for install');
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#f8fafc] via-slate-50 to-slate-100/90 text-slate-900 border-t border-slate-200/90 relative z-20 pt-14 pb-32 sm:pb-36 transition-colors shadow-2xs">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-white/95 text-slate-900 border border-slate-200 shadow-2xl backdrop-blur-xl text-xs font-mono font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Bar: Brand Logo & Region / Language Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          
          {/* Brand Logo in Vadim Carazan editorial serif */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick(1000);
                setActiveTab('command');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }}
              className="font-instrument italic text-3xl sm:text-4xl tracking-tight text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer select-none flex items-center gap-2 font-normal"
            >
              <span>UNIFLOW</span>
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block animate-pulse" />
            </button>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold ml-1">
              STANFORD OS 2026
            </span>
          </div>

          {/* Region and Language Badges */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playClick();
                showToast('Active Campus: Stanford University');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all btn-tactile cursor-pointer shadow-2xs"
              title="Active Campus: Stanford University"
            >
              <span>🌲</span>
              <span>Stanford University</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                showToast('System Language: English (US)');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all btn-tactile cursor-pointer shadow-2xs"
              title="System Language: English (US)"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>English (US)</span>
            </button>
          </div>
        </div>

        {/* 5 Column Navigation Grid (matching Zomato's 5 columns layout) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 text-sm">
          
          {/* Column 1: Ecosystem (corresponds to "Eternal" in Zomato) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('command'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Uniflow OS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('synthesizer'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>AI Notice Studio</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">AI</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('planner'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Dynamic Planner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('planner'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Connected Node Graph
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('campus'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Campus Radar & TreeHacks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('spatial'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>3D Spatial Models Studio</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-sky-50 text-sky-700 border border-sky-200 font-bold">3D</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Telemetry stream: 12 live student nodes syncing at 60 FPS'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Live Academic Telemetry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Bio-X Senior Fellowship defense deck draft loaded in memory'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Bio-X Research Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: For Students (corresponds to "For Restaurants" in Zomato) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              For Students
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Canvas LMS bidirectional token active'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Canvas LMS Integration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Hopper H100 Slurm node allocated (Partition: gpu-stanford)'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  GPU Cluster Allocation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('TreeHacks 2026 Core Roster confirmed with 4 engineering leads'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  TreeHacks Roster Lock
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Bio-X Senior Thesis defense committee notifications configured'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Bio-X Fellowship Defense
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Study sprint session logged: 3.42 hrs Deep Work'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Peer Study Sprints
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Current Cumulative GPA: 3.94 • Top 1% Percentile'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  GPA & Honors Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Instructors & TAs (corresponds to "For Delivery Partners" in Zomato) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              For Instructors & TAs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Broadcast Notice Studio: 4 WhatsApp & Email templates dispatched'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Broadcast Notice Studio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Gradescope autograder connected: 198 submissions processed'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Gradescope Auto-Connect
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Office hours queue: 3 students in Huang Basement'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Office Hours Dispatch
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Teaching Assistants portal: 8 TAs synchronized across CS 229 & NEUR 210'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  TA Teaching Roster
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Curriculum flow architecture: 16 prerequisite branches mapped'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Curriculum Flow Architect
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Silicon Patch-Clamp simulator: Hodgkin-Huxley parameters validated'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Silicon Lab Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Learn More (corresponds to "Learn More" in Zomato) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Learn More
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Privacy Policy: Strict FERPA compliant, zero third-party telemetry'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Privacy & FERPA
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Security: 256-bit AES client-side encryption enabled'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Academic Vault Security
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Terms of Service: Stanford Academic Software Agreement v2026'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Honor Code: Stanford Board of Judicial Affairs guidelines respected'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Honor Code & Ethics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('24/7 Student Health & Academic Sanctuary support active'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Help & Student Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Latest ArXiv: FlashAttention-3 Kernel Coalescing on H100 Hopper'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  ArXiv Research Papers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sound.playPop(); showToast('Uniflow Engineering Blog: Building Spatial OS with React 19'); }}
                  className="hover:text-slate-950 hover:translate-x-0.5 transition-all cursor-pointer text-left"
                >
                  Engineering Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Social Links & App Download Badges (exact Zomato style) */}
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Social Links
            </h4>

            {/* Circular Social Badges row */}
            <div className="flex items-center gap-2.5">
              
              {/* LinkedIn */}
              <button 
                onClick={() => { sound.playClick(); showToast('Opening Stanford Uniflow LinkedIn'); }}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 transition-all flex items-center justify-center font-bold text-xs btn-tactile cursor-pointer shadow-2xs"
                title="LinkedIn"
              >
                in
              </button>

              {/* Instagram */}
              <button 
                onClick={() => { sound.playClick(); showToast('Opening Uniflow Instagram'); }}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-pink-600 hover:text-white hover:border-pink-600 border border-slate-200 transition-all flex items-center justify-center text-xs btn-tactile cursor-pointer shadow-2xs"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>

              {/* YouTube */}
              <button 
                onClick={() => { sound.playClick(); showToast('Opening Stanford Uniflow Tech Demos'); }}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 border border-slate-200 transition-all flex items-center justify-center text-xs btn-tactile cursor-pointer shadow-2xs"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>

              {/* Facebook */}
              <button 
                onClick={() => { sound.playClick(); showToast('Opening Stanford Student Life Community'); }}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 transition-all flex items-center justify-center font-bold text-xs btn-tactile cursor-pointer shadow-2xs"
                title="Facebook"
              >
                f
              </button>

              {/* X / Twitter */}
              <button 
                onClick={() => { sound.playClick(); showToast('Opening @UniflowOS on X'); }}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 border border-slate-200 transition-all flex items-center justify-center text-xs btn-tactile cursor-pointer shadow-2xs font-bold"
                title="X (Twitter)"
              >
                𝕏
              </button>

            </div>

            {/* App Store & Google Play Badges */}
            <div className="pt-2 space-y-2">
              
              {/* Apple App Store */}
              <button
                onClick={() => handleAppDownload('apple')}
                className="w-full max-w-[185px] py-2 px-3 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer btn-tactile shadow-2xs flex items-center gap-2.5 text-left group"
              >
                {/* Apple Logo SVG */}
                <svg className="w-5 h-5 fill-slate-900 group-hover:fill-indigo-600 transition-colors shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.56-7.71-11.61-14.01-6.13-9.5-11-20.48-14.61-32.94-3.61-12.46-5.42-24.5-5.42-36.12 0-15.02 3.84-27.42 11.53-37.21 7.69-9.79 17.31-14.78 28.87-14.97 4.92 0 10.45 1.28 16.6 3.84 6.15 2.56 10.15 3.89 12 3.89 1.48 0 5.43-1.33 11.86-3.99 6.42-2.66 11.96-3.88 16.61-3.67 12.92.53 23.32 4.97 31.21 13.32-11.33 6.84-16.89 16.29-16.67 28.36.21 9.4 3.96 17.29 11.25 23.67 7.29 6.38 16.03 10.02 26.23 10.92-2.24 6.74-4.88 13.25-7.92 19.53zM119.22 31.84c0-7.39 2.66-14.31 7.98-20.76 5.32-6.45 11.89-10.41 19.72-11.88.21 1.07.32 2.03.32 2.88 0 7.39-2.77 14.36-8.31 20.91-5.54 6.55-12.18 10.41-19.92 11.58-.21-.96-.32-1.87-.32-2.73z"/>
                </svg>
                <div className="flex flex-col">
                  <span className="text-[8.5px] text-slate-500 group-hover:text-slate-700 font-sans tracking-tight leading-none">
                    Download on the
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 tracking-tight font-sans leading-none mt-1 transition-colors">
                    App Store
                  </span>
                </div>
              </button>

              {/* Google Play */}
              <button
                onClick={() => handleAppDownload('google')}
                className="w-full max-w-[185px] py-2 px-3 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer btn-tactile shadow-2xs flex items-center gap-2.5 text-left group"
              >
                {/* Google Play Triangle SVG */}
                <svg className="w-4.5 h-4.5 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity" viewBox="0 0 512 512">
                  <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 59.9z"/>
                  <path fill="#34A853" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
                  <path fill="#FBBC04" d="M425.2 214.3L347.5 170 325.3 234.3l59.9 59.9 40-23.1c14.2-8.2 21.8-21.6 21.8-35.3 0-8.5-3-16.5-11.8-21.5z"/>
                  <path fill="#EA4335" d="M104.6 499l280.8-161.2-60.1-59.9L104.6 499z"/>
                </svg>
                <div className="flex flex-col">
                  <span className="text-[7.5px] text-slate-500 group-hover:text-slate-700 font-sans uppercase tracking-wider leading-none">
                    GET IT ON
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 tracking-tight font-sans leading-none mt-1 transition-colors">
                    Google Play
                  </span>
                </div>
              </button>

            </div>

          </div>

        </div>

        {/* Bottom Legal Disclaimer & Copyright (exact Zomato text & layout) */}
        <div className="pt-8 border-t border-slate-200/80 space-y-4 text-xs text-slate-500 leading-relaxed font-sans">
          
          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
            By continuing past this page, you agree to our Terms of Service, Cookie Policy, FERPA Privacy Policy and Academic Content Policies. All university trademarks, department seals, course numbers, and building identifiers are properties of their respective institutions.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <div>
              2024-2026 © Uniflow™ Academic Technologies Inc. All rights reserved.
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> FERPA Compliant
              </span>
              <span>•</span>
              <span>Stanford University Spring 2026</span>
              <span>•</span>
              <span className="text-indigo-600 font-bold">Spatial Edition</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
