import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card, CardContent, Box, Typography, LinearProgress,
    Chip, IconButton, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Stack,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded'
import { useApp } from '../context/AppContext'
import { getCategoryColor, getProgressColor, getUnitLabel } from '../utils/categories'

export default function GoalCard({ goal, showRestore = false }) {
    const navigate = useNavigate()
    const { tr, logProgress, deleteGoal, togglePause, restoreGoal } = useApp()
    const [deleteOpen, setDeleteOpen] = useState(false)

    const pct = goal.target > 0 ? Math.min(Math.round((goal.progress / goal.target) * 100), 100) : 0
    const catColor = getCategoryColor(goal.category)
    const progressColor = getProgressColor(pct)
    const unit = getUnitLabel(goal.type, tr)

    const statusLabel = goal.status === 'active' ? tr.active
        : goal.status === 'paused' ? tr.paused : tr.completed

    const statusColor = goal.status === 'active' ? 'success'
        : goal.status === 'paused' ? 'warning' : 'default'

    return (
        <>
            <Card
                sx={{
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme => theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.5)'
                            : '0 8px 32px rgba(0,0,0,0.12)',
                    },
                    borderLeft: `3px solid ${goal.color || catColor}`,
                }}
                onClick={() => navigate(`/goals/${goal.id}`)}
            >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, pr: 1, lineHeight: 1.3 }} noWrap>
                                {goal.title}
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                <Chip
                                    label={tr[goal.category] || goal.category}
                                    size="small"
                                    sx={{ bgcolor: catColor + '22', color: catColor, fontWeight: 700 }}
                                />
                                <Chip
                                    label={statusLabel}
                                    size="small"
                                    color={statusColor}
                                    variant={goal.status === 'completed' ? 'outlined' : 'filled'}
                                />
                            </Stack>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 0.25 }} onClick={e => e.stopPropagation()}>
                            {showRestore ? (
                                <Tooltip title={tr.restore}>
                                    <IconButton size="small" onClick={() => restoreGoal(goal.id)} color="primary">
                                        <RestoreRoundedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <>
                                    {goal.status !== 'completed' && (
                                        <Tooltip title={tr.markProgress}>
                                            <IconButton size="small" color="primary" onClick={() => logProgress(goal.id, 1)}>
                                                <AddCircleRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title={tr.edit}>
                                        <IconButton size="small" onClick={() => navigate(`/goals/${goal.id}/edit`)}>
                                            <EditRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {goal.status !== 'completed' && (
                                        <Tooltip title={goal.status === 'paused' ? tr.resume : tr.pause}>
                                            <IconButton size="small" onClick={() => togglePause(goal.id)}>
                                                {goal.status === 'paused'
                                                    ? <PlayArrowRoundedIcon fontSize="small" />
                                                    : <PauseRoundedIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title={tr.delete}>
                                        <IconButton size="small" color="error" onClick={() => setDeleteOpen(true)}>
                                            <DeleteRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Progress */}
                    <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {goal.progress} / {goal.target} {unit}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: progressColor }}>
                                {pct}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                '& .MuiLinearProgress-bar': { bgcolor: progressColor },
                            }}
                        />
                    </Box>

                    {/* Notes preview */}
                    {goal.notes && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }} noWrap>
                            {goal.notes}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Delete confirm */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>{tr.confirmDelete}</DialogTitle>
                <DialogContent>
                    <Typography>{tr.confirmDeleteMsg}</Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteOpen(false)}>{tr.cancel}</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => { deleteGoal(goal.id); setDeleteOpen(false) }}
                    >
                        {tr.confirm}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
