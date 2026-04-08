<template>
	<ComponentInfo :component="KtNotificationCentre" />

	<!-- prettier-ignore -->
	<MarkdownBlock>
		The Notification Centre provides a slide-out overlay panel for displaying and managing application
		notifications.

		## Features

		- **Overlay panel** that slides in from the right, similar to KtDrawer
		- **Search &amp; filter** by type (info/warning/success/error) and read status
		- **Sort** by timestamp (ascending/descending)
		- **Actions** Mark as read/unread and delete individually or in bulk
		- **Keyboard support**: Escape to close
	</MarkdownBlock>

	<h2>Interactive Example</h2>

	<p>
		Click the button below to open the notification centre with sample data.
	</p>

	<CodePreview
		:code="`
	<${parserHack.script} setup lang=&quot;ts&quot;>
			const notificationStore = createNotificationCentre(notifications)
	</${parserHack.script}>
	<${parserHack.template}>
		<KtButton
				type=&quot;primary&quot;
				label=&quot;Open Notification Centre&quot;;
				@click=&quot;notificationStore.open()&quot;;
			/>
		<KtNotificationCentre :notificationCentre=&quot;notificationStore&quot; />
	</${parserHack.template}>
`"
		language="vue-html"
	>
		<KtButton
			:label="
				unreadCount
					? `Open Notification Centre (${unreadCount})`
					: 'Open Notification Centre'
			"
			type="primary"
			@click="notificationStore.open()"
		/>
		<KtButton
			class="ml-3"
			label="Add Notification"
			type="primary"
			@click="addNotification()"
		/>
		<KtNotificationCentre :notificationCentre="notificationStore" />
	</CodePreview>

	<h2>Types</h2>

	<CodePreview
		code='
				<div style="display: flex; gap: var(--unit-6)">
					<KtButton type="primary" @click="...">
						Primary Button
					</KtButton>
					<KtButton type="secondary" @click="...">
						Secondary Button
					</KtButton>
					<KtButton type="danger" @click="...">
						Danger Button
					</KtButton>
					<KtButton @click="...">
						Default Button
					</KtButton>
					<KtButton type="text" @click="...">
						Text Button
					</KtButton>
				</div>
			'
		language="vue-html"
	>
		<div style="display: flex; flex-wrap: wrap; gap: var(--unit-6)" />
	</CodePreview>

	<h2>Initial Setup</h2>

	This is the per-app setup process for <code>KtNotificationCentre</code>

	<!-- prettier-ignore -->
	<CodePreview
:code='`
				<${parserHack.template}>
					<KtNotificationCentre :notificationCentre="notificationStore" />
				</${parserHack.template}>

				<${parserHack.script} lang="ts">
				import { defineComponent } from "vue"

				import { notificationStore } from "~/shared/notificationStore.ts"

				export default defineComponent({
					setup() {
						return {
							// KtNotificationCentre needs a reference to your per-app notification centre instance
							notificationStore
						}
					}
				})
				</${parserHack.script}>
			`' fileName="App.vue" language="vue" />

	<CodePreview
		code='
				import { createNotificationCentre } from "@3yourmind/kotti-ui"

				// create a notification centre instance, usually there should only ever be one per app
				export const notificationStore = createNotificationCentre()


			'
		fileName="~/shared/notificationStore.ts"
		language="typescript"
	/>

	<h2>API</h2>

	<!-- prettier-ignore -->
	<MarkdownBlock>
		Use the store instance directly to interact with the notification centre:

		```typescript
		const store = createNotificationCentre()

		// Add a notification programmatically
		store.add({
				id: 'new-1',
				title: 'New Event',
				content: 'We are excited to announce a new event!',
				timestamp: new Date().toISOString(),
				type: 'info',
				toggle: 'unread',
		})

		// Open/close the panel
		store.open()
		store.close()
		store.toggle()

		// Manage notifications
		store.markAsRead('n001')
		store.markAllAsRead()
		store.remove('n001')

		// Reactive state
		store.unreadCount.value // number
		store.isOpen.value // boolean
		```
	</MarkdownBlock>

	<ComponentInfo :component="KtNotificationItem" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type { KottiNotificationCentre } from '@3yourmind/kotti-ui'
import {
	createNotificationCentre,
	KtButton,
	KtNotificationCentre,
	KtNotificationItem,
} from '@3yourmind/kotti-ui'

import CodePreview from '~/components/CodePreview.vue'
import ComponentInfo from '~/components/component-info/ComponentInfo.vue'

import notifications from './notifications.json'

const notificationStore = createNotificationCentre(
	notifications as unknown as KottiNotificationCentre.NotificationInput[],
)

const { unreadCount } = notificationStore

const addNotification = () => {
	notificationStore.add({
		content: 'We are excited to announce a new event!',
		id: `new-${Date.now()}`,
		timestamp: new Date().toISOString(),
		title: 'New Event',
		// toggle: 'unread',
		// type: 'info',
	})
	notificationStore.open()
}

export default defineComponent({
	name: 'DocumentationPageUsageComponentsNotificationCentre',
	components: {
		CodePreview,
		ComponentInfo,
		KtButton,
		KtNotificationCentre,
		KtNotificationItem,
	},
	setup() {
		return {
			addNotification,
			KtNotificationCentre,
			KtNotificationItem,
			notificationStore,
			parserHack: {
				// HACK: parsers are angry when you say template
				script: 'script',
				template: 'template',
			},
			unreadCount,
		}
	},
})
</script>
