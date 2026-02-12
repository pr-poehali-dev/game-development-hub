export type Question = {
  question: string;
  answer: string;
  points: number;
  answered: boolean;
  special?: 'cat' | 'hint' | 'double' | 'bonus';
  image?: string;
  hint?: string;
};

export type Category = {
  name: string;
  questions: Question[];
};

export type FinalQuestion = {
  theme: string;
  question: string;
  answer: string;
};

export type GameLevel = 'easy' | 'medium' | 'hard';

export const GAME_DATA: Record<GameLevel, { round1: Category[]; round2: Category[]; final: FinalQuestion[] }> = {
  easy: {
    round1: [
      {
        name: 'Эмодзи',
        questions: [
          { question: 'Угадай песню по эмодзи', answer: 'Зеленоглазое такси', points: 100, answered: false, image: 'https://cdn.poehali.dev/files/35a9508f-ca7e-44e1-a74a-805e135a593f.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Ветер с моря дул', points: 200, answered: false, image: 'https://cdn.poehali.dev/files/82559d48-084a-4b14-b382-8007c5aa4bbe.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Солнце Монако', points: 300, answered: false, image: 'https://cdn.poehali.dev/files/b18a1049-6486-4296-8547-c1f9a1179957.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Прованс', points: 400, answered: false, image: 'https://cdn.poehali.dev/files/ec73c64a-0776-48b1-bc46-c47b7427e660.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Знаешь ли ты', points: 500, answered: false, image: 'https://cdn.poehali.dev/files/f489bc31-87bf-4e63-81b0-93919aed6026.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Районы кварталы', points: 0, answered: false, image: 'https://cdn.poehali.dev/files/a7b64841-fa1f-4122-90c0-7a8b0c33b4a1.png', special: 'bonus' },
          { question: 'Угадай песню по эмодзи', answer: 'Белые ночи', points: 0, answered: false, image: 'https://cdn.poehali.dev/files/e340afac-d3df-47dd-a43d-10869a4282e6.png', special: 'bonus' },
        ],
      },
      {
        name: 'Кино и мультфильмы',
        questions: [
          { question: 'Как зовут главного героя в фильме "Форрест Гамп"?', answer: 'Форрест Гамп', points: 100, answered: false },
          { question: 'В каком мультфильме есть король Джулиан и пингвины?', answer: 'Мадагаскар', points: 200, answered: false },
          { question: 'Какой актер сыграл Тони Старка в фильмах Marvel?', answer: 'Роберт Дауни-младший', points: 300, answered: false },
          { question: 'Как называется фильм о школе волшебников, где есть профессор Дамблдор?', answer: 'Гарри Поттер', points: 400, answered: false, special: 'cat' },
          { question: 'Как зовут героя ДиКаприо в фильме "Выживший"?', answer: 'Хью Гласс', points: 500, answered: false },
        ],
      },
      {
        name: 'Животные',
        questions: [
          { question: 'Какое животное изображено на логотипе браузера Firefox?', answer: 'Красная лиса', points: 100, answered: false },
          { question: 'Какая птица является символом мудрости?', answer: 'Сова', points: 200, answered: false },
          { question: 'Какое животное самое быстрое на суше?', answer: 'Гепард', points: 300, answered: false },
          { question: 'Какое морское млекопитающее поет песни?', answer: 'Горбатый кит', points: 400, answered: false },
          { question: 'Какое животное может менять цвет кожи?', answer: 'Хамелеон', points: 500, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'География',
        questions: [
          { question: 'Какой город называют "Северной Венецией"?', answer: 'Санкт-Петербург', points: 100, answered: false },
          { question: 'На территории скольких стран находятся Альпы?', answer: '8 стран', points: 200, answered: false },
          { question: 'Какой водопад самый широкий в мире?', answer: 'Кон, Камбоджа', points: 300, answered: false },
          { question: 'Какая пустыня самая холодная?', answer: 'Антарктическая пустыня', points: 400, answered: false },
          { question: 'Какой пролив соединяет Тихий и Атлантический океаны?', answer: 'Магелланов пролив', points: 500, answered: false },
        ],
      },
      {
        name: 'Еда и кулинария',
        questions: [
          { question: 'Из какой страны родом паэлья?', answer: 'Испания', points: 100, answered: false },
          { question: 'Какой напиток получают путем брожения винограда?', answer: 'Вино', points: 200, answered: false },
          { question: 'Какая специя самая дорогая в мире?', answer: 'Шафран', points: 300, answered: false },
          { question: 'В какой стране изобрели майонез?', answer: 'Франция', points: 400, answered: false, special: 'cat' },
          { question: 'Какой овощ называют "перуанским яблоком"?', answer: 'Помидор', points: 500, answered: false },
        ],
      },
      {
        name: 'Спорт и игры',
        questions: [
          { question: 'Сколько игроков в баскетбольной команде на площадке?', answer: '5', points: 100, answered: false },
          { question: 'В какой стране впервые провели Олимпийские игры?', answer: 'Греция', points: 200, answered: false },
          { question: 'Какой вид спорта включает в себя "парантеллу"?', answer: 'Фигурное катание', points: 300, answered: false },
          { question: 'Какой шахматный ход самый короткий?', answer: 'Детский мат', points: 400, answered: false },
          { question: 'В какой стране родился футбол?', answer: 'Англия', points: 500, answered: false },
        ],
      },
      {
        name: 'Литература и сказки',
        questions: [
          { question: 'Кто написал "Робинзона Крузо"?', answer: 'Даниэль Дефо', points: 100, answered: false },
          { question: 'Сколько лет спала Спящая красавица?', answer: '100 лет', points: 200, answered: false },
          { question: 'Как звали кота в "Кота в сапогах"?', answer: 'Кот или просто Кот в сапогах', points: 300, answered: false },
          { question: 'В какой сказке есть "избушка на курьих ножках"?', answer: 'Баба Яга в русских сказках', points: 400, answered: false },
          { question: 'Кто автор "Винни-Пуха"?', answer: 'Алан Милн', points: 500, answered: false, special: 'cat' },
        ],
      },
    ],
    round2: [
      {
        name: 'Музыка',
        questions: [
          { question: 'На каком инструменте виртуозно играл Паганини?', answer: 'Скрипка', points: 200, answered: false },
          { question: 'Как называется коллектив из пяти музыкантов?', answer: 'Квинтет', points: 400, answered: false },
          { question: 'Кто спел хит "Белые розы"?', answer: 'Группа "Ласковый май"', points: 600, answered: false },
          { question: 'Какой группе принадлежит альбом "The Wall"?', answer: 'Pink Floyd', points: 800, answered: false, special: 'cat' },
          { question: 'Какой танец исполняется в балете "Щелкунчик"?', answer: 'Танец феи Драже', points: 1000, answered: false },
        ],
      },
      {
        name: 'Техника и изобретения',
        questions: [
          { question: 'Кто изобрел телефон?', answer: 'Александр Грэм Белл', points: 200, answered: false },
          { question: 'Какой год считается годом рождения интернета?', answer: '1983 год - переход на TCP/IP', points: 400, answered: false },
          { question: 'Что изобрели братья Люмьер?', answer: 'Кинематограф', points: 600, answered: false },
          { question: 'Как называется первая компьютерная мышь?', answer: 'Индикатор позиций x и y', points: 800, answered: false },
          { question: 'Кто создал первый программируемый компьютер?', answer: 'Чарльз Бэббидж', points: 1000, answered: false },
        ],
      },
      {
        name: 'Природа и экология',
        questions: [
          { question: 'Какое дерево самое высокое в мире?', answer: 'Секвойя', points: 200, answered: false },
          { question: 'Как называется самая большая жар-птица?', answer: 'Феникс - мифическая', points: 400, answered: false },
          { question: 'Какая планета известна как "Утренняя звезда"?', answer: 'Венера', points: 600, answered: false },
          { question: 'Как называется явление северного сияния?', answer: 'Аврора', points: 800, answered: false, special: 'cat' },
          { question: 'Как называется самое соленое озеро?', answer: 'Мертвое море', points: 1000, answered: false },
        ],
      },
      {
        name: 'Наука для начинающих',
        questions: [
          { question: 'Сколько планет в Солнечной системе?', answer: '8', points: 200, answered: false },
          { question: 'Что изучает астрономия?', answer: 'Небесные тела', points: 400, answered: false },
          { question: 'Как называется наука о растениях?', answer: 'Ботаника', points: 600, answered: false },
          { question: 'Сколько костей в теле взрослого человека?', answer: '206', points: 800, answered: false },
          { question: 'Какой газ необходим для дыхания?', answer: 'Кислород', points: 1000, answered: false },
        ],
      },
      {
        name: 'Искусство',
        questions: [
          { question: 'Кто написал картину "Бурлаки на Волге"?', answer: 'Илья Репин', points: 200, answered: false },
          { question: 'Как называется техника рисования по сырой штукатурке?', answer: 'Фреска', points: 400, answered: false },
          { question: 'Какой художник отрезал себе ухо?', answer: 'Винсент Ван Гог', points: 600, answered: false },
          { question: 'Что такое палитра?', answer: 'Доска для смешивания красок', points: 800, answered: false },
          { question: 'В каком музее хранится "Джоконда"?', answer: 'Лувр', points: 1000, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'История фактов',
        questions: [
          { question: 'Кто был первым президентом США?', answer: 'Джордж Вашингтон', points: 200, answered: false },
          { question: 'В каком году человек впервые полетел в космос?', answer: '1961', points: 400, answered: false },
          { question: 'Как звали первого царя из династии Романовых?', answer: 'Михаил Федорович', points: 600, answered: false },
          { question: 'Какой век называют "веком Просвещения"?', answer: 'XVIII век', points: 800, answered: false },
          { question: 'Кто открыл Америку?', answer: 'Христофор Колумб', points: 1000, answered: false },
        ],
      },
    ],
    final: [
      { theme: 'Кино', question: 'Какой фильм выиграл "Оскар" за лучший фильм в 1998 году?', answer: '"Титаник"' },
      { theme: 'Животные', question: 'Какая птица не умеет летать, но отлично плавает?', answer: 'Пингвин' },
      { theme: 'Музыка', question: 'На каком инструменте играл Вольфганг Амадей Моцарт?', answer: 'Фортепиано/скрипка' },
      { theme: 'Литература', question: 'Кто написал "Приключения Тома Сойера"?', answer: 'Марк Твен' },
      { theme: 'Спорт', question: 'Сколько игроков в волейбольной команде?', answer: '6' },
      { theme: 'История', question: 'Кто был первым человеком на Луне?', answer: 'Нил Армстронг' },
    ],
  },
  medium: {
    round1: [
      {
        name: 'Эмодзи',
        questions: [
          { question: 'Угадай песню по эмодзи', answer: 'Зеленоглазое такси', points: 100, answered: false, image: 'https://cdn.poehali.dev/files/35a9508f-ca7e-44e1-a74a-805e135a593f.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Ветер с моря дул', points: 200, answered: false, image: 'https://cdn.poehali.dev/files/82559d48-084a-4b14-b382-8007c5aa4bbe.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Солнце Монако', points: 300, answered: false, image: 'https://cdn.poehali.dev/files/b18a1049-6486-4296-8547-c1f9a1179957.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Прованс', points: 400, answered: false, image: 'https://cdn.poehali.dev/files/ec73c64a-0776-48b1-bc46-c47b7427e660.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Знаешь ли ты', points: 500, answered: false, image: 'https://cdn.poehali.dev/files/f489bc31-87bf-4e63-81b0-93919aed6026.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Районы кварталы', points: 0, answered: false, image: 'https://cdn.poehali.dev/files/a7b64841-fa1f-4122-90c0-7a8b0c33b4a1.png', special: 'bonus' },
          { question: 'Угадай песню по эмодзи', answer: 'Белые ночи', points: 0, answered: false, image: 'https://cdn.poehali.dev/files/e340afac-d3df-47dd-a43d-10869a4282e6.png', special: 'bonus' },
        ],
      },
      {
        name: 'Современная культура и тренды',
        questions: [
          { question: 'Что означает термин "флекс" в молодежном сленге?', answer: 'Показное хвастовство', points: 100, answered: false },
          { question: 'Как называется явление, когда алгоритмы создают "информационные пузыри"?', answer: 'Фильтрующий пузырь', points: 200, answered: false },
          { question: 'Что такое "криптовалюта"?', answer: 'Цифровая валюта на основе блокчейна', points: 300, answered: false, special: 'cat' },
          { question: 'Как называется поколение, родившееся между 1997 и 2012 годами?', answer: 'Поколение Z', points: 400, answered: false },
          { question: 'Что означает аббревиатура FIRE в финансовой независимости?', answer: 'Financial Independence, Retire Early', points: 500, answered: false },
        ],
      },
      {
        name: 'Кино и сериалы',
        questions: [
          { question: 'В каком фильме звучит фраза "Я - король мира!"?', answer: 'Титаник', points: 100, answered: false },
          { question: 'Какой сериал Netflix рассказывает о королеве в шахматах?', answer: 'Ход королевы', points: 200, answered: false },
          { question: 'Кто режиссер трилогии "Властелин колец"?', answer: 'Питер Джексон', points: 300, answered: false },
          { question: 'В каком фильме герой использует "неприступную тюрьму" для снов?', answer: 'Начало', points: 400, answered: false },
          { question: 'Как зовут главного антигероя в "Бойцовском клубе"?', answer: 'Тайлер Дерден', points: 500, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'География мира',
        questions: [
          { question: 'Какая страна состоит из более чем 17,000 островов?', answer: 'Индонезия', points: 100, answered: false },
          { question: 'Какой город является самой высокой столицей в мире?', answer: 'Ла-Пас, Боливия', points: 200, answered: false },
          { question: 'Какая река протекает через 10 стран Европы?', answer: 'Дунай', points: 300, answered: false },
          { question: 'На каком материке нет рек?', answer: 'Антарктида', points: 400, answered: false },
          { question: 'Какая страна имеет выход к Каспийскому морю?', answer: 'Россия, Казахстан, Туркменистан, Иран, Азербайджан', points: 500, answered: false },
        ],
      },
      {
        name: 'Биология и природа',
        questions: [
          { question: 'Какое животное имеет три сердца?', answer: 'Осьминог', points: 100, answered: false },
          { question: 'Как называется самый большой цветок в мире?', answer: 'Раффлезия', points: 200, answered: false },
          { question: 'Какое млекопитающее умеет летать?', answer: 'Летучая мышь', points: 300, answered: false },
          { question: 'Как называется процесс превращения гусеницы в бабочку?', answer: 'Метаморфоз', points: 400, answered: false },
          { question: 'Какое растение является символом Ирландии?', answer: 'Трилистник', points: 500, answered: false },
        ],
      },
      {
        name: 'Технологии и IT',
        questions: [
          { question: 'Что означает аббревиатура URL?', answer: 'Uniform Resource Locator', points: 100, answered: false },
          { question: 'Какой язык программирования создал Google?', answer: 'Go', points: 200, answered: false },
          { question: 'Что такое облачные вычисления?', answer: 'Предоставление компьютерных ресурсов через интернет', points: 300, answered: false },
          { question: 'Для чего используется Python в data science?', answer: 'Анализ данных и машинное обучение', points: 400, answered: false },
          { question: 'Как называется операционная система с пингвином-талисманом?', answer: 'Linux', points: 500, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'История и личности',
        questions: [
          { question: 'Кто был первым императором Рима?', answer: 'Октавиан Август', points: 100, answered: false },
          { question: 'В каком году была Куликовская битва?', answer: '1380', points: 200, answered: false },
          { question: 'Кто написал "Декларацию независимости США"?', answer: 'Томас Джефферсон', points: 300, answered: false },
          { question: 'Какой русский князь принял христианство?', answer: 'Владимир Красно Солнышко', points: 400, answered: false },
          { question: 'Кто изобрел печатный станок?', answer: 'Иоганн Гутенберг', points: 500, answered: false },
        ],
      },
    ],
    round2: [
      {
        name: 'Научные понятия',
        questions: [
          { question: 'Как называется наука о вселенной?', answer: 'Космология', points: 200, answered: false },
          { question: 'Что такое фотосинтез?', answer: 'Процесс образования органических веществ у растений', points: 400, answered: false },
          { question: 'Как называется самая маленькая частица вещества?', answer: 'Атом', points: 600, answered: false },
          { question: 'В честь какого ученого названа шкала температуры Цельсия?', answer: 'Андерс Цельсий', points: 800, answered: false, special: 'cat' },
          { question: 'Что такое гравитация?', answer: 'Сила притяжения между телами', points: 1000, answered: false, special: 'hint' },
        ],
      },
      {
        name: 'Музыкальные жанры и исполнители',
        questions: [
          { question: 'Какой жанр музыки создал Боб Марли?', answer: 'Регги', points: 200, answered: false },
          { question: 'Кто автор оперы "Кармен"?', answer: 'Жорж Бизе', points: 400, answered: false },
          { question: 'Как называется коллектив из 9 музыкантов?', answer: 'Нонет', points: 600, answered: false },
          { question: 'Какой певец известен альбомом "25"?', answer: 'Адель', points: 800, answered: false },
          { question: 'Кто написал музыку к фильму "Пираты Карибского моря"?', answer: 'Клаус Бадельт', points: 1000, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'Мировая литература',
        questions: [
          { question: 'Кто написал "Сто лет одиночества"?', answer: 'Габриэль Гарсиа Маркес', points: 200, answered: false },
          { question: 'Как звали слугу Дон Кихота?', answer: 'Санчо Панса', points: 400, answered: false },
          { question: 'Кто автор "Трех мушкетеров"?', answer: 'Александр Дюма', points: 600, answered: false },
          { question: 'В какой стране родился Шекспир?', answer: 'Англия', points: 800, answered: false },
          { question: 'Как называется роман-антиутопия Замятина?', answer: '"Мы"', points: 1000, answered: false },
        ],
      },
      {
        name: 'Экономика и финансы',
        questions: [
          { question: 'Что такое инфляция?', answer: 'Рост общего уровня цен', points: 200, answered: false },
          { question: 'Кто основал компанию SpaceX?', answer: 'Илон Маск', points: 400, answered: false },
          { question: 'Что такое диверсификация в инвестициях?', answer: 'Распределение средств между разными активами', points: 600, answered: false, special: 'cat' },
          { question: 'Какая валюта является резервной в мире?', answer: 'Доллар США', points: 800, answered: false },
          { question: 'Что такое ВВП на душу населения?', answer: 'Валовой продукт, разделенный на количество жителей', points: 1000, answered: false },
        ],
      },
      {
        name: 'Архитектура и живопись',
        questions: [
          { question: 'Кто спроектировал Эйфелеву башню?', answer: 'Гюстав Эйфель', points: 200, answered: false },
          { question: 'В каком стиле построен Собор Василия Блаженного?', answer: 'Шатровый стиль', points: 400, answered: false },
          { question: 'Какой художник основал кубизм?', answer: 'Пабло Пикассо', points: 600, answered: false },
          { question: 'Где находится статуя Христа-Искупителя?', answer: 'Рио-де-Жанейро', points: 800, answered: false },
          { question: 'Кто автор фрески "Сотворение Адама"?', answer: 'Микеланджело', points: 1000, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'Спорт и рекорды',
        questions: [
          { question: 'Какой вид спорта включает тур де Франс?', answer: 'Велоспорт', points: 200, answered: false },
          { question: 'Кто выиграл больше всех титулов в теннисном Уимблдоне?', answer: 'Роджер Федерер - 8', points: 400, answered: false },
          { question: 'Как называется боевое искусство из Бразилии?', answer: 'Капоэйра', points: 600, answered: false },
          { question: 'В каком году проходила московская Олимпиада?', answer: '1980', points: 800, answered: false },
          { question: 'Какой спортсмен установил рекорд по голам в футболе?', answer: 'Криштиану Роналду или Пеле', points: 1000, answered: false },
        ],
      },
    ],
    final: [
      { theme: 'Наука', question: 'Какой ученый открыл закон всемирного тяготения?', answer: 'Исаак Ньютон' },
      { theme: 'Искусство', question: 'В каком городе находится музей Прадо?', answer: 'Мадрид' },
      { theme: 'География', question: 'Какая река самая длинная в мире?', answer: 'Амазонка или Нил' },
      { theme: 'Технологии', question: 'Кто основал компанию Microsoft?', answer: 'Билл Гейтс' },
      { theme: 'Литература', question: 'Какой русский писатель написал "Войну и мир"?', answer: 'Лев Толстой' },
      { theme: 'Культура', question: 'Какой фестиваль проходит в Рио-де-Жанейро?', answer: 'Карнавал' },
    ],
  },
  hard: {
    round1: [
      {
        name: 'Эмодзи',
        questions: [
          { question: 'Угадай песню по эмодзи', answer: 'Зеленоглазое такси', points: 100, answered: false, image: 'https://cdn.poehali.dev/files/35a9508f-ca7e-44e1-a74a-805e135a593f.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Ветер с моря дул', points: 200, answered: false, image: 'https://cdn.poehali.dev/files/82559d48-084a-4b14-b382-8007c5aa4bbe.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Солнце Монако', points: 300, answered: false, image: 'https://cdn.poehali.dev/files/b18a1049-6486-4296-8547-c1f9a1179957.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Прованс', points: 400, answered: false, image: 'https://cdn.poehali.dev/files/ec73c64a-0776-48b1-bc46-c47b7427e660.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Знаешь ли ты', points: 500, answered: false, image: 'https://cdn.poehali.dev/files/f489bc31-87bf-4e63-81b0-93919aed6026.png' },
          { question: 'Угадай песню по эмодзи', answer: 'Районы кварталы', points: 0, answered: false, image: 'https://cdn.poehali.dev/files/a7b64841-fa1f-4122-90c0-7a8b0c33b4a1.png', special: 'bonus' },
          { question: 'Угадай песню по эмодзи', answer: 'Белые ночи', points: 0, answered: false, image: 'https://cdn.poehali.dev/files/e340afac-d3df-47dd-a43d-10869a4282e6.png', special: 'bonus' },
        ],
      },
      {
        name: 'Современные научные концепции',
        questions: [
          { question: 'Что такое "эффект Даннинга-Крюгера"?', answer: 'Когнитивное искажение, когда некомпетентные люди переоценивают свои способности', points: 100, answered: false },
          { question: 'Как называется теория, согласно которой наблюдение влияет на наблюдаемое?', answer: 'Эффект наблюдателя в квантовой физике', points: 200, answered: false },
          { question: 'Что такое "темная материя"?', answer: 'Гипотетическая форма материи, не испускающая электромагнитного излучения', points: 300, answered: false, special: 'cat' },
          { question: 'Как называется процесс, при котором ИИ создает новые данные на основе обучения?', answer: 'Генеративное моделирование', points: 400, answered: false },
          { question: 'Что такое "квантовая запутанность"?', answer: 'Квантовомеханическое явление, при котором состояния частиц связаны', points: 500, answered: false },
        ],
      },
      {
        name: 'Артхаусное кино и режиссура',
        questions: [
          { question: 'Кто снял фильм "Сталкер"?', answer: 'Андрей Тарковский', points: 100, answered: false },
          { question: 'Какой режиссер известен использованием "трэвеллинга" в длинных планах?', answer: 'Микеланджело Антониони', points: 200, answered: false },
          { question: 'Фильм какого режиссера выиграл "Золотую пальмовую ветвь" в 2019 году?', answer: 'Бон Джун Хо - "Паразиты"', points: 300, answered: false },
          { question: 'Кто режиссер трилогии "Апокалипсис"?', answer: 'Фрэнсис Форд Коппола - "Апокалипсис сегодня"', points: 400, answered: false },
          { question: 'Какой фильм Дэвида Линча считается образцом сюрреализма?', answer: '"Малхолланд Драйв"', points: 500, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'Политическая география',
        questions: [
          { question: 'Какая страна имеет эксклав Калининградскую область?', answer: 'Россия', points: 100, answered: false },
          { question: 'Сколько стран входят в Шенгенскую зону?', answer: '26', points: 200, answered: false },
          { question: 'Какой город является административной столицей ЮАР?', answer: 'Претория', points: 300, answered: false },
          { question: 'На территории скольких стран протекает Амазонка?', answer: '9 стран', points: 400, answered: false },
          { question: 'Какая страна имеет самую длинную береговую линию?', answer: 'Канада', points: 500, answered: false },
        ],
      },
      {
        name: 'Биохимия и генетика',
        questions: [
          { question: 'Что расшифровывает аббревиатура ДНК?', answer: 'Дезоксирибонуклеиновая кислота', points: 100, answered: false },
          { question: 'Как называется процесс копирования ДНК?', answer: 'Репликация', points: 200, answered: false },
          { question: 'Что такое CRISPR-Cas9?', answer: 'Технология редактирования генома', points: 300, answered: false },
          { question: 'Какой орган человека производит инсулин?', answer: 'Поджелудочная железа', points: 400, answered: false },
          { question: 'Что такое митохондриальная Ева?', answer: 'Последний общий предок всех людей по материнской линии', points: 500, answered: false },
        ],
      },
      {
        name: 'Кибернетика и алгоритмы',
        questions: [
          { question: 'Что такое "машинное обучение без учителя"?', answer: 'Алгоритмы, находящие паттерны в неразмеченных данных', points: 100, answered: false },
          { question: 'Как называется задача о коммивояжере в теории графов?', answer: 'Задача нахождения кратчайшего пути', points: 200, answered: false },
          { question: 'Что такое "нейронная сеть с обратным распространением ошибки"?', answer: 'Алгоритм обучения нейросетей', points: 300, answered: false },
          { question: 'Как называется парадигма программирования, основанная на объектах?', answer: 'Объектно-ориентированное программирование', points: 400, answered: false },
          { question: 'Какой алгоритм лежит в основе Bitcoin?', answer: 'Proof-of-Work', points: 500, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'История философии',
        questions: [
          { question: 'Кто сказал "Я мыслю, следовательно, существую"?', answer: 'Рене Декарт', points: 100, answered: false },
          { question: 'Какой философ основал школу стоицизма?', answer: 'Зенон Китийский', points: 200, answered: false },
          { question: 'Кто автор работы "Так говорил Заратустра"?', answer: 'Фридрих Ницше', points: 300, answered: false },
          { question: 'Как называется главный труд Иммануила Канта?', answer: '"Критика чистого разума"', points: 400, answered: false },
          { question: 'Кто из философов был учителем Александра Македонского?', answer: 'Аристотель', points: 500, answered: false },
        ],
      },
    ],
    round2: [
      {
        name: 'Теоретическая физика',
        questions: [
          { question: 'Что такое "теория струн"?', answer: 'Теория, предполагающая, что элементарные частицы - это вибрирующие струны', points: 200, answered: false },
          { question: 'Кто сформулировал теорию относительности?', answer: 'Альберт Эйнштейн', points: 400, answered: false },
          { question: 'Что такое "квантовая суперпозиция"?', answer: 'Способность квантовой системы находиться в нескольких состояниях одновременно', points: 600, answered: false },
          { question: 'Как называется частица, переносящая электромагнитное взаимодействие?', answer: 'Фотон', points: 800, answered: false, special: 'cat' },
          { question: 'Что такое "энтропия" в термодинамике?', answer: 'Мера беспорядка системы', points: 1000, answered: false, special: 'hint' },
        ],
      },
      {
        name: 'Академическая музыка',
        questions: [
          { question: 'Кто написал "Времена года"?', answer: 'Антонио Вивальди', points: 200, answered: false },
          { question: 'Какой композитор был глухим?', answer: 'Людвиг ван Бетховен', points: 400, answered: false },
          { question: 'Что такое "контрапункт" в музыке?', answer: 'Одновременное сочетание независимых мелодий', points: 600, answered: false },
          { question: 'Кто автор балета "Весна священная"?', answer: 'Игорь Стравинский', points: 800, answered: false },
          { question: 'Какой русский композитор написал оперу "Князь Игорь"?', answer: 'Александр Бородин', points: 1000, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'Постмодернистская литература',
        questions: [
          { question: 'Кто написал "Хазарский словарь"?', answer: 'Милорад Павич', points: 200, answered: false },
          { question: 'Какой автор использовал технику "потока сознания" в "Улиссе"?', answer: 'Джеймс Джойс', points: 400, answered: false },
          { question: 'Кто автор "Бледного огня"?', answer: 'Владимир Набоков', points: 600, answered: false },
          { question: 'Как называется роман Умберто Эко о монастырской библиотеке?', answer: '"Имя розы"', points: 800, answered: false },
          { question: 'Кто написал "Гаргантюа и Пантагрюэль"?', answer: 'Франсуа Рабле', points: 1000, answered: false },
        ],
      },
      {
        name: 'Макроэкономика',
        questions: [
          { question: 'Что такое "кривая Лаффера"?', answer: 'Графическая зависимость налоговых поступлений от налоговой ставки', points: 200, answered: false },
          { question: 'Кто автор "Богатства народов"?', answer: 'Адам Смит', points: 400, answered: false },
          { question: 'Что такое "паритет покупательной способности"?', answer: 'Сравнение валют через стоимость корзины товаров', points: 600, answered: false, special: 'cat' },
          { question: 'Как называется экономическая школа, отрицающая государственное вмешательство?', answer: 'Австрийская школа', points: 800, answered: false },
          { question: 'Что такое "деривативы" в финансах?', answer: 'Финансовые инструменты, основанные на других активах', points: 1000, answered: false },
        ],
      },
      {
        name: 'Современное искусство',
        questions: [
          { question: 'Кто создал "Фонтан" - писсуар как произведение искусства?', answer: 'Марсель Дюшан', points: 200, answered: false },
          { question: 'Как называется художественное направление, к которому относится Энди Уорхол?', answer: 'Поп-арт', points: 400, answered: false },
          { question: 'Кто автор инсталляции "Абсолютная пустота"?', answer: 'Яёи Кусама', points: 600, answered: false },
          { question: 'Какой художник известен "живыми картинами" из людей?', answer: 'Сэнди Скогланд', points: 800, answered: false },
          { question: 'Кто создал перформанс "Ритм 0"?', answer: 'Марина Абрамович', points: 1000, answered: false, special: 'cat' },
        ],
      },
      {
        name: 'Научные открытия',
        questions: [
          { question: 'Кто открыл структуру ДНК?', answer: 'Джеймс Уотсон и Фрэнсис Крик', points: 200, answered: false },
          { question: 'Что открыл Майкл Фарадей?', answer: 'Электромагнитную индукцию', points: 400, answered: false },
          { question: 'Кто сформулировал законы наследственности?', answer: 'Грегор Мендель', points: 600, answered: false },
          { question: 'Какой ученый открыл радиоактивность?', answer: 'Анри Беккерель', points: 800, answered: false },
          { question: 'Кто доказал, что Земля вращается вокруг Солнца?', answer: 'Николай Коперник', points: 1000, answered: false },
        ],
      },
    ],
    final: [
      { theme: 'Философия', question: 'Кто автор "Государства"?', answer: 'Платон' },
      { theme: 'Физика', question: 'Как называется элементарная частица, придающая массу другим частицам?', answer: 'Бозон Хиггса' },
      { theme: 'Литература', question: 'Кто написал "Улисса"?', answer: 'Джеймс Джойс' },
      { theme: 'Биология', question: 'Как называется наука о древних вымерших организмах?', answer: 'Палеонтология' },
      { theme: 'Экономика', question: 'Кто автор "Капитала"?', answer: 'Карл Маркс' },
      { theme: 'Искусство', question: 'В каком стиле написана "Герника" Пикассо?', answer: 'Кубизм' },
    ],
  },
};