import { Project, OpenSourcePR, SkillCategory, LeetCodeStats, GitHubStats } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Himesh Rupchandani',
  title: 'AI & Data Science Developer',
  location: 'Rajkot, Gujarat, India',
  education: {
    degree: 'B.Tech in Computer Science & Engineering (AI & DS)',
    institution: 'Marwadi University',
    duration: '2025 – 2029',
    focus: 'Artificial Intelligence, Machine Learning, Computer Vision, Data Science',
  },
  goal: 'Seeking Summer 2027 Software Engineering, AI & Data Science Internships and collaborative engineering roles.',
  bio: `I am an AI & Data Science developer fascinated by how algorithmic precision and visual computing intersect. My work focuses on Computer Vision architectures—specifically YOLO object detection pipelines and MediaPipe spatial landmark tracking—alongside high-performance Python, C++, and Data Structures.\n\nRather than treating machine learning libraries as black boxes, I delve into open-source internals, contributing bug fixes and numerical validations to libraries like CPython, Kornia, scikit-image, SciPy, and OpenCV Zoo. I believe in writing readable, mathematically rigorous code that solves tangible problems in manufacturing, human-computer interaction, and robotics.`,
  email: 'rupchandanihimesh69@gmail.com',
  socialLinks: {
    github: 'https://github.com/Himesh-rupchandani',
    linkedin: 'https://www.linkedin.com/in/himesh-rupchandani/',
    leetcode: 'https://leetcode.com/u/Himesh-rupchandani/',
  },
  profilePhoto: '/assets/aistudio/Professional_Teal_Background_Headshot_bacd0e93.png',
};

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'defectguard-ai',
    title: 'DefectGuard AI',
    tagline: 'Industrial Steel Defect Detection & Localization with YOLO',
    category: 'Computer Vision & AI-ML',
    status: 'First Rank Winner',
    badge: 'Code Carnival 3.0 — 1st Rank (PS-7)',
    overview:
      'An automated industrial quality-assurance pipeline engineered to detect and classify minute surface anomalies in manufactured steel strips in real time, preventing defective inventory from reaching consumers.',
    problemStatement:
      'Manual steel surface inspection is error-prone, hazardous, and throttles manufacturing throughput. High-speed roll mills produce hundreds of meters of sheet steel per minute, where micro-cracks, inclusions, and rolled-in scale must be localized before assembly.',
    technicalApproach:
      'Trained a custom lightweight YOLO architecture fine-tuned on industrial surface imagery. Implemented dynamic contrast enhancement preprocessing and bounding-box inference filters to preserve throughput while minimizing false negatives.',
    myContribution:
      'Led the end-to-end Computer Vision & AI-ML development as part of Team DEFECT HUNTERS. Prepared dataset labeling strategies, performed hyperparameter tuning, wrote the real-time inference wrapper, and presented technical demonstrations to the jury.',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'NumPy'],
    features: [
      'Multi-class surface defect localization (scratches, patches, inclusions, cracks)',
      'High-throughput inference suited for real-time factory conveyor streams',
      'Defect confidence heat-mapping and bounding-box coordinate output',
      'Batch processing and inspection anomaly logging',
    ],
    challenges: [
      'Addressing class imbalance across rare manufacturing defect classes',
      'Optimizing inference frame latency to keep up with high-speed video capture',
      'Distinguishing ambient industrial dust artifacts from structural metallurgic micro-cracks',
    ],
    githubUrl: 'https://github.com/Himesh-rupchandani/portfolio',
  },
  {
    id: 'handgesture-master-control',
    title: 'HandGesture Master Control',
    tagline: 'Touchless PC System Volume & Screen Brightness Controller',
    category: 'Computer Vision & HCI',
    status: 'Completed',
    overview:
      'A real-time Human-Computer Interaction system leveraging webcam video streams and MediaPipe hand tracking to regulate PC audio volume and display brightness with zero physical contact.',
    problemStatement:
      'Physical keyboard shortcuts and hardware dials are inconvenient when working with messy hands, presenting, or during touch-restricted medical and lab scenarios. A touchless, non-intrusive alternative was needed.',
    technicalApproach:
      'Extracted 21-point hand landmark coordinates using MediaPipe. Calculated Euclidean distances between the thumb tip and index finger tip, normalized the span against hand scale, and mapped values through an exponential smoothing filter before invoking native OS audio and display APIs.',
    myContribution:
      'Architected the entire application from scratch in Python. Devised the landmark distance mathematical mapping, dynamic gesture toggling, and jitter-reduction smoothing filter.',
    technologies: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI', 'Math'],
    features: [
      'Simultaneous 21-landmark skeletal hand tracking at 30+ FPS',
      'Proportional volume control with responsive visual HUD feedback',
      'Secondary gesture activation for screen brightness adjustment',
      'Low CPU overhead utilizing lightweight vision graphs',
    ],
    challenges: [
      'Eliminating trembling and sensor noise around gesture boundary limits',
      'Accommodating varying webcam distances without distorting metric ranges',
      'Ensuring smooth background execution without UI lag',
    ],
    githubUrl: 'https://github.com/Himesh-rupchandani/HandGesture-Master-Control',
  },
  {
    id: 'plastic-detection-ai',
    title: 'Plastic Detection AI',
    tagline: 'Automated Waste Segregation & Damaged Bottle Classification',
    category: 'Computer Vision & Environmental AI',
    status: 'Prototype / In Development',
    overview:
      'A computer vision model designed to classify recyclable plastic waste on industrial recycling sorters, with specific focus on distinguishing damaged or crushed PET bottles from intact containers.',
    problemStatement:
      'Recycling plants require rapid sorting of recyclable items. Crushed or compromised bottles often trick generic object detectors due to distorted silhouettes and irregular surface reflections.',
    technicalApproach:
      'Utilizing OpenCV morphological filtering combined with custom-trained YOLO detection heads to evaluate edge deformation and surface contour irregularities.',
    myContribution:
      'Curating and annotating domain-specific bottle datasets, experimenting with augmentation routines (rotation, specular glare simulation), and evaluating confusion matrices.',
    technologies: ['Python', 'YOLO', 'OpenCV', 'NumPy', 'Data Augmentation'],
    features: [
      'Dual-state classification: intact vs. deformed / crushed PET containers',
      'Contour analysis to verify silhouette deformation',
      'Exploratory prototype for automated municipal recycling facilities',
    ],
    challenges: [
      'Specular glare from transparent plastics confounding edge detectors',
      'Active development: gathering broader real-world lighting samples before deployment',
    ],
    githubUrl: 'https://github.com/Himesh-rupchandani',
  },
  {
    id: 'drone-landing-pad',
    title: 'Drone Night-Vision Landing Pad Alignment',
    tagline: 'Autonomous UAV Visual Docking in Low-Light & GPS-Denied Zones',
    category: 'Robotics & Vision Research',
    status: 'Research & POC',
    overview:
      'An exploratory research project investigating fiducial marker tracking and low-light object detection to guide autonomous UAVs to secure landing pads when GPS signals are unavailable or degraded.',
    problemStatement:
      'Autonomous drones frequently lose satellite positioning in urban canyons, forested canopies, or military/security installations. In night or low-visibility conditions, safe autonomous touchdown becomes hazardous.',
    technicalApproach:
      'Evaluating AprilTag/ArUco marker detection pipelines alongside infrared contrast stretching and deep-learning detection fallbacks for coarse-to-fine visual servoing.',
    myContribution:
      'Researching mathematical coordinate transformations (camera-to-target pose estimation via solvePnP), reviewing published literature, and running synthetic low-light video simulations.',
    technologies: ['Python', 'OpenCV', 'ArUco Markers', 'YOLO', 'Matrix Mathematics'],
    features: [
      'Pose estimation (rotation and translation vectors) relative to docking target',
      'Low-light contrast enhancement preprocessing for dark feeds',
      'Hybrid approach: Fast fiducial tracking with deep neural network redundancy',
    ],
    challenges: [
      'Early research phase: optimizing computational requirements for companion microcomputers',
      'Motion blur compensation during fast descent phases',
    ],
    githubUrl: 'https://github.com/Himesh-rupchandani',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Programming',
    description: 'Core languages used for systems, algorithms, and machine learning pipelines',
    skills: ['Python', 'C', 'C++', 'SQL'],
  },
  {
    name: 'Data Science',
    description: 'Data manipulation, mathematical modeling, and exploratory data analysis',
    skills: ['NumPy', 'Pandas', 'Data Analysis', 'Feature Engineering'],
  },
  {
    name: 'AI & Computer Vision',
    description: 'Real-time spatial perception, neural architectures, and vision libraries',
    skills: ['OpenCV', 'MediaPipe', 'YOLO (v8)', 'Machine Learning', 'Deep Learning Concepts'],
  },
  {
    name: 'Fundamentals',
    description: 'Foundational computer science principles tested across 190+ algorithmic problems',
    skills: ['Data Structures & Algorithms (DSA)', 'Object-Oriented Programming (OOP)', 'DBMS', 'Operating System Basics'],
  },
  {
    name: 'Tools & Ecosystem',
    description: 'Development environments, version control, and collaborative tooling',
    skills: ['Git', 'GitHub', 'VS Code', 'Linux Terminal', 'Jupyter'],
  },
];

export const VERIFIED_PRS: OpenSourcePR[] = [
  {
    id: 'pr-skimage-8302',
    repo: 'scikit-image/scikit-image',
    repoOwner: 'scikit-image',
    title: 'Validate bandwidth in gabor_kernel',
    prNumber: 8302,
    url: 'https://github.com/scikit-image/scikit-image/pull/8302',
    state: 'open',
    description: 'Adds numerical boundary validation for the bandwidth parameter in Gabor filter generation to prevent ZeroDivisionError and illegal spatial frequency calculations.',
    impactArea: 'Numerical Safety & Filter Algorithms',
  },
  {
    id: 'pr-opencv-zoo-317',
    repo: 'opencv/opencv_zoo',
    repoOwner: 'opencv',
    title: 'Add LPD-YuNet evaluation script on CCPD',
    prNumber: 317,
    url: 'https://github.com/opencv/opencv_zoo/pull/317',
    state: 'open',
    description: 'Contributes a standardized evaluation benchmark script for the lightweight LPD-YuNet License Plate Detection model across the comprehensive CCPD dataset.',
    impactArea: 'Computer Vision Benchmarking',
  },
  {
    id: 'pr-cpython-158369',
    repo: 'python/cpython',
    repoOwner: 'python',
    title: 'gh-158364: Don\'t report other interpreters\' threads in sys._current_frames()',
    prNumber: 158369,
    url: 'https://github.com/python/cpython/pull/158369',
    state: 'closed',
    description: 'Refined subinterpreter frame isolation to ensure sys._current_frames() respects execution boundaries in multi-interpreter Python runtimes.',
    impactArea: 'CPython Subinterpreters & Threading',
  },
  {
    id: 'pr-cpython-156736',
    repo: 'python/cpython',
    repoOwner: 'python',
    title: 'gh-156725: Document O(N) behavior of PyCode_Addr2Line and line-table API',
    prNumber: 156736,
    url: 'https://github.com/python/cpython/pull/156736',
    state: 'closed',
    description: 'Documented performance complexities and algorithmic traversal costs inside internal bytecode line-mapping tables for CPython core documentation.',
    impactArea: 'Core Documentation & Bytecode Internals',
  },
  {
    id: 'pr-kornia-5119',
    repo: 'kornia/kornia',
    repoOwner: 'kornia',
    title: 'fix(augmentation): dispatch IntensityAugmentationBase2D box and keypoint overrides',
    prNumber: 5119,
    url: 'https://github.com/kornia/kornia/pull/5119',
    state: 'closed',
    description: 'Fixed dispatch bug where intensity transformations in AugmentationSequential failed to propagate through bounding box and keypoint spatial targets.',
    impactArea: 'PyTorch Vision Augmentations',
  },
  {
    id: 'pr-kornia-4133',
    repo: 'kornia/kornia',
    repoOwner: 'kornia',
    title: 'fix(color): raise ShapeError for zero-sized YUV chroma planes',
    prNumber: 4133,
    url: 'https://github.com/kornia/kornia/pull/4133',
    state: 'closed',
    description: 'Ensured robust exception handling and input tensor dimension validation when converting empty or degenerate YUV chroma planes to RGB.',
    impactArea: 'Tensor Color Conversions',
  },
  {
    id: 'pr-scipy-26049',
    repo: 'scipy/scipy',
    repoOwner: 'scipy',
    title: 'DOC: correct p_lb to slice index in ShortTimeFFT tutorial',
    prNumber: 26049,
    url: 'https://github.com/scipy/scipy/pull/26049',
    state: 'closed',
    description: 'Corrected indexing bounds in the mathematical ShortTimeFFT signal processing documentation to ensure reproducibility for scientific computing users.',
    impactArea: 'Signal Processing & Scientific Docs',
  },
  {
    id: 'pr-pandas-67626',
    repo: 'pandas-dev/pandas',
    repoOwner: 'pandas-dev',
    title: 'BUG: fix IndexError when usecols selects a column not at position 0',
    prNumber: 67626,
    url: 'https://github.com/pandas-dev/pandas/pull/67626',
    state: 'closed',
    description: 'Addressed index offset failure occurring when parsing non-initial column subsets in selective CSV loading routines.',
    impactArea: 'Data Ingestion & CSV Parsing',
  },
  {
    id: 'pr-winget-445000',
    repo: 'microsoft/winget-pkgs',
    repoOwner: 'microsoft',
    title: 'Update: REALiX.HWiNFO version 8.52 InstallerUrl to official host',
    prNumber: 445000,
    url: 'https://github.com/microsoft/winget-pkgs/pull/445000',
    state: 'closed',
    description: 'Maintained package distribution manifests for Windows Package Manager, verifying hashes and official source URLs.',
    impactArea: 'Package Distribution & Windows Ecosystem',
  },
];

export const HACKATHON_ACHIEVEMENTS = [
  {
    id: 'atmiya-code-carnival',
    title: 'First Rank Winner — Code Carnival 3.0',
    organizer: 'Atmiya University',
    problemStatement: 'PS-7: Automated Steel Surface Defect Detection',
    team: 'Team DEFECT HUNTERS',
    role: 'Computer Vision & AI-ML Developer',
    date: 'March 2025',
    summary:
      'Clinched 1st place among regional university contenders by building DefectGuard AI—a high-speed YOLO defect detection and classification system demonstrating 90%+ real-time accuracy under simulated manufacturing feed conditions.',
    highlights: [
      'First Rank in Problem Statement 7 (PS-7)',
      'Live industrial demo evaluated by academic and industry judges',
      'Recognized for exceptional latency-to-accuracy balance and production-ready architecture',
    ],
  },
];

export const INITIAL_LEETCODE_STATS: LeetCodeStats = {
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
};

export const INITIAL_GITHUB_STATS: GitHubStats = {
  username: 'Himesh-rupchandani',
  name: 'Himesh Rupchandani',
  bio: '🖐️ Computer Vision · 📊 Data Science · ⚙️ C++ & DSA\n🎓 CSE (AI & DS) · 150+ LeetCode\n🚀 Open to SDE / DS internships — Summer 2027',
  avatarUrl: '/assets/aistudio/Professional_Teal_Background_Headshot_bacd0e93.png',
  publicRepos: 24,
  followers: 4,
  following: 5,
  company: 'Marwadi University',
  location: 'Rajkot, Gujarat',
  hireable: true,
  featuredRepos: [
    {
      name: 'HandGesture-Master-Control',
      description: 'Control your PC\'s volume & brightness with hand gestures in real time — Python, OpenCV, MediaPipe.',
      language: 'Python',
      stars: 1,
      url: 'https://github.com/Himesh-rupchandani/HandGesture-Master-Control',
    },
    {
      name: 'LEET-CODE',
      description: '🧩 My LeetCode journey — 150+ solutions in C++/Python, organized by difficulty. Consistency > Intensity.',
      language: 'C++',
      stars: 0,
      url: 'https://github.com/Himesh-rupchandani/LEET-CODE',
    },
    {
      name: 'portfolio',
      description: 'Personal developer portfolio crafted with an Oxblood & Champagne aesthetic, showcasing AI & Data Science projects.',
      language: 'TypeScript',
      stars: 0,
      url: 'https://github.com/Himesh-rupchandani/portfolio',
    },
    {
      name: 'python-hub',
      description: '🐍 Python learning hub — basics to intermediate, coursework, and practice programs. Learning in public.',
      language: 'Python',
      stars: 0,
      url: 'https://github.com/Himesh-rupchandani/python-hub',
    },
  ],
};
