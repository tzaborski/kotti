<template>
	<ComponentInfo :component="KtNotification" />

	<!-- <p>
			The <code>KtBanner</code> component is a versatile alert box used for
			communicating important application-level or contextual information, such
			as errors, warnings, or success messages.
		</p> -->

	<p>
		The <code>KtNotification</code> serves similar purposes to
		<code>KtBanner</code> but is designed for displaying discrete notifications,
		such as in a notification centre. Notifications typically include a title,
		content, timestamp, and allow for actions like marking as read or deleting.
	</p>

	<h2>Types</h2>

	<CodePreview
		code='
			<KtNotification
				content="This is an info notification."
				:timestamp="new Date().toISOString()"
				title="Info Notification"
				type="info"
			/>
			<KtNotification
				content="This is a success notification."
				:timestamp="new Date().toISOString()"
				title="Success Notification"
				type="success"
			/>
			<KtNotification
				content="This is a warning notification."
				:timestamp="new Date().toISOString()"
				title="Warning Notification"
				type="warning"
			/>
			<KtNotification
				content="This is an error notification."
				:timestamp="new Date().toISOString()"
				title="Error Notification"
				type="error"
			/>
			'
		language="vue-html"
	>
		<div style="display: flex; flex-direction: column; gap: var(--unit-6)">
			<KtNotification
				content="This is an info notification."
				:isUnread="!readNotifications.includes(0)"
				:timestamp="new Date().toISOString()"
				title="Info Notification"
				type="info"
				@delete="deleteNotification(0)"
				@toggleRead="toggleRead(0)"
			/>
			<KtNotification
				content="This is a success notification."
				:isUnread="!readNotifications.includes(1)"
				:timestamp="new Date().toISOString()"
				title="Success Notification"
				type="success"
				@delete="deleteNotification(1)"
				@toggleRead="toggleRead(1)"
			/>
			<KtNotification
				content="This is a warning notification."
				:isUnread="!readNotifications.includes(2)"
				:timestamp="new Date().toISOString()"
				title="Warning Notification"
				type="warning"
				@delete="deleteNotification(2)"
				@toggleRead="toggleRead(2)"
			/>
			<KtNotification
				content="This is an error notification."
				:isUnread="!readNotifications.includes(3)"
				:timestamp="new Date().toISOString()"
				title="Error Notification"
				type="error"
				@delete="deleteNotification(3)"
				@toggleRead="toggleRead(3)"
			/>
		</div>
	</CodePreview>

	<KtModal
		:isOpen="typeof deleteId !== 'undefined'"
		@close="deleteId = undefined"
	>
		<template #body>
			<span>
				Delete invoked on notification with id {{ deleteId }}. This is where you
				would implement your delete logic.
			</span>
		</template>
		<template #footer>
			<KtButton label="close" @click="deleteId = undefined" />
		</template>
	</KtModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { KtButton, KtModal, KtNotification } from '@3yourmind/kotti-ui'

import CodePreview from '~/components/CodePreview.vue'
import ComponentInfo from '~/components/component-info/ComponentInfo.vue'

export default defineComponent({
	name: 'DocumentationPageUsageComponentsNotificationCentre',
	components: {
		CodePreview,
		ComponentInfo,
		KtButton,
		KtModal,
		KtNotification,
	},
	setup() {
		const readNotifications = ref<number[]>([])
		const toggleRead = (id: number) => {
			if (readNotifications.value.includes(id)) {
				readNotifications.value = readNotifications.value.filter(
					(n) => n !== id,
				)
			} else {
				readNotifications.value.push(id)
			}
		}

		const deleteId = ref<number | undefined>()
		const deleteNotification = (id: number) => {
			deleteId.value = id
		}

		return {
			deleteId,
			deleteNotification,
			KtNotification,
			parserHack: {
				// HACK: parsers are angry when you say template
				script: 'script',
				template: 'template',
			},
			readNotifications,
			toggleRead,
		}
	},
})
</script>
