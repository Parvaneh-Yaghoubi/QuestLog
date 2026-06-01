import React, { useState } from 'react'
import {
    Box, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup,
    Stack, Divider, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Alert,
} from '@mui/material'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'

export default function Settings() {
    const { tr, prefs, setLanguage, setTheme, clearAllData } = useApp()
    const [clearOpen, setClearOpen] = useState(false)

    return (
        <Box>
            <PageHeader title={tr.settingsTitle} />

            <Stack spacing={3} sx={{ maxWidth: 560 }}>
                {/* Language */}
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <LanguageRoundedIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{tr.language}</Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={prefs.language}
                            exclusive
                            onChange={(_, v) => v && setLanguage(v)}
                            sx={{ '& .MuiToggleButton-root': { fontWeight: 700, px: 3 } }}
                        >
                            <ToggleButton value="en">🇺🇸 English</ToggleButton>
                            <ToggleButton value="ar">🇸🇦 العربية</ToggleButton>
                            <ToggleButton value="fa">🇮🇷 فارسی</ToggleButton>
                        </ToggleButtonGroup>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5 }}>
                        </Typography>
                    </CardContent>
                </Card>

                {/* Theme */}
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <PaletteRoundedIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{tr.theme}</Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={prefs.theme}
                            exclusive
                            onChange={(_, v) => v && setTheme(v)}
                            sx={{ '& .MuiToggleButton-root': { fontWeight: 700, px: 3 } }}
                        >
                            <ToggleButton value="light">☀️ {tr.lightMode}</ToggleButton>
                            <ToggleButton value="dark">🌙 {tr.darkMode}</ToggleButton>
                        </ToggleButtonGroup>
                    </CardContent>
                </Card>

                {/* About */}
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>{tr.aboutTitle}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                            {tr.aboutDesc}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tr.aboutVersion}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>1.0.0</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tr.aboutStorage}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>localStorage</Typography>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <WarningAmberRoundedIcon color="error" />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>{tr.dangerZone}</Typography>
                        </Box>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            {tr.clearConfirm}
                        </Alert>
                        <Button variant="outlined" color="error" onClick={() => setClearOpen(true)}>
                            {tr.clearData}
                        </Button>
                    </CardContent>
                </Card>
            </Stack>

            {/* Clear Confirm Dialog */}
            <Dialog open={clearOpen} onClose={() => setClearOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: 'error.main' }}>⚠️ {tr.dangerZone}</DialogTitle>
                <DialogContent>
                    <Typography>{tr.clearConfirm}</Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setClearOpen(false)}>{tr.cancel}</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => { clearAllData(); setClearOpen(false) }}
                    >
                        {tr.clearData}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
