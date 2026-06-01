import React from 'react'
import { Box, Typography } from '@mui/material'

export default function PageHeader({ title, subtitle, action }) {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
        }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        </Box>
    )
}
