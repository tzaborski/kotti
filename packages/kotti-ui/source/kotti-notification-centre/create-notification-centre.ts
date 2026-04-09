import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

import { KottiNotificationCentre } from './types'

export type NotificationCentreStore<
	T extends
		KottiNotificationCentre.NotificationInput = KottiNotificationCentre.NotificationInput,
> = {
	// State
	filter: Ref<KottiNotificationCentre.Filter>
	filteredNotifications: ComputedRef<T[]>
	isOpen: Ref<boolean>
	notifications: Ref<T[]>
	sortOrder: Ref<KottiNotificationCentre.SortOrder>
	unreadCount: ComputedRef<number>

	// Actions
	add: (notification: T) => void
	close: () => void
	markAllAsRead: () => void
	markAsRead: (id: string) => void
	markAsUnread: (id: string) => void
	open: () => void
	remove: (id: string) => void
	removeAll: () => void
	resetFilter: () => void
	setFilter: (updates: Partial<KottiNotificationCentre.Filter>) => void
	toggle: () => void
	toggleRead: (id: string) => void
}

export const createNotificationCentre = <
	T extends
		KottiNotificationCentre.NotificationInput = KottiNotificationCentre.NotificationInput,
>(
	initialNotifications: T[] = [],
): NotificationCentreStore<T> => {
	const notifications = ref(
		initialNotifications.map((n) =>
			KottiNotificationCentre.notificationSchema.parse(n),
		),
	) as Ref<T[]>
	const isOpen = ref(false)

	const sortOrder = ref<KottiNotificationCentre.SortOrder>('desc')

	const filter = ref<KottiNotificationCentre.Filter>({
		searchQuery: '',
		toggle: null,
		type: null,
	})
	const setFilter = (
		updates: Partial<KottiNotificationCentre.Filter>,
	): void => {
		filter.value = { ...filter.value, ...updates }
	}
	const resetFilter = (): void => {
		filter.value = {
			searchQuery: '',
			toggle: null,
			type: null,
		}
	}

	const filteredNotifications = computed(() => {
		let result = [...notifications.value]

		const { searchQuery, toggle, type } = filter.value

		if (type !== null) {
			result = result.filter((n) => n.type === type)
		}

		if (toggle !== null) {
			result = result.filter((n) => n.toggle === toggle)
		}

		if (searchQuery.trim() !== '') {
			const query = searchQuery.toLowerCase()
			result = result.filter(
				(n) =>
					n.title.toLowerCase().includes(query) ||
					n.content.toLowerCase().includes(query),
			)
		}

		result.sort((a, b) => {
			const timeA = new Date(a.timestamp).getTime()
			const timeB = new Date(b.timestamp).getTime()
			return sortOrder.value === 'desc' ? timeB - timeA : timeA - timeB
		})

		return result
	})

	const unreadCount = computed(
		() => notifications.value.filter((n) => n.toggle === 'unread').length,
	)

	const add = (notification: T): void => {
		const parsed = KottiNotificationCentre.notificationSchema.parse(
			notification,
		) as T
		notifications.value = [parsed, ...notifications.value]
	}

	const remove = (id: string): void => {
		notifications.value = notifications.value.filter((n) => n.id !== id)
	}

	const markAsRead = (id: string): void => {
		const notification = notifications.value.find((n) => n.id === id)
		if (notification !== undefined) notification.toggle = 'read'
	}

	const markAsUnread = (id: string): void => {
		const notification = notifications.value.find((n) => n.id === id)
		if (notification !== undefined) notification.toggle = 'unread'
	}

	const toggleRead = (id: string): void => {
		const notification = notifications.value.find((n) => n.id === id)
		if (notification !== undefined)
			notification.toggle = notification.toggle === 'read' ? 'unread' : 'read'
	}

	const markAllAsRead = (): void => {
		notifications.value.forEach((n) => {
			n.toggle = 'read'
		})
	}

	const removeAll = (): void => {
		notifications.value = []
	}

	const open = (): void => {
		isOpen.value = true
	}

	const close = (): void => {
		isOpen.value = false

		// Reset filters when closing the notification centre
		resetFilter()
	}

	const toggle = (): void => {
		isOpen.value = !isOpen.value
	}

	return {
		// State
		filter,
		filteredNotifications,
		isOpen,
		notifications,
		sortOrder,
		unreadCount,
		// Actions
		add,
		close,
		markAllAsRead,
		markAsRead,
		markAsUnread,
		open,
		remove,
		removeAll,
		resetFilter,
		setFilter,
		toggle,
		toggleRead,
	}
}
