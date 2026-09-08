# Duolearn – Full-Stack Language Learning Platform

Duolearn is a full-stack language learning web application inspired by modern language-learning platforms. It provides an interactive learning path, lessons, exercises, progress tracking, XP, streaks, hearts, gems, leaderboard progress, and user profiles.

The project is built with **Next.js + TypeScript** on the frontend and **FastAPI + SQLite** on the backend.

---

## 🚀 Live Demo

Frontend: https://duolingo-clone-roan.vercel.app/homepage

Backend API: https://duolearn-backend.vercel.app

---

## 📌 Features

### Learning Path
- Interactive course and learning path
- Units and skills
- Locked and unlocked lessons
- Lesson progression
- Progress tracking

### Interactive Lessons
The application supports multiple exercise types:

- Multiple choice questions
- Translation exercises
- Tap-the-word exercises
- Match-pairs exercises
- Fill-in-the-blank exercises
- Type-answer exercises

### Lesson System
- Real-time answer validation
- Immediate correct/wrong feedback
- Lesson progress bar
- Hearts system
- XP rewards
- Lesson completion tracking
- Automatic unlocking of the next lesson

### User Progress
- Per-user lesson progress
- XP tracking
- Daily XP
- Streak tracking
- Hearts
- Gems
- Current lesson tracking
- Profile statistics

### Leaderboard
- Lesson completion tracking
- Daily XP progress
- Leaderboard-style progress

### User System
- Sign up
- Login
- Logout
- User profile
- Avatar selection
- Per-account progress

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- SQLite

### Development Tools
- Git
- GitHub
- npm
- Python virtual environment

---

## 🏗️ Project Structure

```text
duolingo-clone/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── course.py
│   │   │   ├── daily_activity.py
│   │   │   ├── exercise.py
│   │   │   ├── exercise_option.py
│   │   │   ├── lesson.py
│   │   │   ├── lesson_attempt.py
│   │   │   ├── skill.py
│   │   │   ├── unit.py
│   │   │   ├── user.py
│   │   │   ├── user_skill_progress.py
│   │   │   └── user_stats.py
│   │   │
│   │   ├── routers/
│   │   │   ├── activity.py
│   │   │   ├── course.py
│   │   │   ├── lesson.py
│   │   │   ├── progress.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── lesson.py
│   │   │   └── progress.py
│   │   │
│   │   ├── database.py
│   │   ├── main.py
│   │   └── seed.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── courses/
│   │   ├── guidebook/
│   │   ├── homepage/
│   │   ├── leaderboard/
│   │   ├── lesson/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── quests/
│   │   ├── settings/
│   │   ├── shop/
│   │   ├── signup/
│   │   ├── sounds/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── AvatarDisplay.tsx
│   │   ├── DuolingoLayout.tsx
│   │   ├── GlobalHeader.tsx
│   │   └── GlobalSidebar.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── userState.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
