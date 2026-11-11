import type { Chapter } from '@/types/study';

export const mathematicsCh1: Chapter = {
  id: 'mth-ch1',
  subject: 'mathematics',
  number: 1,
  title: 'Matrices, Calculus & Functions',
  summary: [
    {
      heading: 'Functions',
      paragraphs: [
        'A **function** assigns exactly one output to each input. For f(x) = 2x + 3, f(4) = 11. The **domain** is the set of allowed inputs. For f(x) = 1/x, x = 0 is excluded because division by zero is undefined.',
        'Local analogy: A trader at Balogun market quotes one price for each item. Give the same item to the same trader and you always get the same price, which is what makes it a function.',
        'For composition, **(f ∘ g)(x) = f(g(x))**: apply g first, then feed the result into f.',
      ],
    },
    {
      heading: 'Matrices',
      paragraphs: [
        'A **matrix** is a rectangular array of numbers. For a 2 × 2 matrix [[a, b], [c, d]], the **determinant** is ad − bc. If the determinant is zero, the matrix is **singular** and has no inverse.',
        'Addition needs matrices of the same size. For multiplication, the inner dimensions must match: a (2 × 3) matrix times a (3 × 2) matrix gives a 2 × 2 matrix.',
        'The inverse of a 2 × 2 matrix is **A⁻¹ = (1/det)[[d, −b], [−c, a]]**. Matrices solve simultaneous equations. For 2x + y = 5 and x − y = 1, the solution is x = 2 and y = 1.',
        'Local analogy: A matrix works like a price table for shops across Lagos and Abuja. Rows are the shops, and columns are the items.',
      ],
    },
    {
      heading: 'Differentiation and Integration',
      paragraphs: [
        'The **derivative** dy/dx measures the rate of change of y with respect to x, which is the gradient of the curve. The power rule gives **d/dx(xⁿ) = nxⁿ⁻¹**. For example, d/dx(x³ + 4x) = 3x² + 4.',
        'Integration reverses differentiation: **∫xⁿ dx = xⁿ⁺¹/(n + 1) + C**. The **definite integral** ∫ₐᵇ f(x) dx gives the area under the curve between a and b. For example, ∫₀² 3x² dx = [x³] from 0 to 2 = 8.',
        'Local analogy: The derivative is the speedometer reading at one instant. The integral is the total distance covered over the whole journey from Ibadan to Ilorin.',
      ],
    },
  ],
  flashcards: [
    { id: 'mth-ch1-f1', front: 'Function', back: 'A rule that assigns exactly one output to each input.' },
    { id: 'mth-ch1-f2', front: 'Domain', back: 'The set of all allowed input values (x) for a function.' },
    { id: 'mth-ch1-f3', front: 'Determinant (2 × 2)', back: 'For [[a, b], [c, d]], it equals ad − bc. If it is zero, the matrix has no inverse.' },
    { id: 'mth-ch1-f4', front: 'Singular matrix', back: 'A matrix whose determinant is zero. It cannot be inverted.' },
    { id: 'mth-ch1-f5', front: 'Derivative', back: 'The rate of change of y with respect to x, or the gradient of a curve. d/dx(xⁿ) = nxⁿ⁻¹.' },
    { id: 'mth-ch1-f6', front: 'Definite integral', back: 'The area under a curve between two limits: ∫ₐᵇ f(x) dx.' },
  ],
  quiz: [
    {
      id: 'mth-ch1-q1',
      question: 'If f(x) = 2x + 3, then f(4) is:',
      options: ['8', '9', '11', '14'],
      answerIndex: 2,
      explanation: 'f(4) = 2(4) + 3 = 8 + 3 = 11.',
    },
    {
      id: 'mth-ch1-q2',
      question: 'The determinant of [[3, 1], [2, 4]] is:',
      options: ['10', '14', '12', '2'],
      answerIndex: 0,
      explanation: 'ad − bc = (3)(4) − (1)(2) = 12 − 2 = 10.',
    },
    {
      id: 'mth-ch1-q3',
      question: 'The derivative of x³ + 4x with respect to x is:',
      options: ['3x² + 4', '3x + 4', 'x² + 4x', '3x² + 4x'],
      answerIndex: 0,
      explanation: 'Apply the power rule to each term: 3x² + 4.',
    },
    {
      id: 'mth-ch1-q4',
      question: 'The value of ∫₀² 3x² dx is:',
      options: ['4', '6', '8', '12'],
      answerIndex: 2,
      explanation: 'The integral of 3x² is x³. Evaluating from 0 to 2 gives 8 − 0 = 8.',
    },
    {
      id: 'mth-ch1-q5',
      question: 'The matrix [[2, 4], [1, 2]] is:',
      options: ['Invertible', 'Singular', 'An identity matrix', 'A diagonal matrix'],
      answerIndex: 1,
      explanation: 'Its determinant is (2)(2) − (4)(1) = 0, so it is singular and has no inverse.',
    },
  ],
};

import { buildFullSubjectChapters } from '@/data/chapterGenerator';

export const mathematicsChapters: Chapter[] = buildFullSubjectChapters('mathematics', mathematicsCh1);
