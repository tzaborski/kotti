<template>
	<div class="kt-notification-toolbar">
		<div class="kt-notification-toolbar__search">
			<i
				class="yoco kt-notification-toolbar__search-icon"
				v-text="Yoco.Icon.SEARCH"
			/>
			<input
				class="kt-notification-toolbar__search-input"
				placeholder="Search notifications..."
				type="text"
				:value="filter.searchQuery"
				@input="onSearchInput"
			/>
		</div>

		<div class="kt-notification-toolbar__filters">
			<div class="kt-notification-toolbar__filter-group">
				<button
					:class="{
						'kt-notification-toolbar__filter-btn': true,
						'kt-notification-toolbar__filter-btn--active':
							activeToggleFilter === 'unread',
					}"
					@click="onToggleFilter('unread')"
				>
					Unread
					<span v-if="unreadCount > 0" class="kt-notification-toolbar__badge">
						{{ unreadCount }}
					</span>
				</button>
				<button
					:class="{
						'kt-notification-toolbar__filter-btn': true,
						'kt-notification-toolbar__filter-btn--active':
							activeToggleFilter === 'read',
					}"
					@click="onToggleFilter('read')"
				>
					Read
				</button>
			</div>

			<div class="kt-notification-toolbar__filter-group">
				<button
					:class="{
						'kt-notification-toolbar__filter-btn': true,
						'kt-notification-toolbar__filter-btn--active':
							activeTypeFilter === 'info',
					}"
					@click="onTypeFilter('info')"
				>
					Info
				</button>
				<button
					:class="{
						'kt-notification-toolbar__filter-btn': true,
						'kt-notification-toolbar__filter-btn--active':
							activeTypeFilter === 'warning',
					}"
					@click="onTypeFilter('warning')"
				>
					Warning
				</button>
				<button
					:class="{
						'kt-notification-toolbar__filter-btn': true,
						'kt-notification-toolbar__filter-btn--active':
							activeTypeFilter === 'error',
					}"
					@click="onTypeFilter('error')"
				>
					Error
				</button>
			</div>
		</div>

		<div class="kt-notification-toolbar__actions">
			<KtButton
				aria-label="Toggle sort order"
				helpText="Toggle sort order"
				:icon="sortOrder === 'desc' ? Yoco.Icon.ARROW_DOWN : Yoco.Icon.ARROW_UP"
				size="small"
				type="text"
				@click="onToggleSortOrder"
			/>

			<KtButton
				aria-label="Mark all as read"
				:icon="Yoco.Icon.CHECK"
				size="small"
				type="text"
				@click="onMarkAllRead"
			>
				Mark all as read
			</KtButton>

			<KtButton
				aria-label="Remove all notifications"
				helpText="Remove all notifications"
				:icon="Yoco.Icon.TRASH"
				size="small"
				type="text"
				@click="onRemoveAll"
			/>
		</div>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'

import { Yoco } from '@3yourmind/yoco'

import KtButton from '../../kotti-button/KtButton.vue'
import type { KottiNotificationCentre } from '../types'

export default defineComponent({
	name: 'NotificationToolbar',
	components: {
		KtButton,
	},
	props: {
		filter: {
			required: true,
			type: Object as PropType<KottiNotificationCentre.Filter>,
		},
		sortOrder: {
			required: true,
			type: String as PropType<KottiNotificationCentre.SortOrder>,
		},
		unreadCount: {
			required: true,
			type: Number,
		},
	},
	emits: ['markAllRead', 'removeAll', 'update:filter', 'update:sortOrder'],
	setup(props, { emit }) {
		const activeToggleFilter = computed(() => props.filter.toggle)
		const activeTypeFilter = computed(() => props.filter.type)

		return {
			activeToggleFilter,
			activeTypeFilter,
			onMarkAllRead: () => {
				emit('markAllRead')
			},
			onRemoveAll: () => {
				emit('removeAll')
			},
			onSearchInput: (event: Event) => {
				const target = event.target as HTMLInputElement
				emit('update:filter', {
					...props.filter,
					searchQuery: target.value,
				})
			},
			onToggleFilter: (
				toggle: KottiNotificationCentre.NotificationToggle | null,
			) => {
				emit('update:filter', {
					...props.filter,
					toggle: props.filter.toggle === toggle ? null : toggle,
				})
			},
			onToggleSortOrder: () => {
				emit('update:sortOrder', props.sortOrder === 'desc' ? 'asc' : 'desc')
			},
			onTypeFilter: (type: KottiNotificationCentre.NotificationType | null) => {
				emit('update:filter', {
					...props.filter,
					type: props.filter.type === type ? null : type,
				})
			},
			Yoco,
		}
	},
})
</script>

<style lang="scss" scoped>
.kt-notification-toolbar {
	display: flex;
	flex-direction: column;
	gap: var(--unit-2);
	padding: var(--unit-2) var(--unit-3);
	border-bottom: 1px solid var(--ui-02);

	&__search {
		position: relative;
		display: flex;
		align-items: center;
	}

	&__search-icon {
		position: absolute;
		left: var(--unit-2);
		font-size: var(--unit-4);
		color: var(--icon-02);
		pointer-events: none;
	}

	&__search-input {
		width: 100%;
		padding: var(--unit-1) var(--unit-2) var(--unit-1) var(--unit-7);
		font-size: var(--font-size-small);
		color: var(--text-01);
		outline: none;
		background-color: var(--ui-01);
		border: 1px solid var(--ui-02);
		border-radius: var(--border-radius);
		transition: border-color 0.15s ease;

		&::placeholder {
			color: var(--text-03);
		}

		&:focus {
			border-color: var(--interactive-01);
		}
	}

	&__filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--unit-2);
	}

	&__filter-group {
		display: flex;
		gap: 2px;
	}

	&__filter-btn {
		padding: 2px var(--unit-2);
		font-size: var(--font-size-small);
		color: var(--text-02);
		cursor: pointer;
		background: none;
		border: 1px solid var(--ui-02);
		border-radius: var(--border-radius);
		transition: all 0.15s ease;

		&:hover {
			background-color: var(--ui-01);
		}

		&--active {
			color: var(--interactive-01-dark);
			background-color: var(--interactive-03);
			border-color: var(--interactive-01);
		}
	}

	&__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--unit-4);
		height: var(--unit-4);
		padding: 0 4px;
		font-size: 10px;
		font-weight: 700;
		color: var(--ui-background);
		background-color: var(--interactive-01);
		border-radius: var(--unit-2);
	}

	&__actions {
		display: flex;
		gap: var(--unit-1);
		align-items: center;
		justify-content: flex-end;
	}
}
</style>
