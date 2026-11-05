import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for external API calls to avoid rate limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: {
  github?: CacheEntry<any>;
  leetcode?: CacheEntry<any>;
} = {};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// 1. Live GitHub Statistics Endpoint
app.get('/api/github', async (req: Request, res: Response) => {
  const username = 'Himesh-rupchandani';
  const now = Date.now();

  if (cache.github && (now - cache.github.timestamp < CACHE_TTL_MS)) {
    return res.json({ source: 'cache', data: cache.github.data });
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'HimeshPortfolio/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user API returned ${userRes.status}`);
    }

    const userData = await userRes.json();

    // Fetch user's repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, {
      headers: {
        'User-Agent': 'HimeshPortfolio/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    let reposData: any[] = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    const payload = {
      username: userData.login,
      name: userData.name || 'Himesh Rupchandani',
      bio: userData.bio || '',
      avatarUrl: userData.avatar_url,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      company: userData.company,
      location: userData.location,
      hireable: userData.hireable ?? true,
      repos: Array.isArray(reposData) ? reposData.slice(0, 8).map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        updatedAt: repo.updated_at,
      })) : [],
    };

    cache.github = { data: payload, timestamp: now };
    return res.json({ source: 'live', data: payload });
  } catch (err: any) {
    console.error('Error fetching GitHub stats:', err.message);
    // Return verified fallback data if API rate limits or network issues arise
    const fallback = {
      username: 'Himesh-rupchandani',
      name: 'Himesh Rupchandani',
      bio: '🖐️ Computer Vision · 📊 Data Science · ⚙️ C++ & DSA\n🎓 CSE (AI & DS) · 150+ LeetCode\n🚀 Open to SDE / DS internships — Summer 2027',
      avatarUrl: 'https://avatars.githubusercontent.com/u/250642936?v=4',
      publicRepos: 24,
      followers: 4,
      following: 5,
      company: 'Marwadi University',
      location: 'Rajkot, Gujarat',
      hireable: true,
      repos: [
        {
          name: 'HandGesture-Master-Control',
          description: 'Control your PC\'s volume & brightness with hand gestures in real time — Python, OpenCV, MediaPipe.',
          language: 'Python',
          stars: 1,
          forks: 0,
          url: 'https://github.com/Himesh-rupchandani/HandGesture-Master-Control',
        },
        {
          name: 'LEET-CODE',
          description: '🧩 My LeetCode journey — 150+ solutions in C++/Python, organized by difficulty. Consistency > Intensity.',
          language: 'C++',
          stars: 0,
          forks: 0,
          url: 'https://github.com/Himesh-rupchandani/LEET-CODE',
        },
        {
          name: 'portfolio',
          description: 'Personal developer portfolio crafted with an Oxblood & Champagne aesthetic, showcasing AI & Data Science projects.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: 'https://github.com/Himesh-rupchandani/portfolio',
        },
        {
          name: 'python-hub',
          description: '🐍 Python learning hub — basics to intermediate, coursework, and practice programs. Learning in public.',
          language: 'Python',
          stars: 0,
          forks: 0,
          url: 'https://github.com/Himesh-rupchandani/python-hub',
        },
      ],
    };
    return res.json({ source: 'fallback', data: fallback, error: err.message });
  }
});

// 2. Live LeetCode Statistics Endpoint
app.get('/api/leetcode', async (req: Request, res: Response) => {
  const username = 'Himesh-rupchandani';
  const now = Date.now();

  if (cache.leetcode && (now - cache.leetcode.timestamp < CACHE_TTL_MS)) {
    return res.json({ source: 'cache', data: cache.leetcode.data });
  }

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;

    const lcRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!lcRes.ok) {
      throw new Error(`LeetCode GraphQL returned ${lcRes.status}`);
    }

    const json = await lcRes.json();
    const matchedUser = json?.data?.matchedUser;

    if (!matchedUser) {
      throw new Error('LeetCode user profile not found or private');
    }

    const acSubmissions = matchedUser.submitStats?.acSubmissionNum || [];
    const allStats = acSubmissions.find((s: any) => s.difficulty === 'All') || { count: 0, submissions: 0 };
    const easyStats = acSubmissions.find((s: any) => s.difficulty === 'Easy') || { count: 0 };
    const mediumStats = acSubmissions.find((s: any) => s.difficulty === 'Medium') || { count: 0 };
    const hardStats = acSubmissions.find((s: any) => s.difficulty === 'Hard') || { count: 0 };

    const contestRanking = json?.data?.userContestRanking;

    const payload = {
      username: matchedUser.username,
      totalSolved: allStats.count,
      totalSubmissions: allStats.submissions,
      easySolved: easyStats.count,
      mediumSolved: mediumStats.count,
      hardSolved: hardStats.count,
      ranking: matchedUser.profile?.ranking || 0,
      reputation: matchedUser.profile?.reputation || 0,
      starRating: matchedUser.profile?.starRating || 0,
      contestRating: contestRanking ? Math.round(contestRanking.rating) : null,
      contestCount: contestRanking ? contestRanking.attendedContestsCount : 0,
    };

    cache.leetcode = { data: payload, timestamp: now };
    return res.json({ source: 'live', data: payload });
  } catch (err: any) {
    console.error('Error fetching LeetCode stats:', err.message);
    // Verified fallback snapshot
    const fallback = {
      username: 'Himesh-rupchandani',
      totalSolved: 197,
      totalSubmissions: 287,
      easySolved: 173,
      mediumSolved: 24,
      hardSolved: 0,
      ranking: 900004,
      reputation: 160,
      starRating: 2.0,
      contestRating: null,
      contestCount: 0,
    };
    return res.json({ source: 'fallback', data: fallback, error: err.message });
  }
});

// 3. Contact Form Submission Endpoint
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Please enter your name.' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Please enter a message subject.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
    }

    const contactEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // Store in local contact log
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const messagesFile = path.join(dataDir, 'messages.json');
    let messages: any[] = [];
    if (fs.existsSync(messagesFile)) {
      try {
        messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
      } catch (e) {
        messages = [];
      }
    }
    messages.push(contactEntry);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    // Check if external SMTP / Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const mailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL || 'rupchandanihimesh69@gmail.com',
            subject: `[Portfolio Inquiry] ${subject.trim()} from ${name.trim()}`,
            text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
          }),
        });
        if (mailRes.ok) {
          return res.json({
            success: true,
            deliveredDirectly: true,
            message: 'Your message has been delivered directly to Himesh\'s inbox.',
          });
        }
      } catch (mailErr) {
        console.error('Mail dispatch error:', mailErr);
      }
    }

    // Transparent, honest response
    return res.json({
      success: true,
      deliveredDirectly: false,
      storedLocally: true,
      message:
        'Thank you! Your message was received and logged to the server database. (Note: To enable instant direct email forwarding to your personal inbox, add RESEND_API_KEY to your environment secrets).',
    });
  } catch (error: any) {
    console.error('Error handling contact form:', error);
    return res.status(500).json({ success: false, error: 'Server error processing your request. Please try again or reach out on LinkedIn.' });
  }
});

// Setup Vite Dev or Static Production Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
