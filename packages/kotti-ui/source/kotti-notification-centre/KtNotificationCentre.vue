<template>
	<teleport to="body">
		<transition name="kt-notification-centre">
			<div
				v-if="isOpen"
				aria-label="Notification Centre"
				class="kt-notification-centre__mask"
				role="dialog"
				@click.self="onMaskClick"
			>
				<div class="kt-notification-centre__panel">
					<div class="kt-notification-centre__header">
						<div class="kt-notification-centre__title-row">
							<i
								class="yoco kt-notification-centre__icon"
								v-text="Yoco.Icon.BELL"
							/>
							<h2 class="kt-notification-centre__title">Notifications</h2>
							<span
								v-if="unreadCount > 0"
								class="kt-notification-centre__count"
							>
								{{ unreadCount }}
							</span>
						</div>
						<KtButton
							aria-label="Close notification centre"
							helpText="Close notification centre"
							:icon="Yoco.Icon.CLOSE"
							type="text"
							@click="close()"
						/>
					</div>

					<NotificationToolbar
						:filter="filter"
						:sortOrder="sortOrder"
						:unreadCount="unreadCount"
						@markAllRead="onMarkAllRead"
						@removeAll="onRemoveAll"
						@update:filter="onUpdateFilter"
						@update:sortOrder="onUpdateSortOrder"
					/>

					<div class="kt-notification-centre__list">
						<TransitionGroup name="kt-notification-centre-item">
							<template
								v-for="notification in filteredNotifications"
								:key="notification.id"
							>
								<slot
									name="item"
									:notification="notification"
									:onDelete="() => onDelete(notification.id)"
									:onToggleRead="() => onToggleRead(notification.id)"
								>
									<KtNotification
										:content="notification.content"
										:isUnread="notification.toggle === 'unread'"
										:timestamp="notification.timestamp"
										:title="notification.title"
										:type="notification.type"
										@click="onNotificationClick(notification)"
										@delete="() => onDelete(notification.id)"
										@toggleRead="() => onToggleRead(notification.id)"
									/>
								</slot>
							</template>
						</TransitionGroup>

						<div
							v-if="filteredNotifications.length === 0"
							class="kt-notification-centre__empty"
						>
							<i
								class="yoco kt-notification-centre__empty-icon"
								v-text="Yoco.Icon.BELL"
							/>
							<p class="kt-notification-centre__empty-text">No notifications</p>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</teleport>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'

import { Yoco } from '@3yourmind/yoco'

import KtButton from '../kotti-button/KtButton.vue'
import KtNotification from '../kotti-notification/KtNotification.vue'
import { makeProps } from '../make-props'

import NotificationToolbar from './components/NotificationToolbar.vue'
import type { NotificationCentreStore } from './create-notification-centre'
import { KottiNotificationCentre } from './types'

export default defineComponent({
	name: 'KtNotificationCentre',
	components: {
		KtButton,
		KtNotification,
		NotificationToolbar,
	},
	props: makeProps(KottiNotificationCentre.propsSchema),
	emits: ['notificationClick'],
	setup(props, { emit }) {
		const store = props.notificationCentre as unknown as NotificationCentreStore
		const { isOpen, unreadCount, filteredNotifications, filter, sortOrder } =
			store

		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape' && isOpen.value) {
				store.close()
			}
		}

		onMounted(() => {
			document.addEventListener('keydown', onKeyDown)
		})

		onBeforeUnmount(() => {
			document.removeEventListener('keydown', onKeyDown)
		})

		return {
			filter,
			filteredNotifications,
			isOpen,
			sortOrder,
			store,
			unreadCount,
			Yoco,
			// Actions
			close: () => {
				store.close()
			},
			onDelete: (id: string) => {
				store.remove(id)
			},
			onMarkAllRead: () => {
				store.markAllAsRead()
			},
			onMaskClick: () => {
				store.close()
			},
			onNotificationClick: (
				notification: KottiNotificationCentre.Notification,
			) => {
				emit('notificationClick', notification)
			},
			onRemoveAll: () => {
				store.removeAll()
			},
			onToggleRead: (id: string) => {
				store.toggleRead(id)
			},
			onUpdateFilter: (filter: KottiNotificationCentre.Filter) => {
				store.setFilter(filter)
			},
			onUpdateSortOrder: (order: KottiNotificationCentre.SortOrder) => {
				sortOrder.value = order
			},
		}
	},
})
</script>

<style lang="scss">
:root {
	--kt-notification-centre-width: 30rem;
	--kt-notification-centre-mask-background: rgb(0 0 0 / 50%);
	--kt-notification-centre-shadow: var(--shadow-lg);
}

:root[data-theme='dark'] {
	--kt-notification-centre-mask-background: rgb(0 0 0 / 70%);
	--kt-notification-centre-shadow: 0 0 32px rgb(180 180 255 / 10%);
}
</style>

<style lang="scss" scoped>
@import '../kotti-style/_variables';

.kt-notification-centre {
	&__mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: $zindex-4;
		display: flex;
		justify-content: flex-end;
		width: 100%;
		height: 100%;
		background-color: var(--kt-notification-centre-mask-background);
	}

	&__panel {
		display: flex;
		flex-direction: column;
		width: var(--kt-notification-centre-width);
		max-width: 100%;
		height: 100%;
		background-color: var(--ui-background);
		border-left: 1px solid var(--ui-02);
		box-shadow: var(--kt-notification-centre-shadow);
		transition: transform 0.3s ease;
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--unit-3) var(--unit-3) var(--unit-2);
	}

	&__title-row {
		display: flex;
		gap: var(--unit-2);
		align-items: center;
	}

	&__icon {
		font-size: var(--unit-6);
		color: var(--icon-01);
	}

	&__title {
		margin: 0;
		font-size: var(--font-size-xlarge);
		font-weight: 700;
		color: var(--text-01);
	}

	&__count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--unit-5);
		height: var(--unit-5);
		padding: 0 var(--unit-1);
		font-size: var(--font-size-small);
		font-weight: 700;
		color: var(--ui-background);
		background-color: var(--interactive-01);
		border-radius: var(--unit-2);
	}

	&__list {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	&__empty {
		display: flex;
		flex-direction: column;
		gap: var(--unit-2);
		align-items: center;
		justify-content: center;
		padding: var(--unit-8);
		color: var(--text-03);
	}

	&__empty-icon {
		font-size: var(--unit-8);
		opacity: 0.4;
	}

	&__empty-text {
		margin: 0;
		font-size: var(--font-size-small);
	}

	/* Vue Transition: overlay */

	&-enter-active {
		transition: opacity 0.25s ease;
	}

	&-leave-active {
		transition: opacity 0.2s ease;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-enter-active &__panel {
		animation: kt-notification-centre-slide-in 0.3s ease;
	}

	&-leave-active &__panel {
		animation: kt-notification-centre-slide-out 0.2s ease;
	}
}

.kt-notification-centre-item-enter-active {
	transition: all 0.25s ease;
}

.kt-notification-centre-item-leave-active {
	transition: all 0.2s ease;
}

.kt-notification-centre-item-enter-from {
	opacity: 0;
	transform: translateX(20px);
}

.kt-notification-centre-item-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

@keyframes kt-notification-centre-slide-in {
	from {
		transform: translateX(100%);
	}

	to {
		transform: translateX(0);
	}
}

@keyframes kt-notification-centre-slide-out {
	from {
		transform: translateX(0);
	}

	to {
		transform: translateX(100%);
	}
}

@media (width < $size-md) {
	.kt-notification-centre {
		&__panel {
			width: 100%;
		}
	}
}
</style>
