import React from 'react';
import { GitHubStatsSection } from './GitHubStatsSection';
import { LeetCodeSection } from './LeetCodeSection';

export const StatsOverview: React.FC = () => {
  return (
    <section id="stats" className="py-20 border-t border-[#D5AE70]/15 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-semibold tracking-wider text-[#D5AE70] uppercase mb-2">
            06. Live Developer Metrics
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F0DFC5] tracking-tight">
            Live GitHub &amp; LeetCode Statistics
          </h2>
          <p className="text-sm text-[#F0DFC5]/70 mt-2 max-w-xl">
            Real-time public telemetry queried directly from GitHub and LeetCode APIs with server caching. Transparent, uninflated metrics.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <GitHubStatsSection />
          <LeetCodeSection />
        </div>
      </div>
    </section>
  );
};
