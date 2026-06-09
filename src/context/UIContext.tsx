'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'as' | 'hi';
export type FontScale = 'sm' | 'base' | 'lg';

interface UIContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  t: (key: string) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Utility Bar
    emergency_helpline: 'Emergency Helpline',
    tele_consultation: 'Tele-Consultation',
    quick_links: 'Quick Links',
    rti: 'RTI',
    tenders: 'Tenders',
    grievance: 'Grievance',
    
    // Accessibility
    high_contrast: 'High Contrast',
    font_size: 'Font Size',
    
    // Header Tagline
    tagline: 'Government Dental College & Hospital, Dibrugarh, Assam',
    aff_rec: 'Affiliated to Dibrugarh University & Recognized by Dental Council of India',
    
    // Mega Menu
    home: 'Home',
    about_us: 'About Us',
    academics: 'Academics',
    departments: 'Departments',
    faculty_staff: 'Faculty & Staff',
    hospital_services: 'Hospital Services',
    admissions: 'Admissions',
    research: 'Research',
    student_portal: 'Student Portal',
    alumni: 'Alumni',
    news_events: 'News & Events',
    gallery: 'Gallery',
    downloads: 'Downloads',
    contact_us: 'Contact Us',
    
    // Submenu - About Us
    about_college: 'About the College',
    about_hospital: 'About the Hospital',
    dean_msg: 'Principal\'s Message',
    administration: 'Administration',
    governing_body: 'Governing Body',
    glance: 'College at a Glance',
    disclosure: 'Mandatory Disclosure',
    accreditation: 'Accreditation',
    reports: 'Annual Reports',
    
    // Submenu - Academics
    bds_prog: 'BDS Programme',
    mds_prog: 'MDS Programmes',
    calendar: 'Academic Calendar',
    exam_schedule: 'Examination Schedule',
    syllabus: 'Syllabi & Curriculum',
    results: 'Results',
    scholarships: 'Scholarships',
    timetable: 'Timetable',
    
    // Hospital Services Sub
    opd_services: 'OPD Services & Timings',
    specialty_clinics: 'Specialty Clinics',
    patient_registration: 'Patient Registration',
    fee_list: 'Fee & Charges List',
    tele_dental: 'Tele-Dental Consultation',
    
    // News & Events Sub
    news: 'News',
    events: 'Events',
    announcements: 'Announcements',
    
    // Gallery Sub
    photo_gallery: 'Photo Gallery',
    video_gallery: 'Video Gallery',
    
    // Call to actions / general
    read_more: 'Read More',
    view_all: 'View All',
    apply_now: 'Apply Now',
    download_pdf: 'Download PDF',
    search_placeholder: 'Search for faculty, notices, courses...',
    submit: 'Submit',
    reset: 'Reset',
    last_updated: 'Last Updated',
    copyright: 'Copyright © 2026 Government Dental College & Hospital, Dibrugarh. All Rights Reserved.',
    govt_assam: 'Government of Assam',
    dci_rec: 'Recognized by DCI, New Delhi',
    website_policy: 'Website Policy',
    disclaimer: 'Disclaimer',
    sitemap: 'Sitemap',
  },
  as: {
    // Utility Bar
    emergency_helpline: 'জৰুৰীকালীন সহায়ক নম্বৰ',
    tele_consultation: 'দূৰ-পৰামৰ্শ',
    quick_links: 'ক্ষিপ্ৰ সংযোগ',
    rti: 'তথ্যৰ অধিকাৰ (RTI)',
    tenders: 'নিবিদা',
    grievance: 'অভিযোগ কক্ষ',
    
    // Accessibility
    high_contrast: 'উচ্চ কন্ট্ৰাষ্ট',
    font_size: 'ফন্টৰ আকাৰ',
    
    // Header Tagline
    tagline: 'চৰকাৰী দন্ত চিকিৎসা মহাবিদ্যালয় আৰু চিকিৎসালয়, ডিব্ৰুগড়, অসম',
    aff_rec: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ সৈতে অনুমোদিত আৰু ভাৰতীয় দন্ত পৰিষদ (DCI) ৰ দ্বাৰা স্বীকৃত',
    
    // Mega Menu
    home: 'মুখ্য পৃষ্ঠা',
    about_us: 'আমাৰ বিষয়ে',
    academics: 'শৈক্ষিক শাখা',
    departments: 'বিভাগসমূহ',
    faculty_staff: 'অধ্যাপক আৰু কৰ্মচাৰী',
    hospital_services: 'চিকিৎসালয়ৰ সেৱা',
    admissions: 'নামভৰ্তি',
    research: 'গৱেষণা',
    student_portal: 'ছাত্ৰ প’ৰ্টেল',
    alumni: 'প্ৰাক্তন ছাত্ৰী',
    news_events: 'বাতৰি আৰু অনুষ্ঠান',
    gallery: 'গেলেৰী',
    downloads: 'ডাউনলোড',
    contact_us: 'যোগাযোগ কৰক',
    
    // Submenu - About Us
    about_college: 'মহাবিদ্যালয়ৰ বিষয়ে',
    about_hospital: 'চিকিৎসালয়ৰ বিষয়ে',
    dean_msg: 'অধ্যক্ষৰ বাৰ্তা',
    administration: 'প্ৰশাসন',
    governing_body: 'পৰিচালনা সমিতি',
    glance: 'এক দৃষ্টিত মহাবিদ্যালয়',
    disclosure: 'বাধ্যতামূলক প্ৰকাশ',
    accreditation: 'স্বীকৃতি',
    reports: 'বাৰ্ষিক প্ৰতিবেদন',
    
    // Submenu - Academics
    bds_prog: 'BDS পাঠ্যক্ৰম',
    mds_prog: 'MDS পাঠ্যক্ৰমসমূহ',
    calendar: 'শৈক্ষিক বৰ্ষপঞ্জী',
    exam_schedule: 'পৰীক্ষাৰ সময়সূচী',
    syllabus: 'পাঠ্যক্ৰম',
    results: 'পৰীক্ষামূলক ফলাফল',
    scholarships: 'জলপানী',
    timetable: 'সময়সূচী',
    
    // Hospital Services Sub
    opd_services: 'OPD সেৱা আৰু সময়সূচী',
    specialty_clinics: 'বিশেষজ্ঞ ক্লিনিক',
    patient_registration: 'ৰোগী পঞ্জীয়ন',
    fee_list: 'মাচুলৰ তালিকা',
    tele_dental: 'টেলি-দন্ত চিকিৎসা পৰামৰ্শ',
    
    // News & Events Sub
    news: 'বাতৰি',
    events: 'অনুষ্ঠানসমূহ',
    announcements: 'ঘোষণা পত্ৰ',
    
    // Gallery Sub
    photo_gallery: 'ফটো গ্যালৰী',
    video_gallery: 'ভিডিঅ’ গ্যালৰী',
    
    // Call to actions
    read_more: 'অধিক পঢ়ক',
    view_all: 'সকলো চাওক',
    apply_now: 'আবেদন কৰক',
    download_pdf: 'পিডিএফ ডাউনলোড',
    search_placeholder: 'শিক্ষক, জাননী বা পাঠ্যক্ৰম সন্ধান কৰক...',
    submit: 'প্ৰেৰণ কৰক',
    reset: 'পুনৰ ছেট কৰক',
    last_updated: 'শেহতীয়া উন্নীতকৰণ',
    copyright: 'স্বত্বাধিকাৰ © ২০২৬ চৰকাৰী দন্ত চিকিৎসা মহাবিদ্যালয় আৰু চিকিৎসালয়, ডিব্ৰুগড়। সৰ্বস্বত্ব সংৰক্ষিত।',
    govt_assam: 'অসম চৰকাৰ',
    dci_rec: 'DCI, নতুন দিল্লীৰ দ্বাৰা স্বীকৃত',
    website_policy: 'ৱেবছাইট নীতি',
    disclaimer: 'দাবী অস্বীকাৰ',
    sitemap: 'ছাইট মেপ',
  },
  hi: {
    // Utility Bar
    emergency_helpline: 'आपातकालीन हेल्पलाइन',
    tele_consultation: 'टेली-परामर्श',
    quick_links: 'त्वरित लिंक',
    rti: 'सूचना का अधिकार (RTI)',
    tenders: 'निविदाएं',
    grievance: 'शिकायत निवारण',
    
    // Accessibility
    high_contrast: 'उच्च कंट्रास्ट',
    font_size: 'फ़ॉन्ट आकार',
    
    // Header Tagline
    tagline: 'सरकारी दंत चिकित्सा महाविद्यालय और अस्पताल, डिब्रूगढ़, असम',
    aff_rec: 'डिब्रूगढ़ विश्वविद्यालय से संबद्ध और भारतीय दंत परिषद (DCI) द्वारा मान्यता प्राप्त',
    
    // Mega Menu
    home: 'मुख्य पृष्ठ',
    about_us: 'हमारे बारे में',
    academics: 'अकादमिक',
    departments: 'विभाग',
    faculty_staff: 'संकाय और कर्मचारी',
    hospital_services: 'अस्पताल सेवाएं',
    admissions: 'प्रवेश',
    research: 'अनुसंधान',
    student_portal: 'छात्र पोर्टल',
    alumni: 'पूर्व छात्र',
    news_events: 'समाचार और कार्यक्रम',
    gallery: 'गैलरी',
    downloads: 'डाउनलोड',
    contact_us: 'संपर्क करें',
    
    // Submenu - About Us
    about_college: 'कॉलेज के बारे में',
    about_hospital: 'अस्पताल के बारे में',
    dean_msg: 'प्राचार्य का संदेश',
    administration: 'प्रशासन',
    governing_body: 'शासी निकाय',
    glance: 'कॉलेज एक नज़र में',
    disclosure: 'अनिवार्य प्रकटीकरण',
    accreditation: 'मान्यता',
    reports: 'वार्षिक रिपोर्ट',
    
    // Submenu - Academics
    bds_prog: 'BDS पाठ्यक्रम',
    mds_prog: 'MDS पाठ्यक्रम',
    calendar: 'अकादमिक कैलेंडर',
    exam_schedule: 'परीक्षा कार्यक्रम',
    syllabus: 'पाठ्यक्रम',
    results: 'परिणाम',
    scholarships: 'छात्रवृत्ति',
    timetable: 'समय सारणी',
    
    // Hospital Services Sub
    opd_services: 'ओपीडी सेवाएं और समय',
    specialty_clinics: 'विशेषज्ञ क्लीनिक',
    patient_registration: 'रोगी पंजीकरण',
    fee_list: 'शुल्क सूची',
    tele_dental: 'टेली-डेंटल परामर्श',
    
    // News & Events Sub
    news: 'समाचार',
    events: 'कार्यक्रम',
    announcements: 'घोषणाएँ',
    
    // Gallery Sub
    photo_gallery: 'फोटो गैलरी',
    video_gallery: 'वीडियो गैलरी',
    
    // Call to actions
    read_more: 'अधिक पढ़ें',
    view_all: 'सभी देखें',
    apply_now: 'आवेदन करें',
    download_pdf: 'पीडीएफ डाउनलोड करें',
    search_placeholder: 'संकाय, नोटिस, पाठ्यक्रम खोजें...',
    submit: 'जमा करें',
    reset: 'रीसेट करें',
    last_updated: 'अंतिम अपडेट',
    copyright: 'कॉपीराइट © २०२६ सरकारी दंत चिकित्सा महाविद्यालय और अस्पताल, डिब्रूगढ़। सर्वाधिकार सुरक्षित।',
    govt_assam: 'असम सरकार',
    dci_rec: 'DCI, नई दिल्ली द्वारा मान्यता प्राप्त',
    website_policy: 'वेबसाइट नीति',
    disclaimer: 'अस्वीकरण',
    sitemap: 'साइटमैप',
  }
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [fontScale, setFontScale] = useState<FontScale>('base');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Sync settings with localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('gdch_lang') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedFont = localStorage.getItem('gdch_font') as FontScale;
    if (savedFont) setFontScale(savedFont);

    // Dark mode/high contrast is removed, force it to false
    setIsHighContrast(false);
  }, []);

  // Sync fontScale with document root font-size
  useEffect(() => {
    let size = '16px';
    if (fontScale === 'sm') size = '14px';
    if (fontScale === 'lg') size = '18px';
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = size;
    }
  }, [fontScale]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('gdch_lang', lang);
  };

  const changeFontScale = (scale: FontScale) => {
    setFontScale(scale);
    localStorage.setItem('gdch_font', scale);
  };

  const toggleContrast = () => {
    // Dark mode / high contrast toggle is disabled
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  // Base font class is standard text-base (1rem), which scales relative to root font-size
  const fontClass = 'text-base';

  return (
    <UIContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        fontScale,
        setFontScale: changeFontScale,
        isHighContrast,
        toggleHighContrast: toggleContrast,
        t,
      }}
    >
      <div className={`${isHighContrast ? 'high-contrast' : ''} ${fontClass} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
