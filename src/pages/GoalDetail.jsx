import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box, Card, CardContent, Grid, Typography, Button, Chip,
    LinearProgress, Stack, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Divider, IconButton, Tooltip,
    List, ListItem, ListItemText,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { format, parseISO } from 'date-fns'
import { useApp } from '../context/AppContext'
import { getCategoryColor, getProgressColor, getUnitLabel, getTypeLabel } from '../utils/categories'
import EmptyState from '../components/EmptyState'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useTheme } from '@mui/material'

export default function GoalDetail() {
    const navigate = useNavigate()
    const { id } = useParams()
    const theme = useTheme()
    const { tr, goals, logProgress, deleteGoal, togglePause, markComplete } = useApp()
    const [progressOpen, setProgressOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [amount, setAmount] = useState(1)

    const goal = goals.find(g => g.id === id)

    if (!goal) {
        return (
            <Box>
                <EmptyState emoji="😕" title="Goal not found" action={tr.goHome} onAction={() => navigate('/')} />
            </Box>
        )
    }

    const pct = goal.target > 0 ? Math.min(Math.round((goal.progress / goal.target) * 100), 100) : 0
    const catColor = getCategoryColor(goal.category)
    const progressColor = getProgressColor(pct)
    const unit = getUnitLabel(goal.type, tr)

    // Chart data - last 14 log entries
    const chartData = (goal.logs || []).slice(-14).map(l => ({
        date: l.date.slice(5),
        amount: l.amount,
    }))

    const handleLogProgress = () => {
        logProgress(goal.id, Number(amount) || 1)
        setProgressOpen(false)
        setAmount(1)
    }

    const handleDelete = () => {
        deleteGoal(goal.id)
        navigate('/goals')
    }

    return (
        <Box>
            {/* Back */}
            <Button
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => navigate('/goals')}
                sx={{ mb: 2 }}
            >
                {tr.goals}
            </Button>

            <Grid container spacing={3}>
                {/* Main info */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3, borderLeft: `4px solid ${goal.color || catColor}` }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{goal.title}</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={tr[goal.category] || goal.category} size="small"
                                            sx={{ bgcolor: catColor + '22', color: catColor, fontWeight: 700 }} />
                                        <Chip label={getTypeLabel(goal.type, tr)} size="small" variant="outlined" />
                                        <Chip
                                            label={goal.status === 'active' ? tr.active : goal.status === 'paused' ? tr.paused : tr.completed}
                                            size="small"
                                            color={goal.status === 'active' ? 'success' : goal.status === 'paused' ? 'warning' : 'default'}
                                        />
                                    </Stack>
                                </Box>
                                <Stack direction="row" spacing={0.5}>
                                    <Tooltip title={tr.edit}>
                                        <IconButton onClick={() => navigate(`/goals/${id}/edit`)}>
                                            <EditRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={tr.delete}>
                                        <IconButton color="error" onClick={() => setDeleteOpen(true)}>
                                            <DeleteRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>

                            {/* Progress bar */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                        {goal.progress} / {goal.target} {unit}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: progressColor }}>{pct}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={pct}
                                    sx={{
                                        height: 14, borderRadius: 8,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                                        '& .MuiLinearProgress-bar': { bgcolor: progressColor },
                                    }}
                                />
                            </Box>

                            {/* Meta */}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tr.created}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {format(parseISO(goal.createdAt), 'MMM d, yyyy')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tr.started}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {goal.startDate ? format(parseISO(goal.startDate), 'MMM d, yyyy') : '—'}
                                    </Typography>
                                </Grid>
                                {goal.endDate && (
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tr.endDate}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {format(parseISO(goal.endDate), 'MMM d, yyyy')}
                                        </Typography>
                                    </Grid>
                                )}
                                {goal.notes && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tr.notesLabel}</Typography>
                                        <Typography variant="body2">{goal.notes}</Typography>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Action buttons */}
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {goal.status !== 'completed' && (
                                    <>
                                        <Button variant="contained" startIcon={<AddRoundedIcon />}
                                            onClick={() => setProgressOpen(true)}>
                                            {tr.addProgress}
                                        </Button>
                                        <Button variant="outlined" color="success" startIcon={<CheckCircleRoundedIcon />}
                                            onClick={() => markComplete(goal.id)}>
                                            {tr.markComplete}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={goal.status === 'paused' ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}
                                            onClick={() => togglePause(goal.id)}
                                        >
                                            {goal.status === 'paused' ? tr.resume : tr.pause}
                                        </Button>
                                    </>
                                )}
                                <Button variant="outlined" startIcon={<EditRoundedIcon />}
                                    onClick={() => navigate(`/goals/${id}/edit`)}>
                                    {tr.edit}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Progress chart */}
                    {chartData.length > 0 && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{tr.progressHistory}</Typography>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                                        <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                                        <RTooltip
                                            contentStyle={{
                                                backgroundColor: theme.palette.background.paper,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 12,
                                            }}
                                        />
                                        <Bar dataKey="amount" fill={goal.color || catColor} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Log history */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{tr.progressHistory}</Typography>
                            {goal.logs?.length === 0 || !goal.logs ? (
                                <EmptyState emoji="📊" title={tr.noHistory} />
                            ) : (
                                <List dense disablePadding>
                                    {[...goal.logs].reverse().map((log, i) => (
                                        <ListItem key={i} disablePadding sx={{
                                            py: 1, borderBottom: i < goal.logs.length - 1 ? '1px solid' : 'none',
                                            borderColor: 'divider',
                                        }}>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {format(parseISO(log.date), 'MMM d')}
                                                        </Typography>
                                                        <Chip
                                                            label={`+${log.amount} ${unit}`}
                                                            size="small"
                                                            sx={{ bgcolor: (goal.color || catColor) + '22', color: goal.color || catColor, fontWeight: 700 }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Log Progress Dialog */}
            <Dialog open={progressOpen} onClose={() => setProgressOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>{tr.addProgressEntry}</DialogTitle>
                <DialogContent>
                    <TextField
                        label={tr.amountLabel}
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        fullWidth
                        sx={{ mt: 1 }}
                        inputProps={{ min: 1 }}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setProgressOpen(false)}>{tr.cancel}</Button>
                    <Button variant="contained" onClick={handleLogProgress}>{tr.addProgress}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>{tr.confirmDelete}</DialogTitle>
                <DialogContent><Typography>{tr.confirmDeleteMsg}</Typography></DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteOpen(false)}>{tr.cancel}</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>{tr.confirm}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
