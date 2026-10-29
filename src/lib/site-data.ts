/**
 * Site content for ELITE STUDY POINT.
 *
 * IMPORTANT — verified facts only. Everything marked "to be confirmed" is a
 * placeholder that must be replaced with real information before publishing.
 * Do NOT invent subjects, timings, results, testimonials or contact details.
 */

export const SITE = {
  name: "ELITE STUDY POINT",
  tagline: "An Ocean of Knowledge.",
  established: 2016,
  locationLabel: "Trilokpuri, Delhi",
  intro:
    "ELITE STUDY POINT has been offering comprehensive and affordable private lessons in Trilokpuri since 2016. Our goal is to create a supportive learning environment where students can strengthen their understanding, ask questions freely, and build confidence in their academic journey.",
  instagram: {
    handle: "@elitestudypoint01",
    url: "https://www.instagram.com/elitestudypoint01/",
    // Approximate audience from the supplied profile information.
    followersLabel: "≈ 1,543 in our community",
  },
  youtube: {
    label: "Elite Study Point on YouTube",
    url: "https://www.youtube.com/channel/UCTDGe2QhRtw5K-v5bcqsZgQ",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Classes", href: "#classes" },
  { label: "Teaching Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
] as const;

export type ClassOffering = {
  title: string;
  description: string;
  level: string;
  icon: "math" | "science" | "english" | "exam" | "junior" | "senior";
};

/**
 * PLACEHOLDER CATALOGUE — the exact subjects, grade levels, curriculum,
 * timings and teaching formats have NOT been confirmed. Edit this array when
 * the institute confirms its real offerings.
 */
export const CLASS_OFFERINGS: ClassOffering[] = [
  {
    title: "Mathematics",
    description: "Concept-first sessions that build number sense and problem-solving, step by step.",
    level: "Details to be confirmed",
    icon: "math",
  },
  {
    title: "Science",
    description: "Clear explanations and everyday examples that make ideas stick.",
    level: "Details to be confirmed",
    icon: "science",
  },
  {
    title: "English",
    description: "Reading, writing and language skills taught with patience and encouragement.",
    level: "Details to be confirmed",
    icon: "english",
  },
  {
    title: "Exam Preparation",
    description: "Focused revision and practice to help students walk into exams prepared.",
    level: "Details to be confirmed",
    icon: "exam",
  },
  {
    title: "Junior Foundations",
    description: "Strong early foundations taught gently, so confidence grows early.",
    level: "Details to be confirmed",
    icon: "junior",
  },
  {
    title: "Senior Secondary",
    description: "Structured support for higher classes, subject by subject.",
    level: "Details to be confirmed",
    icon: "senior",
  },
];

export const APPROACH_PILLARS = [
  {
    title: "Concept Clarity",
    body: "Help students build a stronger understanding of the topics they study.",
    icon: "clarity" as const,
  },
  {
    title: "Personal Attention",
    body: "Private lessons create room for focused support, shaped around each student.",
    icon: "attention" as const,
  },
  {
    title: "Confidence Through Practice",
    body: "Practice, questions, revision and steady academic development, week after week.",
    icon: "practice" as const,
  },
];

export const JOURNEY_STAGES = [
  {
    step: "01",
    title: "Discover",
    body: "Every new topic starts with curiosity — we begin with questions, not jargon.",
  },
  {
    step: "02",
    title: "Understand",
    body: "Concepts are broken down until they genuinely make sense.",
  },
  {
    step: "03",
    title: "Practise",
    body: "Questions, revision and steady practice turn understanding into habit.",
  },
  {
    step: "04",
    title: "Progress",
    body: "Step by step, confidence grows — and results follow.",
  },
] as const;
