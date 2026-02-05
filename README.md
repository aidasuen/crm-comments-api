**CRM Comments API**

REST API модуль «Комментарии к задачам» для CRM-системы.

Проект реализован в рамках тестового задания.

Технологии:
- Node.js 
- NestJS
- TypeORM
- PostgreSQL
- TypeScript

  **Инструкция по запуску:**

**1. Подготовка окружения**

Приложение использует переменные окружения для настройки подключений.

Склонируйте репозиторий.

Создайте файл .env в корне проекта, взяв за основу шаблон:

 ```.env.example```

(Файл .env добавлен в .gitignore для обеспечения безопасности учетных данных).

**2. Запуск базы данных (Docker)**

Для развертывания PostgreSQL выполните:

```docker-compose up -d```

**3. Запуск модуля**

```npm install```
```npm run start:dev```

API будет доступно по адресу: ```http://localhost:3000```

**Форматы данных:**

Все ответы API возвращаются в формате JSON.

**1. Пользователи (Users)**

POST /users — Регистрация.

Request Body:

```
{
  "email": "user@example.com",
  "password": "strongPassword123",
  "role": "AUTHOR" // Варианты: AUTHOR, USER
}
```

Success Response (201 Created):

```
{
  "id": "uuid-string",
  "email": "user@example.com",
  "role": "AUTHOR",
  "created_at": "2026-02-05T..."
}
```

**2. Аутентификация (Auth)**

POST /auth/login — Вход в систему.

Success Response (201 Created):


```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**3. Задачи (Tasks)**

POST /tasks — Создание задачи.

Request Body:


```
{
  "user_id": "uuid-автора",
  "title": "Написать документацию",
  "description": "Подготовить подробный README"
}
```


Success Response (201 Created):


```
{
  "id": "uuid-задачи",
  "user_id": "uuid-автора",
  "title": "Написать документацию",
   "description": "Подготовить подробный README",
   "created_at": "2026-02-05T..."
}
```

**4. Комментарии (Comments)**

POST /comments — Добавление комментария.

Request Body:

```
{
  "comment": "Надо доделать!",
 "user_id": "uuid-автора",
  "task_id": "uuid-задачи"
}
```


Success Response (201 Created):


```
{
  "id": "uuid-комментария",
  "comment": "Надо доделать!",
  "user_id": "uuid-автора",
  "task_id": "uuid-задачи",
  "created_at": "2026-02-05T..."
}
```
