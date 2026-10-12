---
name: component-data-rules
description: Enforces component data patterns—self-contained feature components that receive a minimal identifier and fetch their own data via useQuery. Use when creating React components, feature components, data-fetching components, or when deciding between prop-driven vs identifier-driven component design.
---

# Component Data Rules

## TL;DR

Default to **self-contained feature components that receive a minimal identifier and fetch their own data**.

The identifier is usually an ID but can be any unique key (slug, hash, address, etc).

Do NOT use wrapper/view hybrids unless there is a very strong reason.

---

## Preferred Pattern (Default)

**Self-contained component: identifier → useQuery**

```tsx
export type UserDetailsProps = {
  userId: string; // minimal lookup key
} & ComponentPropsWithoutRef<"div">;

export const UserDetails: FC<UserDetailsProps> = ({
  userId,
  className,
  ...props
}) => {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading || !user) return null; // or show a spinner if requested or needed 

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

UserDetails.displayName = "UserDetails";
```

### Why this is our default

- Minimal usage friction
- No prop drilling
- Logic is co-located
- Consistent data access
- Works with React Query cache
- Faster feature development
- Less boilerplate

**Ergonomics and velocity win.**

---

## Alternative Pattern (Pure UI Primitive)

Use ONLY for low-level UI atoms with **no data ownership**.

Examples: Spinner, Button, Badge, Avatar, Typography, Layout primitives.

```tsx
// Pure props only—no server data, no useQuery
export const Spinner: FC<
  ComponentPropsWithoutRef<typeof Loader2> &
    VariantProps<typeof spinnerVariants>
> = ({ className, size, ...props }) => {
  return (
    <CgSpinner
      className={cn(spinnerVariants({ className, size }))}
      {...props}
    />
  );
};
```

### When pure props are correct

- No server data involved
- Pure visual primitive
- Highly reusable
- Framework-agnostic

---

## Project Rule

| Rule          | When                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| **Default**   | Feature components receive a minimal unique identifier and fetch their own data |
| **Exception** | Low-level UI primitives receive full data via props                             |

---

## Anti-patterns to avoid

- Passing many primitive props instead of a lookup key
- Prop drilling entity data through many layers
- Moving fetching responsibility to every call site
- Premature abstraction for theoretical purity

---

## Final Guidance

Optimize for:

1. Developer velocity
2. Co-located logic
3. Simple usage
4. Predictable data flow

Not for theoretical purity.
