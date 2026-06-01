import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Box, Grid, Button, Tab, Tabs, TextField, InputAdornment,
    Select, MenuItem, FormControl, InputLabel, Stack, Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useApp } from '../context/AppContext'
import GoalCard from '../components/GoalCard'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

export default function GoalsList() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { tr, goals } = useApp()

    const [tab, setTab] = useState(searchParams.get('tab') || 'all')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')

    useEffect(() => {
        const t = searchParams.get('tab')
        if (t) setTab(t)
    }, [searchParams])

    const filtered = useMemo(() => {
        let list = [...goals]

        // Filter by tab
        if (tab === 'active') list = list.filter(g => g.status === 'active')
        else if (tab === 'completed') list = list.filter(g => g.status === 'completed')
        else if (tab === 'paused') list = list.filter(g => g.status === 'paused')

        // Search
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(g => g.title.toLowerCase().includes(q) || g.category?.toLowerCase().includes(q))
        }

        // Sort
        if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        else if (sort === 'progress') list.sort((a, b) => (b.progress / b.target) - (a.progress / a.target))
        else if (sort === 'category') list.sort((a, b) => a.category?.localeCompare(b.category))

        return list
    }, [goals, tab, search, sort])

    const tabs = [
        { value: 'all', label: tr.all },
        { value: 'active', label: tr.active },
        { value: 'paused', label: tr.paused },
        { value: 'completed', label: tr.completed },
    ]

    return (
        <Box>
            <PageHeader
                title={tr.allGoals}
                action={
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate('/goals/new')}>
                        {tr.newGoal}
                    </Button>
                }
            />

            {/* Filters */}
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2, '& .MuiTabs-indicator': { borderRadius: 4 } }}
                >
                    {tabs.map(t => (
                        <Tab key={t.value} value={t.value} label={t.label} sx={{ fontWeight: 700 }} />
                    ))}
                </Tabs>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        placeholder={tr.searchGoals}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>{tr.sortBy}</InputLabel>
                        <Select value={sort} onChange={e => setSort(e.target.value)} label={tr.sortBy}>
                            <MenuItem value="newest">{tr.newest}</MenuItem>
                            <MenuItem value="progress">{tr.progressPct}</MenuItem>
                            <MenuItem value="category">{tr.byCategory}</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            {filtered.length === 0 ? (
                <EmptyState
                    emoji="🔍"
                    title={tr.noGoalsFound}
                    action={tr.newGoal}
                    onAction={() => navigate('/goals/new')}
                />
            ) : (
                <Grid container spacing={2}>
                    {filtered.map(goal => (
                        <Grid item xs={12} sm={6} lg={4} key={goal.id}>
                            <GoalCard goal={goal} showRestore={goal.status === 'completed'} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    )
}
