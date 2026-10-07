import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { getDb } from '@/lib/db';
import { GalleryClient } from './GalleryClient';

export const revalidate = 900;

interface GalleryItem {
  id: number;
  album_name: string;
  category: string;
  image_url: string;
  is_video: number;
  video_url: string | null;
}

export default async function PublicGalleryPage() {
  const db = await getDb();

  // 1. Scan public/images directory dynamically for categories and images
  const folderItems: GalleryItem[] = [];
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (fs.existsSync(imagesDir)) {
      const categories = fs.readdirSync(imagesDir);
      let idCounter = 1000;
      for (const cat of categories) {
        const catPath = path.join(imagesDir, cat);
        if (fs.statSync(catPath).isDirectory()) {
          const files = fs.readdirSync(catPath);
          for (const file of files) {
            if (/\.(jpe?g|png|webp|gif|bmp)$/i.test(file)) {
              let categoryName = cat;
              // Normalize category spelling
              if (cat.toLowerCase() === 'acamedic') {
                categoryName = 'Academic';
              } else {
                categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
              }

              // Extract filename without extension for display
              const nameWithoutExt = path.parse(file).name;
              let displayName = `${categoryName} - Image ${nameWithoutExt}`;
              if (/^\d+$/.test(nameWithoutExt)) {
                displayName = `${categoryName} Gallery Exhibit ${nameWithoutExt}`;
              } else {
                displayName = nameWithoutExt.replace(/[-_]/g, ' ');
                displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
              }

              folderItems.push({
                id: idCounter++,
                album_name: displayName,
                category: categoryName,
                image_url: `/images/${cat}/${file}`,
                is_video: 0,
                video_url: null
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading gallery images from directory:", err);
  }

  // Fetch all gallery items from database
  let databaseItems: GalleryItem[] = [];
  try {
    databaseItems = await db.all('SELECT * FROM gallery ORDER BY id DESC');
  } catch (err) {
    console.error("Error reading gallery table:", err);
  }

  // fallback pre-seeded list to ensure clean fallback if DB table has no items
  const fallbackItems: GalleryItem[] = [];

  // Determine final items list
  let finalItems: GalleryItem[] = [];
  
  if (folderItems.length > 0) {
    // If we have folder items, combine them with database items
    // But filter out any default mock unsplash images so we display real ones
    const activeDbItems = databaseItems.filter(item => 
      !item.image_url.includes('images.unsplash.com')
    );

    finalItems = [...folderItems, ...activeDbItems];
  } else {
    // No folder items found, use database items
    finalItems = databaseItems.filter(item => !item.image_url.includes('images.unsplash.com'));
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Institutional Media Gallery</span>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0A1F44] to-[#1B5E3B] text-white rounded-lg p-6 md:p-10 mb-8 shadow-md">
          <span className="bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded shadow">
            Visual Catalog
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mt-3 mb-2 tracking-tight">
            Campus Galleries & Virtual Case Portals
          </h1>
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-2xl font-sans">
            Explore our state-of-the-art dental clinical theater chambers, academic labs, community outreach dental health campaigns, and dynamic student cultural events.
          </p>
        </div>

        {/* Dynamic client-side list rendering */}
        <GalleryClient initialItems={finalItems} />

      </div>
    </div>
  );
}
