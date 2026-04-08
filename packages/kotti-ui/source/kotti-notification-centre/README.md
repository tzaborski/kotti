# Discovered patterns

- Zod and strong TypeScript preference when validating input/output
- Minimal dependencies - avoiding adding new libraries
- Reusable pattern (factories over singletons)
- Parser hack become helpful <3
- KtComponentName reserved for top level components

1. Decided to go with vue reactivity system at the component level. I don't want to introduce new dependency Pinia/Vuex - it's not necessarry. State management library would be an overkill in this case.
