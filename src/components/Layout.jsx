import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, AppBar, Toolbar, IconButton, Typography,
    useMediaQuery, useTheme, Avatar, Divider, Tooltip,
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useApp } from '../context/AppContext'

const DRAWER_WIDTH = 240

export default function Layout({ children }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { tr, stats, level, prefs } = useApp()
    const isRTL = prefs.language === 'ar' || prefs.language === 'fa'

    const navItems = [
        { label: tr.dashboard, icon: <DashboardRoundedIcon />, path: '/' },
        { label: tr.goals, icon: <TrackChangesRoundedIcon />, path: '/goals' },
        { label: tr.categories, icon: <CategoryRoundedIcon />, path: '/categories' },
        { label: tr.settings, icon: <SettingsRoundedIcon />, path: '/settings' },
    ]

    const handleNav = (path) => {
        navigate(path)
        if (isMobile) setMobileOpen(false)
    }

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
            {/* Logo */}
            <Box sx={{ px: 3, pb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: theme.palette.primary.main,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <BoltRoundedIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 22 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {tr.appName}
                </Typography>
            </Box>

            {/* XP Badge */}
            <Box sx={{
                mx: 2, mb: 2, p: 2, borderRadius: 3,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(200,240,77,0.12) 0%, rgba(200,240,77,0.04) 100%)'
                    : 'linear-gradient(135deg, rgba(91,63,232,0.10) 0%, rgba(91,63,232,0.04) 100%)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(200,240,77,0.2)' : 'rgba(91,63,232,0.15)'}`,
            }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {tr.level} {level}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}>
                    {stats.xpTotal.toLocaleString()} XP
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    🔥 {stats.streak} {tr.currentStreak}
                </Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Nav */}
            <List sx={{ px: 1, flex: 1 }}>
                {navItems.map(item => {
                    const isActive = item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path)
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNav(item.path)}
                                sx={{
                                    borderRadius: 3,
                                    px: 2, py: 1.2,
                                    background: isActive
                                        ? theme.palette.mode === 'dark' ? 'rgba(200,240,77,0.12)' : 'rgba(91,63,232,0.10)'
                                        : 'transparent',
                                    '&:hover': {
                                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 36,
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.92rem',
                                        color: isActive ? 'primary.main' : 'text.primary',
                                    }}
                                />
                                {isActive && (
                                    <Box sx={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: 'primary.main',
                                        bgcolor: 'primary.main',
                                    }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>

            <Divider sx={{ mb: 2 }} />
            <Box sx={{ px: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    QuestLog v1.0
                </Typography>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    anchor={isRTL ? 'right' : 'left'}
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                    }}
                >
                    {drawer}
                </Drawer>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    anchor={isRTL ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                        <IconButton onClick={() => setMobileOpen(false)}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                    {drawer}
                </Drawer>
            )}

            {/* Main content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Mobile AppBar */}
                {isMobile && (
                    <AppBar
                        position="sticky"
                        elevation={0}
                        sx={{
                            bgcolor: 'background.paper',
                            borderBottom: 1,
                            borderColor: 'divider',
                            color: 'text.primary',
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                edge={isRTL ? 'end' : 'start'}
                                onClick={() => setMobileOpen(true)}
                                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0 }}
                            >
                                <MenuRoundedIcon />
                            </IconButton>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BoltRoundedIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {tr.appName}
                                </Typography>
                            </Box>
                        </Toolbar>
                    </AppBar>
                )}

                {/* Page content */}
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: { xs: 2, md: 4 },
                        maxWidth: 1200,
                        width: '100%',
                        mx: 'auto',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    )
}
