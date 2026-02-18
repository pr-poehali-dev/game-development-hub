import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import FortuneWheel from '@/components/ui/fortune-wheel';
import { GAME_DATA, type GameLevel, type Category, type Question } from '@/data/gameData';
import { addInteractivesToGame } from '@/utils/gameHelpers';

type Player = {
  id: number;
  name: string;
  score: number;
  hasHint: boolean;
};

type GameState = 'setup' | 'round1' | 'round1-end' | 'round2' | 'round2-end' | 'final-betting' | 'final-question' | 'results';

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<{ category: number; question: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [finalBets, setFinalBets] = useState<{ [key: number]: number }>({});
  const [finalAnswers, setFinalAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [remainingThemes, setRemainingThemes] = useState<number[]>([]);
  const [finalTheme, setFinalTheme] = useState<number | null>(null);
  const [catTarget, setCatTarget] = useState<number | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [betInputs, setBetInputs] = useState<{ [key: number]: string }>({});
  const [showWheel, setShowWheel] = useState(false);
  const [bonusPoints, setBonusPoints] = useState<number | null>(null);
  
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const bonusSoundRef = useRef<HTMLAudioElement | null>(null);
  const wheelSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSoundRef.current = new Audio('https://cdn.poehali.dev/files/correct-sound.mp3');
    wrongSoundRef.current = new Audio('https://cdn.poehali.dev/files/wrong-sound.mp3');
    bonusSoundRef.current = new Audio('https://cdn.poehali.dev/files/bonus-sound.mp3');
    wheelSoundRef.current = new Audio('https://cdn.poehali.dev/files/wheel-spin.mp3');
  }, []);

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
      setPlayers([...players, { id: players.length, name: newPlayerName, score: 0, hasHint: false }]);
      setNewPlayerName('');
    }
  };

  const [round2Data, setRound2Data] = useState<Category[]>([]);

  const startGame = (level: GameLevel) => {
    if (players.length > 0) {
      setSelectedLevel(level);
      const gameData = GAME_DATA[level];
      const round1 = JSON.parse(JSON.stringify(gameData.round1));
      const round2 = JSON.parse(JSON.stringify(gameData.round2));
      const withInteractives = addInteractivesToGame(round1, round2);
      setCategories(withInteractives.round1);
      setRound2Data(withInteractives.round2);
      setGameState('round1');
    }
  };

  const selectQuestion = (categoryIndex: number, questionIndex: number) => {
    const question = categories[categoryIndex].questions[questionIndex];
    if (!question.answered) {
      setSelectedQuestion({ category: categoryIndex, question: questionIndex });
      setShowAnswer(false);
      setHintShown(false);
      setBonusPoints(null);

      if (question.special === 'cat') {
        return;
      }

      if (question.special === 'bonus') {
        setShowWheel(true);
        if (bonusSoundRef.current) {
          bonusSoundRef.current.play();
        }
        return;
      }

      if (question.special === 'hint') {
        const newPlayers = [...players];
        newPlayers[currentPlayer].hasHint = true;
        setPlayers(newPlayers);
      }

      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const selectCatTarget = (targetPlayer: number) => {
    if (selectedQuestion) {
      setCatTarget(targetPlayer);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setShowAnswer(false);
    setTimerActive(false);
    setTimeLeft(30);
    setCatTarget(null);
    setHintShown(false);
    setShowWheel(false);
    setBonusPoints(null);
    nextPlayer();
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setTimerActive(false);
  };

  const useHint = () => {
    setHintShown(true);
    const newPlayers = [...players];
    newPlayers[currentPlayer].hasHint = false;
    setPlayers(newPlayers);
  };

  const answerCorrect = () => {
    if (selectedQuestion) {
      const question = categories[selectedQuestion.category].questions[selectedQuestion.question];
      const newPlayers = [...players];
      const targetId = catTarget !== null ? catTarget : currentPlayer;
      let points = question.points;
      
      if (question.special === 'bonus' && bonusPoints !== null) {
        points = bonusPoints;
      } else if (question.special === 'double') {
        points = question.points * 2;
      }
      
      newPlayers[targetId].score += points;
      setPlayers(newPlayers);

      const newCategories = [...categories];
      newCategories[selectedQuestion.category].questions[selectedQuestion.question].answered = true;
      setCategories(newCategories);

      if (correctSoundRef.current) {
        correctSoundRef.current.play();
      }

      closeQuestion();
      checkRoundEnd();
    }
  };

  const answerWrong = () => {
    if (selectedQuestion) {
      const newCategories = [...categories];
      newCategories[selectedQuestion.category].questions[selectedQuestion.question].answered = true;
      setCategories(newCategories);

      if (wrongSoundRef.current) {
        wrongSoundRef.current.play();
      }

      closeQuestion();
      checkRoundEnd();
    }
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const checkRoundEnd = () => {
    const allAnswered = categories.every((cat) => cat.questions.every((q) => q.answered));
    if (allAnswered && selectedLevel) {
      if (gameState === 'round1') {
        setGameState('round1-end');
      } else if (gameState === 'round2') {
        setGameState('round2-end');
      }
    }
  };

  const startRound2 = () => {
    setCategories(round2Data);
    setGameState('round2');
  };

  const startFinalRound = () => {
    if (selectedLevel) {
      const gameData = GAME_DATA[selectedLevel];
      setRemainingThemes(gameData.final.map((_, i) => i));
      setGameState('final-betting');
    }
  };

  const removeTheme = (themeIndex: number) => {
    const newThemes = remainingThemes.filter((i) => i !== themeIndex);
    setRemainingThemes(newThemes);
    if (newThemes.length === 1) {
      setFinalTheme(newThemes[0]);
    }
    nextPlayer();
  };

  const placeBet = (playerId: number, bet: number) => {
    setFinalBets({ ...finalBets, [playerId]: bet });
  };

  const answerFinalQuestion = (playerId: number, correct: boolean) => {
    const newAnswers = { ...finalAnswers, [playerId]: correct };
    setFinalAnswers(newAnswers);

    const newPlayers = [...players];
    const playerIndex = newPlayers.findIndex((p) => p.id === playerId);
    const bet = finalBets[playerId] || 0;
    if (correct) {
      newPlayers[playerIndex].score += bet;
    } else {
      newPlayers[playerIndex].score -= bet;
    }
    setPlayers(newPlayers);

    const topPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
    if (Object.keys(newAnswers).length === topPlayers.length) {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setSelectedLevel(null);
    setCategories([]);
    setRound2Data([]);
    setPlayers([]);
    setCurrentPlayer(0);
    setSelectedQuestion(null);
    setShowAnswer(false);
    setTimeLeft(30);
    setTimerActive(false);
    setNewPlayerName('');
    setFinalBets({});
    setFinalAnswers({});
    setRemainingThemes([]);
    setFinalTheme(null);
    setCatTarget(null);
    setHintShown(false);
    setBetInputs({});
    setShowWheel(false);
    setBonusPoints(null);
  };

  const handleWheelResult = (points: number) => {
    setBonusPoints(points);
    if (wheelSoundRef.current) {
      wheelSoundRef.current.play();
    }
    setTimeout(() => {
      setShowWheel(false);
      setTimeLeft(30);
      setTimerActive(true);
    }, 1500);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-5xl space-y-6">
          <Card className="p-10 bg-white shadow-sm border border-border/40">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-5xl font-bold text-primary tracking-tight">QUIZ ARENA</h1>
              <p className="text-muted-foreground text-lg">Интеллектуальная игра для команд</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Users" size={20} className="text-primary" />
                  <h3 className="font-semibold text-lg">Участники</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Имя команды"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    className="flex-1"
                  />
                  <Button onClick={addPlayer} className="bg-primary hover:bg-primary/90">
                    <Icon name="Plus" size={20} />
                  </Button>
                </div>

                {players.length > 0 && (
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/40"
                      >
                        <span className="font-medium">{player.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPlayers(players.filter((p) => p.id !== player.id))}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Target" size={20} className="text-primary" />
                  <h3 className="font-semibold text-lg">Уровень сложности</h3>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => startGame('easy')}
                    disabled={players.length === 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white justify-start h-auto py-4"
                  >
                    <div className="text-left">
                      <div className="font-bold">Легкий</div>
                      <div className="text-sm opacity-90">Общая эрудиция</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => startGame('medium')}
                    disabled={players.length === 0}
                    className="w-full bg-accent hover:bg-accent/90 text-white justify-start h-auto py-4"
                  >
                    <div className="text-left">
                      <div className="font-bold">Средний</div>
                      <div className="text-sm opacity-90">Углубленные знания</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => startGame('hard')}
                    disabled={players.length === 0}
                    className="w-full bg-destructive hover:bg-destructive/90 text-white justify-start h-auto py-4"
                  >
                    <div className="text-left">
                      <div className="font-bold">Сложный</div>
                      <div className="text-sm opacity-90">Экспертный уровень</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowRules(true)}
              variant="outline"
              className="w-full mt-6 border-primary/20 hover:bg-primary/5"
            >
              <Icon name="BookOpen" size={18} className="mr-2" />
              Правила игры
            </Button>
          </Card>
        </div>

        <Dialog open={showRules} onOpenChange={setShowRules}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">Правила QUIZ ARENA</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="font-bold text-lg mb-2">Структура игры</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Раунд 1:</strong> 6 тем × 5 вопросов (100-500 баллов)</li>
                  <li>• <strong>Раунд 2:</strong> 6 тем × 5 вопросов (200-1000 баллов)</li>
                  <li>• <strong>Финал:</strong> Топ-3 команды, ставки и один вопрос</li>
                  <li>• Команды выбирают вопросы по очереди</li>
                  <li>• Команда, выбравшая вопрос, обязана на него ответить</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Система баллов</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Правильный ответ = +баллы вопроса</li>
                  <li>• Неправильный ответ = -баллы вопроса</li>
                  <li>• Счет может быть отрицательным</li>
                  <li>• 30 секунд на обсуждение (60 в финале)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 text-accent">Кот в мешке 🎁</h3>
                <p className="text-muted-foreground mb-2">
                  Особые вопросы, которые появляются случайно. Когда команда выбирает такой вопрос:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Команда обязана передать вопрос любому сопернику</li>
                  <li>• Принимающая команда отвечает на вопрос</li>
                  <li>• Баллы начисляются/списываются у принимающей команды</li>
                  <li>• Это тактический ход для передачи сложных вопросов</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 text-primary">Подсказка 💡</h3>
                <p className="text-muted-foreground mb-2">
                  В игре спрятан <strong>один вопрос с подсказкой</strong>. Команда, открывшая этот вопрос:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Получает право на <strong>одну подсказку</strong> до конца игры</li>
                  <li>• Может использовать подсказку на любом вопросе</li>
                  <li>• При использовании подсказки — ведущий помогает команде</li>
                  <li>• Подсказка видна только после открытия вопроса</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 text-green-600">Повышенный номинал ×2</h3>
                <p className="text-muted-foreground mb-2">
                  В игре спрятано <strong>3 вопроса с повышенным номиналом</strong>:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Правильный ответ = <strong>двойные баллы</strong></li>
                  <li>• Неправильный ответ = обычный штраф</li>
                  <li>• Повышенный номинал виден только после открытия вопроса</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Финальный раунд</h3>
                <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Выходят топ-3 команды по баллам</li>
                  <li>Команды по очереди убирают темы (остается одна)</li>
                  <li>Каждая команда делает ставку (от 0 до всех баллов)</li>
                  <li>Ставки скрыты от других команд</li>
                  <li>Ведущий открывает финальный вопрос</li>
                  <li>Правильный ответ = +ставка, неправильный = -ставка</li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (gameState === 'final-betting') {
    const topPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
    const allBetsPlaced = topPlayers.every((p) => finalBets[p.id] !== undefined);

    if (!selectedLevel) return null;
    const finalData = GAME_DATA[selectedLevel].final;

    return (
      <div className="min-h-screen p-4 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="p-6 bg-white shadow-sm border border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Финальный раунд</h1>
                <p className="text-muted-foreground mt-1">
                  {finalTheme === null ? `Ход команды: ${players[currentPlayer].name}` : 'Сделайте ставки'}
                </p>
              </div>
              <Button variant="outline" onClick={resetGame} size="sm">
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Сброс
              </Button>
            </div>
          </Card>

          {finalTheme === null && (
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Выберите тему для исключения:</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {remainingThemes.map((index) => (
                  <Button
                    key={index}
                    onClick={() => removeTheme(index)}
                    variant="outline"
                    className="h-20 text-base font-medium hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  >
                    {finalData[index].theme}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {finalTheme !== null && (
            <>
              <Card className="p-6 bg-destructive/10 border-2 border-destructive">
                <div className="flex items-center gap-3">
                  <Icon name="EyeOff" size={32} className="text-destructive flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-destructive">Важно для организаторов!</h3>
                    <p className="text-muted-foreground mt-1">
                      Просьба скрыть игру с большого экрана до момента, когда все команды сделают ставку
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h2 className="text-2xl font-bold text-center text-primary">
                  Финальная тема: {finalData[finalTheme].theme}
                </h2>
              </Card>
            </>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {topPlayers.map((player, index) => (
              <Card
                key={player.id}
                className={`p-6 bg-white shadow-sm ${
                  index === 0 ? 'border-2 border-primary' : 'border border-border/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{player.name}</h3>
                    <p className="text-2xl text-primary font-bold">{player.score}</p>
                  </div>
                </div>

                {finalTheme !== null && finalBets[player.id] === undefined ? (
                  <div className="space-y-3">
                    <label className="text-sm text-muted-foreground block">
                      Ставка (макс: {Math.max(player.score, 0)})
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={Math.max(player.score, 0)}
                        value={betInputs[player.id] || '0'}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = parseInt(value) || 0;
                          const maxBet = Math.max(player.score, 0);
                          const validValue = Math.min(Math.max(numValue, 0), maxBet);
                          setBetInputs({ ...betInputs, [player.id]: validValue.toString() });
                        }}
                        className="flex-1 text-lg text-center font-bold"
                        placeholder="0"
                      />
                      <Button
                        onClick={() => {
                          const bet = parseInt(betInputs[player.id] || '0');
                          placeBet(player.id, bet);
                        }}
                        className="bg-primary hover:bg-primary/90 px-6"
                      >
                        ✓
                      </Button>
                    </div>
                    <Slider
                      min={0}
                      max={Math.max(player.score, 0)}
                      step={50}
                      value={[parseInt(betInputs[player.id] || '0')]}
                      onValueChange={(value) => {
                        setBetInputs({ ...betInputs, [player.id]: value[0].toString() });
                      }}
                    />
                  </div>
                ) : finalBets[player.id] !== undefined ? (
                  <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">Ставка сделана</p>
                    <p className="text-2xl font-bold text-primary">✓</p>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>

          {allBetsPlaced && finalTheme !== null && (
            <Card className="p-6 bg-white shadow-sm">
              <Button
                onClick={() => setGameState('final-question')}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              >
                Показать финальный вопрос
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'final-question') {
    if (!selectedLevel || finalTheme === null) return null;
    const finalQ = GAME_DATA[selectedLevel].final[finalTheme];
    const topPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-4xl p-10 space-y-8 bg-white shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">{finalQ.theme}</h2>
            <p className="text-3xl font-medium leading-relaxed">{finalQ.question}</p>
          </div>

          {!showAnswer ? (
            <Button
              onClick={revealAnswer}
              className="w-full bg-primary hover:bg-primary/90 text-xl py-8"
            >
              <Icon name="Eye" size={24} className="mr-2" />
              Показать ответ
            </Button>
          ) : (
            <>
              <Card className="p-8 bg-primary/10 border-2 border-primary">
                <p className="text-2xl text-center font-semibold">{finalQ.answer}</p>
              </Card>

              <div className="space-y-3">
                {topPlayers.map((player) =>
                  finalAnswers[player.id] === undefined || finalAnswers[player.id] === null ? (
                    <div key={player.id} className="flex gap-3">
                      <Button
                        onClick={() => answerFinalQuestion(player.id, true)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-6"
                      >
                        {player.name} - Верно
                      </Button>
                      <Button
                        onClick={() => answerFinalQuestion(player.id, false)}
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-lg py-6"
                      >
                        {player.name} - Неверно
                      </Button>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  if (gameState === 'round1-end') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-4xl p-10 space-y-8 bg-white shadow-sm">
          <div className="text-center space-y-4">
            <Icon name="CheckCircle" size={80} className="mx-auto text-primary" />
            <h1 className="text-5xl font-bold text-primary">Раунд 1 завершен!</h1>
            <p className="text-xl text-muted-foreground">Промежуточные результаты</p>
          </div>

          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-5 rounded-lg transition-all ${
                  index === 0
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-secondary/30 border border-border/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-12 text-center">{index + 1}.</div>
                  <span className="text-xl font-semibold">{player.name}</span>
                </div>
                <div className="text-3xl font-bold text-primary">{player.score}</div>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 space-y-3">
            <h3 className="text-2xl font-bold text-center text-accent">Раунд 2: Глубина</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Вопросы от 200 до 1000 баллов</li>
              <li>• Более сложные темы</li>
              <li>• Сохраняются интерактивы из раунда 1</li>
            </ul>
          </div>

          <Button onClick={startRound2} className="w-full bg-primary hover:bg-primary/90 text-xl py-8">
            <Icon name="Play" size={24} className="mr-2" />
            Начать Раунд 2
          </Button>
        </Card>
      </div>
    );
  }

  if (gameState === 'round2-end') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const topPlayers = sortedPlayers.slice(0, 3);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-4xl p-10 space-y-8 bg-white shadow-sm">
          <div className="text-center space-y-4">
            <Icon name="Award" size={80} className="mx-auto text-primary" />
            <h1 className="text-5xl font-bold text-primary">Раунд 2 завершен!</h1>
            <p className="text-xl text-muted-foreground">Результаты перед финалом</p>
          </div>

          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-5 rounded-lg transition-all ${
                  index < 3
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted/50 border border-border/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-12 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <span className="text-xl font-semibold">{player.name}</span>
                </div>
                <div className="text-3xl font-bold text-primary">{player.score}</div>
              </div>
            ))}
          </div>

          <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6 space-y-3">
            <h3 className="text-2xl font-bold text-center text-destructive">Финальный раунд</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• В финал проходят топ-3 команды: <strong>{topPlayers.map(p => p.name).join(', ')}</strong></li>
              <li>• Команды по очереди убирают темы (остается одна)</li>
              <li>• Каждая команда делает ставку от 0 до всех своих баллов</li>
              <li>• Один вопрос решает победителя!</li>
            </ul>
          </div>

          <Button onClick={startFinalRound} className="w-full bg-primary hover:bg-primary/90 text-xl py-8">
            <Icon name="Zap" size={24} className="mr-2" />
            Начать финал
          </Button>
        </Card>
      </div>
    );
  }

  if (gameState === 'results') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-3xl p-10 space-y-8 bg-white shadow-sm">
          <div className="text-center space-y-4">
            <Icon name="Trophy" size={80} className="mx-auto text-primary" />
            <h1 className="text-5xl font-bold text-primary">Итоги игры</h1>
          </div>

          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-6 rounded-lg transition-all ${
                  index === 0
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-secondary/30 border border-border/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl w-16 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <span className="text-2xl font-semibold">{player.name}</span>
                </div>
                <div className="text-4xl font-bold text-primary">{player.score}</div>
              </div>
            ))}
          </div>

          <Button onClick={resetGame} className="w-full bg-primary hover:bg-primary/90 text-xl py-8">
            <Icon name="RotateCcw" size={24} className="mr-2" />
            Новая игра
          </Button>
        </Card>
      </div>
    );
  }

  const roundName = gameState === 'round1' ? 'Раунд 1: Разминка' : 'Раунд 2: Глубина';

  return (
    <div className="min-h-screen p-3 bg-background">
      <div className="max-w-[1800px] mx-auto space-y-3">
        <Card className="p-4 bg-white shadow-sm border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">QUIZ ARENA</h1>
              <p className="text-sm text-muted-foreground">{roundName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRules(true)} size="sm">
                <Icon name="BookOpen" size={16} className="mr-2" />
                Правила
              </Button>
              {gameState === 'round1' && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (confirm('Вы уверены? В раунде остались нерешенные вопросы. Перейти к раунду 2?')) {
                      startRound2();
                    }
                  }} 
                  size="sm"
                >
                  <Icon name="FastForward" size={16} className="mr-2" />
                  К раунду 2
                </Button>
              )}
              {gameState === 'round2' && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (confirm('Вы уверены? В раунде остались нерешенные вопросы. Перейти к финалу?')) {
                      startFinalRound();
                    }
                  }} 
                  size="sm"
                >
                  <Icon name="Zap" size={16} className="mr-2" />
                  К финалу
                </Button>
              )}
              <Button variant="outline" onClick={resetGame} size="sm">
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Сброс
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {players.map((player, index) => (
            <Card
              key={player.id}
              className={`p-3 text-center transition-all ${
                index === currentPlayer
                  ? 'bg-primary/10 border-2 border-primary shadow-md'
                  : 'bg-white border border-border/40'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name="Users" size={14} />
                <h3 className="font-semibold text-sm truncate">{player.name}</h3>
              </div>
              <div className="text-2xl font-bold text-primary">{player.score}</div>
              {player.hasHint && (
                <div className="text-xs text-green-600 mt-1 font-semibold">💡 есть подсказка</div>
              )}
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="flex gap-2 items-stretch">
              <Card className="p-3 bg-primary text-white flex items-center justify-center border border-primary min-w-[140px] md:min-w-[180px] shrink-0">
                <h2 className="font-bold text-xs md:text-sm leading-tight text-center">{category.name}</h2>
              </Card>
              <div className="flex gap-2 flex-1">
                {category.questions.map((question, qIndex) => (
                  <Card
                    key={qIndex}
                    onClick={() => selectQuestion(catIndex, qIndex)}
                    className={`p-4 md:p-6 text-center cursor-pointer transition-all flex-1 flex items-center justify-center ${
                      question.answered
                        ? 'bg-muted/50 opacity-40 cursor-not-allowed border border-border/40'
                        : 'bg-accent hover:bg-accent/80 hover:scale-105 shadow-sm hover:shadow-md border border-accent'
                    }`}
                  >
                    <div className="text-xl md:text-3xl font-bold text-white">
                      {question.answered ? '✓' : (question.special === 'bonus' ? '🎲' : question.points)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={selectedQuestion !== null} onOpenChange={() => {}}>
        <DialogContent className="max-w-3xl bg-white" onPointerDownOutside={(e) => e.preventDefault()}>
          {selectedQuestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl text-center text-primary">
                  {categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'bonus' 
                    ? (bonusPoints ? `${bonusPoints} баллов` : 'Бонусный вопрос')
                    : `${categories[selectedQuestion.category].questions[selectedQuestion.question].points} баллов`}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'cat' &&
                  catTarget === null && (
                    <>
                      <Card className="p-6 bg-accent/10 border-2 border-accent">
                        <p className="text-center text-xl font-bold text-accent">🎁 Кот в мешке!</p>
                        <p className="text-center text-muted-foreground mt-2">
                          Выберите команду, которая ответит на этот вопрос
                        </p>
                      </Card>
                      <div className="grid grid-cols-2 gap-3">
                        {players.map((player, index) =>
                          index !== currentPlayer ? (
                            <Button
                              key={player.id}
                              onClick={() => selectCatTarget(index)}
                              className="bg-primary hover:bg-primary/90 h-16 text-lg"
                            >
                              {player.name}
                            </Button>
                          ) : null
                        )}
                      </div>
                    </>
                  )}

                {categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'bonus' && showWheel ? (
                  <>
                    <Card className="p-4 bg-yellow-50 border-2 border-yellow-500">
                      <p className="text-center text-xl font-bold text-yellow-700">🎲 Бонусный вопрос!</p>
                      <p className="text-center text-sm text-yellow-600 mt-1">
                        Крутите колесо фортуны, чтобы узнать номинал вопроса
                      </p>
                    </Card>
                    <FortuneWheel onResult={handleWheelResult} pointsRange={gameState === 'round1' ? 'round1' : 'round2'} />
                  </>
                ) : catTarget !== null || (categories[selectedQuestion.category].questions[selectedQuestion.question].special !== 'cat' && categories[selectedQuestion.category].questions[selectedQuestion.question].special !== 'bonus') || (categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'bonus' && bonusPoints !== null) ? (
                  <>
                    {categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'bonus' && bonusPoints !== null && (
                      <Card className="p-4 bg-yellow-50 border-2 border-yellow-500">
                        <p className="text-center text-xl font-bold text-yellow-700">🎲 Номинал: {bonusPoints} баллов</p>
                        <p className="text-center text-sm text-yellow-600 mt-1">
                          Правильный ответ = +{bonusPoints}, неправильный = -{bonusPoints}
                        </p>
                      </Card>
                    )}

                    {categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'hint' && (
                      <Card className="p-4 bg-green-50 border-2 border-green-500">
                        <p className="text-center text-lg font-bold text-green-700">💡 Подсказка найдена!</p>
                        <p className="text-center text-sm text-green-600 mt-1">
                          Команда "{players[currentPlayer].name}" получила право на одну подсказку до конца игры
                        </p>
                      </Card>
                    )}

                    {categories[selectedQuestion.category].questions[selectedQuestion.question].special === 'double' && (
                      <Card className="p-4 bg-green-50 border-2 border-green-500">
                        <p className="text-center text-xl font-bold text-green-700">×2 Повышенный номинал!</p>
                        <p className="text-center text-sm text-green-600 mt-1">
                          Правильный ответ = {categories[selectedQuestion.category].questions[selectedQuestion.question].points * 2} баллов
                        </p>
                      </Card>
                    )}

                    <div className="flex items-center justify-center gap-4">
                      {timerActive && (
                        <>
                          <Icon name="Clock" size={32} className="text-primary" />
                          <div className="text-5xl font-bold text-primary">{timeLeft}с</div>
                        </>
                      )}
                      {players[currentPlayer].hasHint && !hintShown && (
                        <Button onClick={useHint} variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                          <Icon name="Lightbulb" size={18} className="mr-2" />
                          Использовать подсказку
                        </Button>
                      )}
                    </div>

                    {hintShown && (
                      <Card className="p-4 bg-yellow-50 border-2 border-yellow-500">
                        <p className="text-center text-yellow-800 font-semibold">
                          ℹ️ Ведущий дает подсказку команде "{players[currentPlayer].name}"
                        </p>
                      </Card>
                    )}

                    {categories[selectedQuestion.category].questions[selectedQuestion.question].image ? (
                      <Card className="p-4 bg-secondary/30 border border-border/40">
                        <img 
                          src={categories[selectedQuestion.category].questions[selectedQuestion.question].image} 
                          alt="Вопрос с изображением"
                          className="w-full max-w-md max-h-96 mx-auto rounded-lg object-contain"
                        />
                      </Card>
                    ) : (
                      <Card className="p-8 bg-secondary/30 border border-border/40">
                        <p className="text-xl md:text-2xl text-center leading-relaxed">
                          {categories[selectedQuestion.category].questions[selectedQuestion.question].question}
                        </p>
                      </Card>
                    )}

                    {showAnswer && (
                      <Card className="p-8 bg-primary/10 border-2 border-primary">
                        <p className="text-xl md:text-2xl text-center font-semibold leading-relaxed">
                          {categories[selectedQuestion.category].questions[selectedQuestion.question].answer}
                        </p>
                      </Card>
                    )}

                    <div className="flex gap-3">
                      {!showAnswer ? (
                        <Button
                          onClick={revealAnswer}
                          className="flex-1 bg-primary hover:bg-primary/90 text-xl py-7"
                        >
                          <Icon name="Eye" size={24} className="mr-2" />
                          Показать ответ
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={answerCorrect}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xl py-7"
                          >
                            <Icon name="Check" size={24} className="mr-2" />
                            Верно
                          </Button>
                          <Button
                            onClick={answerWrong}
                            className="flex-1 bg-destructive hover:bg-destructive/90 text-xl py-7"
                          >
                            <Icon name="X" size={24} className="mr-2" />
                            Неверно
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Правила QUIZ ARENA</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-bold text-lg mb-2">Структура игры</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Раунд 1:</strong> 6 тем × 5 вопросов (100-500 баллов)</li>
                <li>• <strong>Раунд 2:</strong> 6 тем × 5 вопросов (200-1000 баллов)</li>
                <li>• <strong>Финал:</strong> Топ-3 команды, ставки и один вопрос</li>
                <li>• Команды выбирают вопросы по очереди</li>
                <li>• Команда, выбравшая вопрос, обязана на него ответить</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Система баллов</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Правильный ответ = +баллы вопроса</li>
                <li>• Неправильный ответ = -баллы вопроса</li>
                <li>• Счет может быть отрицательным</li>
                <li>• 30 секунд на обсуждение (60 в финале)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-accent">Кот в мешке 🎁</h3>
              <p className="text-muted-foreground mb-2">
                Особые вопросы, которые появляются случайно. Когда команда выбирает такой вопрос:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Команда обязана передать вопрос любому сопернику</li>
                <li>• Принимающая команда отвечает на вопрос</li>
                <li>• Баллы начисляются/списываются у принимающей команды</li>
                <li>• Это тактический ход для передачи сложных вопросов</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-primary">Подсказка 💡</h3>
              <p className="text-muted-foreground mb-2">
                В игре спрятан <strong>один вопрос с подсказкой</strong>. Команда, открывшая этот вопрос:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Получает право на <strong>одну подсказку</strong> до конца игры</li>
                <li>• Может использовать подсказку на любом вопросе</li>
                <li>• При использовании подсказки — ведущий помогает команде</li>
                <li>• Подсказка видна только после открытия вопроса</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-green-600">Повышенный номинал ×2</h3>
              <p className="text-muted-foreground mb-2">
                В игре спрятано <strong>3 вопроса с повышенным номиналом</strong>:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Правильный ответ = <strong>двойные баллы</strong></li>
                <li>• Неправильный ответ = обычный штраф</li>
                <li>• Повышенный номинал виден только после открытия вопроса</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Финальный раунд</h3>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Выходят топ-3 команды по баллам</li>
                <li>Команды по очереди убирают темы (остается одна)</li>
                <li>Каждая команда делает ставку (от 0 до всех баллов)</li>
                <li>Ставки скрыты от других команд</li>
                <li>Ведущий открывает финальный вопрос</li>
                <li>Правильный ответ = +ставка, неправильный = -ставка</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}