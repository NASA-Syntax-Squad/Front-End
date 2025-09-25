import React, { useState, useEffect, useRef } from 'react';
import { Satellite, SatelliteDish, Orbit, Radar } from 'lucide-react';
import logo from '@/assets/logo.png';
import headerBgVideo from '@/assets/header_bg.mp4';

function AnimatedNumber({
  value,
  duration = 1200,
  decimals = 0,
  format,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (n: number) => string;
}) {
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [display, setDisplay] = useState<number>(0);

  useEffect(() => {
    startRef.current = null;
    const startVal = 0;
    const delta = value - startVal;

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min(1, elapsed / duration);
      const eased = easeOutQuad(pct);
      const current = startVal + delta * eased;
      setDisplay(current);

      if (pct < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const rounded = Number(display.toFixed(decimals));
  return <>{format ? format(rounded) : rounded.toLocaleString()}</>;
}

const Header = () => {
  const [data, setData] = useState({
    satellites: 0,
    coverage: 'GLOBAL',
    resolution: 0,
    status: '...',
    status_status: 'success',
  });

  useEffect(() => {
    const generateDynamicData = () => {
      try {
        const satelliteCount = Math.floor(Math.random() * 21) + 40;
        const resolutionValue = parseFloat((Math.random() * 8 + 2).toFixed(1));
        const statuses = ['LIVE', 'NOMINAL', 'ALL SYSTEMS GO'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        setData({
          satellites: satelliteCount,
          coverage: 'GLOBAL',
          resolution: resolutionValue,
          status: randomStatus,
          status_status: 'success',
        });
      } catch (error) {
        console.error("Failed to generate data:", error);
        setData({
          satellites: 0,
          coverage: 'UNKNOWN',
          resolution: 0,
          status: 'ERROR',
          status_status: 'error',
        });
      }
    };

    const timer = setTimeout(generateDynamicData, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={headerBgVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-space-cyan rounded-full animate-float shadow-glow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-space-purple rounded-full animate-float shadow-glow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-space-card/50 border border-space-cyan/30 rounded-full backdrop-blur-md animate-slide-up">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-space-cyan font-mono text-sm tracking-widest">
            NASA WEATHER SATELLITE NETWORK • ONLINE
          </span>
          <Radar className="w-4 h-4 text-space-cyan animate-pulse-glow" />
        </div>

        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-2xl md:text-7xl lg:text-8xl font-bold mb-10 tracking-tighter whitespace-nowrap">
            <span className="bg-gradient-to-r from-space-cyan via-space-blue to-space-purple bg-clip-text text-transparent text-8xl">
              Will It Rain On My Parade?
            </span>
          </h1>
        </div>

        <div className="relative flex items-center justify-center mb-8 h-32 animate-float">
          <div className="absolute w-48 h-48 border border-space-cyan/20 rounded-full animate-rotate-slow">
            <Satellite className="w-6 h-6 text-space-cyan absolute -top-3 left-1/2 transform -translate-x-1/2 animate-glow" />
          </div>
          <div className="absolute w-32 h-32 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse' }}>
            <Satellite className="w-5 h-5 text-space-blue absolute -top-2.5 left-1/2 transform -translate-x-1/2" />
          </div>
          <img
            src={logo}
            alt="Earth Logo"
            className="w-28 h-28 object-contain animate-pulse-glow rounded-full mt-4 mb-2"
            style={{ background: 'transparent' }}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-xl md:text-2xl text-cyan-100/90 max-w-4xl mx-auto font-light leading-relaxed tracking-wide mb-6 mt-6">
            A high-tech system that monitors weather in real time and gives detailed forecasts using satellite data
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8 animate-fade-in group" style={{ animationDelay: '0.6s' }}>
          {[
            { icon: SatelliteDish, label: 'SATELLITES', value: <AnimatedNumber value={data.satellites} format={(n) => `${n} ONLINE`} />, status: data.status_status },
            { icon: Orbit, label: 'COVERAGE', value: data.coverage, status: data.status_status },
            { icon: Radar, label: 'RESOLUTION', value: <AnimatedNumber value={data.resolution} decimals={1} format={(n) => `${n} KM`} />, status: data.status_status },
            { icon: Satellite, label: 'DATA', value: data.status, status: data.status_status },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-space-card/30 border border-space-cyan/20 rounded-lg p-3 backdrop-blur-sm 
                         transition-all duration-300 ease-in-out
                         hover:scale-105 hover:border-space-cyan"
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-4 h-4 text-space-cyan transition-all duration-300 group-hover:text-space-cyan" />
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-green-400' :
                  item.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                } animate-pulse`}></div>
              </div>
              <div className="text-left">
                <div className="text-space-cyan font-mono text-xs tracking-widest">{item.label}</div>
                <div className="text-white font-bold text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;