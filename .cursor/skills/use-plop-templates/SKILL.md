---
name: use-plop-templates
description: Ensures components and useQuery hooks follow project plop templates. Use when creating new React components, useQuery hooks, or when the user asks to add components or query hooks.
---

# Use Plop Templates

When creating code in this project, **always** read and follow the plop templates. Do not generate components or query hooks from scratch.

## When Creating Components

1. **Read** `plop-templates/Component.hbs` before generating any component
2. Follow its structure: FC typing, `ComponentPropsWithoutRef`, `cn()` for className, displayName
3. Use the same patterns for optional props (`addProps`), `componentType` (HTML element), and exports

## When Creating useQuery Hooks

1. **Read** `plop-templates/Query.hbs` before generating any query hook
2. Follow its structure: `queryOptions`, `QueryConfig`, `useQuery` from TanStack, `Use{{Name}}Options` type
3. Export both the query options and the hook; use kebabCase for queryKey

## Quick Reference

**Component pattern**: FC with `ComponentPropsWithoutRef`, `cn(className)`, `displayName` set

**Query pattern**: `queryOptions` + `useQuery` with `QueryConfig`, `enabled` handling, camelCase for hook name, kebabCase for queryKey
