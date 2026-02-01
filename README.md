# CodeLearn - Online Programming Learning Platform

Платформа для обучения программированию с автоматической проверкой кода через Piston.

## 🚀 Быстрый старт

### Требования
- Docker & Docker Compose
- (Опционально) Node.js 18+ для локальной разработки

### 🐳 Запуск через Docker (рекомендуется)

```bash
# Запустить весь стек одной командой
docker-compose up -d

# Или используя скрипт (PowerShell)
.\scripts\start.ps1
```

Это запустит:
- **PostgreSQL** (порт 5432) - база данных
- **Piston** (порт 2358) - движок выполнения кода
- **Node.js App** (порт 3000) - бэкенд + фронтенд

После запуска платформа доступна по адресу: **http://localhost:3000**

### Проверка работоспособности

```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить API
curl http://localhost:3000/api/health

# Проверить Piston (доступные языки)
curl http://localhost:2358/api/v2/runtimes
```

### Остановка

```bash
docker-compose down

# Для полной очистки (удаление volumes)
docker-compose down -v
```

---

## 💻 Локальная разработка (без Docker)

### Требования
- Node.js 18+
- PostgreSQL 15+
- Piston (через Docker)

### Установка

1. **Установить зависимости:**
```bash
npm install
```

2. **Настроить environment:**
```bash
# Отредактировать .env при необходимости
# DB_HOST=localhost
# JUDGE0_API_URL=http://localhost:2358
```

3. **Запустить PostgreSQL и Piston:**
```bash
# PostgreSQL
docker-compose up -d postgres

# Piston
docker-compose up -d piston piston-setup
```

4. **Инициализировать базу данных:**
```bash
npm run db:init
```

5. **Запустить сервер в режиме разработки:**
```bash
npm run dev
```

Сервер будет доступен на http://localhost:3000

---

## 📁 Структура проекта

```
├── src/
│   ├── config/          # Конфигурация (DB, JWT, Piston)
│   ├── controllers/     # Обработчики запросов
│   ├── middleware/      # Auth, validation, errors
│   ├── repositories/    # SQL queries
│   ├── routes/          # API endpoints
│   ├── services/        # Бизнес-логика (codeExecution)
│   └── utils/           # Утилиты
├── public/              # Frontend (HTML/CSS/JS)
├── database/            # SQL схемы и seed data
├── scripts/             # Скрипты запуска
├── docker-compose.yml   # Docker конфигурация
└── package.json
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Авторизация
- `GET /api/auth/me` - Текущий пользователь

### Courses
- `GET /api/courses` - Список курсов
- `GET /api/courses/:id` - Курс с уровнями
- `POST /api/courses/:id/start` - Начать курс

### Levels
- `GET /api/levels/:id` - Уровень с заданием

### Submissions
- `POST /api/submissions` - Отправить код
- `GET /api/submissions/:token` - Результат проверки
- `GET /api/submissions/languages` - Доступные языки

### Users
- `GET /api/users/profile` - Профиль
- `GET /api/users/leaderboard` - Таблица лидеров

## 🎮 Функциональность

- ✅ Регистрация и авторизация (JWT)
- ✅ Курсы с уровнями (roadmap)
- ✅ Теория + практические задания
- ✅ Автоматическая проверка кода через Judge0
- ✅ XP система и уровни
- ✅ Прогресс пользователя
- ✅ Leaderboard

## 🔧 Конфигурация

Переменные окружения (.env):

```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codelearn
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Judge0
JUDGE0_API_URL=http://localhost:2358
```

## 📝 Judge0 Language IDs

- Python 3: 71
- JavaScript (Node.js): 63
- C++ (GCC): 54
- C (GCC): 50
- Java: 62

## 🛡️ Безопасность

- Пароли хешируются через bcrypt
- JWT токены для авторизации
- Helmet для HTTP headers
- CORS настроен
- Валидация входных данных
