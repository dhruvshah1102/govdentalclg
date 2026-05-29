'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface AdmissionsFaqClientProps {
  faqs: FaqItem[];
}

export const AdmissionsFaqClient: React.FC<AdmissionsFaqClientProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
      <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
        <HelpCircle className="text-[#D4870A]" size={20} /> Frequently Asked Questions (FAQ)
      </h3>
      
      <div className="space-y-3 font-sans">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div 
              key={index} 
              className="border border-gray-100 rounded-lg overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full bg-[#F8F9FA] text-left px-5 py-3.5 flex justify-between items-center text-xs md:text-sm font-semibold text-[#0A1F44] hover:bg-gray-100/50 transition gap-4"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {isOpen && (
                <div className="px-5 py-4 text-xs md:text-sm text-gray-500 bg-white leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
