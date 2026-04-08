import { attachMeta, makeInstallable } from '../utilities'

import KtNotificationVue from './KtNotification.vue'
import { KottiNotification } from './types'

export const KtNotification = attachMeta(makeInstallable(KtNotificationVue), {
	addedVersion: '9.8.0',
	deprecated: null,
	designs: null,
	slots: {
		actions: { description: null, scope: null },
		content: {
			description: 'Allows overriding the content of the notification',
			scope: null,
		},
		item: {
			description:
				'Allows overriding the individual notification item as a whole',
			scope: null,
		},
	},
	typeScript: {
		namespace: 'Kotti.Notification',
		schema: KottiNotification.propsSchema,
	},
})
