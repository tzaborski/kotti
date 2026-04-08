import { z } from 'zod'

import { createLooseZodEnumSchema } from '../zod-utilities/enums'

export namespace KottiNotification {
	export enum NotificationType {
		ERROR = 'error',
		INFO = 'info',
		SUCCESS = 'success',
		WARNING = 'warning',
	}

	export const notificationTypeSchema =
		createLooseZodEnumSchema(NotificationType)

	export const propsSchema = z.object({
		content: z.string(),
		isUnread: z.boolean().default(true),
		timestamp: z.string(),
		title: z.string(),
		type: notificationTypeSchema.default('info'),
	})

	export type Props = z.input<typeof propsSchema>
	export type PropsInternal = z.output<typeof propsSchema>
}
