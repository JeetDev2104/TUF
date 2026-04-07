'use client';

// Hero image section — displays a month-relevant full-width photograph
// Backend integration point: replace static Unsplash URLs with a CMS or image API

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

interface CalendarHeroProps {
  month: number; // 0-indexed
  year: number;
}

// Month-relevant Unsplash images — each visually represents the season/theme
const MONTH_IMAGES: Array<{src: string;alt: string;credit: string;}> = [
// January — snowy mountain climber (matches reference image exactly)
{
  src: "https://images.unsplash.com/photo-1558921401-419b0b7de260",
  alt: 'Mountain climber scaling a snow-covered rocky peak in winter, grey overcast sky',
  credit: 'Unsplash'
},
// February — frozen lake with snow-dusted pine forest
{
  src: "https://images.unsplash.com/photo-1706901685952-07b70aa86153",
  alt: 'Frozen lake surrounded by snow-covered pine trees under soft winter light',
  credit: 'Unsplash'
},
// March — cherry blossoms beginning to bloom on bare branches
{
  src: "https://images.unsplash.com/photo-1719480639932-678fef067243",
  alt: 'Pink cherry blossom branches in early spring bloom against a pale blue sky',
  credit: 'Unsplash'
},
// April — lush green meadow with wildflowers and rolling hills
{
  src: "https://images.unsplash.com/photo-1651942046520-71cd9de5c88f",
  alt: 'Vibrant green meadow filled with yellow wildflowers under bright spring sunshine',
  credit: 'Unsplash'
},
// May — coastal cliffs with turquoise sea
{
  src: "https://images.unsplash.com/photo-1594041736272-9c69da7dff42",
  alt: 'Turquoise ocean waves breaking against golden sandy beach under clear blue sky',
  credit: 'Unsplash'
},
// June — lavender field in full purple bloom
{
  src: "https://images.unsplash.com/photo-1626902506649-6edd5cb193b5",
  alt: 'Endless rows of purple lavender flowers stretching to the horizon in summer',
  credit: 'Unsplash'
},
// July — sunny tropical beach with palm trees
{
  src: "https://images.unsplash.com/photo-1638968985034-00edfbc631ee",
  alt: 'Pristine tropical beach with palm trees, white sand, and crystal clear blue water',
  credit: 'Unsplash'
},
// August — golden wheat field at sunset
{
  src: "https://images.unsplash.com/photo-1623237353245-a720501e1352",
  alt: 'Golden wheat field glowing in warm late-afternoon summer sunset light',
  credit: 'Unsplash'
},
// September — autumn forest with orange and red leaves
{
  src: "https://images.unsplash.com/photo-1574969772651-c266ef958f4a",
  alt: 'Winding forest path covered in fallen orange and red autumn leaves',
  credit: 'Unsplash'
},
// October — misty forest with golden fall foliage
{
  src: "https://images.unsplash.com/photo-1698335382716-2670664a9c45",
  alt: 'Misty autumn forest with golden and crimson leaves glowing in soft morning light',
  credit: 'Unsplash'
},
// November — bare trees in fog, moody grey landscape
{
  src: "https://images.unsplash.com/photo-1564750575890-a7f5c5e690a9",
  alt: 'Bare skeletal trees in thick fog over a quiet winter landscape at dusk',
  credit: 'Unsplash'
},
// December — snow-covered village with Christmas lights
{
  src: "https://images.unsplash.com/photo-1640040294787-1e3a46a648f2",
  alt: 'Cozy snow-covered alpine village glowing with warm Christmas lights at night',
  credit: 'Unsplash'
}];


export default function CalendarHero({ month, year }: CalendarHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [imgKey, setImgKey] = useState(`hero-${month}-${year}`);

  // Reset loading state when month changes
  useEffect(() => {
    setLoaded(false);
    setImgKey(`hero-${month}-${year}`);
  }, [month, year]);

  const imageData = MONTH_IMAGES[month];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '240px' }}>
      
      {/* Shimmer placeholder while image loads */}
      {!loaded &&
      <div
        className="absolute inset-0 shimmer"
        style={{ zIndex: 1 }}
        aria-hidden="true" />

      }

      {/* Hero photograph */}
      <div
        key={imgKey}
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: loaded ? 1 : 0, zIndex: 2 }}>
        
        <AppImage
          src={imageData.src}
          alt={imageData.alt}
          fill
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-cover object-center"
          priority
          onLoad={() => setLoaded(true)} />
        
      </div>

      {/* Subtle dark gradient overlay at bottom — smooths into chevron */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '60px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08))',
          zIndex: 3
        }}
        aria-hidden="true" />
      
    </div>);

}