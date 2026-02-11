import { type Category } from '@/data/gameData';

export function addInteractivesToGame(round1: Category[], round2: Category[]): { round1: Category[]; round2: Category[] } {
  const allCategories = [...round1, ...round2];
  const allQuestions: { catIndex: number; qIndex: number; isRound1: boolean }[] = [];

  round1.forEach((cat, catIndex) => {
    cat.questions.forEach((q, qIndex) => {
      if (q.special !== 'cat') {
        allQuestions.push({ catIndex, qIndex, isRound1: true });
      }
    });
  });

  round2.forEach((cat, catIndex) => {
    cat.questions.forEach((q, qIndex) => {
      if (q.special !== 'cat') {
        allQuestions.push({ catIndex, qIndex, isRound1: false });
      }
    });
  });

  const shuffled = allQuestions.sort(() => Math.random() - 0.5);

  if (shuffled.length > 0) {
    const hintQuestion = shuffled[0];
    if (hintQuestion.isRound1) {
      round1[hintQuestion.catIndex].questions[hintQuestion.qIndex].special = 'hint';
    } else {
      round2[hintQuestion.catIndex].questions[hintQuestion.qIndex].special = 'hint';
    }
  }

  const remaining = shuffled.slice(1);
  for (let i = 0; i < Math.min(3, remaining.length); i++) {
    const doubleQuestion = remaining[i];
    if (doubleQuestion.isRound1) {
      round1[doubleQuestion.catIndex].questions[doubleQuestion.qIndex].special = 'double';
    } else {
      round2[doubleQuestion.catIndex].questions[doubleQuestion.qIndex].special = 'double';
    }
  }

  return { round1, round2 };
}
