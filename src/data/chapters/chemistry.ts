import type { Chapter } from '@/types/study';

export const chemistryCh1: Chapter = {
  id: 'chm-ch1',
  subject: 'chemistry',
  number: 1,
  title: 'Atomic Structure & Stoichiometry',
  summary: [
    {
      heading: 'Atomic Structure',
      paragraphs: [
        'An **atom** has a dense **nucleus** of protons (positive) and neutrons (neutral), surrounded by **electrons** (negative) arranged in shells. The **atomic number (Z)** is the number of protons. The **mass number (A)** is protons plus neutrons. In a neutral atom, the number of electrons equals the number of protons.',
        'Local analogy: Picture the nucleus as the heavy central market in Onitsha, with traders (electrons) moving quickly around it in their own lanes, which are the shells.',
        '**Isotopes** are atoms of the same element with different numbers of neutrons, such as carbon-12 and carbon-14. Electrons fill shells in the order 2, then 8, then 8. The electrons in the outermost shell are the **valence electrons**, and they decide how an element bonds.',
      ],
    },
    {
      heading: 'The Mole and Stoichiometry',
      paragraphs: [
        'A **mole** is 6.02 × 10²³ particles, known as **Avogadro\'s number**. The **molar mass** in g/mol is numerically equal to the relative formula mass. The number of moles is **moles = mass / molar mass**.',
        'Stoichiometry uses balanced equations. In 2H₂ + O₂ → 2H₂O, 4 g of hydrogen reacts with 32 g of oxygen to give 36 g of water. The mass is conserved throughout.',
        'The **limiting reagent** is the reactant that is used up first, and it fixes the maximum amount of product. Local analogy: if you have 10 cups of rice but only 3 cups of stew base, the stew limits how many plates of jollof you can serve.',
        '**Percentage yield** = actual yield / theoretical yield × 100.',
      ],
    },
  ],
  flashcards: [
    { id: 'chm-ch1-f1', front: 'Atomic number (Z)', back: 'The number of protons in the nucleus. It identifies the element.' },
    { id: 'chm-ch1-f2', front: 'Mass number (A)', back: 'The total number of protons and neutrons in the nucleus.' },
    { id: 'chm-ch1-f3', front: 'Isotopes', back: 'Atoms of the same element that have different numbers of neutrons.' },
    { id: 'chm-ch1-f4', front: 'Mole', back: 'The amount of substance containing 6.02 × 10²³ particles (Avogadro\'s number).' },
    { id: 'chm-ch1-f5', front: 'Molar mass', back: 'The mass of one mole of a substance in g/mol. It is numerically equal to the relative formula mass.' },
    { id: 'chm-ch1-f6', front: 'Limiting reagent', back: 'The reactant that is used up first. It sets the maximum amount of product that can form.' },
  ],
  quiz: [
    {
      id: 'chm-ch1-q1',
      question: 'An atom has 11 protons and 12 neutrons. Its mass number is:',
      options: ['11', '12', '23', '34'],
      answerIndex: 2,
      explanation: 'Mass number = protons + neutrons = 11 + 12 = 23.',
    },
    {
      id: 'chm-ch1-q2',
      question: 'How many moles are in 36 g of water (molar mass 18 g/mol)?',
      options: ['0.5', '1', '2', '18'],
      answerIndex: 2,
      explanation: 'moles = mass / molar mass = 36 / 18 = 2 moles.',
    },
    {
      id: 'chm-ch1-q3',
      question: 'Atoms of the same element with different numbers of neutrons are called:',
      options: ['Isotopes', 'Isobars', 'Allotropes', 'Ions'],
      answerIndex: 0,
      explanation: 'Isotopes share the same proton number but differ in neutron number.',
    },
    {
      id: 'chm-ch1-q4',
      question: 'In 2H₂ + O₂ → 2H₂O, how many grams of water form from 4 g of hydrogen (oxygen in excess)?',
      options: ['9 g', '18 g', '36 g', '4 g'],
      answerIndex: 2,
      explanation: '4 g of H₂ is 2 moles. That gives 2 moles of H₂O, which is 2 × 18 = 36 g.',
    },
    {
      id: 'chm-ch1-q5',
      question: 'Which is the correct electron arrangement for an atom with atomic number 12?',
      options: ['2, 8, 2', '2, 8, 8', '2, 10', '2, 8, 1, 1'],
      answerIndex: 0,
      explanation: 'Atomic number 12 means 12 electrons, filling shells as 2, 8 and 2.',
    },
  ],
};

import { buildFullSubjectChapters } from '@/data/chapterGenerator';

export const chemistryChapters: Chapter[] = buildFullSubjectChapters('chemistry', chemistryCh1);
