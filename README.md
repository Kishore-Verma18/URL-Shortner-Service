# 🔗 URL Shortener Service

A robust, lightweight backend REST API built with Node.js, Express, PostgreSQL, and Drizzle ORM that converts long, complex URLs into concise, manageable short links and handles high-throughput redirection.

---

## 📌 Problem & Solution

### The Problem
* **Cluttered & Fragile URLs:** Long URLs containing heavy query parameters, UTM tags, and path segments are cumbersome to share across messages, social media, printed materials, and character-constrained environments.
* **Lack of Tracking & Ownership:** Plain links provide no centralized management or ownership control for creators and organizations.

### The Solution
* **Compact Hash Generation:** Automatically transforms arbitrary long URLs into compact unique short codes (powered by `nanoid`).
* **Fast Redirection:** Resolves incoming short codes and immediately redirects client browsers with standard HTTP 301/302 redirects.
* **User Isolation & Security:** Provides JWT-based authentication so users can securely create, view, and manage their personal collection of shortened URLs.

---

## ⚙️ How It Works (Architecture & Workflow)

```
[ Client / Browser ] 
        │
        ├──────────────── (1) POST /user/signup or /user/login ───────────────┐
        │                 (Receives JWT Auth Token)                           │
        │                                                                     ▼
        ├──────────────── (2) POST /shorten { longUrl } ─────────────► [ Express App ]
        │                 (Header: Bearer <Token>)                            │
        │                                                                     │ (Generates nanoid)
        │                                                                     ▼
        │                                                           [ PostgreSQL DB ]
        │                                                           (Stores mapping)
        │
        └──────────────── (3) GET /:shortCode ───────────────────────► [ Express App ]
                          (302 Found / Redirect)                              │
                                  ◄───────────────────────────────────────────┘
```

1. **User Authentication:** Users register and log in to receive a signed JSON Web Token (JWT).
2. **URL Shortening:** An authenticated user submits a target URL (`longUrl`). The backend validates the payload using Zod, generates a collision-resistant unique code via `nanoid`, and persists the link-user relation in PostgreSQL using Drizzle ORM.
3. **Redirection Engine:** When a client visits `GET /:shortCode`, the server performs an indexed lookup in PostgreSQL and sends an HTTP redirect directly to the original target URL.
4. **URL Management:** Authenticated users can query all their registered links (`GET /urls`) or delete links they own (`DELETE /urls/:id`).

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM & Migrations:** Drizzle ORM & Drizzle Kit
* **Authentication:** JSON Web Tokens (`jsonwebtoken`)
* **ID Generation:** `nanoid`
* **Validation:** `zod`
* **Containerization:** Docker & Docker Compose (Local DB instance)

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [pnpm](https://pnpm.io/) (or `npm`)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
PORT=8000
DATABASE_URL=postgresql://postgresql:admin@localhost:5432/postgres
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Start PostgreSQL Database
Run the local PostgreSQL database using Docker Compose:

```bash
docker compose up -d
```

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Push Database Schema
Sync database tables defined via Drizzle schema to PostgreSQL:

```bash
pnpm run db:push
```

*(Optional) Launch Drizzle Studio GUI for visual database management:*
```bash
pnpm run db:studio
```

### 6. Run the Application
Start the backend server in development mode:

```bash
pnpm run dev
```
The server will start listening on `http://localhost:8000`.

---

## 📡 API Reference

### Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Checks server status | ❌ No |

---

### Authentication Endpoints (`/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/signup` | Register a new user account | ❌ No |
| `POST` | `/user/login` | Authenticate user and obtain JWT | ❌ No |

#### `POST /user/signup`
**Request Body:**
```json
{
  "email": "developer@example.com",
  "password": "securepassword123"
}
```

#### `POST /user/login`
**Request Body:**
```json
{
  "email": "developer@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### URL Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/shorten` | Generate a new short URL | ✅ Yes |
| `GET` | `/:shortCode` | Redirect to original long URL | ❌ No |
| `GET` | `/urls` | List all URLs owned by current user | ✅ Yes |
| `DELETE` | `/urls/:id` | Delete a specific short URL record | ✅ Yes |

#### `POST /shorten`
**Headers:** `Authorization: Bearer <your_token>`  
**Request Body:**
```json
{
  "url": "https://example.com/very/long/and/complex/path?query=parameter"
}
```
**Response:**
```json
{
  "id": "1",
  "shortCode": "aB3x9Z",
  "originalUrl": "https://example.com/very/long/and/complex/path?query=parameter",
  "shortUrl": "http://localhost:8000/aB3x9Z"
}
```

#### `GET /:shortCode`
* Navigating to `http://localhost:8000/aB3x9Z` returns an HTTP `302 Found` header redirecting to the target destination.

---

## 📂 Project Structure

```text
├── drizzle/              # Generated Drizzle migration files
├── middlewares/          # Express middlewares (auth, validation, error handler)
│   └── auth.middleware.js
├── models/               # Drizzle schemas and database definitions
│   └── index.js
├── routes/               # Modular Express API route controllers
│   ├── user.routes.js
│   └── url.routes.js
├── docker-compose.yml    # Container configuration for PostgreSQL
├── drizzle.config.js     # Drizzle ORM configuration
├── index.js              # Server entry point
├── package.json          # Project dependencies & scripts
└── README.md             # Documentation
```
=======
# URL-Shortner-Service
"Built a robust, lightweight URL Shortener API powered by Node.js and Express.js. This project highlights my backend capabilities in schema design, API security, and high-throughput data processing."
>>>>>>> fd283528fae8113aa0b9bbaa9f3656acfc32badc
