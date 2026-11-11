import type { Chapter } from '@/types/study';

export const biologyCh1: Chapter = {
  id: 'bio-ch1',
  subject: 'biology',
  number: 1,
  title: 'Cell Biology & Ecosystems',
  summary: [
    {
      heading: 'The Cell: Basic Unit of Life',
      paragraphs: [
        'A **cell** is the smallest unit of life that can carry out all the processes of life. Some organisms are **unicellular**, made of one cell, such as Amoeba and Euglena. Others are **multicellular**, like humans, where millions of specialised cells work together.',
        'Local analogy: Think of a cell as a family compound in Surulere. The gate and fence control who enters, the water tank stores supplies, and every room has a job. Together they keep the household running.',
      ],
    },
    {
      heading: 'Key Organelles and Their Functions',
      paragraphs: [
        'The **nucleus** is the control room. It holds the DNA and directs every activity of the cell. The **cell membrane** is a selective gate that decides what enters and leaves.',
        'The **mitochondria** release energy through respiration. They are the cell generator: when the light goes off, a generator burns fuel to power the whole estate, and mitochondria burn glucose to produce **ATP**. The **ribosome** builds proteins.',
        'Local analogy: Plant cells have a **cell wall** of cellulose that gives rigid support, like the fence and iron gate of a compound. **Chloroplasts** trap sunlight to make food by photosynthesis, so they act as the cell solar panel.',
      ],
    },
    {
      heading: 'Ecosystems: Energy Flow and Interdependence',
      paragraphs: [
        'An **ecosystem** is a community of living things interacting with their non-living environment. **Producers** such as green plants make their own food. **Consumers** eat other organisms. **Decomposers**, mainly bacteria and fungi, break dead matter down and return nutrients to the soil.',
        'Energy flows one way through a **food chain**, while nutrients such as nitrogen are recycled. Only about **10%** of energy passes to the next trophic level; the rest is lost as heat. This is why food chains rarely have more than four or five links.',
        'Local analogy: It is like a palm wine chain in Benin market. Each middleman keeps a cut, so by the time the last seller gets it, very little is left.',
        'Legume plants such as beans and groundnuts host **nitrogen-fixing bacteria** in their root nodules. These bacteria convert atmospheric nitrogen into a form plants can use.',
      ],
    },
  ],
  flashcards: [
    { id: 'bio-ch1-f1', front: 'Cell', back: 'The smallest unit of life that can carry out all the processes of life.' },
    { id: 'bio-ch1-f2', front: 'Mitochondrion', back: 'The site of aerobic respiration where energy is released as ATP. Think: the generator of the cell.' },
    { id: 'bio-ch1-f3', front: 'Chloroplast', back: 'Contains chlorophyll and traps sunlight for photosynthesis. Think: the cell solar panel.' },
    { id: 'bio-ch1-f4', front: 'Cell wall (plants)', back: 'A rigid outer layer of cellulose that gives the cell shape and support. Think: the fence and gate of a compound.' },
    { id: 'bio-ch1-f5', front: 'Producer', back: 'An organism that makes its own food, such as a green plant. Think: the farmers who grow the food for the market.' },
    { id: 'bio-ch1-f6', front: 'The 10% rule', back: 'Only about 10% of energy passes from one trophic level to the next. The rest is lost mainly as heat.' },
  ],
  quiz: [
    {
      id: 'bio-ch1-q1',
      question: 'Which organelle is known as the control centre of the cell?',
      options: ['Mitochondrion', 'Nucleus', 'Ribosome', 'Vacuole'],
      answerIndex: 1,
      explanation: 'The nucleus holds the DNA and directs all cell activities, so it is the control centre.',
    },
    {
      id: 'bio-ch1-q2',
      question: 'Which of the following is a unicellular organism?',
      options: ['Man', 'Amoeba', 'Mango tree', 'Grasshopper'],
      answerIndex: 1,
      explanation: 'Amoeba is made of a single cell. Man, the mango tree and the grasshopper are all multicellular.',
    },
    {
      id: 'bio-ch1-q3',
      question: 'The process by which green plants make food using sunlight is called:',
      options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Excretion'],
      answerIndex: 2,
      explanation: 'Photosynthesis uses light energy, carbon dioxide and water to make glucose inside chloroplasts.',
    },
    {
      id: 'bio-ch1-q4',
      question: 'Roughly what percentage of energy is transferred from one trophic level to the next?',
      options: ['1%', '10%', '50%', '90%'],
      answerIndex: 1,
      explanation: 'About 10% of energy passes on to the next trophic level. The remainder is lost, mostly as heat.',
    },
    {
      id: 'bio-ch1-q5',
      question: 'Which group breaks down dead matter and returns nutrients to the soil?',
      options: ['Producers', 'Herbivores', 'Decomposers', 'Carnivores'],
      answerIndex: 2,
      explanation: 'Decomposers such as bacteria and fungi recycle dead organic matter back into the soil.',
    },
  ],
};

import { buildFullSubjectChapters } from '@/data/chapterGenerator';

export const biologyChapters: Chapter[] = buildFullSubjectChapters('biology', biologyCh1);
