import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { translations } from '../data/translations'

const AppContext = createContext(null)

const STORAGE_KEY = 'questlog_goals'
const STATS_KEY = 'questlog_stats'
const PREFS_KEY = 'questlog_prefs'

const defaultStats = {
    xpTotal: 0,
    streak: 0,
    completedCount: 0,
    lastLogDate: null,
}

const defaultPrefs = {
    language: 'en',
    theme: 'dark',
}

function calcLevel(xp) {
    return Math.floor(xp / 500) + 1
}

function calcStreak(goals) {
    // Look at all daily goals and find the longest consecutive daily log streak
    const allDates = new Set()
    goals.forEach(g => {
        if (g.type === 'daily') {
            g.logs?.forEach(log => allDates.add(log.date))
        }
    })
    if (allDates.size === 0) return 0

    const today = new Date().toISOString().slice(0, 10)
    let streak = 0
    let check = today
    while (allDates.has(check)) {
        streak++
        const d = new Date(check)
        d.setDate(d.getDate() - 1)
        check = d.toISOString().slice(0, 10)
    }
    return streak
}

export function AppProvider({ children }) {
    const [goals, setGoals] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
        } catch { return [] }
    })

    const [stats, setStats] = useState(() => {
        try {
            return { ...defaultStats, ...JSON.parse(localStorage.getItem(STATS_KEY)) }
        } catch { return defaultStats }
    })

    const [prefs, setPrefs] = useState(() => {
        try {
            return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(PREFS_KEY)) }
        } catch { return defaultPrefs }
    })

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const tr = translations[prefs.language] || translations.en

    // Persist
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
        // recalc streak
        const streak = calcStreak(goals)
        setStats(prev => {
            const next = { ...prev, streak }
            localStorage.setItem(STATS_KEY, JSON.stringify(next))
            return next
        })
    }, [goals])

    useEffect(() => {
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
        document.documentElement.dir = tr.dir
        document.documentElement.lang = tr.lang
    }, [prefs, tr])

    const showSnack = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }, [])

    const closeSnack = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }))
    }, [])

    // CRUD
    const createGoal = useCallback((data) => {
        const goal = {
            id: uuidv4(),
            ...data,
            progress: 0,
            status: 'active',
            logs: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        setGoals(prev => [goal, ...prev])
        showSnack('Goal created! 🎯')
        return goal
    }, [showSnack])

    const updateGoal = useCallback((id, data) => {
        setGoals(prev => prev.map(g =>
            g.id === id ? { ...g, ...data, updatedAt: new Date().toISOString() } : g
        ))
        showSnack('Goal updated ✨')
    }, [showSnack])

    const deleteGoal = useCallback((id) => {
        setGoals(prev => prev.filter(g => g.id !== id))
        showSnack('Goal deleted')
    }, [showSnack])

    const logProgress = useCallback((id, amount = 1) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== id) return g
            const today = new Date().toISOString().slice(0, 10)
            // For daily, only one log per day
            const existingLog = g.logs?.find(l => l.date === today)
            let newLogs
            if (existingLog) {
                newLogs = g.logs.map(l => l.date === today ? { ...l, amount: l.amount + amount } : l)
            } else {
                newLogs = [...(g.logs || []), { date: today, amount }]
            }
            const totalProgress = newLogs.reduce((sum, l) => sum + l.amount, 0)
            const newProgress = Math.min(totalProgress, g.target)
            const isComplete = newProgress >= g.target
            return {
                ...g,
                logs: newLogs,
                progress: newProgress,
                status: isComplete ? 'completed' : g.status,
                updatedAt: new Date().toISOString(),
            }
        }))

        // Add XP
        const XP_PER_LOG = 20
        setStats(prev => {
            const next = {
                ...prev,
                xpTotal: prev.xpTotal + XP_PER_LOG,
                lastLogDate: new Date().toISOString().slice(0, 10),
            }
            localStorage.setItem(STATS_KEY, JSON.stringify(next))
            return next
        })
        showSnack('+20 XP gained! 💫')
    }, [showSnack])

    const markComplete = useCallback((id) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== id) return g
            return { ...g, status: 'completed', progress: g.target, updatedAt: new Date().toISOString() }
        }))
        setStats(prev => {
            const next = { ...prev, completedCount: prev.completedCount + 1, xpTotal: prev.xpTotal + 100 }
            localStorage.setItem(STATS_KEY, JSON.stringify(next))
            return next
        })
        showSnack('Goal completed! 🏆 +100 XP')
    }, [showSnack])

    const togglePause = useCallback((id) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== id) return g
            const newStatus = g.status === 'paused' ? 'active' : 'paused'
            return { ...g, status: newStatus, updatedAt: new Date().toISOString() }
        }))
    }, [])

    const restoreGoal = useCallback((id) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== id) return g
            return { ...g, status: 'active', progress: 0, logs: [], updatedAt: new Date().toISOString() }
        }))
        showSnack('Goal restored! 🔄')
    }, [showSnack])

    const setLanguage = useCallback((lang) => {
        setPrefs(prev => ({ ...prev, language: lang }))
    }, [])

    const setTheme = useCallback((theme) => {
        setPrefs(prev => ({ ...prev, theme }))
    }, [])

    const clearAllData = useCallback(() => {
        setGoals([])
        setStats(defaultStats)
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STATS_KEY)
        showSnack('All data cleared', 'info')
    }, [showSnack])

    const overallProgress = goals.length > 0
        ? Math.round(goals.reduce((sum, g) => sum + Math.min(g.progress / g.target, 1), 0) / goals.length * 100)
        : 0

    const completedGoals = goals.filter(g => g.status === 'completed')
    const activeGoals = goals.filter(g => g.status === 'active')

    return (
        <AppContext.Provider value={{
            goals, stats, prefs, tr,
            overallProgress, completedGoals, activeGoals,
            level: calcLevel(stats.xpTotal),
            createGoal, updateGoal, deleteGoal,
            logProgress, markComplete, togglePause, restoreGoal,
            setLanguage, setTheme, clearAllData,
            snackbar, showSnack, closeSnack,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext)
