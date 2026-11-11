import type { SubjectId } from '@/types/study';

export type TextbookCategory = 'biology' | 'chemistry' | 'physics' | 'mathematics' | 'engineering' | 'medicine';

export interface Textbook {
  id: string;
  category: TextbookCategory;
  iconSubject: SubjectId;
  title: string;
  author: string;
  level: string;
  description: string;
  sourceUrl: string;
}

export const TEXTBOOK_CATEGORIES: { id: TextbookCategory; label: string }[] = [
  { id: 'biology', label: 'Biology' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'physics', label: 'Physics' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'medicine', label: 'Medicine' },
];

export const TEXTBOOKS: Textbook[] = [
  {
    id: 'bio-general-biology', category: 'biology', iconSubject: 'biology', title: 'General Biology', author: 'LibreTexts Biology', level: 'SSCE / UTME / 100-Level',
    description: 'A broad biology text covering cells, genetics, ecology, and plant and animal structure.', sourceUrl: 'https://commons.libretexts.org/book/bio-1764',
  },
  {
    id: 'bio-human-biology', category: 'biology', iconSubject: 'biology', title: 'Human Biology', author: 'LibreTexts Biology', level: 'SSCE / UTME / 100-Level',
    description: 'An accessible introduction to the human body, its systems, functions, and health.', sourceUrl: 'https://commons.libretexts.org/book/bio-16710',
  },
  {
    id: 'bio-microbiology', category: 'biology', iconSubject: 'biology', title: 'Microbiology', author: 'LibreTexts Biology', level: '100-Level',
    description: 'Core microbiology concepts with allied-health applications, clear pedagogy, and scientific rigor.', sourceUrl: 'https://commons.libretexts.org/book/bio-5173',
  },
  {
    id: 'bio-plant-anatomy', category: 'biology', iconSubject: 'biology', title: 'Plant Anatomy and Physiology', author: 'LibreTexts Biology', level: '100-Level',
    description: 'Cells, tissues, organs, and plant environmental physiology supported with helpful illustrations.', sourceUrl: 'https://commons.libretexts.org/book/bio-47189',
  },
  {
    id: 'chem-organic-principles', category: 'chemistry', iconSubject: 'chemistry', title: 'Basic Principles of Organic Chemistry', author: 'John D. Roberts & Marjorie C. Caserio', level: '100-Level',
    description: 'A classic organic chemistry text that uses thermochemistry to explain why organic reactions happen.', sourceUrl: 'https://commons.libretexts.org/book/chem-21927',
  },
  {
    id: 'chem-inorganic', category: 'chemistry', iconSubject: 'chemistry', title: 'Inorganic Chemistry', author: 'LibreTexts Chemistry', level: '100-Level',
    description: 'Important inorganic compounds organized systematically through the periodic table in molecular and solid states.', sourceUrl: 'https://commons.libretexts.org/book/chem-125370',
  },
  {
    id: 'chem-introductory', category: 'chemistry', iconSubject: 'chemistry', title: 'Introductory Chemistry', author: 'CK-12 / LibreTexts', level: 'SSCE / UTME / 100-Level',
    description: 'A friendly starting point for chemistry fundamentals, reactions, matter, and quantitative thinking.', sourceUrl: 'https://commons.libretexts.org/book/chem-52251',
  },
  {
    id: 'chem-physical', category: 'chemistry', iconSubject: 'chemistry', title: 'Physical Chemistry', author: 'LibreTexts Chemistry', level: '100-Level',
    description: 'Thermodynamics, quantum chemistry, statistical mechanics, equilibria, motion, energy, and force in chemical systems.', sourceUrl: 'https://commons.libretexts.org/book/chem-9054',
  },
  {
    id: 'chem-pre-general', category: 'chemistry', iconSubject: 'chemistry', title: 'Chemistry 142: Pre-General Chemistry', author: 'LibreTexts Chemistry', level: '100-Level',
    description: 'Build a confident foundation before general chemistry with a guided path from atoms to reactions.', sourceUrl: 'https://commons.libretexts.org/book/chem-509319',
  },
  {
    id: 'phy-classical-mechanics', category: 'physics', iconSubject: 'physics', title: 'Classical Mechanics', author: 'LibreTexts Physics', level: '100-Level',
    description: 'Force and conservation laws develop a conceptual understanding of motion, experiments, and prediction.', sourceUrl: 'https://commons.libretexts.org/book/phys-24413',
  },
  {
    id: 'phy-general', category: 'physics', iconSubject: 'physics', title: 'Physics', author: 'LibreTexts Physics', level: 'SSCE / UTME / 100-Level',
    description: 'A wide-ranging physics reference for mechanics, energy, waves, electricity, and modern physics.', sourceUrl: 'https://commons.libretexts.org/book/phys-14430',
  },
  {
    id: 'phy-electromagnetics', category: 'physics', iconSubject: 'physics', title: 'Electromagnetics and Applications', author: 'LibreTexts Physics', level: '100-Level',
    description: 'Maxwell’s equations, waves, radiation, circuits, antennas, sensors, communications, and power systems.', sourceUrl: 'https://commons.libretexts.org/book/phys-24865',
  },
  {
    id: 'phy-waves', category: 'physics', iconSubject: 'physics', title: 'Physics and Waves', author: 'LibreTexts Physics', level: 'SSCE / 100-Level',
    description: 'Vibrations, sound, electromagnetic waves, optics, mechanical waves, and gravitational waves with the maths to explain them.', sourceUrl: 'https://commons.libretexts.org/book/phys-34337',
  },
  {
    id: 'phy-optics', category: 'physics', iconSubject: 'physics', title: 'Physical Optics', author: 'LibreTexts Physics', level: '100-Level',
    description: 'Interference, diffraction, polarization, and the wave behaviour that ray optics cannot explain.', sourceUrl: 'https://commons.libretexts.org/book/phys-7347',
  },
  {
    id: 'mth-calculus', category: 'mathematics', iconSubject: 'mathematics', title: 'Calculus', author: 'LibreTexts Mathematics', level: '100-Level',
    description: 'A full sequence through single-variable calculus, infinite series, and multivariable calculus.', sourceUrl: 'https://commons.libretexts.org/book/math-2417',
  },
  {
    id: 'mth-elementary-algebra', category: 'mathematics', iconSubject: 'mathematics', title: 'Elementary Algebra', author: 'LibreTexts Mathematics', level: 'SSCE / UTME',
    description: 'A structured first algebra course covering fundamentals, equations, expressions, and applications.', sourceUrl: 'https://commons.libretexts.org/book/math-15115',
  },
  {
    id: 'mth-advanced-algebra', category: 'mathematics', iconSubject: 'mathematics', title: 'Advanced Algebra', author: 'LibreTexts Mathematics', level: '100-Level',
    description: 'Intermediate algebra that builds from the basics into functions, geometry, and advanced applications.', sourceUrl: 'https://commons.libretexts.org/book/math-6225',
  },
  {
    id: 'mth-matrix-analysis', category: 'mathematics', iconSubject: 'mathematics', title: 'Matrix Analysis', author: 'LibreTexts Mathematics', level: '100-Level',
    description: 'Linear systems, least-squares problems, dynamical systems, eigenvalues, Jordan form, and Laplace transforms.', sourceUrl: 'https://commons.libretexts.org/book/math-21797',
  },
  {
    id: 'eng-environmental-science', category: 'engineering', iconSubject: 'biology', title: 'Introduction to Environmental Science', author: 'LibreTexts Engineering', level: '100-Level',
    description: 'Biology and earth science explain oil spills, climate change, resource management, and better environmental decisions.', sourceUrl: 'https://commons.libretexts.org/book/eng-12216',
  },
  {
    id: 'eng-physics-electronics', category: 'engineering', iconSubject: 'physics', title: 'Introduction to Physics Electronics', author: 'LibreTexts Engineering', level: '100-Level',
    description: 'Crystal structure, quantum theory of solids, semiconductors, transport, and excess carriers for device physics.', sourceUrl: 'https://commons.libretexts.org/book/eng-88486',
  },
  {
    id: 'eng-mechanics-materials', category: 'engineering', iconSubject: 'physics', title: 'Mechanics of Materials', author: 'LibreTexts Engineering', level: '100-Level',
    description: 'Stress, strain, trusses, torsion, beam bending, and how processing shapes metals, ceramics, and polymers.', sourceUrl: 'https://commons.libretexts.org/book/eng-43990',
  },
  {
    id: 'eng-biosystems', category: 'engineering', iconSubject: 'biology', title: 'Introduction to Biosystems Engineering', author: 'LibreTexts Engineering', level: '100-Level',
    description: 'Engineering solutions for sustainable food, water, energy, and a healthier environment.', sourceUrl: 'https://commons.libretexts.org/book/eng-46829',
  },
  {
    id: 'eng-electrical-computer', category: 'engineering', iconSubject: 'physics', title: 'A First Course in Electrical and Computer Engineering', author: 'LibreTexts Engineering', level: '100-Level',
    description: 'An experimental freshman course that prepares learners for circuits and the wider world of computing.', sourceUrl: 'https://commons.libretexts.org/book/eng-9932',
  },
  {
    id: 'med-anatomy-animals', category: 'medicine', iconSubject: 'biology', title: 'Anatomy and Physiology of Animals', author: 'LibreTexts Medicine', level: '100-Level',
    description: 'Normal animal body structure and function for veterinary nursing and allied animal-health study.', sourceUrl: 'https://commons.libretexts.org/book/med-2169',
  },
  {
    id: 'med-human-anatomy', category: 'medicine', iconSubject: 'biology', title: 'Human Anatomy', author: 'LibreTexts Medicine', level: '100-Level',
    description: 'An accessible first-semester anatomy resource designed for accurate, inclusive, and equitable learning.', sourceUrl: 'https://commons.libretexts.org/book/med-21589',
  },
  {
    id: 'med-epidemiology', category: 'medicine', iconSubject: 'biology', title: 'Foundations of Epidemiology', author: 'LibreTexts Medicine', level: '100-Level',
    description: 'Incidence, prevalence, surveillance, study designs, bias, confounding, screening, and epidemiologic thinking.', sourceUrl: 'https://commons.libretexts.org/book/med-38507',
  },
];

export function getTextbooksByCategory(category: TextbookCategory): Textbook[] {
  return TEXTBOOKS.filter((textbook) => textbook.category === category);
}
