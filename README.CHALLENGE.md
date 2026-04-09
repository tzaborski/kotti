
# Challenge

  

As part of this challenge, I created two separate UI components: `kotti-notification` and `kotti-notification-centre`.

  

To stay consistent with the existing codebase, I followed these principles:

  

-  **Separation of concerns**

`kotti-notification-centre` exposes both a UI component and a composable (`createNotificationCentre()`).

  

-  **Schema validation with Zod**

All types are defined and validated via `types.ts`.

  

-  **Options API over Composition API**

This aligns with the current architecture of the project.

  

-  **No additional dependencies**

I relied only on existing libraries in the codebase.

  

-  **Consistent structure and naming**

Directory layout and naming conventions match existing components as closely as possible.

  

---

  

## Why I avoided Pinia / Vuex

  

> This is a component library, not an application. I’m not trying to solve a problem that Vue reactivity system already handles well.

  

-  `createNotificationCentre()` is a factory function, allowing multiple independent instances by design (very rare in this case)

- The Notifications API surface is relatively small and doesn’t justify introducing a peer dependency

- Adding a state management layer would increase complexity rather than simplify the solution

  

**Note:** Vuex is no longer actively maintained, so it’s not a viable option. Pinia is the recommended state management library for Vue 3.

  

---

  

# How to Test

## Live URL

You can review my approach by visiting:
   

> [https://sekvoia.co/kotti/](https://sekvoia.co/kotti/)


Interactive examples can be found here:

-  `KtNotification` → **Components → Notification**

-  `KtNotificationCentre` → **Layouts → Notifications Centre**

## Dev environment

  

Follow the guidelines from the original `README.md`. You have to clone / download repository and run just like the original. Refer to [Development section](https://github.com/tzaborski/kotti?tab=readme-ov-file#develop)

  
### Notes

- Components are implemented within the `kotti-ui` package

- Example usage is available in the `documentation` package
  

---

  

# Decision Notes

  

- Reused the existing component playground (`documentation` package) instead of introducing a new package or repository

- Focused on delivering stable core functionality first, postponing enhancements for later iterations

- Keeping `KtNotification` separate from `KtNotificationCentre` improves reusability

While they are closely related, `KtNotification` can still be used independently

- After reviewing the structure, `KtNotificationCentre` fits better under **Layouts** rather than **Components**

It’s typically instantiated once per app and behaves more like a layout-level feature than a reusable component

- Used custom input inside `NotificationToolbar` due to issues detecting field clearing via keyboard (likely related to v-model emit behavior/guard)

- Added a global `notificationClick` event handler for simple interaction handling

- Opted not to reuse `KtDrawer` to keep `KtNotificationCentre` flexible for possible UI changes

  

---

  

# Next Steps

  

- Evaluate reusing `KtBanner` inside `KtNotification`

- Consider confirmation modals for bulk actions (Mark all, delete all)

- Add i18n support

- Expand unit tests to Vue components

- Improve accessibility (Keyboard access, aria attributes, focus trap)

- Create separate demo that uses mocked API (notifications.json) and Pinia store (That would be good example of Pinia usage, it will serve as a layer between Demo App and Notification Centre)
