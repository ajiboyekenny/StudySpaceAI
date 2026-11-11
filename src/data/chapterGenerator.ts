import type { Chapter, SubjectId } from '@/types/study';
import { TOTAL_CHAPTERS_PER_SUBJECT } from '@/types/study';

interface ChapterOutline {
  title: string;
  topic: string;
}

const OUTLINES: Record<SubjectId, ChapterOutline[]> = {
  biology: [
    { title: 'Cell Biology & Ecosystems', topic: 'cell structure and energy flow in ecosystems' },
    { title: 'Tissues, Organs & Systems', topic: 'how cells form tissues and organ systems' },
    { title: 'Nutrition in Plants & Animals', topic: 'photosynthesis, balanced diet and digestion' },
    { title: 'Respiration & Gas Exchange', topic: 'aerobic and anaerobic respiration' },
    { title: 'Transport in Plants & Animals', topic: 'xylem, phloem, blood and the heart' },
    { title: 'Excretion & Osmoregulation', topic: 'kidneys, liver and water balance' },
    { title: 'Reproduction in Plants', topic: 'flowers, pollination and seed formation' },
    { title: 'Reproduction in Humans', topic: 'the reproductive system and fertilisation' },
    { title: 'Genetics & Inheritance', topic: 'Mendelian ratios and Punnett squares' },
    { title: 'Variation, Evolution & Selection', topic: 'natural selection and genetic variation' },
    { title: 'Classification of Living Things', topic: 'the five-kingdom system' },
    { title: 'Microorganisms & Diseases', topic: 'bacteria, viruses and pathogens' },
    { title: 'The Nervous System', topic: 'neurons, reflexes and the brain' },
    { title: 'The Endocrine System', topic: 'hormones and homeostasis' },
    { title: 'Support and Movement', topic: 'the skeleton and muscles' },
    { title: 'Ecology & Populations', topic: 'populations, communities and adaptation' },
    { title: 'Pollution & Conservation', topic: 'air, water and land pollution' },
    { title: 'Food Production & Agriculture', topic: 'crop and animal farming in Nigeria' },
    { title: 'Biotechnology & Genetic Engineering', topic: 'GMOs and modern applications' },
    { title: 'Exam Revision & Past Questions', topic: 'mixed UTME, WAEC and 100L revision' },
  ],
  physics: [
    { title: 'Mechanics & Sound Waves', topic: 'motion, forces and sound' },
    { title: 'Units, Measurements & Vectors', topic: 'SI units and vector addition' },
    { title: 'Projectiles & Circular Motion', topic: 'parabolic paths and centripetal force' },
    { title: 'Friction & Equilibrium', topic: 'statics and frictional forces' },
    { title: 'Work, Energy & Power', topic: 'energy transformation and efficiency' },
    { title: 'Heat & Temperature', topic: 'thermal expansion and heat transfer' },
    { title: 'Gas Laws & Kinetic Theory', topic: 'Boyle, Charles and the ideal gas law' },
    { title: 'Optics & Light', topic: 'reflection, refraction and lenses' },
    { title: 'Waves & Wave Properties', topic: 'amplitude, frequency and wave equations' },
    { title: 'Electrostatics & Capacitors', topic: 'charge, fields and capacitance' },
    { title: 'Current Electricity', topic: 'Ohm, resistors and circuits' },
    { title: 'Magnetism & Electromagnetism', topic: 'fields, induction and transformers' },
    { title: 'Simple AC Circuits', topic: 'alternating current and reactance' },
    { title: 'Modern Physics & Radioactivity', topic: 'atomic models and nuclear decay' },
    { title: 'Semiconductors & Electronics', topic: 'diodes, transistors and logic gates' },
    { title: 'Gravitation & Orbits', topic: "Newton's law of gravitation" },
    { title: 'Fluids & Pressure', topic: 'Archimedes and Bernoulli principles' },
    { title: 'Machines & Engines', topic: 'mechanical advantage and efficiency' },
    { title: 'Renewable Energy & Power', topic: 'solar, wind and Nigeria energy mix' },
    { title: 'Exam Revision & Past Questions', topic: 'mixed UTME, WAEC and 100L revision' },
  ],
  chemistry: [
    { title: 'Atomic Structure & Stoichiometry', topic: 'atoms, moles and equations' },
    { title: 'The Periodic Table', topic: 'groups, periods and periodicity' },
    { title: 'Chemical Bonding', topic: 'ionic, covalent and metallic bonds' },
    { title: 'Chemical Reactions & Equations', topic: 'balancing and reaction types' },
    { title: 'Acids, Bases & Salts', topic: 'pH, neutralisation and salt preparation' },
    { title: 'Redox Reactions', topic: 'oxidation, reduction and titration' },
    { title: 'Energy Changes in Reactions', topic: 'exothermic and endothermic changes' },
    { title: 'Rates of Reaction', topic: 'factors that affect reaction speed' },
    { title: 'Chemical Equilibrium', topic: 'Le Chatelier and reversible reactions' },
    { title: 'Gases & Gas Laws', topic: 'Boyle, Charles and the ideal gas equation' },
    { title: 'Water & Solutions', topic: 'hardness, solubility and concentration' },
    { title: 'Metals & Extraction', topic: 'reactivity series and blast furnace' },
    { title: 'Non-Metals & Compounds', topic: 'carbon, sulphur and nitrogen' },
    { title: 'Organic Chemistry: Alkanes', topic: 'hydrocarbons, naming and isomerism' },
    { title: 'Alkenes, Alkynes & Reactions', topic: 'unsaturated hydrocarbons and addition' },
    { title: 'Alcohols, Acids & Esters', topic: 'functional groups in organic chemistry' },
    { title: 'Polymers & Macromolecules', topic: 'addition and condensation polymers' },
    { title: 'Qualitative Analysis', topic: 'testing for ions and gases' },
    { title: 'Environmental & Industrial Chemistry', topic: 'fertilisers, pollution and industry' },
    { title: 'Exam Revision & Past Questions', topic: 'mixed UTME, WAEC and 100L revision' },
  ],
  mathematics: [
    { title: 'Matrices, Calculus & Functions', topic: 'matrices, differentiation and integration' },
    { title: 'Number Systems & Indices', topic: 'surds, indices and logarithms' },
    { title: 'Sets & Venn Diagrams', topic: 'set operations and word problems' },
    { title: 'Algebraic Expressions & Equations', topic: 'factorisation and simultaneous equations' },
    { title: 'Variation & Proportion', topic: 'direct, inverse and joint variation' },
    { title: 'Sequences & Series', topic: 'AP, GP and sigma notation' },
    { title: 'Quadratic Equations', topic: 'roots, completing the square and the discriminant' },
    { title: 'Inequalities & Linear Programming', topic: 'graphs of inequalities and optimisation' },
    { title: 'Trigonometry', topic: 'ratios, identities and the sine and cosine rules' },
    { title: 'Coordinate Geometry', topic: 'lines, gradients, circles and distance' },
    { title: 'Geometry: Triangles & Polygons', topic: 'angles, congruence and properties' },
    { title: 'Circles & Mensuration', topic: 'area, perimeter, volume and surface area' },
    { title: 'Vectors & Transformations', topic: 'vector addition and geometric transformations' },
    { title: 'Differentiation Techniques', topic: 'product, quotient and chain rules' },
    { title: 'Integration & Applications', topic: 'areas, volumes and kinematics' },
    { title: 'Complex Numbers', topic: 'argand diagrams and polar form' },
    { title: 'Statistics & Data', topic: 'mean, median, mode and standard deviation' },
    { title: 'Probability', topic: 'simple, combined and conditional probability' },
    { title: 'Binary Operations & Group Theory', topic: 'operations and basic group properties' },
    { title: 'Exam Revision & Past Questions', topic: 'mixed UTME, WAEC and 100L revision' },
  ],
};

function chapterId(subject: SubjectId, number: number): string {
  const prefix = subject === 'biology' ? 'bio' : subject === 'physics' ? 'phy' : subject === 'chemistry' ? 'chm' : 'mth';
  return `${prefix}-ch${number}`;
}

function buildOutlineChapter(subject: SubjectId, number: number): Chapter {
  const outline = OUTLINES[subject][number - 1];
  return {
    id: chapterId(subject, number),
    subject,
    number,
    title: `Chapter ${number}: ${outline.title}`,
    summary: [
      {
        heading: '1. Big picture',
        paragraphs: [
          `Chapter ${number} develops the core ideas of **${outline.topic}**. Start by identifying the important terms, the quantities being measured, and the relationships that connect them. These ideas appear across UTME, WAEC, and first-year university questions.`,
          `Local analogy: Think of this topic as a busy Lagos bus route. The key terms are the stops, the rules are the route map, and an exam question asks you to work out where the bus should arrive next.`,
        ],
      },
      {
        heading: '2. Key concepts',
        paragraphs: [
          `The first concept is **definition and classification**: know what ${outline.topic} means and how its major groups differ. The second is **cause and effect**: explain what changes when one condition changes. The third is **application**: connect the principle to a practical example, experiment, diagram, or calculation.`,
          `Make a small comparison table in your notebook. Put the term in the first column, its meaning in the second, and one example in the third. This turns passive reading into active recall.`,
        ],
      },
      {
        heading: '3. Worked example',
        paragraphs: [
          `Example: A question gives you a short description related to **${outline.topic}** and asks for the best conclusion. Underline the data, name the principle being tested, substitute the information carefully, and then check whether your answer uses the correct unit or scientific vocabulary.`,
          `For a theory question, write a one-sentence definition followed by a reason. For a calculation, write the formula first, show each step, and round only at the end. A clear method can earn marks even when the final answer needs correction.`,
        ],
      },
      {
        heading: '4. Nigerian context',
        paragraphs: [
          `You can observe **${outline.topic}** around you: in a school laboratory, a farm, a health centre, a generator repair shop, a construction site, or a computer and phone. Connecting the idea to familiar places makes it easier to remember during an exam.`,
          `Ask yourself: where would this principle appear in Nigeria, what would I measure, and what could make the result inaccurate? That habit builds scientific thinking rather than memorisation alone.`,
        ],
      },
      {
        heading: '5. Exam method and common errors',
        paragraphs: [
          `Before choosing an answer, read every option. Watch for absolute words such as **always** and **never**, keep units consistent, and do not confuse a definition with an example. If a diagram is provided, label the parts before interpreting it.`,
          `A common mistake is skipping the command word. “State” needs a short fact, “explain” needs a reason, “compare” needs similarities and differences, and “calculate” needs working. Match your response to the command.`,
        ],
      },
      {
        heading: '6. Quick recap',
        paragraphs: [
          `You should now be able to define **${outline.topic}**, name its main categories, explain one cause-and-effect relationship, and apply the idea to a practical example. Use the six flashcards to test recall, then take the quiz without looking back at the text.`,
          `If you miss a question, return to the exact subsection that explains it, write the answer in your own words, and try again later. That is how a short study session becomes long-term memory.`,
        ],
      },
    ],
    flashcards: [
      { id: `${chapterId(subject, number)}-f1`, front: `${outline.title} (key idea 1)`, back: `Core concept for ${outline.topic}. Full flashcard content coming soon.` },
      { id: `${chapterId(subject, number)}-f2`, front: `${outline.title} (key idea 2)`, back: `Second core concept for ${outline.topic}. Full flashcard content coming soon.` },
      { id: `${chapterId(subject, number)}-f3`, front: `${outline.title} (key idea 3)`, back: `Third core concept for ${outline.topic}. Full flashcard content coming soon.` },
      { id: `${chapterId(subject, number)}-f4`, front: `${outline.title} (key idea 4)`, back: `Fourth core concept for ${outline.topic}. Full flashcard content coming soon.` },
      { id: `${chapterId(subject, number)}-f5`, front: `${outline.title} (key idea 5)`, back: `Fifth core concept for ${outline.topic}. Full flashcard content coming soon.` },
      { id: `${chapterId(subject, number)}-f6`, front: `${outline.title} (key idea 6)`, back: `Sixth core concept for ${outline.topic}. Full flashcard content coming soon.` },
    ],
    quiz: [
      {
        id: `${chapterId(subject, number)}-q1`,
        question: `Which topic does Chapter ${number} of this subject cover?`,
        options: [outline.topic, 'Cell organelles only', 'Matrix inversion', 'Nuclear fission'],
        answerIndex: 0,
        explanation: `This chapter introduces ${outline.topic}.`,
      },
      {
        id: `${chapterId(subject, number)}-q2`,
        question: `Chapter ${number} is best described as which level of study?`,
        options: ['UTME / JAMB only', 'UTME, WAEC and 100-Level revision', 'Primary school science', 'Postgraduate research'],
        answerIndex: 1,
        explanation: 'Every chapter in StudySpace AI is mapped across UTME, WAEC and 100-Level curricula.',
      },
      {
        id: `${chapterId(subject, number)}-q3`,
        question: `Which is the most effective first step when starting a new chapter?`,
        options: ['Memorise formulas only', 'Read the summary, then make flashcards', 'Skip to the quiz', 'Read nothing and guess'],
        answerIndex: 1,
        explanation: 'Reading the summary first builds a mental map before you practise with flashcards and quizzes.',
      },
      {
        id: `${chapterId(subject, number)}-q4`,
        question: `Why save a chapter for offline study?`,
        options: ['It locks the data into your phone', 'It deletes the chapter', 'It shares it with strangers', 'It blocks the quiz'],
        answerIndex: 0,
        explanation: 'Saving stores the chapter text, flashcards and quiz on your device so you can study without mobile data.',
      },
      {
        id: `${chapterId(subject, number)}-q5`,
        question: `Active recall means:`,
        options: ['Reading notes passively', 'Testing yourself from memory', 'Highlighting only', 'Watching a video once'],
        answerIndex: 1,
        explanation: 'Active recall forces you to retrieve answers from memory, which strengthens long-term retention.',
      },
    ],
  };
}

export function buildFullSubjectChapters(subject: SubjectId, readyChapter: Chapter): Chapter[] {
  const chapters: Chapter[] = [readyChapter];
  for (let number = 2; number <= TOTAL_CHAPTERS_PER_SUBJECT; number += 1) {
    chapters.push(buildOutlineChapter(subject, number));
  }
  return chapters;
}
