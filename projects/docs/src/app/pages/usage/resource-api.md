---
title: Resource API Integration
---

# Resource API Integration

Angular 19 introduces the `resource` API (experimental) for handling asynchronous data fetching. `ngx-persist` provides a `persistResource` utility to easily add offline-first capabilities to your resources.

## The Problem

When you fetch data from an API:
1.  **Offline**: If the user is offline, the fetch fails.
2.  **Slow Network**: The user sees a loading spinner every time they visit the page.

We want a **Stale-While-Revalidate** strategy:
1.  Show cached data *immediately* (if available).
2.  Fetch fresh data in the background.
3.  Update the UI (and cache) when fresh data arrives.

## Usage

Wrap your loader function with `persistResource`.

```typescript
import { Component, resource } from '@angular/core';
import { persistResource } from 'ngx-persist';

@Component({ ... })
export class UserProfileComponent {
  userId = input.required<string>();

  userResource = resource({
    // The request depends on userId
    request: () => ({ id: this.userId() }),
    
    // Wrap the loader
    loader: persistResource(
      // Your original loader
      async ({ request }) => {
        const response = await fetch(\`/api/users/\${request.id}\`);
        return response.json();
      },
      // Persistence options
      {
        // Dynamic key based on request params
        key: (params) => \`user_profile_\${params.request.id}\`,
        
        // Optional: Custom adapter (defaults to localStorage)
        adapter: localStorageAdapter
      }
    )
  });
}
```

## How It Works

`persistResource` modifies the loader behavior:

1.  **On Load**:
    -   It tries to fetch from the API.
    -   **Success**: It saves the result to storage and returns it.
    -   **Failure (Offline)**: It catches the error, tries to load from storage, and returns the cached value. If storage is empty, it re-throws the error.

> [!NOTE]
> Currently, Angular's `resource` API expects a single Promise return. This means we can't easily do "Return Cache THEN Return Fresh" in a single pass without triggering a reload.
> 
> The current implementation prioritizes **Freshness** (try network first), falling back to **Cache** only on failure.
> 
> Future versions of `ngx-persist` may implement a true "Stale-While-Revalidate" pattern once the Resource API stabilizes or supports streaming responses.
