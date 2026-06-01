import { createTheme } from '@mui/material/styles'

const fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export function buildTheme(mode) {
    const isDark = mode === 'dark'

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? '#c72d53' : '#5B3FE8',
                contrastText: isDark ? '#0D0F14' : '#fff',
            },
            secondary: {
                main: isDark ? '#FF6B6B' : '#FF4D6D',
            },
            background: {
                default: isDark ? '#0D0F14' : '#F4F3FF',
                paper: isDark ? '#161A24' : '#FFFFFF',
            },
            text: {
                primary: isDark ? '#EEF0F8' : '#0D0F14',
                secondary: isDark ? '#7B8199' : '#5B607A',
            },
            divider: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
            success: { main: '#4ADE80' },
            warning: { main: '#FBBF24' },
            error: { main: '#F87171' },
            info: { main: isDark ? '#60A5FA' : '#3B82F6' },
        },
        typography: {
            fontFamily,
            h1: { fontWeight: 800, letterSpacing: '-0.03em' },
            h2: { fontWeight: 800, letterSpacing: '-0.02em' },
            h3: { fontWeight: 700, letterSpacing: '-0.02em' },
            h4: { fontWeight: 700, letterSpacing: '-0.02em' },
            h5: { fontWeight: 600, letterSpacing: '-0.01em' },
            h6: { fontWeight: 600, letterSpacing: '-0.01em' },
            subtitle1: { fontWeight: 600 },
            subtitle2: { fontWeight: 600 },
            button: {
                fontFamily,
                fontWeight: 600,
                textTransform: 'none',
                letterSpacing: '0',
            },
            caption: { fontFamily, fontWeight: 500 },
        },
        shape: { borderRadius: 16 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 12, padding: '8px 20px' },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        backgroundImage: 'none',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 8, fontWeight: 600, fontSize: '0.72rem' },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: { borderRadius: 8, height: 8 },
                    bar: { borderRadius: 8 },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: { borderRadius: 24 },
                },
            },
            MuiTextField: {
                defaultProps: { variant: 'outlined' },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundImage: 'none',
                        backgroundColor: isDark ? '#0D0F14' : '#FFFFFF',
                        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
                    },
                },
            },
        },
    })
}