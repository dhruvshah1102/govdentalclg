import React from 'react';
import Link from 'next/link';
import { ShieldAlert, BookOpen, Stethoscope, AlertTriangle } from 'lucide-react';

export const revalidate = 0;

export default function DisclaimerPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Disclaimer</span>
        </div>

        {/* Dynamic Page Card Wrapper */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44] border-b-2 border-[#D4870A] pb-3.5 mb-8 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-red-600" />
            Legal & Medical Disclaimer
          </h2>

          <div className="space-y-8 text-xs md:text-sm text-gray-700 leading-relaxed">
            
            {/* 1. General Information Disclaimer */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <BookOpen className="text-[#1B5E3B]" size={18} />
                1. General Information
              </h3>
              <p>
                The information contained in this website is for general information and educational purposes only. The information is provided by <strong>Government Dental College & Hospital, Dibrugarh</strong> and while we endeavor to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
              </p>
            </section>

            {/* 2. Medical & Clinical Disclaimer */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <Stethoscope className="text-red-600" size={18} />
                2. Medical and Clinical Advice
              </h3>
              <div className="bg-red-50 border border-red-200 rounded p-4 text-[#2D2D2D] mb-4">
                <span className="font-bold text-red-700 block mb-1">Important Health Notice:</span>
                The content on this website, including texts, graphics, images, and other materials, is not intended to be a substitute for professional medical or dental advice, diagnosis, or treatment. 
              </div>
              <p>
                Always seek the advice of your dentist, physician, or other qualified health provider with any questions you may have regarding a dental or medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website. 
              </p>
              <p>
                In case of a medical or dental emergency, please call our emergency trauma helpline at <strong>+91 373 2300999</strong>, visit the nearest hospital emergency room, or consult a qualified doctor immediately.
              </p>
            </section>

            {/* 3. External Links & Services */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <AlertTriangle className="text-[#D4870A]" size={18} />
                3. External Links and Outages
              </h3>
              <p>
                Through this website, you are able to link to other websites which are not under the control of Government Dental College & Hospital, Dibrugarh. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
              </p>
              <p>
                Every effort is made to keep the website up and running smoothly. However, the college takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
