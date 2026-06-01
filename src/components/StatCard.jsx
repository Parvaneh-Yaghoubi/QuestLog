import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'

export default function StatCard({ icon, label, value, sub, color, gradient }) {
    return (
        <Card sx={{
            background: gradient || undefined,
            position: 'relative',
            overflow: 'hidden',
        }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="caption" sx={{
                            color: gradient ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.68rem',
                            display: 'block', mb: 0.5,
                        }}>
                            {label}
                        </Typography>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            color: gradient ? '#fff' : color || 'text.primary',
                            lineHeight: 1.1,
                        }}>
                            {value}
                        </Typography>
                        {sub && (
                            <Typography variant="caption" sx={{ color: gradient ? 'rgba(255,255,255,0.65)' : 'text.secondary' }}>
                                {sub}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        width: 44, height: 44, borderRadius: 3,
                        bgcolor: gradient ? 'rgba(255,255,255,0.18)' : color ? color + '22' : 'action.hover',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22,
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
