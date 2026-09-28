import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  EmployerProfile,
  Vacancy,
  Application,
  Project,
  Review,
  Deal,
  ChatMessage,
  StudentTab,
  EmployerTab,
} from '../types';
import { maxBridge } from '../services/maxBridge';

// Initial Seed Data
const SEED_USERS: User[] = [
  {
    id: 'student-1',
    role: 'student',
    email: 'alex@bmstu.ru',
    passwordHash: 'pass123',
    name: 'Александр Иванов',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'student-2',
    role: 'student',
    email: 'kate@hse.ru',
    passwordHash: 'pass123',
    name: 'Екатерина Смирнова',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'employer-1',
    role: 'employer',
    email: 'lead@vktech.ru',
    passwordHash: 'pass123',
    name: 'VK Tech Studio',
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'employer-2',
    role: 'employer',
    email: 'hr@digital-retail.ru',
    passwordHash: 'pass123',
    name: 'Цифровой Ритейл',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-25T09:30:00Z',
  },
];

const SEED_STUDENT_PROFILES: Record<string, StudentProfile> = {
  'student-1': {
    userId: 'student-1',
    fullName: 'Александр Иванов',
    age: 21,
    university: 'МГТУ им. Н.Э. Баумана (ИУ-7, 3 курс)',
    city: 'Москва',
    experience: '2 года пет-проектов и фриланса на React & TypeScript',
    sphere: 'IT & Веб-разработка',
    about: 'Разрабатываю быстрые и адаптивные Mini Apps для МАХ и Telegram. Люблю чистый код, Tailwind CSS, готов брать сложные задачи за адекватные деньги ради опыта и реального портфолио.',
    softSkills: ['Внимание к ТЗ', 'Соблюдение дедлайнов', 'Командная работа', 'Быстрая обучаемость'],
    hardSkills: ['React', 'TypeScript', 'MAX SDK', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Git'],
    caseLinks: [
      { id: '1', title: 'GitHub: Mini-App-Cart-MAX', url: 'https://github.com/alex-dev/max-cart', platform: 'github' },
      { id: '2', title: 'Demo: СБП Платёжный виджет', url: 'https://max-sbp-demo.ru', platform: 'website' },
      { id: '3', title: 'Behance: Мобильный UI для доставки', url: 'https://behance.net/gallery/max-ui', platform: 'behance' },
    ],
    certificates: [
      { id: 'c1', title: 'Frontend Developer PRO 2025', issuer: 'Яндекс Практикум', year: '2025' },
      { id: 'c2', title: 'VK Mini Apps & Bot Architect', issuer: 'VK Education', year: '2026' },
    ],
    completedProjectsCount: 4,
    rating: 5.0,
    reviewsCount: 3,
  },
  'student-2': {
    userId: 'student-2',
    fullName: 'Екатерина Смирнова',
    age: 20,
    university: 'НИУ ВШЭ (Факультет креативных индустрий)',
    city: 'Санкт-Петербург',
    experience: '1.5 года продуктового UI/UX дизайна мобильных интерфейсов',
    sphere: 'Дизайн и UI/UX',
    about: 'Создаю удобные, эстетичные и конверсионные мобильные интерфейсы под стандарты МАХ и Telegram. Провожу пользовательские интервью, собираю интерактивные прототипы в Figma.',
    softSkills: ['Эмпатия к пользователю', 'Презентация макетов', 'Пунктуальность'],
    hardSkills: ['Figma', 'UI/UX Mobile Guidelines', 'Design Systems', 'Design Tokens', 'Prototyping'],
    caseLinks: [
      { id: '1', title: 'Figma Community: MAX UI Kit', url: 'https://figma.com/@kate-ux', platform: 'website' },
      { id: '2', title: 'Behance: Кейс Fintech Banking App', url: 'https://behance.net/kate-fintech', platform: 'behance' },
    ],
    certificates: [
      { id: 'c1', title: 'UX Research & Mobile Patterns', issuer: 'Skillbox', year: '2025' },
    ],
    completedProjectsCount: 2,
    rating: 4.9,
    reviewsCount: 2,
  },
};

const SEED_EMPLOYER_PROFILES: Record<string, EmployerProfile> = {
  'employer-1': {
    userId: 'employer-1',
    companyName: 'VK Tech Studio',
    contactPerson: 'Дмитрий Соколов (Team Lead)',
    sphere: 'IT & Digital разработка',
    city: 'Москва',
    inn: '7743013902',
    website: 'https://vk.company/tech',
    description: 'Инновационная продуктовая студия. Создаем сервисы и мини-приложения нового поколения для российской экосистемы МАХ и VK. Активно привлекаем талантливых бауманцев и студентов ВШЭ к реальным кейсам.',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 5,
  },
  'employer-2': {
    userId: 'employer-2',
    companyName: 'Цифровой Ритейл',
    contactPerson: 'Ольга Романова',
    sphere: 'E-commerce & Ритейл',
    city: 'Санкт-Петербург',
    inn: '7810394012',
    website: 'https://digital-retail-spb.ru',
    description: 'Федеральная сеть розничных магазинов. Запускаем витрину онлайн-заказов в новом российском мессенджере МАХ.',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 3,
  },
};

const SEED_VACANCIES: Vacancy[] = [
  {
    id: 'vac-1',
    employerId: 'employer-1',
    companyName: 'VK Tech Studio',
    city: 'Москва',
    title: 'Разработка каталога товаров в Mini App МАХ',
    sphere: 'IT & Веб-разработка',
    description: 'Требуется разработать мобильное веб-приложение каталога на React + Tailwind. Необходима поддержка темной/светлой темы через MAX SDK, корзина с локальным сохранением и интеграция быстрого оформления заказа по СБП.',
    budget: 45000,
    format: 'Удаленно',
    deadline: '2026-10-15',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'MAX SDK', 'REST API'],
    status: 'active',
    responsesCount: 3,
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'vac-2',
    employerId: 'employer-2',
    companyName: 'Цифровой Ритейл',
    city: 'Санкт-Петербург',
    title: 'UI/UX дизайн витрины и чекаута для мессенджера',
    sphere: 'Дизайн и UI/UX',
    description: 'Ищем студента-дизайнера для подготовки дизайн-макетов мобильного магазина в Figma. 8 экранов (главная, карточка, корзина, успешная оплата), использование официальных компонентов MAX UI и гайдлайнов мобильного UX.',
    budget: 28000,
    format: 'Удаленно',
    deadline: '2026-10-05',
    requiredSkills: ['Figma', 'UI/UX', 'Mobile Design', 'Design System'],
    status: 'active',
    responsesCount: 2,
    createdAt: '2026-09-22T14:30:00Z',
  },
  {
    id: 'vac-3',
    employerId: 'employer-1',
    companyName: 'VK Tech Studio',
    city: 'Москва',
    title: 'Бэкенд сервис авторизации initData на Node.js Fastify',
    sphere: 'IT & Веб-разработка',
    description: 'Написать микросервис проверки HMAC-SHA256 подписи initData из MAX SDK, выдачи JWT токена и сохранения пользователей в PostgreSQL. Тесты и OpenAPI документация.',
    budget: 35000,
    format: 'Удаленно',
    deadline: '2026-10-20',
    requiredSkills: ['Node.js', 'Fastify / Express', 'PostgreSQL', 'Crypto HMAC'],
    status: 'active',
    responsesCount: 1,
    createdAt: '2026-09-24T11:00:00Z',
  },
  {
    id: 'vac-4',
    employerId: 'employer-2',
    companyName: 'Цифровой Ритейл',
    city: 'Москва',
    title: 'Парсинг каталога и подготовка структуры данных',
    sphere: 'Анализ данных & Python',
    description: 'Написать скрипт на Python для сбора цен и остатков конкурентов, нормализация в PostgreSQL с генерацией JSON для мобильного приложения.',
    budget: 22000,
    format: 'Удаленно',
    deadline: '2026-10-12',
    requiredSkills: ['Python', 'BeautifulSoup', 'PostgreSQL', 'Pandas'],
    status: 'active',
    responsesCount: 0,
    createdAt: '2026-09-26T16:00:00Z',
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    vacancyId: 'vac-1',
    studentId: 'student-1',
    studentName: 'Александр Иванов',
    studentUniversity: 'МГТУ им. Баумана',
    studentRating: 5.0,
    coverLetter: 'Здравствуйте! Готов выполнить задачу качественно. Имею готовый шаблон Mini App под МАХ с настроенным MAX SDK и Tailwind. Сдам проект за 7 дней.',
    proposedPrice: 45000,
    deliveryDays: 7,
    status: 'in_chat',
    createdAt: '2026-09-21T11:20:00Z',
  },
  {
    id: 'app-2',
    vacancyId: 'vac-2',
    studentId: 'student-2',
    studentName: 'Екатерина Смирнова',
    studentUniversity: 'НИУ ВШЭ',
    studentRating: 4.9,
    coverLetter: 'Добрый день! Специализируюсь на мобильных UI/UX интерфейсах. Подготовлю кликабельный прототип в Figma строго по гайдлайну МАХ за 5 дней.',
    proposedPrice: 28000,
    deliveryDays: 5,
    status: 'viewed',
    createdAt: '2026-09-23T15:00:00Z',
  },
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Виджет проверки баланса для чат-бота МАХ',
    clientName: 'Финтех Лаб',
    studentId: 'student-1',
    employerId: 'employer-1',
    amount: 32000,
    completedDate: '18 сентября 2026',
    description: 'Разработан легковесный SPA виджет для отображения счета и последних списаний в чат-боте МАХ.',
    externalUrl: 'https://github.com/alex-dev/fintech-widget',
    rating: 5,
    reviewText: 'Александр выполнил кейс с опережением дедлайна. Чистый код, отличная адаптация под iOS и Android клиенты МАХ. Рекомендуем!',
    isManual: false,
  },
  {
    id: 'proj-2',
    title: 'Telegram Mini App для кофейни',
    clientName: 'Coffee Point',
    studentId: 'student-1',
    amount: 18000,
    completedDate: '10 августа 2026',
    description: 'Интерактивное меню напитков и программа лояльности с QR-кодом для бариста.',
    externalUrl: 'https://coffee-demo.ru',
    rating: 5,
    reviewText: 'Прекрасная работа, все работает стабильно, клиенты довольны.',
    isManual: true,
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorId: 'employer-1',
    authorName: 'VK Tech Studio',
    authorRole: 'employer',
    targetId: 'student-1',
    targetRole: 'student',
    rating: 5,
    projectName: 'Виджет проверки баланса для чат-бота МАХ',
    date: '18 сентября 2026',
    text: 'Отличный разработчик! Быстро вник в требования MAX SDK, реализовал haptic feedback и корректный адаптив под safe-area смартфонов. Будем привлекать еще!',
    replyText: 'Спасибо за интересный кейс и четкое ТЗ! Рад сотрудничеству.',
  },
  {
    id: 'rev-2',
    authorId: 'employer-2',
    authorName: 'Цифровой Ритейл',
    authorRole: 'employer',
    targetId: 'student-1',
    targetRole: 'student',
    rating: 5,
    projectName: 'Парсер каталога поставщиков',
    date: '28 августа 2026',
    text: 'Студент с Бауманки сделал надежный скрипт, автоматизировал выгрузку остатков.',
  },
  {
    id: 'rev-3',
    authorId: 'student-1',
    authorName: 'Александр Иванов',
    authorRole: 'student',
    targetId: 'employer-1',
    targetRole: 'employer',
    rating: 5,
    projectName: 'Виджет проверки баланса для чат-бота МАХ',
    date: '19 сентября 2026',
    text: 'Заказчик всегда на связи, оплата по СБП поступила сразу после утверждения задачи. Очень комфортный опыт.',
  },
];

const SEED_DEALS: Deal[] = [
  {
    id: 'deal-1',
    vacancyId: 'vac-1',
    vacancyTitle: 'Разработка каталога товаров в Mini App МАХ',
    studentId: 'student-1',
    studentName: 'Александр Иванов',
    employerId: 'employer-1',
    employerName: 'VK Tech Studio',
    stage: 'negotiation',
    agreedAmount: 45000,
    createdAt: '2026-09-21T11:30:00Z',
    updatedAt: '2026-09-21T11:30:00Z',
  },
];

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    chatId: 'deal-1',
    senderId: 'system',
    senderRole: 'student',
    text: '👋 Создан безопасный чат по кейсу «Разработка каталога товаров в Mini App МАХ». Стороны могут обсудить детали ТЗ, сроки и бюджет.',
    type: 'system',
    timestamp: '21 сент, 11:30',
  },
  {
    id: 'msg-2',
    chatId: 'deal-1',
    senderId: 'student-1',
    senderRole: 'student',
    text: 'Здравствуйте! Готов обсудить архитектуру каталога. Рекомендую использовать React 19 + Tailwind v4 и сборку на Vite для моментальной загрузки в WebView мессенджера.',
    type: 'text',
    timestamp: '21 сент, 11:32',
  },
  {
    id: 'msg-3',
    chatId: 'deal-1',
    senderId: 'employer-1',
    senderRole: 'employer',
    text: 'Привет, Александр! Отличная идея. Главное — чтобы карточки адаптировались под экран смартфона и работала нативная кнопка «Назад» через MAX Bridge. Готовы начинать, подтверждаем сумму 45 000 ₽.',
    type: 'text',
    timestamp: '21 сент, 11:35',
  },
];

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  studentProfile: StudentProfile | null;
  employerProfile: EmployerProfile | null;
  studentTab: StudentTab;
  employerTab: EmployerTab;
  vacancies: Vacancy[];
  applications: Application[];
  projects: Project[];
  reviews: Review[];
  deals: Deal[];
  messages: ChatMessage[];
  activeDealId: string | null;
  previewStudentId: string | null;
  isDeployGuideOpen: boolean;

  // Actions
  setStudentTab: (tab: StudentTab) => void;
  setEmployerTab: (tab: EmployerTab) => void;
  quickLogin: (userId: string) => void;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  registerStudent: (data: { name: string; email: string; pass: string }) => { success: boolean; message?: string };
  registerEmployer: (data: { name: string; companyName: string; email: string; pass: string; inn?: string }) => { success: boolean; message?: string };
  logout: () => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateEmployerProfile: (profile: Partial<EmployerProfile>) => void;
  createVacancy: (data: Omit<Vacancy, 'id' | 'employerId' | 'companyName' | 'responsesCount' | 'createdAt'>) => void;
  updateVacancyStatus: (vacancyId: string, status: Vacancy['status']) => void;
  duplicateVacancy: (vacancyId: string) => void;
  deleteVacancy: (vacancyId: string) => void;
  applyToVacancy: (vacancyId: string, coverLetter: string, proposedPrice: number, deliveryDays: number) => { success: boolean; message?: string };
  openChatForApplication: (app: Application) => void;
  openChatForDeal: (dealId: string) => void;
  closeChat: () => void;
  sendMessage: (dealId: string, text: string, type?: ChatMessage['type'], metadata?: ChatMessage['metadata']) => void;
  agreeDeal: (dealId: string) => void;
  sendRequisites: (dealId: string, requisites: { bankName: string; recipientPhone: string; cardNumber?: string; note?: string }) => void;
  confirmPayment: (dealId: string) => void;
  leaveReview: (dealId: string, rating: number, text: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;
  addManualProject: (proj: Omit<Project, 'id' | 'studentId' | 'isManual'>) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message?: string };
  setPreviewStudentId: (id: string | null) => void;
  setIsDeployGuideOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('max_cases_user');
    return saved ? JSON.parse(saved) : SEED_USERS[0]; // Default logged in as Student Александр for immediate review
  });

  const [studentTab, setStudentTab] = useState<StudentTab>('vacancies');
  const [employerTab, setEmployerTab] = useState<EmployerTab>('tasks');

  const [studentProfiles, setStudentProfiles] = useState<Record<string, StudentProfile>>(() => {
    const saved = localStorage.getItem('max_student_profiles');
    return saved ? JSON.parse(saved) : SEED_STUDENT_PROFILES;
  });

  const [employerProfiles, setEmployerProfiles] = useState<Record<string, EmployerProfile>>(() => {
    const saved = localStorage.getItem('max_employer_profiles');
    return saved ? JSON.parse(saved) : SEED_EMPLOYER_PROFILES;
  });

  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem('max_vacancies');
    return saved ? JSON.parse(saved) : SEED_VACANCIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('max_applications');
    return saved ? JSON.parse(saved) : SEED_APPLICATIONS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('max_projects');
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('max_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('max_deals');
    return saved ? JSON.parse(saved) : SEED_DEALS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('max_messages');
    return saved ? JSON.parse(saved) : SEED_MESSAGES;
  });

  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [previewStudentId, setPreviewStudentId] = useState<string | null>(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('max_cases_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('max_cases_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('max_student_profiles', JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem('max_employer_profiles', JSON.stringify(employerProfiles));
  }, [employerProfiles]);

  useEffect(() => {
    localStorage.setItem('max_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('max_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('max_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('max_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('max_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('max_messages', JSON.stringify(messages));
  }, [messages]);

  const currentRole = currentUser?.role || null;
  const studentProfile = currentUser && currentUser.role === 'student' ? studentProfiles[currentUser.id] || null : null;
  const employerProfile = currentUser && currentUser.role === 'employer' ? employerProfiles[currentUser.id] || null : null;

  // Quick Switcher for testing all perspectives
  const quickLogin = (userId: string) => {
    const user = SEED_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      maxBridge.haptic('medium');
      if (user.role === 'student') {
        setStudentTab('vacancies');
      } else {
        setEmployerTab('tasks');
      }
    }
  };

  const login = (email: string, pass: string) => {
    const user = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Пользователь с таким email не найден.' };
    }
    if (user.passwordHash !== pass) {
      return { success: false, message: 'Неверный пароль.' };
    }
    setCurrentUser(user);
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const registerStudent = ({ name, email, pass }: { name: string; email: string; pass: string }) => {
    const existing = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Этот email уже зарегистрирован.' };
    }
    const newId = `student-${Date.now()}`;
    const newUser: User = {
      id: newId,
      role: 'student',
      email,
      passwordHash: pass,
      name,
      createdAt: new Date().toISOString(),
    };
    const newProfile: StudentProfile = {
      userId: newId,
      fullName: name,
      age: 20,
      university: 'ВУЗ не указан',
      city: 'Москва',
      experience: 'Начинающий специалист',
      sphere: 'IT & Веб-разработка',
      about: 'Студент, мотивирован решать интересные проектные задачи.',
      softSkills: ['Ответственность', 'Дедлайны'],
      hardSkills: ['HTML', 'CSS', 'JavaScript'],
      caseLinks: [],
      certificates: [],
      completedProjectsCount: 0,
      rating: 5.0,
      reviewsCount: 0,
    };
    SEED_USERS.push(newUser);
    setStudentProfiles((prev) => ({ ...prev, [newId]: newProfile }));
    setCurrentUser(newUser);
    setStudentTab('profile');
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const registerEmployer = ({
    name,
    companyName,
    email,
    pass,
    inn,
  }: {
    name: string;
    companyName: string;
    email: string;
    pass: string;
    inn?: string;
  }) => {
    const existing = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Этот email уже зарегистрирован.' };
    }
    const newId = `employer-${Date.now()}`;
    const newUser: User = {
      id: newId,
      role: 'employer',
      email,
      passwordHash: pass,
      name: companyName,
      createdAt: new Date().toISOString(),
    };
    const newProfile: EmployerProfile = {
      userId: newId,
      companyName,
      contactPerson: name,
      sphere: 'IT & Digital',
      city: 'Москва',
      inn: inn || '',
      website: '',
      description: 'Компания на бирже МАХ Кейсы.',
      rating: 5.0,
      reviewsCount: 0,
    };
    SEED_USERS.push(newUser);
    setEmployerProfiles((prev) => ({ ...prev, [newId]: newProfile }));
    setCurrentUser(newUser);
    setEmployerTab('tasks');
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveDealId(null);
    maxBridge.haptic('light');
  };

  const updateStudentProfile = (data: Partial<StudentProfile>) => {
    if (!currentUser || currentUser.role !== 'student') return;
    setStudentProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...(prev[currentUser.id] || {}),
        ...data,
      },
    }));
    maxBridge.hapticNotification('success');
  };

  const updateEmployerProfile = (data: Partial<EmployerProfile>) => {
    if (!currentUser || currentUser.role !== 'employer') return;
    setEmployerProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...(prev[currentUser.id] || {}),
        ...data,
      },
    }));
    maxBridge.hapticNotification('success');
  };

  const createVacancy = (
    data: Omit<Vacancy, 'id' | 'employerId' | 'companyName' | 'responsesCount' | 'createdAt'>
  ) => {
    if (!currentUser || currentUser.role !== 'employer') return;
    const newVac: Vacancy = {
      ...data,
      id: `vac-${Date.now()}`,
      employerId: currentUser.id,
      companyName: employerProfile?.companyName || currentUser.name,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVacancies((prev) => [newVac, ...prev]);
    maxBridge.hapticNotification('success');
  };

  const updateVacancyStatus = (vacancyId: string, status: Vacancy['status']) => {
    setVacancies((prev) =>
      prev.map((v) => (v.id === vacancyId ? { ...v, status } : v))
    );
    maxBridge.haptic('medium');
  };

  const duplicateVacancy = (vacancyId: string) => {
    const original = vacancies.find((v) => v.id === vacancyId);
    if (!original) return;
    const copy: Vacancy = {
      ...original,
      id: `vac-${Date.now()}`,
      title: `${original.title} (Копия)`,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVacancies((prev) => [copy, ...prev]);
    maxBridge.hapticNotification('success');
  };

  const deleteVacancy = (vacancyId: string) => {
    setVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
    maxBridge.haptic('medium');
  };

  const applyToVacancy = (
    vacancyId: string,
    coverLetter: string,
    proposedPrice: number,
    deliveryDays: number
  ) => {
    if (!currentUser || currentUser.role !== 'student') {
      return { success: false, message: 'Откликаться могут только студенты.' };
    }
    const alreadyApplied = applications.some(
      (a) => a.vacancyId === vacancyId && a.studentId === currentUser.id
    );
    if (alreadyApplied) {
      return { success: false, message: 'Вы уже откликнулись на эту вакансию.' };
    }

    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return { success: false, message: 'Вакансия не найдена.' };

    const newApp: Application = {
      id: `app-${Date.now()}`,
      vacancyId,
      studentId: currentUser.id,
      studentName: studentProfile?.fullName || currentUser.name,
      studentUniversity: studentProfile?.university || 'Студент',
      studentRating: studentProfile?.rating || 5.0,
      coverLetter,
      proposedPrice: proposedPrice || vacancy.budget,
      deliveryDays: deliveryDays || 7,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    setVacancies((prev) =>
      prev.map((v) =>
        v.id === vacancyId ? { ...v, responsesCount: v.responsesCount + 1 } : v
      )
    );

    // Also auto-prepare or link a deal for seamless chat
    const newDealId = `deal-${Date.now()}`;
    const newDeal: Deal = {
      id: newDealId,
      vacancyId,
      vacancyTitle: vacancy.title,
      studentId: currentUser.id,
      studentName: studentProfile?.fullName || currentUser.name,
      employerId: vacancy.employerId,
      employerName: vacancy.companyName,
      stage: 'negotiation',
      agreedAmount: proposedPrice || vacancy.budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDeals((prev) => [newDeal, ...prev]);

    // Add first system message and student's cover letter into the chat
    const initialMsgs: ChatMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        chatId: newDealId,
        senderId: 'system',
        senderRole: 'student',
        text: `🎓 Студент ${currentUser.name} откликнулся на задачу «${vacancy.title}» за ${proposedPrice || vacancy.budget} ₽ (срок: ${deliveryDays} дней).`,
        type: 'system',
        timestamp: 'Только что',
      },
      {
        id: `msg-${Date.now()}-2`,
        chatId: newDealId,
        senderId: currentUser.id,
        senderRole: 'student',
        text: coverLetter || 'Здравствуйте! Готов взяться за выполнение данного проекта.',
        type: 'text',
        timestamp: 'Только что',
      },
    ];
    setMessages((prev) => [...prev, ...initialMsgs]);

    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const openChatForApplication = (app: Application) => {
    // Find or create deal
    let deal = deals.find(
      (d) => d.vacancyId === app.vacancyId && d.studentId === app.studentId
    );
    if (!deal) {
      const vacancy = vacancies.find((v) => v.id === app.vacancyId);
      const newDealId = `deal-${Date.now()}`;
      deal = {
        id: newDealId,
        vacancyId: app.vacancyId,
        vacancyTitle: vacancy?.title || 'Проект',
        studentId: app.studentId,
        studentName: app.studentName,
        employerId: vacancy?.employerId || currentUser?.id || 'employer-1',
        employerName: vacancy?.companyName || 'Заказчик',
        stage: 'negotiation',
        agreedAmount: app.proposedPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDeals((prev) => [deal!, ...prev]);
    }
    // Update app status to in_chat if was sent/viewed
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'in_chat' } : a))
    );
    setActiveDealId(deal.id);
    maxBridge.haptic('light');
  };

  const openChatForDeal = (dealId: string) => {
    setActiveDealId(dealId);
    maxBridge.haptic('light');
  };

  const closeChat = () => {
    setActiveDealId(null);
    maxBridge.haptic('light');
  };

  const sendMessage = (
    dealId: string,
    text: string,
    type: ChatMessage['type'] = 'text',
    metadata?: ChatMessage['metadata']
  ) => {
    if (!currentUser || !text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: dealId,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      text,
      type,
      metadata,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    maxBridge.haptic('light');
  };

  const agreeDeal = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: 'in_progress', updatedAt: new Date().toISOString() } : d))
    );
    // Send system message
    sendMessage(
      dealId,
      '🤝 Стороны нажали кнопку «Договорились»! Проект переведен в статус «В работе». Студент может приступить к реализации, а затем отправить реквизиты для выплаты.',
      'system'
    );
    maxBridge.hapticNotification('success');
  };

  const sendRequisites = (
    dealId: string,
    requisites: { bankName: string; recipientPhone: string; cardNumber?: string; note?: string }
  ) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: 'waiting_payment',
              requisites,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
    const text = `💳 Студент отправил реквизиты для выплаты по СБП:
Банк: ${requisites.bankName}
Телефон СБП: ${requisites.recipientPhone}${requisites.cardNumber ? `\nКарта: ${requisites.cardNumber}` : ''}${requisites.note ? `\nПримечание: ${requisites.note}` : ''}`;
    sendMessage(dealId, text, 'requisites', {
      bankName: requisites.bankName,
      recipientPhone: requisites.recipientPhone,
      cardNumber: requisites.cardNumber,
    });
    maxBridge.hapticNotification('success');
  };

  const confirmPayment = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: 'completed',
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );

    // Auto-create Project in Student Portfolio
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      vacancyId: deal.vacancyId,
      title: deal.vacancyTitle,
      clientName: deal.employerName,
      studentId: deal.studentId,
      employerId: deal.employerId,
      amount: deal.agreedAmount,
      completedDate: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Успешно завершенный проект через биржу МАХ Кейсы.',
      isManual: false,
    };
    setProjects((prev) => [newProj, ...prev]);

    // Increment completed count in student profile
    setStudentProfiles((prev) => {
      const sp = prev[deal.studentId];
      if (!sp) return prev;
      return {
        ...prev,
        [deal.studentId]: {
          ...sp,
          completedProjectsCount: sp.completedProjectsCount + 1,
        },
      };
    });

    // Update vacancy status to completed
    setVacancies((prev) =>
      prev.map((v) => (v.id === deal.vacancyId ? { ...v, status: 'completed' } : v))
    );

    // Send system message
    sendMessage(
      dealId,
      '🎉 Работодатель подтвердил перевод вознаграждения по СБП! Кейс перешел в статус «Завершен» и автоматически добавлен в портфолио студента. Обе стороны могут оставить взаимный отзыв.',
      'system'
    );
    maxBridge.hapticNotification('success');
  };

  const leaveReview = (dealId: string, rating: number, text: string) => {
    if (!currentUser) return;
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const isStudent = currentUser.role === 'student';
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorId: currentUser.id,
      authorName: isStudent ? studentProfile?.fullName || currentUser.name : employerProfile?.companyName || currentUser.name,
      authorRole: currentUser.role,
      targetId: isStudent ? deal.employerId : deal.studentId,
      targetRole: isStudent ? 'employer' : 'student',
      rating,
      text,
      projectName: deal.vacancyTitle,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update deal review flags
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              studentReviewLeft: isStudent ? true : d.studentReviewLeft,
              employerReviewLeft: !isStudent ? true : d.employerReviewLeft,
            }
          : d
      )
    );

    sendMessage(
      dealId,
      `⭐ ${newReview.authorName} оставил(а) отзыв с оценкой ${rating}/5: «${text}»`,
      'system'
    );
    maxBridge.hapticNotification('success');
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, replyText } : r))
    );
    maxBridge.hapticNotification('success');
  };

  const addManualProject = (proj: Omit<Project, 'id' | 'studentId' | 'isManual'>) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      studentId: currentUser.id,
      isManual: true,
    };
    setProjects((prev) => [newProj, ...prev]);
    maxBridge.hapticNotification('success');
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'Не авторизован.' };
    if (currentUser.passwordHash !== oldPass) {
      return { success: false, message: 'Старый пароль введен неверно.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'Новый пароль должен быть не короче 6 символов.' };
    }
    currentUser.passwordHash = newPass;
    setCurrentUser({ ...currentUser });
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        studentProfile,
        employerProfile,
        studentTab,
        employerTab,
        vacancies,
        applications,
        projects,
        reviews,
        deals,
        messages,
        activeDealId,
        previewStudentId,
        isDeployGuideOpen,
        setStudentTab,
        setEmployerTab,
        quickLogin,
        login,
        registerStudent,
        registerEmployer,
        logout,
        updateStudentProfile,
        updateEmployerProfile,
        createVacancy,
        updateVacancyStatus,
        duplicateVacancy,
        deleteVacancy,
        applyToVacancy,
        openChatForApplication,
        openChatForDeal,
        closeChat,
        sendMessage,
        agreeDeal,
        sendRequisites,
        confirmPayment,
        leaveReview,
        replyToReview,
        addManualProject,
        changePassword,
        setPreviewStudentId,
        setIsDeployGuideOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
