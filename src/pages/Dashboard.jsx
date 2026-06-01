import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Grid, Typography, Button, Card, CardContent,
    LinearProgress, Divider, Stack, Chip,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import { useApp } from '../context/AppContext'
import GoalCard from '../components/GoalCard'
import StatCard from '../components/StatCard'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { getCategoryColor } from '../utils/categories'

export default function Dashboard() {
    const navigate = useNavigate()
    const { tr, goals, stats, level, overallProgress, completedGoals, activeGoals } = useApp()

    const recentCompleted = completedGoals.slice(0, 3)

    return (
        <Box>
            <PageHeader
                title={`${tr.appName} ⚡`}
                subtitle={tr.tagline}
                action={
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate('/goals/new')} size="small">
                            {tr.newGoal}
                        </Button>
                        <Button variant="outlined" startIcon={<ListRoundedIcon />} onClick={() => navigate('/goals')} size="small">
                            {tr.viewAllGoals}
                        </Button>
                    </Stack>
                }
            />

            {/* Stats row */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <StatCard
                        icon="🎯"
                        label={tr.overallProgress}
                        value={`${overallProgress}%`}
                        sub={tr.complete}
                        color="#C8F04D"
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        icon="🏆"
                        label={tr.totalCompleted}
                        value={completedGoals.length}
                        sub={tr.completed}
                        color="#FBBF24"
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        icon="🔥"
                        label={tr.currentStreak}
                        value={stats.streak}
                        sub={tr.days}
                        color="#FB923C"
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        icon="⚡"
                        label={tr.totalXP}
                        value={stats.xpTotal.toLocaleString()}
                        sub={`${tr.level} ${level}`}
                        gradient="linear-gradient(135deg, #5B3FE8 0%, #7C3AED 100%)"
                    />
                </Grid>
            </Grid>

            {/* Overall progress bar */}
            <Card sx={{ mb: 4 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{tr.overallProgress}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>{overallProgress}%</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        sx={{
                            height: 12, borderRadius: 8,
                            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #5B3FE8, #C8F04D)',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {activeGoals.length} {tr.active} · {completedGoals.length} {tr.completed}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {goals.length} {tr.totalGoals}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Active Goals */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{tr.activeGoals}</Typography>
                    <Button size="small" onClick={() => navigate('/goals')}>{tr.viewAll} →</Button>
                </Box>

                {activeGoals.length === 0 ? (
                    <EmptyState
                        emoji="🚀"
                        title={tr.noActiveGoals}
                        subtitle={tr.startFirst}
                        action={tr.newGoal}
                        onAction={() => navigate('/goals/new')}
                    />
                ) : (
                    <Grid container spacing={2} alignItems="stretch">
                        {activeGoals.map(goal => (
                            <Grid item xs={12} sm={6} lg={4} key={goal.id} sx={{ display: 'flex' }}>
                                <GoalCard goal={goal} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Completed Preview */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        <EmojiEventsRoundedIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#FBBF24' }} />
                        {tr.completedPreview}
                    </Typography>
                    <Button size="small" onClick={() => navigate('/goals?tab=completed')}>{tr.viewAll} →</Button>
                </Box>

                {recentCompleted.length === 0 ? (
                    <EmptyState emoji="🏅" title={tr.noCompletedGoals} />
                ) : (
                    <Grid container spacing={2} alignItems="stretch">
                        {recentCompleted.map(goal => (
                            <Grid item xs={12} sm={6} lg={4} key={goal.id} sx={{ display: 'flex' }}>
                                <GoalCard goal={goal} showRestore />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    )
}
