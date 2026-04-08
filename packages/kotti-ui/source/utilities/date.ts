import dayjs from 'dayjs'

const SIXTY_MINUTES = 60
const TWENTY_FOUR_HOURS = 24
const THIRTY_DAYS = 30
const TWELVE_MONTHS = 12

export const getRelativeTime = (timestamp: string): string => {
	const now = dayjs()
	const then = dayjs(timestamp)
	const diffMinutes = now.diff(then, 'minute')

	if (diffMinutes < 1) return 'just now'
	if (diffMinutes < SIXTY_MINUTES) return `${diffMinutes}m ago`

	const diffHours = now.diff(then, 'hour')
	if (diffHours < TWENTY_FOUR_HOURS) return `${diffHours}h ago`

	const diffDays = now.diff(then, 'day')
	if (diffDays < THIRTY_DAYS) return `${diffDays}d ago`

	const diffMonths = now.diff(then, 'month')
	if (diffMonths < TWELVE_MONTHS) return `${diffMonths}mo ago`

	return `${now.diff(then, 'year')}y ago`
}
