"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

async function fetchFromStrapi(path: string, locale: string = 'en') {
  try {
    const res = await fetch(`http://localhost:1337/api/${path}?populate=*&locale=${locale}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

const getStrapiImage = (imageObj: any, fallback: string) => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj; 
  if (imageObj.url) return `http://localhost:1337${imageObj.url}`;
  if (Array.isArray(imageObj) && imageObj[0]?.url) return `http://localhost:1337${imageObj[0].url}`;
  return fallback;
};

export default function OurPeoplePage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Fetch from Strapi if you have a "team-members" collection
      const data = await fetchFromStrapi('team-members', locale);
      setTeamMembers(data);
      setIsLoading(false);
    }
    loadData();
  }, [locale]);

  // Fallback team data if Strapi has no data
  const fallbackTeam = [
    { name: "Hisham El-Khazindar", title: "Chairman & CEO", image: "", bio: "Visionary leader with over 30 years of investment banking experience." },
    { name: "Karim Helal", title: "Managing Director, Investment Banking", image: "", bio: "Expert in M&A and capital markets with 20+ years of experience." },
    { name: "Mona Zulficar", title: "Managing Director, Asset Management", image: "", bio: "Leading asset management division with over $15bn in AUM." },
    { name: "Youssef Bichara", title: "Head of Research", image: "", bio: "Driving market insights and economic analysis for the group." },
  ];

  const team = teamMembers.length > 0 ? teamMembers : fallbackTeam;

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white border border-sky-100 shadow-sm p-6">
              <div className="w-24 h-24 rounded-full bg-sky-100 mx-auto"></div>
              <div className="h-4 bg-sky-100 w-1/2 mx-auto mt-4"></div>
              <div className="h-3 bg-sky-100 w-1/3 mx-auto mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          Our People
        </h1>
        <p className="text-neutral-500 text-sm tracking-wider uppercase">
          Meet the leaders driving CI Capital's success
        </p>
        <div className="w-16 h-0.5 bg-sky-600 mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member: any, idx: number) => {
          const attrs = member.attributes || member;
          const imageSrc = getStrapiImage(attrs.image, "/avatar-placeholder.jpg");
          
          return (
            <div key={idx} className="bg-white border border-sky-100 shadow-sm p-6 hover:shadow-md transition-shadow text-center">
              <div className="w-32 h-32 rounded-full bg-sky-50 mx-auto overflow-hidden flex items-center justify-center">
                <img 
                  src={imageSrc} 
                  alt={attrs.name || "Team Member"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 text-5xl font-light';
                      fallback.innerHTML = (attrs.name || '?').charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <h3 className="text-xl font-light text-neutral-950 uppercase tracking-tight mt-4">
                {attrs.name || "Team Member"}
              </h3>
              <p className="text-sm text-sky-600 font-medium tracking-wider uppercase mt-1">
                {attrs.title || "Position"}
              </p>
              <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                {attrs.bio || ""}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}