# Authentication with Page Redirect

This system allows users to access public pages without authentication, but when they perform actions that require authentication, they are redirected to sign in and then back to the same page.

## Components

### 1. `useAuthAction` Hook

A custom hook that handles authentication-required actions:

```typescript
import { useAuthAction } from "../hooks/useAuthAction";

function MyComponent() {
  const { executeWithAuth, isAuthenticated, isLoading } = useAuthAction();

  const handleAction = () => {
    executeWithAuth(async () => {
      // This code only runs if user is authenticated
      // If not authenticated, user is redirected to sign in
      console.log("User is authenticated, performing action...");
    });
  };

  return (
    <button onClick={handleAction}>
      {isAuthenticated ? "Perform Action" : "Sign in to Perform Action"}
    </button>
  );
}
```

### 2. `AuthRequiredButton` Component

A button that requires authentication before executing its action:

```typescript
import AuthRequiredButton from "../components/AuthRequiredButton";

function MyComponent() {
  const handleWishlistToggle = async () => {
    // This function only runs if user is authenticated
    console.log("Adding to wishlist...");
  };

  return (
    <AuthRequiredButton
      onClick={handleWishlistToggle}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Add to Wishlist
    </AuthRequiredButton>
  );
}
```

### 3. `AuthRequiredLink` Component

A link that requires authentication before navigating:

```typescript
import AuthRequiredLink from "../components/AuthRequiredLink";

function MyComponent() {
  return (
    <AuthRequiredLink
      href="/cart"
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Go to Cart
    </AuthRequiredLink>
  );
}
```

## How It Works

1. **Public Access**: Users can browse public pages (like book details, repository listings) without signing in.

2. **Authentication Required**: When users try to perform actions that require authentication (like adding to cart or wishlist), they are redirected to the sign-in page.

3. **Callback URL**: The current page URL is automatically passed as a `callbackUrl` parameter to the sign-in page.

4. **Return to Original Page**: After successful authentication, users are redirected back to the original page where they can complete their intended action.

## Configuration

### Auth Configuration (`auth.ts`)

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ... other config
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  // ... rest of config
});
```

### Middleware (`middleware.ts`)

The middleware automatically protects certain routes and redirects unauthenticated users:

```typescript
const protectedRoutes = [
  '/dashboard',
  '/manuscripts', 
  '/reviews',
  '/cart',
  '/wishlist'
];
```

### Sign-in Page (`/auth/signin`)

The custom sign-in page automatically handles the `callbackUrl` parameter and redirects users back to their original page after authentication.

## Usage Examples

### Repository Page (Book Details)

```typescript
// Users can view book details without authentication
// But need to sign in to add to cart or wishlist

<AuthRequiredLink href="/cart">
  Add to Cart
</AuthRequiredLink>

<AuthRequiredButton onClick={handleWishlistToggle}>
  Add to Wishlist
</AuthRequiredButton>
```

### Navigation

```typescript
// Sign-in button automatically uses current page as callback
<button onClick={() => signIn(undefined, { callbackUrl: getCurrentUrl() })}>
  Sign In
</button>
```

## Benefits

1. **Better UX**: Users can browse content without forced authentication
2. **Seamless Flow**: After signing in, users return to exactly where they were
3. **Flexible**: Easy to add authentication requirements to any action
4. **Consistent**: Standardized components for authentication-required actions
