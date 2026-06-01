import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box, Grid, Button, TextField, Select, MenuItem,
    FormControl, InputLabel, FormHelperText, Typography,
    ToggleButton, ToggleButtonGroup, Stack, Divider,
    RadioGroup, FormControlLabel, Radio, FormLabel,
} from '@mui/material'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useApp } from '../context/AppContext'
import { CATEGORIES, GOAL_COLORS } from '../utils/categories'
import PageHeader from '../components/PageHeader'

const defaultForm = {
    title: '',
    category: 'Health',
    type: 'daily',
    target: 30,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    color: '#C8F04D',
    notes: '',
}

export default function GoalForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { tr, goals, createGoal, updateGoal } = useApp()
    const isEdit = Boolean(id)

    const [form, setForm] = useState(defaultForm)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEdit && id !== 'new') {
            const goal = goals.find(g => g.id === id)
            if (goal) {
                setForm({
                    title: goal.title || '',
                    category: goal.category || 'Health',
                    type: goal.type || 'daily',
                    target: goal.target || 30,
                    startDate: goal.startDate || new Date().toISOString().slice(0, 10),
                    endDate: goal.endDate || '',
                    color: goal.color || '#C8F04D',
                    notes: goal.notes || '',
                })
            }
        }
    }, [id, goals, isEdit])

    const set = (key, val) => {
        setForm(prev => ({ ...prev, [key]: val }))
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
    }

    const validate = () => {
        const errs = {}
        if (!form.title.trim()) errs.title = tr.required
        if (!form.category) errs.category = tr.required
        if (!form.target || form.target < 1) errs.target = tr.required
        return errs
    }

    const handleSubmit = () => {
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        if (isEdit) {
            updateGoal(id, form)
        } else {
            createGoal(form)
        }
        navigate('/goals')
    }

    const targetLabel = form.type === 'daily' ? tr.targetDays
        : form.type === 'count' ? tr.targetCount
            : tr.targetMinutes

    return (
        <Box>
            <PageHeader
                title={isEdit ? tr.editGoal : tr.createGoal}
                action={
                    <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>
                        {tr.cancel}
                    </Button>
                }
            />

            <Box sx={{ maxWidth: 640 }}>
                <Grid container spacing={3}>
                    {/* Title */}
                    <Grid item xs={12}>
                        <TextField
                            label={tr.titleLabel}
                            placeholder={tr.titlePlaceholder}
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                            fullWidth
                            required
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={Boolean(errors.category)}>
                            <InputLabel>{tr.categoryLabel}</InputLabel>
                            <Select value={form.category} onChange={e => set('category', e.target.value)} label={tr.categoryLabel}>
                                {CATEGORIES.map(c => (
                                    <MenuItem key={c} value={c}>{tr[c] || c}</MenuItem>
                                ))}
                            </Select>
                            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    {/* Target */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={targetLabel}
                            type="number"
                            value={form.target}
                            onChange={e => set('target', Number(e.target.value))}
                            error={Boolean(errors.target)}
                            helperText={errors.target}
                            fullWidth
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    {/* Goal Type */}
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>{tr.goalType}</FormLabel>
                            <RadioGroup
                                row
                                value={form.type}
                                onChange={e => set('type', e.target.value)}
                            >
                                <FormControlLabel value="daily" control={<Radio />} label={tr.daily} />
                                <FormControlLabel value="count" control={<Radio />} label={tr.countBased} />
                                <FormControlLabel value="time" control={<Radio />} label={tr.timeBased} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {/* Dates */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={tr.startDate}
                            type="date"
                            value={form.startDate}
                            onChange={e => set('startDate', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={tr.endDate}
                            type="date"
                            value={form.endDate}
                            onChange={e => set('endDate', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Color */}
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>{tr.colorLabel}</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {GOAL_COLORS.map(color => (
                                <Box
                                    key={color}
                                    onClick={() => set('color', color)}
                                    sx={{
                                        width: 32, height: 32, borderRadius: '50%', bgcolor: color,
                                        cursor: 'pointer',
                                        border: form.color === color ? '3px solid white' : '3px solid transparent',
                                        outline: form.color === color ? `2px solid ${color}` : 'none',
                                        transition: 'transform 0.1s',
                                        '&:hover': { transform: 'scale(1.15)' },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    {/* Notes */}
                    <Grid item xs={12}>
                        <TextField
                            label={tr.notesLabel}
                            placeholder={tr.notesPlaceholder}
                            value={form.notes}
                            onChange={e => set('notes', e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SaveRoundedIcon />}
                                onClick={handleSubmit}
                            >
                                {tr.save}
                            </Button>
                            <Button variant="outlined" size="large" onClick={() => navigate(-1)}>
                                {tr.cancel}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
