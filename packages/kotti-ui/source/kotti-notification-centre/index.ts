import { attachMeta, makeInstallable } from '../utilities'

import KtNotificationCentreVue from './KtNotificationCentre.vue'
import KtNotificationItemVue from './KtNotificationItem.vue'
import { KottiNotificationCentre } from './types'

export { createNotificationCentre } from './create-notification-centre'
export type { NotificationCentreStore } from './create-notification-centre'
export { KottiNotificationCentre } from './types'

export const KtNotificationCentre = attachMeta(
	makeInstallable(KtNotificationCentreVue),
	{
		addedVersion: '9.8.0',
		deprecated: null,
		designs: null,
		slots: {},
		typeScript: {
			namespace: 'Kotti.NotificationCentre',
			schema: KottiNotificationCentre.propsSchema,
		},
	},
)

export const KtNotificationItem = attachMeta(
	makeInstallable(KtNotificationItemVue),
	{
		addedVersion: '9.8.0',
		deprecated: null,
		designs: null,
		slots: {},
		typeScript: {
			namespace: 'Kotti.NotificationCentre',
			schema: KottiNotificationCentre.propsSchema,
		},
	},
)
