// components/RightSidebar.tsx
import React from 'react';
import { CheckCircleIcon, BookmarkIcon, EmojiEventsIcon } from './icons';

export const RightSidebar = () => {
  return (
    <aside className="w-80 h-screen fixed right-0 top-0 bg-surface-container-low border-l-0 p-8 flex flex-col gap-y-8 overflow-y-auto">
      <section>
        <h4 className="text-xs font-label font-bold text-secondary uppercase tracking-[0.15em] mb-6">Quick Stats</h4>
        <div className="space-y-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-primary">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Weekly Mastery</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-headline font-extrabold text-on-surface">84%</span>
              <span className="text-xs text-primary font-bold">+12% vs last week</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[84%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-tertiary">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Quizzes Completed</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-headline font-extrabold text-on-surface">142</span>
              <span className="text-xs text-secondary">Level 12 Scholar</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-label font-bold text-secondary uppercase tracking-[0.15em]">Recent Activity</h4>
          <button className="text-[10px] font-bold text-primary hover:underline">View All</button>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CheckCircleIcon className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Completed: Indian Polity</p>
              <p className="text-[10px] text-secondary mt-1">Score: 48/50 • 2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
              <BookmarkIcon className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Marked for Review</p>
              <p className="text-[10px] text-secondary mt-1">Rajasthan Geography • Unit 4</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <EmojiEventsIcon className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">New Badge Unlocked</p>
              <p className="text-[10px] text-secondary mt-1">Consistent Learner • 7 Day Streak</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar/Engagement Mockup */}
      <section className="mt-auto">
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
          <p className="text-xs font-bold text-primary mb-2 text-center">Study Streak</p>
          <div className="flex justify-between items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">M</span>
              <div className="w-6 h-6 rounded-md bg-primary"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">T</span>
              <div className="w-6 h-6 rounded-md bg-primary"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">W</span>
              <div className="w-6 h-6 rounded-md bg-primary"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">T</span>
              <div className="w-6 h-6 rounded-md bg-primary"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">F</span>
              <div className="w-6 h-6 rounded-md bg-primary"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">S</span>
              <div className="w-6 h-6 rounded-md bg-surface-container"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-secondary uppercase">S</span>
              <div className="w-6 h-6 rounded-md bg-surface-container"></div>
            </div>
          </div>
          <p className="text-[10px] text-secondary mt-4 text-center italic"> Consistency is the key to mastery.</p>
        </div>
      </section>
    </aside>
  );
};