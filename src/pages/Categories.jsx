import React from 'react'
import {
    Box, Grid, Card, CardContent, Typography, LinearProgress,
    Stack, Chip,
} from '@mui/material'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'
import { useTheme } from '@mui/material'

export default function Categories() {
    const { tr, goals } = useApp()
    const theme = useTheme()

    const categoryStats = CATEGORIES.map(cat => {
        const catGoals = goals.filter(g => g.category === cat)
        const active = catGoals.filter(g => g.status === 'active').length
        const completed = catGoals.filter(g => g.status === 'completed').length
        const paused = catGoals.filter(g => g.status === 'paused').length
        const total = catGoals.length
        const avgProgress = total > 0
            ? Math.round(catGoals.reduce((sum, g) => sum + Math.min(g.progress / g.target, 1), 0) / total * 100)
            : 0
        return { cat, active, completed, paused, total, avgProgress, color: CATEGORY_COLORS[cat] }
    }).filter(s => s.total > 0)

    const chartData = categoryStats.map(s => ({
        name: tr[s.cat] || s.cat,
        active: s.active,
        completed: s.completed,
        color: s.color,
    }))

    return (
        <Box>
            <PageHeader title={tr.categoriesTitle} />

            {goals.length === 0 ? (
                <EmptyState emoji="📂" title={tr.noGoalsFound} />
            ) : (
                <>
                    {/* Chart */}
                    {chartData.length > 0 && (
                        <Card sx={{ mb: 4 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Goals by Category</Typography>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                                        <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: theme.palette.background.paper,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 12,
                                            }}
                                        />
                                        <Bar dataKey="active" name="Active" radius={[6, 6, 0, 0]}>
                                            {chartData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Bar>
                                        <Bar dataKey="completed" name="Completed" fill="#4ADE80" radius={[6, 6, 0, 0]} opacity={0.6} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Category cards */}
                    <Grid container spacing={2}>
                        {categoryStats.map(s => (
                            <Grid item xs={12} sm={6} md={4} key={s.cat}>
                                <Card sx={{ borderTop: `3px solid ${s.color}` }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <Box sx={{
                                                width: 44, height: 44, borderRadius: 3,
                                                bgcolor: s.color + '22',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 22,
                                            }}>
                                                {CATEGORY_ICONS[s.cat]}
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                    {tr[s.cat] || s.cat}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {s.total} {tr.totalGoals}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                            <Chip label={`${s.active} ${tr.activeCount}`} size="small" color="success" />
                                            <Chip label={`${s.completed} ${tr.completedCount}`} size="small"
                                                sx={{ bgcolor: '#4ADE8022', color: '#4ADE80' }} />
                                        </Stack>

                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Avg. Progress</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: s.color }}>{s.avgProgress}%</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={s.avgProgress}
                                                sx={{
                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                                                    '& .MuiLinearProgress-bar': { bgcolor: s.color },
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    )
}
