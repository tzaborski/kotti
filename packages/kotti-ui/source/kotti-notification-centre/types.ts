import { z } from 'zod'

import { createLooseZodEnumSchema } from '../zod-utilities/enums'

export namespace KottiNotificationCentre {
	export enum NotificationType {
		ERROR = 'error',
		INFO = 'info',
		SUCCESS = 'success',
		WARNING = 'warning',
	}

	export enum NotificationToggle {
		READ = 'read',
		UNREAD = 'unread',
	}

	export const notificationTypeSchema =
		createLooseZodEnumSchema(NotificationType)

	export const notificationToggleSchema =
		createLooseZodEnumSchema(NotificationToggle)

	export const notificationSchema = z
		.object({
			content: z.string(),
			id: z.string(),
			timestamp: z.string(),
			title: z.string(),
			toggle: notificationToggleSchema.default('unread'),
			type: notificationTypeSchema.default('info'),
		})
		.passthrough()

	export type Notification = z.output<typeof notificationSchema>
	export type NotificationInput = z.input<typeof notificationSchema>

	export const filterSchema = z.object({
		searchQuery: z.string().default(''),
		toggle: notificationToggleSchema.nullable().default(null),
		type: notificationTypeSchema.nullable().default(null),
	})

	export type Filter = z.output<typeof filterSchema>

	export const sortOrderSchema = z.enum(['asc', 'desc'])
	export type SortOrder = z.infer<typeof sortOrderSchema>

	export const propsSchema = z.object({
		notificationCentre: z
			.object({
				add: z.function(),
				close: z.function(),
				open: z.function(),
				remove: z.function(),
				toggle: z.function(),
			})
			.passthrough(),
	})

	export type Props = z.input<typeof propsSchema>
	export type PropsInternal = z.output<typeof propsSchema>
}
