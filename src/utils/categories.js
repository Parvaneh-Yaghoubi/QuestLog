export const CATEGORIES = ['Health', 'Study', 'Work', 'Personal', 'Finance', 'Fitness', 'Other']

export const CATEGORY_COLORS = {
    Health: '#4ADE80',
    Study: '#60A5FA',
    Work: '#FBBF24',
    Personal: '#F472B6',
    Finance: '#34D399',
    Fitness: '#FB923C',
    Other: '#A78BFA',
}

export const CATEGORY_ICONS = {
    Health: '🩺',
    Study: '📚',
    Work: '💼',
    Personal: '🌱',
    Finance: '💰',
    Fitness: '🏋️',
    Other: '✨',
}

export const GOAL_COLORS = [
    '#C8F04D', '#60A5FA', '#F472B6', '#FB923C',
    '#4ADE80', '#A78BFA', '#FBBF24', '#34D399',
    '#F87171', '#818CF8',
]

export function getCategoryColor(cat) {
    return CATEGORY_COLORS[cat] || '#A78BFA'
}

export function getProgressColor(pct) {
    if (pct >= 100) return '#4ADE80'
    if (pct >= 60) return '#C8F04D'
    if (pct >= 30) return '#FBBF24'
    return '#F87171'
}

export function getTypeLabel(type, tr) {
    if (type === 'daily') return tr.daily
    if (type === 'count') return tr.countBased
    if (type === 'time') return tr.timeBased
    return type
}

export function getUnitLabel(type, tr) {
    if (type === 'daily') return tr.days
    if (type === 'count') return tr.sessions
    if (type === 'time') return tr.minutes
    return ''
}
