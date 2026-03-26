// components/SubjectCard.tsx
import React from 'react';
import { ArrowForwardIcon } from './icons';

interface SubjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group relative bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:translate-y-[-4px]">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
      <div className="relative">
        <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          {/* We wrap the icon so it sizes correctly */}
          <div className="text-3xl flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-sm text-secondary mb-8 leading-relaxed">
          {description}
        </p>
        <button className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white font-bold rounded-lg text-sm transition-all hover:shadow-[0_8px_20px_-4px_rgba(0,63,177,0.4)]">
          Start Quiz
          <ArrowForwardIcon className="text-lg" />
        </button>
      </div>
    </div>
  );
};