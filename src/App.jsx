import React, { useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Snackbar, Alert } from '@mui/material'
import { AppProvider, useApp } from './context/AppContext'
import { buildTheme } from './utils/theme'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import GoalsList from './pages/GoalsList'
import GoalForm from './pages/GoalForm'
import GoalDetail from './pages/GoalDetail'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function ThemedApp() {
    const { prefs, snackbar, closeSnack } = useApp()
    const theme = useMemo(() => buildTheme(prefs.theme), [prefs.theme])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/goals" element={<GoalsList />} />
                        <Route path="/goals/new" element={<GoalForm />} />
                        <Route path="/goals/:id" element={<GoalDetail />} />
                        <Route path="/goals/:id/edit" element={<GoalForm />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnack}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={closeSnack}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ fontWeight: 700 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    )
}

export default function App() {
    return (
        <AppProvider>
            <ThemedApp />
        </AppProvider>
    )
}
