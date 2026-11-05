export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: 'Completed' | 'First Rank Winner' | 'Prototype / In Development' | 'Research & POC';
  overview: string;
  problemStatement: string;
  technicalApproach: string;
  myContribution: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  githubUrl?: string;
  demoUrl?: string;
  badge?: string;
}

export interface OpenSourcePR {
  id: string;
  repo: string;
  repoOwner: string;
  title: string;
  prNumber: number;
  url: string;
  state: 'open' | 'closed' | 'merged';
  description: string;
  impactArea: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: string[];
}

export interface GitHubStats {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  company: string;
  location: string;
  hireable: boolean;
  featuredRepos: {
    name: string;
    description: string;
    language: string;
    stars: number;
    url: string;
  }[];
}

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  totalSubmissions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  reputation: number;
  starRating: number;
  contestRating: number | null;
}
