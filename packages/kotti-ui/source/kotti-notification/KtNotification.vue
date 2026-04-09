<template>
	<div :aria-label="title" :class="{
		'kt-notification-item': true,
		'kt-notification-item--is-unread': isUnread,
	}" role="article">
		<!-- #item slot: replaces the entire item layout -->
		<slot :absoluteTimestamp="absoluteTimestamp" :isUnread="isUnread" name="item" :onDelete="onDelete"
			:onToggleRead="onToggleRead" :relativeTimestamp="relativeTimestamp">
			<div class="kt-notification-item__icon" :style="{
				color: typeStyle.darkColor,
				backgroundColor: typeStyle.backgroundColor,
			}">
				<i class="yoco" v-text="typeStyle.icon" />
			</div>

			<!-- #content slot: replaces the middle content area -->
			<div class="kt-notification-item__content">
				<slot :absoluteTimestamp="absoluteTimestamp" :isUnread="isUnread" name="content"
					:relativeTimestamp="relativeTimestamp">
					<div class="kt-notification-item__header">
						<span class="kt-notification-item__title">
							{{ title }}
						</span>
						<span v-if="isUnread" aria-label="Unread" class="kt-notification-item__unread-dot" />
					</div>

					<p class="kt-notification-item__text">
						{{ content }}
					</p>

					<div class="kt-notification-item__meta">
						<span class="kt-notification-item__timestamp" :title="absoluteTimestamp">
							{{ relativeTimestamp }}
						</span>
					</div>
				</slot>
			</div>

			<!-- #actions slot: replaces the action buttons -->
			<div class="kt-notification-item__actions" @click.stop>
				<slot :isUnread="isUnread" name="actions" :onDelete="onDelete" :onToggleRead="onToggleRead">
					<KtButton v-if="isUnread" aria-label="Mark as read" helpText="Mark as read"
						:icon="Yoco.Icon.CIRCLE_CHECK" size="small" type="text" @click="onToggleRead" />
					<KtButton v-else aria-label="Mark as unread" helpText="Mark as unread"
						:icon="Yoco.Icon.CIRCLE_CROSS" size="small" type="text" @click="onToggleRead" />

					<KtButton aria-label="Delete notification" helpText="Delete notification" :icon="Yoco.Icon.TRASH"
						size="small" @click="onDelete" />
				</slot>
			</div>
		</slot>
	</div>
</template>
<script lang="ts">
import dayjs from 'dayjs'
import { computed, defineComponent } from 'vue'

import { Yoco } from '@3yourmind/yoco'

import KtButton from '../kotti-button/KtButton.vue'
import type { KottiNotificationCentre } from '../kotti-notification-centre/types'
import { makeProps } from '../make-props'
import { getRelativeTime } from '../utilities/date'

import { KottiNotification } from './types'

const TYPE_STYLES: Record<
	KottiNotificationCentre.NotificationType,
	{
		backgroundColor: string
		darkColor: string
		icon: Yoco.Icon
	}
> = {
	error: {
		backgroundColor: 'var(--support-error-bg)',
		darkColor: 'var(--support-error-dark)',
		icon: Yoco.Icon.CIRCLE_CROSS,
	},
	info: {
		backgroundColor: 'var(--support-info-bg)',
		darkColor: 'var(--support-info-dark)',
		icon: Yoco.Icon.CIRCLE_I,
	},
	success: {
		backgroundColor: 'var(--support-success-bg)',
		darkColor: 'var(--support-success-dark)',
		icon: Yoco.Icon.CIRCLE_CHECK,
	},
	warning: {
		backgroundColor: 'var(--support-warning-bg)',
		darkColor: 'var(--support-warning-dark)',
		icon: Yoco.Icon.CIRCLE_ATTENTION,
	},
}

export default defineComponent({
	name: 'KtNotification',
	components: {
		KtButton,
	},
	props: makeProps(KottiNotification.propsSchema),

	emits: ['delete', 'toggleRead'],
	setup(props, { emit }) {
		const typeStyle = computed(() => TYPE_STYLES[props.type])

		const relativeTimestamp = computed(() => getRelativeTime(props.timestamp))

		const absoluteTimestamp = computed(() =>
			dayjs(props.timestamp).format('YYYY-MM-DD HH:mm'),
		)

		return {
			absoluteTimestamp,
			onDelete: () => {
				emit('delete')
			},
			onToggleRead: () => {
				emit('toggleRead')
			},
			relativeTimestamp,
			typeStyle,
			Yoco,
		}
	},
})
</script>

<style lang="scss" scoped>
.kt-notification-item {
	display: flex;
	gap: var(--unit-2);
	padding: var(--unit-2) var(--unit-3);
	cursor: default;
	background-color: var(--ui-background);
	border-bottom: 1px solid var(--ui-02);
	transition: background-color 0.15s ease;

	&:hover {
		background-color: var(--ui-01);
	}

	&--is-unread {
		background-color: var(--ui-01);

		&:hover {
			background-color: var(--ui-02);
		}
	}

	&__icon {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: var(--unit-7);
		height: var(--unit-7);
		border-radius: var(--border-radius);

		.yoco {
			font-size: var(--unit-5);
		}
	}

	&__content {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: var(--unit-1);
		min-width: 0;
	}

	&__header {
		display: flex;
		gap: var(--unit-1);
		align-items: center;
	}

	&__title {
		font-weight: 500;
		line-height: var(--unit-5);
		color: var(--text-01);
	}

	&--is-unread &__title {
		font-weight: 700;
	}

	&__unread-dot {
		display: inline-block;
		flex-shrink: 0;
		width: 8px;
		height: 8px;
		background-color: var(--interactive-01);
		border-radius: 50%;
	}

	&__text {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: var(--font-size-small);
		line-height: var(--unit-4);
		color: var(--text-02);
		white-space: nowrap;
	}

	&__meta {
		display: flex;
		gap: var(--unit-2);
		align-items: center;
		font-size: var(--font-size-small);
		color: var(--text-03);
	}

	&__actions {
		display: flex;
		flex-shrink: 0;
		gap: var(--unit-1);
		align-items: flex-start;
		padding-top: 2px;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	&:hover &__actions {
		opacity: 1;
	}
}
</style>
