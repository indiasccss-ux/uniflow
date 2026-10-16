export interface UserProfile {
  name: string;
  avatar: string;
  tagline: string;
  major: string;
  institution: string;
  honor: string;
  term: string;
  gpa: number;
  maxGpa: number;
  creditsCurrent: number;
  creditsTotal: number;
  level: number;
  xp: number;
  xpNextLevel: number;
  streakDays: number;
  deepWorkHoursThisWeek: number;
  deepWorkGoalHours: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
  bgGlow: string;
  instructor: string;
  room: string;
  schedule: string;
  grade: string;
  progress: number;
  nextMilestone: string;
  credits: number;
}

export interface CollegeNotice {
  id: string;
  title: string;
  sender: string;
  channel: 'WhatsApp Forward' | 'Canvas Announcement' | 'Dean Portal' | 'Student Discord';
  date: string;
  rawText: string;
  // Parsed AI attributes
  extracted: {
    courseCode: string;
    actionItem: string;
    deadline: string;
    deadlineFormatted: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    estimatedHours: number;
    tags: string[];
    summary: string;
    actionType: 'Assignment' | 'Exam Prep' | 'Grant Submission' | 'Registration';
  };
}

export interface TaskItem {
  id: string;
  title: string;
  courseCode: string;
  color: string;
  dueTime: string;
  difficulty: 'Hard' | 'Medium' | 'Chill';
  estMinutes: number;
  completed: boolean;
  xpReward: number;
  priority: 'high' | 'normal' | 'low';
}

export interface ScheduleEvent {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:30"
  courseCode: string;
  title: string;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Deep Work' | 'Office Hours';
  room: string;
  instructor: string;
  color: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

export interface CampusEvent {
  id: string;
  title: string;
  organizer: string;
  category: 'Tech & AI' | 'Hackathon' | 'Design' | 'Social & Lo-Fi';
  date: string;
  time: string;
  location: string;
  spotsLeft: number;
  totalSpots: number;
  registered: boolean;
  coverGradient: string;
  badge: string;
  description: string;
  imageUrl?: string;
}

export const INITIAL_USER: UserProfile = {
  name: 'Alex Mercer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  tagline: 'Neuro-Symbolic AI & Spatial Systems',
  major: 'B.S. Artificial Intelligence & Neuroscience',
  institution: 'Stanford University',
  honor: "Dean's High Honors List",
  term: 'Senior Year • Spring 2026',
  gpa: 3.96,
  maxGpa: 4.00,
  creditsCurrent: 18,
  creditsTotal: 20,
  level: 16,
  xp: 3420,
  xpNextLevel: 4000,
  streakDays: 24,
  deepWorkHoursThisWeek: 28.5,
  deepWorkGoalHours: 35.0,
};

export const COURSES: Course[] = [
  {
    id: 'cs229',
    code: 'CS 229',
    name: 'Machine Learning & Neural Architectures',
    color: '#6366f1', // Indigo
    bgGlow: 'rgba(99, 102, 241, 0.15)',
    instructor: 'Prof. Andrew Ng & Dr. Vance',
    room: 'Packard Hall 101',
    schedule: 'Mon / Wed • 10:00 - 11:30 AM',
    grade: 'A (97.4%)',
    progress: 85,
    nextMilestone: 'Transformer Kernel Optimization due Thursday',
    credits: 4,
  },
  {
    id: 'neur210',
    code: 'NEUR 210',
    name: 'Computational Synaptic Dynamics',
    color: '#06b6d4', // Cyan
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    instructor: 'Dr. Elena Rostova',
    room: 'Clark Bio-X Auditorium S360',
    schedule: 'Tue / Thu • 01:15 - 02:45 PM',
    grade: 'A+ (99.1%)',
    progress: 92,
    nextMilestone: 'Patch Clamp Spiking Model due Friday',
    credits: 4,
  },
  {
    id: 'des314',
    code: 'DESIGN 314',
    name: 'Spatial Computing & Kinetic UX',
    color: '#ec4899', // Pink
    bgGlow: 'rgba(236, 72, 153, 0.15)',
    instructor: 'Prof. Hiroshi Ishii',
    room: 'd.school Studio 4',
    schedule: 'Tue • 04:00 - 06:30 PM',
    grade: 'A (95.0%)',
    progress: 78,
    nextMilestone: 'VisionOS Spatial Haptic Prototype',
    credits: 3,
  },
  {
    id: 'phil182',
    code: 'PHIL 182',
    name: 'Ethics of Autonomous Superintelligence',
    color: '#10b981', // Emerald
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    instructor: 'Prof. Nick Bostrom',
    room: 'Wallenberg 200',
    schedule: 'Wed / Fri • 02:00 - 03:15 PM',
    grade: 'A- (92.8%)',
    progress: 70,
    nextMilestone: 'Alignment Paper Draft review',
    credits: 3,
  },
];

export const RAW_NOTICES: CollegeNotice[] = [
  {
    id: 'notice-1',
    title: '⚠️ CS 229: Urgent Problem Set 4 Submission Window Shift',
    sender: 'Prof. Marcus Vance (TA Coordinator)',
    channel: 'WhatsApp Forward',
    date: '12 mins ago',
    rawText: `[FORWARDED FROM CS229 ANNOUNCEMENT CHAT]
Hey everyone, heads up! Due to the Stanford Stanford Farm Cluster GPU downtime scheduled for this weekend, P-Set 4 (Sparse Attention Kernels & FlashAttention v3 CUDA implementation) submission deadline has been MOVED FORWARD to Thursday at 11:59 PM instead of Friday night. 

Please ensure you submit both your PDF writeup and the .zip of your PyTorch benchmark kernels to Gradescope. Late passes CANNOT be applied to this assignment due to grading auto-sync. Ping me during OH if GPU memory allocation errors persist.`,
    extracted: {
      courseCode: 'CS 229',
      actionItem: 'Submit FlashAttention v3 CUDA Kernel & Benchmark PDF',
      deadline: '2026-10-16T23:59:00',
      deadlineFormatted: 'This Thursday • 11:59 PM',
      priority: 'CRITICAL',
      estimatedHours: 4.5,
      tags: ['Gradescope', 'CUDA', 'P-Set 4', 'Strict Deadline'],
      summary: 'Deadline pushed forward by 24h due to Stanford GPU cluster maintenance. No late passes allowed.',
      actionType: 'Assignment',
    },
  },
  {
    id: 'notice-2',
    title: 'Bio-X Innovation Grant: Mandatory Senior Draft Defense',
    sender: 'Dean of Undergraduate Research',
    channel: 'Dean Portal',
    date: '2 hours ago',
    rawText: `Bio-X Interdisciplinary Fellowship Announcement:
All senior fellowship grant applicants must submit their preliminary 5-page research defense slides by Friday at 4:00 PM. Physical presentation scheduled for Clark Center S360. 
Bring 3 printed executive summaries for the evaluating panel. Slide deck format: 16:9 PDF with high-resolution synaptic electron microscopy diagrams included.`,
    extracted: {
      courseCode: 'NEUR 210',
      actionItem: 'Prepare 5-page Grant Defense Slides & 3 Executive Summaries',
      deadline: '2026-10-17T16:00:00',
      deadlineFormatted: 'Friday • 04:00 PM',
      priority: 'HIGH',
      estimatedHours: 3.0,
      tags: ['Fellowship', 'Slide Deck', 'Clark S360', 'Printed Copies'],
      summary: 'Senior fellowship grant presentation slides and 3 executive summaries required for Clark Center panel.',
      actionType: 'Grant Submission',
    },
  },
  {
    id: 'notice-3',
    title: 'TreeHacks 2026: AI Hardware Track Registration Closing',
    sender: 'Stanford TreeHacks Organizing Committee',
    channel: 'Student Discord',
    date: 'Today • 03:15 PM',
    rawText: `⚡ TreeHacks 2026 Alert:
Hackers! Final team lock is tonight at 11:59 PM. If your team is submitting for the Neuro-Symbolic & Spatial Computing track ($15k top prize + NVIDIA B200 sandbox access), you must link your repo and finalize roster of 4 members in the portal now.`,
    extracted: {
      courseCode: 'EXTRACURRICULAR',
      actionItem: 'Finalize TreeHacks Team Roster & Submit GitHub Repo',
      deadline: '2026-10-15T23:59:00',
      deadlineFormatted: 'Tonight • 11:59 PM',
      priority: 'HIGH',
      estimatedHours: 1.0,
      tags: ['Hackathon', 'NVIDIA B200', 'TreeHacks', 'Portal Lock'],
      summary: 'Team roster lock and GitHub repo submission deadline for TreeHacks 2026 Spatial track.',
      actionType: 'Registration',
    },
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Practical Midterm Exam: CUDA Attention Kernels & Benchmark Defense',
    courseCode: 'CS 229',
    color: '#6366f1',
    dueTime: 'Today • 6:00 PM',
    difficulty: 'Hard',
    estMinutes: 90,
    completed: false,
    xpReward: 250,
    priority: 'high',
  },
  {
    id: 'task-2',
    title: 'Lab Exam: Patch-Clamp Synapse Modeling & Electrophysiology Review',
    courseCode: 'NEUR 210',
    color: '#06b6d4',
    dueTime: 'Tomorrow • 11:00 AM',
    difficulty: 'Medium',
    estMinutes: 60,
    completed: false,
    xpReward: 180,
    priority: 'high',
  },
  {
    id: 'task-3',
    title: 'Spatial UI Exam: Real-Time Shader Pipeline & Kinetic UX Defense',
    courseCode: 'DESIGN 314',
    color: '#ec4899',
    dueTime: 'Tomorrow • 3:30 PM',
    difficulty: 'Medium',
    estMinutes: 45,
    completed: true,
    xpReward: 150,
    priority: 'normal',
  },
  {
    id: 'task-4',
    title: 'Theoretical Final Exam: Superintelligence Alignment & Formal Ethics',
    courseCode: 'PHIL 182',
    color: '#10b981',
    dueTime: 'Friday • 1:00 PM',
    difficulty: 'Chill',
    estMinutes: 30,
    completed: false,
    xpReward: 90,
    priority: 'low',
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'ev-1',
    day: 'Mon',
    startTime: '10:00',
    endTime: '11:30',
    courseCode: 'CS 229',
    title: 'Sparse Attention & Transformer Scaling Laws',
    type: 'Lecture',
    room: 'Packard Hall 101',
    instructor: 'Prof. Andrew Ng',
    color: '#6366f1',
    status: 'completed',
  },
  {
    id: 'ev-2',
    day: 'Mon',
    startTime: '13:00',
    endTime: '15:00',
    courseCode: 'DEEP WORK',
    title: 'FlashAttention Kernel Optimization Sprint',
    type: 'Deep Work',
    room: 'Green Library Rotunda',
    instructor: 'Alex Mercer (Self)',
    color: '#a855f7',
    status: 'completed',
  },
  {
    id: 'ev-3',
    day: 'Tue',
    startTime: '13:15',
    endTime: '14:45',
    courseCode: 'NEUR 210',
    title: 'Synaptic Plasticity & Spiking Dynamics',
    type: 'Lecture',
    room: 'Clark Bio-X S360',
    instructor: 'Dr. Elena Rostova',
    color: '#06b6d4',
    status: 'completed',
  },
  {
    id: 'ev-4',
    day: 'Tue',
    startTime: '16:00',
    endTime: '18:30',
    courseCode: 'DESIGN 314',
    title: 'Spatial Canvas & Kinetic UI Critiques',
    type: 'Lab',
    room: 'd.school Studio 4',
    instructor: 'Prof. Hiroshi Ishii',
    color: '#ec4899',
    status: 'in-progress',
  },
  {
    id: 'ev-5',
    day: 'Wed',
    startTime: '10:00',
    endTime: '11:30',
    courseCode: 'CS 229',
    title: 'CUDA Tensor Core Acceleration Lab',
    type: 'Lab',
    room: 'Gates Building B02',
    instructor: 'Dr. Marcus Vance',
    color: '#6366f1',
    status: 'upcoming',
  },
  {
    id: 'ev-6',
    day: 'Wed',
    startTime: '14:00',
    endTime: '15:15',
    courseCode: 'PHIL 182',
    title: 'Orthogonality Thesis & Value Alignment',
    type: 'Seminar',
    room: 'Wallenberg 200',
    instructor: 'Prof. Nick Bostrom',
    color: '#10b981',
    status: 'upcoming',
  },
  {
    id: 'ev-7',
    day: 'Thu',
    startTime: '13:15',
    endTime: '14:45',
    courseCode: 'NEUR 210',
    title: 'Electrophysiology Simulation in Silicon',
    type: 'Lab',
    room: 'Clark Bio-X Lab 12',
    instructor: 'Dr. Elena Rostova',
    color: '#06b6d4',
    status: 'upcoming',
  },
  {
    id: 'ev-8',
    day: 'Fri',
    startTime: '14:00',
    endTime: '15:15',
    courseCode: 'PHIL 182',
    title: 'Superintelligence Governance Debates',
    type: 'Seminar',
    room: 'Wallenberg 200',
    instructor: 'Prof. Nick Bostrom',
    color: '#10b981',
    status: 'upcoming',
  },
  {
    id: 'ev-9',
    day: 'Fri',
    startTime: '16:00',
    endTime: '17:30',
    courseCode: 'NEUR 210',
    title: 'Senior Fellowship Defense Presentation',
    type: 'Seminar',
    room: 'Clark Center S360',
    instructor: 'Research Panel',
    color: '#f59e0b',
    status: 'upcoming',
  },
];

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'Silicon Valley AI Summit: Frontier Labs Keynote',
    organizer: 'Stanford AI Guild & Sequoia Capital',
    category: 'Tech & AI',
    date: 'Tomorrow, Oct 15',
    time: '06:00 PM - 09:00 PM',
    location: 'Memorial Auditorium',
    spotsLeft: 18,
    totalSpots: 350,
    registered: true,
    coverGradient: 'from-indigo-600/40 via-purple-600/30 to-pink-600/20',
    badge: 'EXCLUSIVE VIP PASS',
    description: 'Fireside discussion with leading research scientists on agentic reasoning and next-gen neuro-symbolic models.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'evt-2',
    title: 'Spatial Audio & Lo-Fi Deep Work Sanctuary',
    organizer: 'd.school Sound & Wellbeing Lab',
    category: 'Social & Lo-Fi',
    date: 'Thursday, Oct 16',
    time: '08:00 PM - 11:30 PM',
    location: 'CoHo Rooftop Starlight Lounge',
    spotsLeft: 7,
    totalSpots: 60,
    registered: false,
    coverGradient: 'from-cyan-600/40 via-blue-600/30 to-indigo-600/20',
    badge: 'LIMITED CAPACITY',
    description: 'Immersive sound baths, 432Hz ambient binaural soundscapes, artisan matcha, and silent collaborative study.',
    imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'evt-3',
    title: 'TreeHacks 2026: 36-Hour Hackathon Launch',
    organizer: 'TreeHacks Engineering Board',
    category: 'Hackathon',
    date: 'Friday, Oct 17',
    time: '05:00 PM Kickoff',
    location: 'Arrillaga Center for Sports & Recreation',
    spotsLeft: 42,
    totalSpots: 1200,
    registered: true,
    coverGradient: 'from-emerald-600/40 via-teal-600/30 to-blue-600/20',
    badge: '₹4,00,000+ PRIZE POOL',
    description: 'Largest collegiate hackathon in North America. AI agents, Spatial UI, and hardware tracks with global industry judges.',
    imageUrl: '/images/hackathon-team.jpg',
  },
  {
    id: 'evt-4',
    title: 'Spatial Design & Apple Vision Pro Workshop',
    organizer: 'Stanford XR Design Collective',
    category: 'Design',
    date: 'Saturday, Oct 18',
    time: '02:00 PM - 05:00 PM',
    location: 'Huang Engineering Studio 019',
    spotsLeft: 4,
    totalSpots: 30,
    registered: false,
    coverGradient: 'from-amber-600/40 via-orange-600/30 to-red-600/20',
    badge: 'HANDS-ON HARDWARE',
    description: 'Hands-on session building visionOS window ornaments, volumetric 3D models, and eye-tracking gestures.',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
  },
];
