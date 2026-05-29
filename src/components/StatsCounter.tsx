'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

export interface StatItem {
  id: number;
  label: string;
  value: string;
  icon: string;
}

interface StatsCounterProps {
  stats: StatItem[];
}

const CountUp: React.FC<{ target: string }> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Parse numeric parts (e.g. "45,000+" -> 45000, "2018" -> 2018)
    const numericStr = target.replace(/[^0-9]/g, '');
    const maxVal = parseInt(numericStr, 10);
    
    if (isNaN(maxVal) || maxVal <= 0) {
      return;
    }

    // Set duration of count-up animation
    const duration = 2000;
    const start = 0;
    const stepTime = Math.max(Math.floor(duration / Math.min(maxVal, 100)), 15);
    const increment = Math.ceil(maxVal / (duration / stepTime));

    let timer = setInterval(() => {
      setCount((prev) => {
        const nextVal = prev + increment;
        if (nextVal >= maxVal) {
          clearInterval(timer);
          return maxVal;
        }
        return nextVal;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  // If number has characters like "+", "," or "%", format the final string beautifully
  const isOPD = target.includes(',');
  const isPlus = target.includes('+');
  
  if (count === 0) return <>{target}</>;
  
  let displayValue = count.toString();
  if (isOPD) {
    displayValue = count.toLocaleString('en-IN');
  }
  if (isPlus) {
    displayValue = displayValue + '+';
  }
  
  return <>{displayValue}</>;
};

export const StatsCounter: React.FC<StatsCounterProps> = ({ stats }) => {
  // Utility function to dynamically retrieve Lucide icons from string keys
  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    if (LucideIcon) {
      return <LucideIcon size={28} className="text-[#D4870A]" />;
    }
    return <Icons.Activity size={28} className="text-[#D4870A]" />;
  };

  if (!stats || stats.length === 0) return null;

  return (
    <div className="bg-white border-y border-gray-200 py-8 px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((s) => (
          <div 
            key={s.id} 
            className="flex flex-col items-center text-center p-4 rounded-lg bg-[#F8F9FA] border border-gray-100 hover:border-[#D4870A] hover:shadow-md transition-all duration-300"
          >
            <div className="bg-[#0A1F44]/5 p-3 rounded-full mb-3 text-[#0A1F44]">
              {renderIcon(s.icon)}
            </div>
            <span className="font-ui font-bold text-lg md:text-xl xl:text-2xl text-[#0A1F44] tracking-tight">
              <CountUp target={s.value} />
            </span>
            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1 font-sans">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
