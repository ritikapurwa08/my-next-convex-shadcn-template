// app/dashboard/page.tsx (या pages/dashboard.tsx)
import React from "react";

import {
  HistoryEduIcon,
  PaletteIcon,
  LandscapeIcon,
  AccountBalanceIcon,
  MapIcon,
  PsychologyIcon,
} from "@/components/icons";
import { Sidebar } from "@/components/sidebar";
import { SubjectCard } from "@/components/subject-card";
import { RightSidebar } from "@/components/right-sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 mr-80 p-10 min-h-screen">
        {/* Header Section */}
        <header className="mb-12">
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Academic Dashboard
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            <p className="text-secondary font-label text-sm uppercase tracking-widest">
              Select your specialization
            </p>
          </div>
        </header>

        {/* Subject Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SubjectCard
            title="Rajasthan History"
            description="Comprehensive study of Rajputana dynasties, independence struggle, and ancient civilizations."
            icon={<HistoryEduIcon />}
          />
          <SubjectCard
            title="Art & Culture"
            description="Heritage architecture, folk arts, festivals, and the vibrant cultural tapestry of Rajasthan."
            icon={<PaletteIcon />}
          />
          <SubjectCard
            title="Rajasthan Geography"
            description="Aravalli range, Thar desert ecosystem, river basins, and natural resources of the state."
            icon={<LandscapeIcon />}
          />
          <SubjectCard
            title="Indian Polity"
            description="Constitutional framework, federal structure, judicial system, and administrative nuances."
            icon={<AccountBalanceIcon />}
          />
          <SubjectCard
            title="Indian Geography"
            description="Physiographic divisions, climate patterns, agriculture, and industrial corridors of India."
            icon={<MapIcon />}
          />
          <SubjectCard
            title="Psychology"
            description="Educational psychology, theories of learning, personality development, and child growth."
            icon={<PsychologyIcon />}
          />
        </div>

        {/* Promotion Banner (Editorial Quality) */}
        <section className="mt-12 overflow-hidden rounded-xl bg-primary relative h-48 flex items-center px-12">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none overflow-hidden">
            <img
              alt="Library Books"
              className="object-cover w-full h-full grayscale mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtM-IYw89y-Ffu2-wIyOMB73OpMqOYhmKC7K1RlPn5v6nzBLUgKyCyi9gO1vvnaJMcJmcZfqTSczAnSAVLdP6_Y01WBFsP33pD2ZeTr_L_KyTJFIVEyaD0VTKgdWMP7Xa0-pvlOPsSDGjZRkyTjUAtZJDfBxFaIx27_xbQvdndUf56e4wDIX86eBK3mHMkPgQs3XL8pTDCftUxiMpMUyhJc-TIva1Z34uwXSHYA3lWS8dPGuIMXFEvtGbC-0lAEZY7WSE_VAMLlA" // Replace with actual image source later
            />
          </div>
          <div className="relative z-10 max-w-lg">
            <h4 className="text-2xl font-headline font-bold text-white mb-2">
              Mock Test Series 2024
            </h4>
            <p className="text-primary-fixed-dim text-sm font-label">
              Challenge yourself with timed simulated exams designed by academic
              experts.
            </p>
            <button className="mt-4 px-6 py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-opacity-90 transition-all">
              Enroll Now
            </button>
          </div>
        </section>
      </main>

      <RightSidebar />
    </div>
  );
}
