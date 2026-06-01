import React from 'react'
import { Box, Typography, Button } from '@mui/material'

export default function EmptyState({ emoji = '🎯', title, subtitle, action, onAction }) {
    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', py: 8, textAlign: 'center',
        }}>
            <Typography sx={{ fontSize: 56, mb: 2, lineHeight: 1 }}>{emoji}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
            {subtitle && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>{subtitle}</Typography>
            )}
            {action && (
                <Button variant="contained" onClick={onAction}>{action}</Button>
            )}
        </Box>
    )
}
