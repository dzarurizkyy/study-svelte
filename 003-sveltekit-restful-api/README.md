# Study Svelte Contact Management

A web-based contact management app built with **SvelteKit 5**. This is a frontend project that connects to a REST API backend to manage contacts and their addresses.

## About

This app allows users to:

- **Authentication** — register, login, logout, and update profile
- **Contact Management** — create, view, edit, delete, and search contacts
- **Address Management** — add, edit, and delete addresses per contact

## Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Framework  | [SvelteKit 5](https://svelte.dev)            |
| Build Tool | [Vite](https://vite.dev)                     |
| Alerts     | [SweetAlert2](https://sweetalert2.github.io) |
| Backend    | Node.js REST API (see Backend section)       |

## Project Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── UserApi.js      # register, login, logout, profile
│   │   ├── ContactApi.js   # CRUD contacts
│   │   └── AddressApi.js   # CRUD addresses
│   └── alert.js            # SweetAlert2 helper
└── routes/
    ├── (default)/
    │   ├── login/          # Login page
    │   └── register/       # Register page
    └── (user)/dashboard/
        ├── contacts/       # Contact list & detail
        │   ├── create/     # Create contact
        │   ├── [id]/edit/  # Edit contact
        │   └── [id]/addresses/  # Address management
        └── users/
            ├── profile/    # Update profile
            └── logout/     # Logout
```

## Running the Frontend

### Prerequisites

- Node.js >= 18
- Backend running at `http://localhost:3000`

### Steps

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd study-svelte-contact-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   A `.env` file is already included. Edit it if needed:

   ```env
   VITE_URL_API=http://localhost:3000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`.

5. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

---

## Backend

This frontend consumes the REST API from:

> **[belajar-nodejs-restful-api](https://github.com/ProgrammerZamanNow/belajar-nodejs-restful-api)**
> by ProgrammerZamanNow

The backend is built with **Node.js**, **Prisma ORM**, and **MySQL**.

### Backend Setup

1. **Clone the backend repository**

   ```bash
   git clone https://github.com/ProgrammerZamanNow/belajar-nodejs-restful-api.git
   cd belajar-nodejs-restful-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env` file in the backend root:

   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
   ```

   Replace `USER`, `PASSWORD`, and `DATABASE_NAME` with your MySQL credentials.

4. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   ```

5. **Start the backend**

   ```bash
   npm start
   ```

   Backend runs at `http://localhost:3000`.

### API Endpoints Used

| Method | Endpoint                                 | Description          |
|--------|------------------------------------------|----------------------|
| POST   | `/api/users`                             | Register user        |
| POST   | `/api/users/login`                       | Login                |
| DELETE | `/api/users/logout`                      | Logout               |
| GET    | `/api/users/current`                     | Get current user     |
| PATCH  | `/api/users/current`                     | Update profile       |
| POST   | `/api/contacts`                          | Create contact       |
| GET    | `/api/contacts`                          | List contacts        |
| GET    | `/api/contacts/:id`                      | Get contact          |
| PUT    | `/api/contacts/:id`                      | Update contact       |
| DELETE | `/api/contacts/:id`                      | Delete contact       |
| POST   | `/api/contacts/:id/addresses`            | Create address       |
| GET    | `/api/contacts/:id/addresses`            | List addresses       |
| GET    | `/api/contacts/:id/addresses/:addressId` | Get address          |
| PUT    | `/api/contacts/:id/addresses/:addressId` | Update address       |
| DELETE | `/api/contacts/:id/addresses/:addressId` | Delete address       |

---

## Startup Order

Start the backend **before** the frontend:

```
1. Start MySQL
2. Start backend  →  http://localhost:3000
3. Start frontend →  http://localhost:5173
```
