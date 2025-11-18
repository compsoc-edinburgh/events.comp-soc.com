# @monorepo/types

Shared TypeScript types, Zod schemas, and constants for the CompSoc events management system.

## Structure

```
src/
├── const/          # Constants and enums
│   ├── roles.ts    # User role definitions
│   └── sigs.ts     # Special Interest Group definitions
├── models/         # TypeScript type definitions
│   ├── event.ts    # Event and SearchEvent types
│   ├── form.ts     # Form field types
│   └── user.ts     # User type
├── schemas/        # Zod validation schemas
│   ├── event.ts    # Event validation schemas
│   ├── form.ts     # Form validation schemas
│   └── user.ts     # User validation schemas
├── utils.ts        # Utility types
└── index.ts        # Main entry point
```

## Usage

### Import Everything

```typescript
import { User, UserRole, UserCreateSchema } from "@monorepo/types";
```

### Import from Specific Modules

```typescript
// Models only
import { Event, User } from "@monorepo/types/models";

// Schemas only
import { EventCreateSchema, UserUpdateSchema } from "@monorepo/types/schemas";

// Constants only
import { UserRole, Sigs } from "@monorepo/types/const";

// Utils only
import { Nullable, PartialNullable } from "@monorepo/types/utils";
```

## Constants

### User Roles

```typescript
import { UserRole } from "@monorepo/types/const";

const role = UserRole.Committee; // "COMMITTEE"
```

Available roles:

- `UserRole.User` - Regular user
- `UserRole.Committee` - Committee member
- `UserRole.SigsLeader` - SIG leader

### Special Interest Groups (SIGs)

```typescript
import { Sigs } from "@monorepo/types/const";

const sig = Sigs.Compsoc; // "compsoc"
```

## Models

Type definitions for domain entities:

- `User` - User entity
- `Event` - Full event entity
- `SearchEvent` - Simplified event for listings
- `Form` - Registration form configuration
- `FormField` - Union of form field types
- `TextField`, `ButtonGroupField`, `SelectField` - Specific field types

## Schemas

Zod schemas for runtime validation:

### User Schemas

```typescript
import { UserCreateSchema, UserUpdateSchema } from "@monorepo/types/schemas";

// Inferred types
type UserCreateInput = z.infer<typeof UserCreateSchema>;
type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
```

### Event Schemas

```typescript
import { EventCreateSchema, EventUpdateSchema } from "@monorepo/types/schemas";

// Inferred types
type EventCreateInput = z.infer<typeof EventCreateSchema>;
type EventUpdateInput = z.infer<typeof EventUpdateSchema>;
```

### Form Schemas

```typescript
import { FormSchema, FormFieldSchema } from "@monorepo/types/schemas";

// Inferred types
type FormInput = z.infer<typeof FormSchema>;
type FormFieldInput = z.infer<typeof FormFieldSchema>;
```

## Utility Types

```typescript
import {
  Nullable,
  PartialNullable,
  RequireProps,
  OptionalProps
} from "@monorepo/types/utils";

// Make a type nullable
type NullableUser = Nullable<User>;

// Make all properties optional and nullable
type PartialNullableUser = PartialNullable<User>;

// Require specific properties
type UserWithEmail = RequireProps<Partial<User>, "email">;

// Make specific properties optional
type UserOptionalEmail = OptionalProps<User, "email">;
```
