# Tackly

Lekka, przejrzysta aplikacja do zarządzania zadaniami składająca się z dwóch części:

- **backend** – NestJS + Prisma API
- **frontend** – Next.js + React UI

---

## Struktura projektu

```
/
├── backend/       # NestJS + Prisma
└── frontend/      # Next.js + React
```

---

## Start aplikacji

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/kacperrito21/ThesisProject.git
cd ThesisProject
```
Zainstaluj wersje node js 22.17.0

---

### 2. Postaw bazę danych
Osobiście przy programowaniu stawiałem wszystko na mariadb także polecam trzymać się tego, najlepiej w Dockerze ze względu na case-sensitivity

---

### 3. Konfiguracja środowiska

W katalogu `backend/` utwórz plik `.env` z co najmniej:

```dotenv
DATABASE_URL="mariadb://user:password@localhost:5432/thesis_database"
JWT_SECRET="TwojSekretnyKlucz"
```

W katalogu `frontend/` utwórz plik `.env.local` z ustawieniami baza URL API:

```dotenv
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

### 4. Instalacja zależności

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Uruchamianie

### Backend

```bash
# najlepiej w dwóch osobnych konsolach, łatwiej debugować

cd backend
# tryb deweloperski:
cd backend
npm run start:dev

# produkcyjnie:
npm run build
npm run start:prod
```

API wystartuje na domyślnym porcie `5000`.

### Frontend

```bash
cd frontend
# tryb deweloperski:
npm run dev

# build + start produkcyjny:
npm run build
npm run start
```

UI dostępne pod adresem `http://localhost:3000` (lub innym, jaki konfigurowałeś).

---

## Skrypty

#### Backend (`backend/package.json`)

| Skrypt        | Co robi                                        |
|---------------|------------------------------------------------|
| `npm run start:dev`  | Uruchamia aplikację w trybie watch (`--watch`)       |
| `npm run build`      | Kompiluje TypeScript do `dist/`                      |
| `npm run start:prod` | Uruchamia skompilowaną wersję z `dist/main.js`       |
| `npm run test`       | Uruchamia testy jednostkowe (Jest)                   |
| `npm run lint`       | ESLint + automatyczne poprawki                       |
| `npm run format`     | Prettier formatowanie kodu                           |
| `npm run test:e2e`   | Testy end‑to‑end (Jest + Supertest)                  |

#### Frontend (`frontend/package.json`)

| Skrypt       | Co robi                                               |
|--------------|-------------------------------------------------------|
| `npm run dev`   | Uruchamia Next.js w trybie deweloperskim               |
| `npm run build` | Kompiluje i optymalizuje produkcyjną wersję aplikacji  |
| `npm run start` | Uruchamia serwer produkcyjny Next.js                  |
| `npm run lint`  | ESLint + automatyczne poprawki                        |

---

## Technologie

### Backend

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io/)
- TypeScript, ESLint, Prettier

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- TypeScript, ESLint, Prettier

---

## Testy

```bash
# Backend
# na chwilę obecną nie napisałem testów
cd backend
npm run test

# Frontend (możesz dodać własne testy w przyszłości)
cd frontend
# na chwilę obecną nie napisałem testów
```

---

## 🧹 Lint & Format

```bash
# Backend
cd backend && npm run lint && npm run format

# Frontend
cd frontend && npm run lint
```

---

## Licencja

- **backend**: `UNLICENSED`
- **frontend**: `UNLICENSED`

---

## Wkład
Jeśli masz dostęp do tego repo to pewnie wiesz o tym ale i tak trzymaj się instrukcji:
1. Sforkuj repo
2. Stwórz branch `feature/moja-funkcjonalnosc`
3. Zrób PR
4. Czekaj na review i merge

---

### Kontakt

W razie pytań: `kacperrito21@wp.pl`

Powodzenia w odhaczaniu zadań
