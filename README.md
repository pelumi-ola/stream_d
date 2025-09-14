# Streamd 🎥

Streamd is a modern video streaming web app where users can save, favorite, and love their favorite football (soccer) match highlights. Built with **Next.js**, **React**, and **Zustand**, it provides a smooth user experience with authentication, saved lists, and video playback.

---

## ✨ Features

- 🔐 **Authentication** – secure login & user sessions.
- 📺 **Video Playback** – watch football highlights with an immersive player.
- ❤️ **User Interactions** – save to _Watch Later_, _Favorites_, or _Loved_ lists.
- 🗑 **Manage Saved Videos** – remove saved videos instantly.
- 🔎 **Filter & Pagination** – easily browse saved matches by date.
- 🎨 **Modern UI** – smooth animations with **Framer Motion** and responsive design.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS, Framer Motion
- **State Management:** Zustand
- **API:** Axios with REST endpoints (`/interactions`, `/videos`)
- **Validation:** Zod
- **UI/UX:** Shadcn/UI + custom components

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/streamd.git
cd streamd
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
/components     → UI components (FilterTabs, Pagination, VideoPlayer)
/context        → Auth & Video context providers
/hooks          → Custom hooks (user interactions, video fetching)
/lib            → Shared utilities & UI elements
/pages or /app  → Next.js routes
```
