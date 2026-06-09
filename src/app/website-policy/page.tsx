import React from 'react';
import Link from 'next/link';
import { Shield, Lock, FileCheck, HelpCircle } from 'lucide-react';

export const revalidate = 0;

export default function WebsitePolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Website Policy</span>
        </div>

        {/* Dynamic Page Card Wrapper */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44] border-b-2 border-[#D4870A] pb-3.5 mb-8 tracking-tight flex items-center gap-3">
            <Shield className="text-[#D4870A]" />
            Website Policy & Terms of Use
          </h2>

          <div className="space-y-8 text-xs md:text-sm text-gray-700 leading-relaxed">
            
            {/* 1. Copyright Policy */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <FileCheck className="text-[#1B5E3B]" size={18} />
                1. Copyright Policy
              </h3>
              <p>
                Material featured on this website may be reproduced free of charge. However, the material must be reproduced accurately and not be used in a derogatory manner or in a misleading context. Wherever the material is being published or issued to others, the source must be prominently acknowledged. 
              </p>
              <p>
                The permission to reproduce this material does not extend to any material on this site which is identified as being the copyright of a third party. Authorization to reproduce such material must be obtained from the respective copyright holders.
              </p>
            </section>

            {/* 2. Privacy Policy */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <Lock className="text-[#1B5E3B]" size={18} />
                2. Privacy Policy
              </h3>
              <p>
                Government Dental College & Hospital, Dibrugarh website does not automatically capture any specific personal information from you (like name, phone number or email address), that allows us to identify you individually.
              </p>
              <p>
                If the website requests you to provide personal information (such as for online OPD registration, feedback, or grievance lodging), you will be informed for what particular purpose the information is gathered and adequate security measures will be taken to protect your personal information.
              </p>
              <p>
                We do not sell or share any personally identifiable information volunteered on this site to any third party (public/private) without consent. Any information provided to this website will be protected from loss, misuse, unauthorized access, disclosure, alteration, or destruction.
              </p>
            </section>

            {/* 3. Hyperlinking Policy */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <HelpCircle className="text-[#1B5E3B]" size={18} />
                3. Hyperlinking Policy
              </h3>
              <p>
                <strong>Links to External Websites/Portals:</strong> At many places in this website, you may find links to other websites/portals (e.g. Directorate of Medical Education, Medical Counseling Committee, Dibrugarh University). These links have been placed for your convenience. Government Dental College & Hospital, Dibrugarh is not responsible for the contents and reliability of the linked websites and does not necessarily endorse the views expressed in them. Mere presence of the link or its listing on this website should not be assumed as endorsement of any kind.
              </p>
              <p>
                <strong>Links to GDC Dibrugarh Website by Other Websites:</strong> We do not object to you linking directly to the information that is hosted on this website and no prior permission is required for the same. However, we do not permit our pages to be loaded into frames on your site. The pages belonging to this website must load into a newly opened browser window of the user.
              </p>
            </section>

            {/* 4. Content Contribution, Moderation & Approval Policy (CMAP) */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                <FileCheck className="text-[#1B5E3B]" size={18} />
                4. Content Contribution, Moderation & Approval Policy (CMAP)
              </h3>
              <p>
                All content presented on this official portal goes through a structured verification process before publication. Academic notices, tender records, and fee modifications are authored by authorized administrative staff, verified by the respective Head of Department (HOD) or Academic Coordinator, and approved by the Principal & Dean before being uploaded via the administrative dashboard.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
