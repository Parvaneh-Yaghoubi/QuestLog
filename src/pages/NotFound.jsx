import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { useApp } from '../context/AppContext'

export default function NotFound() {
    const navigate = useNavigate()
    const { tr } = useApp()

    return (
        <Box sx={{
            minHeight: '80vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
            <Typography sx={{ fontSize: 120, fontWeight: 900, color: 'primary.main', lineHeight: 1, mb: 2 }}>
                {tr.notFound}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {tr.notFoundMsg}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                The page you're looking for doesn't exist.
            </Typography>
            <Button
                variant="contained"
                size="large"
                startIcon={<HomeRoundedIcon />}
                onClick={() => navigate('/')}
            >
                {tr.goHome}
            </Button>
        </Box>
    )
}
