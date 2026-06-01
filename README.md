# QuestLog — Goal Tracker Dashboard

A multipage React goal tracking app with gamification, RTL/LTR support, and a dark/light polished UI.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Tech Stack

- **React 18** + **Vite**
- **React Router v6** (multi-page)
- **MUI v5** (Material UI) — with custom dark/light themes
- **Recharts** — progress charts
- **date-fns** — date utilities
- **uuid** — unique goal IDs
- **LocalStorage** — persistent data

## 🌍 Languages

| Language | Direction |
|----------|-----------|
| English  | LTR       |
| Arabic   | RTL       |
| Persian  | RTL       |

Switch in **Settings → Language**. Layout direction (RTL/LTR) changes automatically.

## 📄 Pages / Routes

| Route | Page |
|-------|------|
| `/` | Dashboard — summary stats, active goals, recent completions |
| `/goals` | Goals List — filter/search/sort all goals |
| `/goals/new` | Create Goal form |
| `/goals/:id` | Goal Detail — history, chart, actions |
| `/goals/:id/edit` | Edit Goal form |
| `/categories` | Categories — stats per category + bar chart |
| `/settings` | Settings — language, theme, danger zone |
| `*` | 404 Not Found |

## 🔥 Streak System Rules

- **Streak counts**: consecutive days where at least one **daily** goal has a log entry.
- **Increases**: if the user logs progress on a `daily` goal today, and also logged yesterday, streak increments.
- **Resets**: if no daily goal progress is logged on a given day, the streak resets to 0 the next day.
- Streak is recalculated from the actual logs array each time data changes — no "skip" tolerance.

## ⚡ XP System

| Action | XP |
|--------|----|
| Log progress | +20 XP |
| Mark goal complete | +100 XP |

Level = `floor(XP / 500) + 1`

## 🗂 Data Model

```js
Goal {
  id: string (uuid)
  title: string
  category: 'Health' | 'Study' | 'Work' | 'Personal' | 'Finance' | 'Fitness' | 'Other'
  type: 'daily' | 'count' | 'time'
  target: number
  progress: number
  status: 'active' | 'paused' | 'completed'
  startDate: string (ISO date)
  endDate?: string (ISO date)
  color: string (hex)
  notes?: string
  logs: Array<{ date: string, amount: number }>
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

UserStats {
  xpTotal: number
  streak: number
  completedCount: number
  lastLogDate: string | null
}
```

## ✨ Features

- ✅ Full CRUD for goals (create, read, update, delete with confirm dialog)
- ✅ Progress logging with auto-completion detection
- ✅ Streak system based on consecutive daily logs
- ✅ XP gamification with level display
- ✅ Archive (completed goals) with restore functionality
- ✅ Dark / Light theme toggle
- ✅ English / Arabic with full RTL layout switch
- ✅ Responsive (mobile + desktop)
- ✅ Category stats with Recharts bar chart
- ✅ Goal detail progress history chart
- ✅ Empty states, loading states, snackbar notifications
- ✅ Search, filter (tabs), and sort on Goals page

## 🎁 Bonus Features Implemented

- **Charts**: Recharts bar charts on goal detail + categories page
- **Restore completed goals**: button on completed goal cards
- **Color picker**: per-goal color selection

## Screenshots(desktop + mobile)

<div align="center">
    <table align="center">
    <tr align="center">
    <td align="center">
    <h3>Desktop View</h3>
    <a href="https://github.com/Parvaneh-Yaghoubi/QuestLog/blob/main/public/screenshot-desktop.png">
    <img src="https://raw.githubusercontent.com/Parvaneh-Yaghoubi/QuestLog/main/screenshots/desktop.png" height=200px>
    </a>
</td>
<td  align="center">
    <h3>Mobile View</h3>
    <a href="https://github.com/Parvaneh-Yaghoubi/QuestLog/blob/main/public/screenshot-mobile.png">
    <img src="https://raw.githubusercontent.com/Parvaneh-Yaghoubi/QuestLog/main/screenshots/mobile.png" height=200px>
    </a>
    </td>
    <tr>
    </table>
</div>
