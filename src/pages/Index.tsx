import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type Question = {
  question: string;
  answer: string;
  points: number;
  answered: boolean;
};

type Category = {
  name: string;
  questions: Question[];
};

type Player = {
  id: number;
  name: string;
  score: number;
};

const GAME_DATA: Category[] = [
  {
    name: 'IT и Технологии',
    questions: [
      { question: 'Что программист делает на кухне?', answer: 'Готовит компот (компонент)', points: 100, answered: false },
      { question: 'Какой язык программирования самый вежливый?', answer: 'Java (всегда говорит Hello World)', points: 200, answered: false },
      { question: 'Почему программисты путают Хэллоуин и Рождество?', answer: 'Потому что Oct 31 = Dec 25', points: 300, answered: false },
      { question: 'Сколько программистов нужно, чтобы вкрутить лампочку?', answer: 'Ноль, это аппаратная проблема', points: 400, answered: false },
      { question: 'Как называется кот программиста?', answer: 'НуллПоинтер', points: 500, answered: false },
    ],
  },
  {
    name: 'История',
    questions: [
      { question: 'Что сказал Юлий Цезарь, переходя Рубикон в метель?', answer: 'Пришёл, увидел, замёрз', points: 100, answered: false },
      { question: 'Как Наполеон относился к своему росту?', answer: 'Свысока', points: 200, answered: false },
      { question: 'Что общего у динозавров и моей диеты?', answer: 'Обе закончились внезапно', points: 300, answered: false },
      { question: 'Почему викинги были хорошими программистами?', answer: 'Они знали норвежский (Norse-вежский)', points: 400, answered: false },
      { question: 'Как Колумб назвал свой GPS?', answer: 'Случайный поиск', points: 500, answered: false },
    ],
  },
  {
    name: 'Наука',
    questions: [
      { question: 'Почему физики не любят пляж?', answer: 'Там слишком много волн', points: 100, answered: false },
      { question: 'Что сказал атом, когда потерял электрон?', answer: 'Я слежу за ним!', points: 200, answered: false },
      { question: 'Почему биологи плохо шутят?', answer: 'Все шутки про клетки', points: 300, answered: false },
      { question: 'Как химик заваривает чай?', answer: 'Экзотермической реакцией', points: 400, answered: false },
      { question: 'Почему математики никогда не загорают?', answer: 'Они избегают tan', points: 500, answered: false },
    ],
  },
  {
    name: 'Еда',
    questions: [
      { question: 'Что сказал помидор огурцу?', answer: 'Ты такой зелёный!', points: 100, answered: false },
      { question: 'Почему хлеб ходит к психологу?', answer: 'У него замесы с самооценкой', points: 200, answered: false },
      { question: 'Как назвать грустный кофе?', answer: 'Депрессо', points: 300, answered: false },
      { question: 'Что сыр сказал себе в зеркало?', answer: 'Халлуми!', points: 400, answered: false },
      { question: 'Почему банан пошёл к врачу?', answer: 'Плохо себя чистил', points: 500, answered: false },
    ],
  },
  {
    name: 'Кино',
    questions: [
      { question: 'Любимый фильм математика?', answer: 'Матрица', points: 100, answered: false },
      { question: 'Что Дарт Вейдер сказал официанту?', answer: 'Я твой отец... этого заказа', points: 200, answered: false },
      { question: 'Почему Халк всегда спокоен на съёмках?', answer: 'Он в зелёной комнате', points: 300, answered: false },
      { question: 'Любимая песня Терминатора?', answer: 'I will be back (to black)', points: 400, answered: false },
      { question: 'Что Гарри Поттер делает перед экзаменом?', answer: 'Штудирус Максимус', points: 500, answered: false },
    ],
  },
];

export default function Index() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [categories, setCategories] = useState<Category[]>(JSON.parse(JSON.stringify(GAME_DATA)));
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<{ category: number; question: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { id: players.length, name: newPlayerName, score: 0 }]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length > 0) {
      setGameState('playing');
    }
  };

  const selectQuestion = (categoryIndex: number, questionIndex: number) => {
    const question = categories[categoryIndex].questions[questionIndex];
    if (!question.answered) {
      setSelectedQuestion({ category: categoryIndex, question: questionIndex });
      setShowAnswer(false);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setShowAnswer(false);
    setTimerActive(false);
    setTimeLeft(30);
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setTimerActive(false);
  };

  const answerCorrect = () => {
    if (selectedQuestion) {
      const question = categories[selectedQuestion.category].questions[selectedQuestion.question];
      const newPlayers = [...players];
      newPlayers[currentPlayer].score += question.points;
      setPlayers(newPlayers);

      const newCategories = [...categories];
      newCategories[selectedQuestion.category].questions[selectedQuestion.question].answered = true;
      setCategories(newCategories);

      closeQuestion();
      checkGameEnd();
    }
  };

  const answerWrong = () => {
    if (selectedQuestion) {
      const question = categories[selectedQuestion.category].questions[selectedQuestion.question];
      const newPlayers = [...players];
      newPlayers[currentPlayer].score -= question.points;
      setPlayers(newPlayers);

      const newCategories = [...categories];
      newCategories[selectedQuestion.category].questions[selectedQuestion.question].answered = true;
      setCategories(newCategories);

      closeQuestion();
      nextPlayer();
      checkGameEnd();
    }
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const checkGameEnd = () => {
    const allAnswered = categories.every((cat) => cat.questions.every((q) => q.answered));
    if (allAnswered) {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setCategories(JSON.parse(JSON.stringify(GAME_DATA)));
    setPlayers([]);
    setCurrentPlayer(0);
    setSelectedQuestion(null);
    setShowAnswer(false);
    setTimeLeft(30);
    setTimerActive(false);
    setGameState('setup');
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 space-y-6 bg-card border-2 border-border">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold text-primary">Своя Игра</h1>
            <p className="text-muted-foreground">Добавьте игроков и начните игру</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Имя игрока"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                className="flex-1"
              />
              <Button onClick={addPlayer} className="bg-primary hover:bg-primary/90">
                <Icon name="UserPlus" size={20} />
              </Button>
            </div>

            {players.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Игроки:</h3>
                <div className="grid gap-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={18} />
                        <span>{player.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlayers(players.filter((p) => p.id !== player.id))}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={startGame}
              disabled={players.length === 0}
              className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
            >
              Начать игру
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === 'results') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 space-y-6 bg-card border-2 border-border">
          <div className="text-center space-y-2">
            <Icon name="Trophy" size={64} className="mx-auto text-accent" />
            <h1 className="text-5xl font-bold text-primary">Результаты</h1>
          </div>

          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-accent/20 border-2 border-accent' : 'bg-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <span className="text-xl font-semibold">{player.name}</span>
                </div>
                <div className="text-2xl font-bold text-primary">{player.score}</div>
              </div>
            ))}
          </div>

          <Button onClick={resetGame} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
            <Icon name="RotateCcw" size={20} className="mr-2" />
            Новая игра
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
          <h1 className="text-3xl font-bold text-primary">Своя Игра</h1>
          <Button variant="outline" onClick={resetGame} size="sm">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Сброс
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {players.map((player, index) => (
            <Card
              key={player.id}
              className={`p-4 text-center transition-all ${
                index === currentPlayer ? 'bg-primary/20 border-2 border-primary scale-105' : 'bg-card'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="User" size={18} />
                <h3 className="font-semibold truncate">{player.name}</h3>
              </div>
              <div className="text-2xl font-bold text-accent">{player.score}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="space-y-2">
              <Card className="p-3 bg-primary text-center">
                <h2 className="font-bold text-sm md:text-base">{category.name}</h2>
              </Card>
              {category.questions.map((question, qIndex) => (
                <Card
                  key={qIndex}
                  onClick={() => selectQuestion(catIndex, qIndex)}
                  className={`p-6 text-center cursor-pointer transition-all hover:scale-105 ${
                    question.answered ? 'bg-muted opacity-50 cursor-not-allowed' : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  <div className="text-2xl md:text-4xl font-bold">
                    {question.answered ? '—' : question.points}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={selectedQuestion !== null} onOpenChange={closeQuestion}>
        <DialogContent className="max-w-2xl">
          {selectedQuestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  {categories[selectedQuestion.category].questions[selectedQuestion.question].points} очков
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {timerActive && (
                  <div className="flex items-center justify-center gap-3">
                    <Icon name="Clock" size={24} className="text-primary" />
                    <div className="text-4xl font-bold text-primary">{timeLeft}с</div>
                  </div>
                )}

                <Card className="p-6 bg-secondary">
                  <p className="text-xl text-center">
                    {categories[selectedQuestion.category].questions[selectedQuestion.question].question}
                  </p>
                </Card>

                {showAnswer && (
                  <Card className="p-6 bg-primary/20 border-2 border-primary animate-scale-in">
                    <p className="text-xl text-center font-semibold">
                      {categories[selectedQuestion.category].questions[selectedQuestion.question].answer}
                    </p>
                  </Card>
                )}

                <div className="flex gap-3">
                  {!showAnswer ? (
                    <Button onClick={revealAnswer} className="flex-1 bg-primary hover:bg-primary/90 text-lg py-6">
                      <Icon name="Eye" size={20} className="mr-2" />
                      Показать ответ
                    </Button>
                  ) : (
                    <>
                      <Button onClick={answerCorrect} className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6">
                        <Icon name="Check" size={20} className="mr-2" />
                        Верно
                      </Button>
                      <Button onClick={answerWrong} className="flex-1 bg-destructive hover:bg-destructive/90 text-lg py-6">
                        <Icon name="X" size={20} className="mr-2" />
                        Неверно
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
