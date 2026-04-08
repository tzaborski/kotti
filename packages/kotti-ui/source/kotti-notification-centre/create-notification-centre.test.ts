import { describe, expect, it } from 'vitest'

import { createNotificationCentre } from './create-notification-centre'
import type { KottiNotificationCentre } from './types'

const makeNotification = (
	overrides: Partial<KottiNotificationCentre.NotificationInput> = {},
): KottiNotificationCentre.NotificationInput => ({
	content: 'Default content',
	id: `n-${Math.random().toString(36).slice(2)}`,
	timestamp: '2026-04-09T10:00:00Z',
	title: 'Default Title',
	...overrides,
})

describe('createNotificationCentre', () => {
	describe('initialisation', () => {
		it('creates an empty store by default', () => {
			const store = createNotificationCentre()

			expect(store.notifications.value).toHaveLength(0)
			expect(store.isOpen.value).toBe(false)
			expect(store.sortOrder.value).toBe('desc')
			expect(store.unreadCount.value).toBe(0)
		})

		it('accepts initial notifications', () => {
			const store = createNotificationCentre([
				makeNotification({ id: '1' }),
				makeNotification({ id: '2' }),
			])

			expect(store.notifications.value).toHaveLength(2)
		})

		it('applies defaults to initial notifications (toggle, type)', () => {
			const store = createNotificationCentre([makeNotification({ id: '1' })])

			expect(store.notifications.value[0]!.toggle).toBe('unread')
			expect(store.notifications.value[0]!.type).toBe('info')
		})

		it('preserves explicit toggle and type on initial notifications', () => {
			const store = createNotificationCentre([
				makeNotification({ id: '1', toggle: 'read', type: 'error' }),
			])

			expect(store.notifications.value[0]!.toggle).toBe('read')
			expect(store.notifications.value[0]!.type).toBe('error')
		})

		it('initialises filter with empty defaults', () => {
			const store = createNotificationCentre()

			expect(store.filter.value).toEqual({
				searchQuery: '',
				toggle: null,
				type: null,
			})
		})
	})

	describe('add', () => {
		it('prepends a notification to the list', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'existing' }),
			])

			store.add(makeNotification({ id: 'new' }))

			expect(store.notifications.value).toHaveLength(2)
			expect(store.notifications.value[0]!.id).toBe('new')
		})

		it('applies schema defaults when adding', () => {
			const store = createNotificationCentre()

			store.add(makeNotification({ id: 'added' }))

			expect(store.notifications.value[0]!.toggle).toBe('unread')
			expect(store.notifications.value[0]!.type).toBe('info')
		})
	})

	describe('remove', () => {
		it('removes a notification by id', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'a' }),
				makeNotification({ id: 'b' }),
			])

			store.remove('a')

			expect(store.notifications.value).toHaveLength(1)
			expect(store.notifications.value[0]!.id).toBe('b')
		})

		it('does nothing when id does not exist', () => {
			const store = createNotificationCentre([makeNotification({ id: 'a' })])

			store.remove('nonexistent')

			expect(store.notifications.value).toHaveLength(1)
		})
	})

	describe('removeAll', () => {
		it('clears all notifications', () => {
			const store = createNotificationCentre([
				makeNotification({ id: '1' }),
				makeNotification({ id: '2' }),
			])

			store.removeAll()

			expect(store.notifications.value).toHaveLength(0)
		})
	})

	describe('markAsRead', () => {
		it('marks a notification as read', () => {
			const store = createNotificationCentre([makeNotification({ id: 'a' })])

			expect(store.notifications.value[0]!.toggle).toBe('unread')

			store.markAsRead('a')

			expect(store.notifications.value[0]!.toggle).toBe('read')
		})

		it('does nothing when id does not exist', () => {
			const store = createNotificationCentre([makeNotification({ id: 'a' })])

			store.markAsRead('nonexistent')

			expect(store.notifications.value[0]!.toggle).toBe('unread')
		})
	})

	describe('markAsUnread', () => {
		it('marks a notification as unread', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'a', toggle: 'read' }),
			])

			store.markAsUnread('a')

			expect(store.notifications.value[0]!.toggle).toBe('unread')
		})

		it('does nothing when id does not exist', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'a', toggle: 'read' }),
			])

			store.markAsUnread('nonexistent')

			expect(store.notifications.value[0]!.toggle).toBe('read')
		})
	})

	describe('toggleRead', () => {
		it('toggles unread to read', () => {
			const store = createNotificationCentre([makeNotification({ id: 'a' })])

			store.toggleRead('a')

			expect(store.notifications.value[0]!.toggle).toBe('read')
		})

		it('toggles read to unread', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'a', toggle: 'read' }),
			])

			store.toggleRead('a')

			expect(store.notifications.value[0]!.toggle).toBe('unread')
		})

		it('does nothing when id does not exist', () => {
			const store = createNotificationCentre([makeNotification({ id: 'a' })])

			store.toggleRead('nonexistent')

			expect(store.notifications.value[0]!.toggle).toBe('unread')
		})
	})

	describe('markAllAsRead', () => {
		it('marks every notification as read', () => {
			const store = createNotificationCentre([
				makeNotification({ id: '1' }),
				makeNotification({ id: '2' }),
				makeNotification({ id: '3', toggle: 'read' }),
			])

			store.markAllAsRead()

			expect(store.notifications.value.every((n) => n.toggle === 'read')).toBe(
				true,
			)
		})
	})

	describe('unreadCount', () => {
		it('counts only unread notifications', () => {
			const store = createNotificationCentre([
				makeNotification({ id: '1' }),
				makeNotification({ id: '2', toggle: 'read' }),
				makeNotification({ id: '3' }),
			])

			expect(store.unreadCount.value).toBe(2)
		})

		it('updates reactively when a notification is marked as read', () => {
			const store = createNotificationCentre([makeNotification({ id: '1' })])

			expect(store.unreadCount.value).toBe(1)

			store.markAsRead('1')

			expect(store.unreadCount.value).toBe(0)
		})
	})

	describe('filter', () => {
		describe('by type', () => {
			it('returns only notifications matching the type filter', () => {
				const store = createNotificationCentre([
					makeNotification({ id: '1', type: 'error' }),
					makeNotification({ id: '2', type: 'info' }),
					makeNotification({ id: '3', type: 'error' }),
				])

				store.setFilter({ type: 'error' })

				expect(store.filteredNotifications.value).toHaveLength(2)
				expect(
					store.filteredNotifications.value.every((n) => n.type === 'error'),
				).toBe(true)
			})
		})

		describe('by toggle', () => {
			it('returns only unread notifications when toggle filter is "unread"', () => {
				const store = createNotificationCentre([
					makeNotification({ id: '1' }),
					makeNotification({ id: '2', toggle: 'read' }),
				])

				store.setFilter({ toggle: 'unread' })

				expect(store.filteredNotifications.value).toHaveLength(1)
				expect(store.filteredNotifications.value[0]!.id).toBe('1')
			})

			it('returns only read notifications when toggle filter is "read"', () => {
				const store = createNotificationCentre([
					makeNotification({ id: '1' }),
					makeNotification({ id: '2', toggle: 'read' }),
				])

				store.setFilter({ toggle: 'read' })

				expect(store.filteredNotifications.value).toHaveLength(1)
				expect(store.filteredNotifications.value[0]!.id).toBe('2')
			})
		})

		describe('by searchQuery', () => {
			it('matches against title (case-insensitive)', () => {
				const store = createNotificationCentre([
					makeNotification({ id: '1', title: 'Deployment failed' }),
					makeNotification({ id: '2', title: 'Build succeeded' }),
				])

				store.setFilter({ searchQuery: 'deploy' })

				expect(store.filteredNotifications.value).toHaveLength(1)
				expect(store.filteredNotifications.value[0]!.id).toBe('1')
			})

			it('matches against content (case-insensitive)', () => {
				const store = createNotificationCentre([
					makeNotification({
						content: 'Error in pipeline',
						id: '1',
						title: 'Alert',
					}),
					makeNotification({
						content: 'All good',
						id: '2',
						title: 'Info',
					}),
				])

				store.setFilter({ searchQuery: 'pipeline' })

				expect(store.filteredNotifications.value).toHaveLength(1)
				expect(store.filteredNotifications.value[0]!.id).toBe('1')
			})

			it('ignores whitespace-only search queries', () => {
				const store = createNotificationCentre([
					makeNotification({ id: '1' }),
					makeNotification({ id: '2' }),
				])

				store.setFilter({ searchQuery: '   ' })

				expect(store.filteredNotifications.value).toHaveLength(2)
			})
		})

		describe('combined filters', () => {
			it('applies type and toggle filters together', () => {
				const store = createNotificationCentre([
					makeNotification({ id: '1', toggle: 'read', type: 'error' }),
					makeNotification({ id: '2', type: 'error' }),
					makeNotification({ id: '3', type: 'info' }),
				])

				store.setFilter({ toggle: 'unread', type: 'error' })

				expect(store.filteredNotifications.value).toHaveLength(1)
				expect(store.filteredNotifications.value[0]!.id).toBe('2')
			})

			it('applies type, toggle, and searchQuery together', () => {
				const store = createNotificationCentre([
					makeNotification({
						id: '1',
						title: 'Deploy error',
						type: 'error',
					}),
					makeNotification({
						id: '2',
						title: 'Build error',
						type: 'error',
					}),
					makeNotification({
						id: '3',
						title: 'Deploy ok',
						type: 'success',
					}),
				])

				store.setFilter({ searchQuery: 'deploy', type: 'error' })

				expect(store.filteredNotifications.value).toHaveLength(1)
				expect(store.filteredNotifications.value[0]!.id).toBe('1')
			})
		})
	})

	describe('setFilter', () => {
		it('merges partial updates into the existing filter', () => {
			const store = createNotificationCentre()

			store.setFilter({ type: 'error' })
			expect(store.filter.value.type).toBe('error')
			expect(store.filter.value.searchQuery).toBe('')

			store.setFilter({ searchQuery: 'test' })
			expect(store.filter.value.type).toBe('error')
			expect(store.filter.value.searchQuery).toBe('test')
		})
	})

	describe('resetFilter', () => {
		it('resets filter to initial defaults', () => {
			const store = createNotificationCentre()

			store.setFilter({
				searchQuery: 'something',
				toggle: 'read',
				type: 'error',
			})

			store.resetFilter()

			expect(store.filter.value).toEqual({
				searchQuery: '',
				toggle: null,
				type: null,
			})
		})
	})

	describe('sortOrder', () => {
		it('sorts descending by default (newest first)', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'old', timestamp: '2026-01-01T00:00:00Z' }),
				makeNotification({ id: 'new', timestamp: '2026-04-09T00:00:00Z' }),
			])

			expect(store.filteredNotifications.value[0]!.id).toBe('new')
			expect(store.filteredNotifications.value[1]!.id).toBe('old')
		})

		it('sorts ascending when sortOrder is "asc" (oldest first)', () => {
			const store = createNotificationCentre([
				makeNotification({ id: 'old', timestamp: '2026-01-01T00:00:00Z' }),
				makeNotification({ id: 'new', timestamp: '2026-04-09T00:00:00Z' }),
			])

			store.sortOrder.value = 'asc'

			expect(store.filteredNotifications.value[0]!.id).toBe('old')
			expect(store.filteredNotifications.value[1]!.id).toBe('new')
		})
	})
})
