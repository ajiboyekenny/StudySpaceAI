import type { Chapter } from '@/types/study';

export const physicsCh1: Chapter = {
  id: 'phy-ch1',
  subject: 'physics',
  number: 1,
  title: 'Mechanics & Sound Waves',
  summary: [
    {
      heading: 'Motion: Speed, Velocity and Acceleration',
      paragraphs: [
        'Speed is the distance covered per unit time. Velocity is speed with a direction attached. **Acceleration** is the rate of change of velocity: a = (v − u) / t, where u is the starting velocity, v is the final velocity and t is the time taken.',
        'Local analogy: A danfo bus in Ojota gains speed when the road clears and brakes sharply at the bus stop. The change in its speed over time is its acceleration, and a hard stop is a large negative acceleration.',
      ],
    },
    {
      heading: "Newton's Laws and Energy",
      paragraphs: [
        '**First law**: a body stays at rest or keeps moving at constant velocity unless a net force acts on it. **Second law**: F = ma, so force equals mass times acceleration. **Third law**: every action has an equal and opposite reaction.',
        'Local analogy: When a danfo driver brakes suddenly, passengers lurch forward because their bodies keep moving. That is the first law at work, and it is why seat belts save lives.',
        'Work done is **W = F × s**, measured in joules, when the force acts in the direction of motion. Power is the rate of doing work, **P = W / t**, measured in watts. A 1 kW generator does 1000 joules of work every second.',
        'Kinetic energy is **½mv²** and gravitational potential energy is **mgh**. Energy is never created or destroyed; it only changes form.',
      ],
    },
    {
      heading: 'Sound Waves',
      paragraphs: [
        'Sound is a **mechanical wave**. It needs a medium such as air, water or steel to travel and cannot pass through a vacuum. Sound moves fastest in solids, then liquids, then gases. In air at room temperature it travels at about **340 m/s**.',
        '**Frequency** is the number of complete waves per second, measured in hertz (Hz). Frequency controls **pitch**, while **amplitude** controls **loudness**. Humans can hear roughly 20 Hz to 20,000 Hz.',
        'An **echo** is heard distinctly only if the reflecting wall is at least **17 m** away, because the sound must travel 34 m, there and back, in 0.1 s.',
        'Local analogy: The hum of a generator in the next compound has a steady pitch set by the engine speed. A louder blast from the same engine is a wave with greater amplitude.',
      ],
    },
    {
      heading: 'Exam Technique',
      paragraphs: [
        'Write the formula first, substitute the values, then solve. Convert units before you calculate. To change km/h to m/s, multiply by **5/18**.',
      ],
    },
  ],
  flashcards: [
    { id: 'phy-ch1-f1', front: 'Acceleration', back: 'Rate of change of velocity: a = (v − u) / t. Unit: metres per second squared (m/s²).' },
    { id: 'phy-ch1-f2', front: "Newton's Second Law", back: 'F = ma. The net force equals mass multiplied by acceleration.' },
    { id: 'phy-ch1-f3', front: 'Work done', back: 'W = F × s, where the force acts in the direction of motion. Unit: joule (J).' },
    { id: 'phy-ch1-f4', front: 'Power', back: 'The rate of doing work: P = W / t. Unit: watt (W).' },
    { id: 'phy-ch1-f5', front: 'Frequency', back: 'The number of complete waves per second. It sets the pitch of a sound. Unit: hertz (Hz).' },
    { id: 'phy-ch1-f6', front: 'Echo distance', back: 'The minimum distance to hear a separate echo is 17 m, since sound covers 34 m in 0.1 s.' },
  ],
  quiz: [
    {
      id: 'phy-ch1-q1',
      question: 'A car accelerates uniformly from rest to 20 m/s in 5 s. Its acceleration is:',
      options: ['2 m/s²', '4 m/s²', '5 m/s²', '10 m/s²'],
      answerIndex: 1,
      explanation: 'a = (v − u) / t = (20 − 0) / 5 = 4 m/s².',
    },
    {
      id: 'phy-ch1-q2',
      question: 'A force of 12 N acts on a body of mass 3 kg. The acceleration produced is:',
      options: ['0.25 m/s²', '4 m/s²', '9 m/s²', '36 m/s²'],
      answerIndex: 1,
      explanation: 'From F = ma, a = F / m = 12 / 3 = 4 m/s².',
    },
    {
      id: 'phy-ch1-q3',
      question: 'Sound cannot travel through:',
      options: ['Air', 'Water', 'Steel', 'A vacuum'],
      answerIndex: 3,
      explanation: 'Sound is a mechanical wave and needs a material medium. A vacuum has no particles to carry it.',
    },
    {
      id: 'phy-ch1-q4',
      question: 'The SI unit of power is:',
      options: ['Joule', 'Newton', 'Watt', 'Pascal'],
      answerIndex: 2,
      explanation: 'Power is measured in watts (W). The joule is the unit of work or energy.',
    },
    {
      id: 'phy-ch1-q5',
      question: 'The minimum distance from a reflecting wall for a distinct echo is about:',
      options: ['8.5 m', '17 m', '34 m', '340 m'],
      answerIndex: 1,
      explanation: 'Sound must travel 2d in 0.1 s, so 2d = 34 m and d = 17 m.',
    },
  ],
};

import { buildFullSubjectChapters } from '@/data/chapterGenerator';

export const physicsChapters: Chapter[] = buildFullSubjectChapters('physics', physicsCh1);
