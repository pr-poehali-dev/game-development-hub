import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type Question = {
  question: string;
  answer: string;
  points: number;
  answered: boolean;
  special?: string;
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

const ROUND1_DATA: Category[] = [
  {
    name: 'Современная культура',
    questions: [
      { question: 'Какое скандинавское понятие, ставшее мировым трендом, описывает уютную атмосферу и ощущение комфорта?', answer: 'Хюгге (датское слово)', points: 100, answered: false },
      { question: 'Как называется практика осознанного отказа от использования цифровых устройств на определенное время?', answer: 'Цифровой детокс', points: 200, answered: false },
      { question: 'Какой термин описывает экономическую модель, где товары и услуги временно арендуются, а не покупаются?', answer: 'Шеринг-экономика или экономика совместного потребления', points: 300, answered: false, special: 'Кот в мешке' },
      { question: 'Что означает аббревиатура NFT в цифровом искусстве?', answer: 'Non-Fungible Token (Невзаимозаменяемый токен)', points: 400, answered: false },
      { question: 'Какой психологический эффект описывает страх пропустить что-то важное в социальных сетях?', answer: 'FOMO (Fear Of Missing Out)', points: 500, answered: false },
    ],
  },
  {
    name: 'Кино и сериалы',
    questions: [
      { question: 'В какой киновселенной существуют Железный человек, Капитан Америка и Тор?', answer: 'Кинематографическая вселенная Marvel (КВМ)', points: 100, answered: false },
      { question: 'Какой сериал Netflix рассказывает о подростках с суперспособностями, которые сбегают из лаборатории?', answer: '«Очень странные дела» (Stranger Things)', points: 200, answered: false },
      { question: 'Кто сыграл роль Джека Воробья в серии фильмов «Пираты Карибского моря»?', answer: 'Джонни Депп', points: 300, answered: false },
      { question: 'В каком фильме главный герой использует татуировки на теле, чтобы запоминать важную информацию?', answer: '«Помни» (Memento)', points: 400, answered: false, special: 'Кот в мешке' },
      { question: 'Как зовут главного героя сериала «Декстер», который работает судмедэкспертом днем и серийным убийцей ночью?', answer: 'Декстер Морган', points: 500, answered: false },
    ],
  },
  {
    name: 'География мира',
    questions: [
      { question: 'На каком материке находится пустыня Сахара?', answer: 'Африка', points: 100, answered: false },
      { question: 'Какая страна имеет форму «сапога» на карте?', answer: 'Италия', points: 200, answered: false },
      { question: 'Столицей какой страны является город Оттава?', answer: 'Канада', points: 300, answered: false },
      { question: 'Какой пролив разделяет Европу и Африку?', answer: 'Гибралтарский пролив', points: 400, answered: false },
      { question: 'В какой стране находится самый высокий водопад в мире — Анхель?', answer: 'Венесуэла', points: 500, answered: false, special: 'Кот в мешке' },
    ],
  },
  {
    name: 'Живой мир',
    questions: [
      { question: 'Какое животное является символом Всемирного фонда дикой природы (WWF)?', answer: 'Большая панда', points: 100, answered: false },
      { question: 'Какое морское млекопитающее известно своим интеллектом и способностью выполнять трюки?', answer: 'Дельфин', points: 200, answered: false },
      { question: 'Как называется явление, когда птицы улетают в теплые края на зиму?', answer: 'Миграция или перелет', points: 300, answered: false },
      { question: 'Какое самое высокое животное на Земле?', answer: 'Жираф', points: 400, answered: false },
      { question: 'Какой австралийский зверь носит детенышей в сумке на животе?', answer: 'Кенгуру', points: 500, answered: false },
    ],
  },
  {
    name: 'Технологии',
    questions: [
      { question: 'Какая компания разработала операционную систему iOS?', answer: 'Apple', points: 100, answered: false },
      { question: 'Что такое блокчейн простыми словами?', answer: 'Цепочка блоков с информацией (технология распределенного реестра)', points: 200, answered: false },
      { question: 'Как называется чат-бот с искусственным интеллектом от компании OpenAI?', answer: 'ChatGPT', points: 300, answered: false },
      { question: 'Для чего в смартфонах используется технология NFC?', answer: 'Бесконтактная оплата и передача данных', points: 400, answered: false },
      { question: 'Какой язык программирования назван в честь комедийного шоу «Монти Пайтон»?', answer: 'Python', points: 500, answered: false, special: 'Кот в мешке' },
    ],
  },
  {
    name: 'История и факты',
    questions: [
      { question: 'Кто был первым человеком, полетевшим в космос?', answer: 'Юрий Гагарин', points: 100, answered: false },
      { question: 'В каком веке произошла Октябрьская революция в России?', answer: 'XX век (1917 год)', points: 200, answered: false },
      { question: 'Кто изобрел лампочку накаливания?', answer: 'Томас Эдисон (с улучшениями)', points: 300, answered: false },
      { question: 'Какой русский ученый создал периодическую таблицу химических элементов?', answer: 'Дмитрий Менделеев', points: 400, answered: false },
      { question: 'Что было построено раньше: Эйфелева башня или Статуя Свободы?', answer: 'Статуя Свободы (1886 vs 1889)', points: 500, answered: false },
    ],
  },
];

const ROUND2_DATA: Category[] = [
  {
    name: 'Наука',
    questions: [
      { question: 'Какой газ составляет около 78% атмосферы Земли?', answer: 'Азот', points: 200, answered: false },
      { question: 'Какая планета Солнечной системы известна своими кольцами?', answer: 'Сатурн', points: 400, answered: false },
      { question: 'Как называется самая маленькая частица химического элемента?', answer: 'Атом', points: 600, answered: false },
      { question: 'В честь какого ученого названа единица измерения силы тока?', answer: 'Ампер (Андре-Мари Ампер)', points: 800, answered: false, special: 'Кот в мешке' },
      { question: 'Как называется теория, объясняющая происхождение Вселенной в результате гигантского взрыва?', answer: 'Теория Большого взрыва', points: 1000, answered: false },
    ],
  },
  {
    name: 'Музыка',
    questions: [
      { question: 'Какая британская рок-группа выпустила альбом «The Dark Side of the Moon»?', answer: 'Pink Floyd', points: 200, answered: false },
      { question: 'Кто является автором балета «Лебединое озеро»?', answer: 'Петр Ильич Чайковский', points: 400, answered: false },
      { question: 'Какой музыкальный инструмент имеет 88 клавиш?', answer: 'Фортепиано (рояль или пианино)', points: 600, answered: false },
      { question: 'Кто спел саундтрек «My Heart Will Go On» к фильму «Титаник»?', answer: 'Селин Дион', points: 800, answered: false },
      { question: 'Какой певец известен альбомами «Thriller» и «Bad»?', answer: 'Майкл Джексон', points: 1000, answered: false, special: 'Кот в мешке' },
    ],
  },
  {
    name: 'Литература',
    questions: [
      { question: 'Кто написал роман «Мастер и Маргарита»?', answer: 'Михаил Булгаков', points: 200, answered: false },
      { question: 'Как звали главного героя романа «Преступление и наказание»?', answer: 'Родион Раскольников', points: 400, answered: false },
      { question: 'Кто создал детектива Шерлока Холмса?', answer: 'Артур Конан Дойл', points: 600, answered: false },
      { question: 'В какой стране родился писатель Габриэль Гарсиа Маркес?', answer: 'Колумбия', points: 800, answered: false },
      { question: 'Как называется антиутопический роман Джорджа Оруэлла о тоталитарном обществе?', answer: '«1984»', points: 1000, answered: false },
    ],
  },
  {
    name: 'Бизнес и экономика',
    questions: [
      { question: 'Кто является основателем компании Microsoft?', answer: 'Билл Гейтс', points: 200, answered: false },
      { question: 'Что означает аббревиатура ВВП в экономике?', answer: 'Валовой внутренний продукт', points: 400, answered: false },
      { question: 'Как называется первое публичное предложение акций компании на бирже?', answer: 'IPO (Initial Public Offering)', points: 600, answered: false, special: 'Кот в мешке' },
      { question: 'Какая компания владеет брендами Instagram и WhatsApp?', answer: 'Meta (ранее Facebook)', points: 800, answered: false },
      { question: 'Кто является основателем компании Tesla?', answer: 'Илон Маск', points: 1000, answered: false },
    ],
  },
  {
    name: 'Искусство',
    questions: [
      { question: 'Кто написал картину «Черный квадрат»?', answer: 'Казимир Малевич', points: 200, answered: false },
      { question: 'В каком музее хранится «Мона Лиза» Леонардо да Винчи?', answer: 'Лувр (Париж)', points: 400, answered: false },
      { question: 'Кто скульптор знаменитой статуи «Давид»?', answer: 'Микеланджело', points: 600, answered: false },
      { question: 'Какой художник написал «Звездную ночь»?', answer: 'Винсент Ван Гог', points: 800, answered: false },
      { question: 'Какой русский художник известен своими картинами на сказочные и былинные сюжеты?', answer: 'Виктор Васнецов', points: 1000, answered: false, special: 'Кот в мешке' },
    ],
  },
  {
    name: 'Спорт',
    questions: [
      { question: 'В каком виде спорта разыгрывается Кубок Стэнли?', answer: 'Хоккей', points: 200, answered: false },
      { question: 'Какая страна выиграла чемпионат мира по футболу в 2018 году?', answer: 'Франция', points: 400, answered: false },
      { question: 'Как зовут теннисистку, выигравшую наибольшее количество турниров Большого шлема в истории?', answer: 'Серена Уильямс', points: 600, answered: false },
      { question: 'В каком году Москва принимала летние Олимпийские игры?', answer: '1980', points: 800, answered: false },
      { question: 'Как называется высшая лига в американском футболе?', answer: 'NFL (Национальная футбольная лига)', points: 1000, answered: false },
    ],
  },
];

const FINAL_ROUND_DATA = [
  { theme: 'Космос', question: 'Как звали первую женщину-космонавта?', answer: 'Валентина Терешкова' },
  { theme: 'Языки', question: 'На каком языке больше всего говорят людей в мире как на родном?', answer: 'Китайский (мандаринский)' },
  { theme: 'Архитектура', question: 'В каком городе находится Колизей?', answer: 'Рим' },
  { theme: 'Еда и напитки', question: 'Из какой страны родом пицца?', answer: 'Италия' },
  { theme: 'Психология', question: 'Кто считается основателем психоанализа?', answer: 'Зигмунд Фрейд' },
  { theme: 'Мода', question: 'Какой французский модельер создал бренд Chanel?', answer: 'Коко Шанель' },
];

export default function Index() {
  const [gameState, setGameState] = useState<'setup' | 'round1' | 'round2' | 'final' | 'results'>('setup');
  const [currentRound, setCurrentRound] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<{ category: number; question: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [finalBets, setFinalBets] = useState<{ [key: number]: number }>({});
  const [finalAnswers, setFinalAnswers] = useState<{ [key: number]: boolean }>({});
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);

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
      setCategories(JSON.parse(JSON.stringify(ROUND1_DATA)));
      setGameState('round1');
      setCurrentRound(1);
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
      checkRoundEnd();
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
      checkRoundEnd();
    }
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const checkRoundEnd = () => {
    const allAnswered = categories.every((cat) => cat.questions.every((q) => q.answered));
    if (allAnswered) {
      if (gameState === 'round1') {
        setCategories(JSON.parse(JSON.stringify(ROUND2_DATA)));
        setGameState('round2');
        setCurrentRound(2);
      } else if (gameState === 'round2') {
        setGameState('final');
        setCurrentRound(3);
      }
    }
  };

  const placeBet = (playerId: number, bet: number) => {
    setFinalBets({ ...finalBets, [playerId]: bet });
  };

  const answerFinalQuestion = (playerId: number, correct: boolean) => {
    const newAnswers = { ...finalAnswers, [playerId]: correct };
    setFinalAnswers(newAnswers);

    const newPlayers = [...players];
    const playerIndex = newPlayers.findIndex((p) => p.id === playerId);
    if (correct) {
      newPlayers[playerIndex].score += finalBets[playerId] || 0;
    } else {
      newPlayers[playerIndex].score -= finalBets[playerId] || 0;
    }
    setPlayers(newPlayers);

    if (Object.keys(newAnswers).length === Math.min(3, players.length)) {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setCategories([]);
    setPlayers([]);
    setCurrentPlayer(0);
    setSelectedQuestion(null);
    setShowAnswer(false);
    setTimeLeft(30);
    setTimerActive(false);
    setGameState('setup');
    setCurrentRound(1);
    setFinalBets({});
    setFinalAnswers({});
    setSelectedTheme(null);
    setShowFinalQuestion(false);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
        <Card className="w-full max-w-2xl p-8 space-y-6 bg-card/95 backdrop-blur border-2 border-primary/20 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-2">
              <Icon name="Gamepad2" size={48} className="text-primary" />
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              QUIZ ARENA
            </h1>
            <p className="text-muted-foreground text-lg">Добавьте участников и начните игру</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Имя участника"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                className="flex-1 h-12 text-lg"
              />
              <Button onClick={addPlayer} className="bg-primary hover:bg-primary/90 h-12 px-6">
                <Icon name="UserPlus" size={24} />
              </Button>
            </div>

            {players.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-xl flex items-center gap-2">
                  <Icon name="Users" size={20} />
                  Участники:
                </h3>
                <div className="grid gap-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 bg-secondary/80 rounded-lg border border-border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-primary" />
                        </div>
                        <span className="text-lg font-medium">{player.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlayers(players.filter((p) => p.id !== player.id))}
                        className="hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={startGame}
              disabled={players.length === 0}
              className="w-full bg-accent hover:bg-accent/90 text-lg py-7 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Icon name="Play" size={24} className="mr-2" />
              Начать игру
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === 'final') {
    const topPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

    if (!showFinalQuestion) {
      return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-accent/10">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card className="p-6 bg-card/95 backdrop-blur border-2 border-accent">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-accent flex items-center gap-3">
                    <Icon name="Trophy" size={40} />
                    ФИНАЛЬНЫЙ РАУНД
                  </h1>
                  <p className="text-muted-foreground mt-1">Выберите тему и сделайте ставку</p>
                </div>
                <Button variant="outline" onClick={resetGame} size="sm">
                  <Icon name="RotateCcw" size={16} className="mr-2" />
                  Сброс
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {topPlayers.map((player, index) => (
                <Card
                  key={player.id}
                  className={`p-6 bg-card/95 backdrop-blur border-2 ${
                    index === 0 ? 'border-accent' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{player.name}</h3>
                      <p className="text-2xl text-accent font-bold">{player.score}</p>
                    </div>
                  </div>

                  {finalBets[player.id] === undefined ? (
                    <div className="space-y-3">
                      <label className="text-sm text-muted-foreground">
                        Ставка (макс: {player.score > 0 ? player.score : 0})
                      </label>
                      <Slider
                        min={0}
                        max={Math.max(player.score, 0)}
                        step={50}
                        defaultValue={[0]}
                        onValueChange={(value) => {
                          const btn = document.getElementById(`bet-btn-${player.id}`) as HTMLButtonElement;
                          if (btn) btn.dataset.bet = value[0].toString();
                        }}
                        className="mb-3"
                      />
                      <Button
                        id={`bet-btn-${player.id}`}
                        onClick={(e) => {
                          const bet = parseInt((e.target as HTMLButtonElement).dataset.bet || '0');
                          placeBet(player.id, bet);
                        }}
                        data-bet="0"
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Сделать ставку
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-primary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Ставка:</p>
                      <p className="text-3xl font-bold text-primary">{finalBets[player.id]}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {Object.keys(finalBets).length === topPlayers.length && selectedTheme === null && (
              <Card className="p-6 bg-card/95 backdrop-blur">
                <h2 className="text-2xl font-bold mb-4 text-center">Выберите тему:</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  {FINAL_ROUND_DATA.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        setSelectedTheme(index);
                        setShowFinalQuestion(true);
                      }}
                      className="h-20 text-lg font-semibold bg-secondary hover:bg-accent/20 hover:border-accent border-2"
                    >
                      {item.theme}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      );
    } else if (selectedTheme !== null) {
      const finalQ = FINAL_ROUND_DATA[selectedTheme];
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/10">
          <Card className="w-full max-w-4xl p-10 space-y-8 bg-card/95 backdrop-blur border-2 border-accent">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-accent">{finalQ.theme}</h2>
              <p className="text-2xl mt-6">{finalQ.question}</p>
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
                <Card className="p-6 bg-accent/20 border-2 border-accent">
                  <p className="text-2xl text-center font-semibold">{finalQ.answer}</p>
                </Card>

                <div className="space-y-3">
                  {topPlayers.map((player) =>
                    finalAnswers[player.id] === undefined ? (
                      <div key={player.id} className="flex gap-3">
                        <Button
                          onClick={() => answerFinalQuestion(player.id, true)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6"
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
  }

  if (gameState === 'results') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/10">
        <Card className="w-full max-w-3xl p-10 space-y-8 bg-card/95 backdrop-blur border-2 border-accent shadow-2xl">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 bg-accent/10 rounded-full">
              <Icon name="Trophy" size={80} className="text-accent" />
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              ИТОГИ ИГРЫ
            </h1>
          </div>

          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-6 rounded-xl transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-accent/30 to-accent/10 border-2 border-accent scale-105'
                    : 'bg-secondary/80 border border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold w-16 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <span className="text-2xl font-semibold">{player.name}</span>
                </div>
                <div className="text-4xl font-bold text-accent">{player.score}</div>
              </div>
            ))}
          </div>

          <Button onClick={resetGame} className="w-full bg-primary hover:bg-primary/90 text-xl py-8 font-bold shadow-lg">
            <Icon name="RotateCcw" size={24} className="mr-2" />
            Новая игра
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-[1800px] mx-auto space-y-3">
        <Card className="p-4 bg-card/95 backdrop-blur border-2 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon name="Zap" size={32} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-primary">QUIZ ARENA</h1>
                <p className="text-sm text-muted-foreground">
                  {gameState === 'round1' ? 'Раунд 1: Интеллектуальный старт' : 'Раунд 2: Глубина знаний'}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={resetGame} size="sm">
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сброс
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {players.map((player, index) => (
            <Card
              key={player.id}
              className={`p-3 text-center transition-all ${
                index === currentPlayer
                  ? 'bg-primary/20 border-2 border-primary scale-105 shadow-lg'
                  : 'bg-card/80 backdrop-blur border border-border'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name="User" size={16} />
                <h3 className="font-semibold text-sm truncate">{player.name}</h3>
              </div>
              <div className="text-2xl font-bold text-accent">{player.score}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-2">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="space-y-2">
              <Card className="p-3 bg-gradient-to-br from-primary to-primary/80 text-center border-2 border-primary/50">
                <h2 className="font-bold text-xs md:text-sm leading-tight">{category.name}</h2>
              </Card>
              {category.questions.map((question, qIndex) => (
                <Card
                  key={qIndex}
                  onClick={() => selectQuestion(catIndex, qIndex)}
                  className={`p-4 md:p-6 text-center cursor-pointer transition-all relative ${
                    question.answered
                      ? 'bg-muted/50 opacity-40 cursor-not-allowed'
                      : 'bg-accent hover:bg-accent/80 hover:scale-105 shadow-md hover:shadow-xl'
                  }`}
                >
                  {question.special && !question.answered && (
                    <div className="absolute top-1 right-1 text-xs bg-primary/90 text-white px-2 py-1 rounded">
                      {question.special}
                    </div>
                  )}
                  <div className="text-xl md:text-3xl font-bold">
                    {question.answered ? '✓' : question.points}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={selectedQuestion !== null} onOpenChange={closeQuestion}>
        <DialogContent className="max-w-3xl bg-card/95 backdrop-blur">
          {selectedQuestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl text-center text-accent">
                  {categories[selectedQuestion.category].questions[selectedQuestion.question].points} баллов
                </DialogTitle>
                {categories[selectedQuestion.category].questions[selectedQuestion.question].special && (
                  <p className="text-center text-primary font-semibold text-lg">
                    {categories[selectedQuestion.category].questions[selectedQuestion.question].special}
                  </p>
                )}
              </DialogHeader>

              <div className="space-y-6 py-4">
                {timerActive && (
                  <div className="flex items-center justify-center gap-4">
                    <Icon name="Clock" size={32} className="text-primary animate-pulse" />
                    <div className="text-5xl font-bold text-primary">{timeLeft}с</div>
                  </div>
                )}

                <Card className="p-8 bg-secondary/80 border-2 border-border">
                  <p className="text-xl md:text-2xl text-center leading-relaxed">
                    {categories[selectedQuestion.category].questions[selectedQuestion.question].question}
                  </p>
                </Card>

                {showAnswer && (
                  <Card className="p-8 bg-primary/20 border-2 border-primary animate-scale-in">
                    <p className="text-xl md:text-2xl text-center font-semibold leading-relaxed">
                      {categories[selectedQuestion.category].questions[selectedQuestion.question].answer}
                    </p>
                  </Card>
                )}

                <div className="flex gap-3">
                  {!showAnswer ? (
                    <Button onClick={revealAnswer} className="flex-1 bg-primary hover:bg-primary/90 text-xl py-7">
                      <Icon name="Eye" size={24} className="mr-2" />
                      Показать ответ
                    </Button>
                  ) : (
                    <>
                      <Button onClick={answerCorrect} className="flex-1 bg-green-600 hover:bg-green-700 text-xl py-7">
                        <Icon name="Check" size={24} className="mr-2" />
                        Верно
                      </Button>
                      <Button onClick={answerWrong} className="flex-1 bg-destructive hover:bg-destructive/90 text-xl py-7">
                        <Icon name="X" size={24} className="mr-2" />
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
