'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Music, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

interface HeroAsciiProps {
  registrationOpen?: boolean;
}

export default function HeroAscii({ registrationOpen = true }: HeroAsciiProps) {
  useEffect(() => {
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    // CSS to clean up canvas and hide third-party branding
    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const selectors = [
        '[data-us-project]',
        '[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',
        '.unicorn-studio-container',
        'canvas[aria-label*="Unicorn"]',
      ];

      selectors.forEach((selector) => {
        const containers = document.querySelectorAll(selector);
        containers.forEach((container) => {
          const allElements = container.querySelectorAll('*');
          allElements.forEach((el) => {
            const text = (el.textContent || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            const href = (el.getAttribute('href') || '').toLowerCase();

            if (
              text.includes('made with') ||
              text.includes('unicorn') ||
              title.includes('made with') ||
              title.includes('unicorn') ||
              href.includes('unicorn.studio')
            ) {
              const htmlEl = el as HTMLElement;
              htmlEl.style.display = 'none';
              htmlEl.style.visibility = 'hidden';
              htmlEl.style.opacity = '0';
              htmlEl.style.pointerEvents = 'none';
              htmlEl.style.position = 'absolute';
              htmlEl.style.left = '-9999px';
              htmlEl.style.top = '-9999px';
              try {
                el.remove();
              } catch {}
            }
          });
        });
      });
    };

    hideBranding();
    const interval = setInterval(hideBranding, 100);

    const timeouts = [
      setTimeout(hideBranding, 500),
      setTimeout(hideBranding, 1000),
      setTimeout(hideBranding, 2000),
      setTimeout(hideBranding, 5000),
    ];

    return () => {
      clearInterval(interval);
      timeouts.forEach((t) => clearTimeout(t));
      if (embedScript.parentNode) {
        document.head.removeChild(embedScript);
      }
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen overflow-hidden bg-black text-white flex flex-col justify-between">
      {/* 3D ASCII Background Canvas (desktop) */}
      <div className="absolute inset-0 w-full h-full hidden lg:block opacity-90">
        <div
          data-us-project="OMzqyUv6M3kSnv0JeAtC"
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>

      {/* Responsive starfield background for mobile/tablet fallback */}
      <div className="absolute inset-0 w-full h-full lg:hidden stars-bg opacity-40 pointer-events-none" />

      {/* Subtle top cyan ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Top Header / Status bar */}
      <div className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-white text-lg lg:text-xl font-bold tracking-widest italic transform -skew-x-6 text-cyan-400">
              FMUN 2026
            </span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white/70 text-[10px] lg:text-xs font-mono uppercase tracking-wider">
              Fluorescent Secondary School
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] lg:text-xs font-mono text-white/60">
            <span className="hidden sm:inline">KATHMANDU, NEPAL</span>
            <div className="hidden sm:block w-1 h-1 bg-cyan-400 rounded-full" />
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold">
              3-DAY EVENT
            </span>
          </div>
        </div>
      </div>

      {/* Corner Frame Accents */}
      <div className="pointer-events-none absolute top-12 left-4 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-cyan-400/40 z-20" />
      <div className="pointer-events-none absolute top-12 right-4 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-cyan-400/40 z-20" />
      <div className="pointer-events-none absolute bottom-14 left-4 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-cyan-400/40 z-20" />
      <div className="pointer-events-none absolute bottom-14 right-4 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-cyan-400/40 z-20" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-end px-4 sm:px-8 lg:px-16 py-12 lg:py-0">
        <div className="w-full lg:w-1/2 max-w-xl lg:mr-[6%]">
          {/* Glowing pill matching reference */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#031525]/90 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)] mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[11px] font-mono font-semibold tracking-widest text-cyan-300 uppercase">
              MINDS IN MOTION
            </span>
          </div>

          {/* Decorative line */}
          <div className="flex items-center gap-2 mb-3 opacity-60">
            <div className="w-10 h-px bg-cyan-400" />
            <span className="text-cyan-300 text-[10px] font-mono tracking-wider">#FMUN2026</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Main Title */}
          <div className="relative mb-3">
            <div className="hidden lg:block absolute -right-3 top-0 bottom-0 w-1 dither-pattern opacity-40" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tight text-white leading-tight">
              FLUORESCENT <span className="text-cyan-400">MUN 2026</span>
            </h1>
          </div>

          {/* Simple subtitle */}
          <p className="text-xs sm:text-sm font-mono text-cyan-200/80 uppercase tracking-widest mb-4">
            Grade 11 & 12 • +2 Science & Management
          </p>

          {/* Simple narrative - no AI words, no fake numbers */}
          <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed font-sans font-light">
            A focused 3-day conference for Fluorescent Secondary School students in +2 Science and Management.
            Step into diplomacy, debate global topics, represent a country, and share your ideas.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {registrationOpen ? (
              <Link
                href="/register"
                className="relative px-6 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 hover:text-black transition-all duration-200 group flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white group-hover:border-cyan-400" />
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white group-hover:border-cyan-400" />
                <span>Register as Delegate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-gray-800 text-gray-400 font-mono text-xs font-bold uppercase tracking-wider cursor-not-allowed"
              >
                Registration Closed
              </button>
            )}

            <Link
              href="/#events"
              className="relative px-5 py-3 bg-black/60 border border-white/40 hover:border-cyan-400 text-white hover:text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule (3 Days)</span>
            </Link>

            <Link
              href="/#party-songs"
              className="relative px-5 py-3 bg-black/60 border border-white/20 hover:border-cyan-400/70 text-gray-300 hover:text-cyan-300 font-mono text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>Song Recom for Party</span>
            </Link>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/10 font-mono text-[11px]">
            <div className="p-2 rounded bg-white/[0.03] border border-white/10">
              <span className="text-gray-400 block text-[9px] uppercase">Duration</span>
              <span className="text-white font-bold">3 Days</span>
            </div>
            <div className="p-2 rounded bg-white/[0.03] border border-white/10">
              <span className="text-gray-400 block text-[9px] uppercase">Students</span>
              <span className="text-cyan-300 font-bold">+2 Sci & Mgmt</span>
            </div>
            <div className="p-2 rounded bg-white/[0.03] border border-white/10">
              <span className="text-gray-400 block text-[9px] uppercase">Classes</span>
              <span className="text-white font-bold">Grade 11 & 12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer / Status Line */}
      <div className="relative z-20 border-t border-white/15 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between text-[9px] font-mono text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">FMUN // SYSTEM ACTIVE</span>
            <div className="hidden sm:block h-3 w-px bg-white/20" />
            <span className="hidden sm:inline text-white/70">
              FLUORESCENT SECONDARY SCHOOL • BANASTHALI, KATHMANDU
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-cyan-300/80">3-DAY SUMMIT</span>
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <div
                className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-1.5 h-1.5 bg-cyan-400/20 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
            <span className="text-white/60">LIVE</span>
          </div>
        </div>
      </div>

      <style>{`
        .dither-pattern {
          background-image: 
            repeating-linear-gradient(0deg, transparent 0px, transparent 1px, #22d3ee 1px, #22d3ee 2px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 1px, #22d3ee 1px, #22d3ee 2px);
          background-size: 3px 3px;
        }
        
        .stars-bg {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, #22d3ee, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, #38bdf8, transparent),
            radial-gradient(1px 1px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 60%, #22d3ee, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent);
          background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;
          background-position: 0% 0%, 40% 40%, 60% 60%, 20% 20%, 80% 80%, 30% 30%, 70% 70%, 50% 50%;
        }
      `}</style>
    </section>
  );
}
