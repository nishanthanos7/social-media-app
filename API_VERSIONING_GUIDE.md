# API Versioning Guide

This document explains how API versioning works in our JWT Authentication API.

## Why We Use API Versioning

API versioning is a best practice that allows us to:

1. **Make changes without breaking existing clients**: We can introduce new features or change existing ones without affecting applications that use the current API.
2. **Support multiple versions simultaneously**: Different clients can use different API versions based on their needs.
3. **Deprecate old versions gracefully**: We can mark older versions as deprecated and give clients time to migrate.
4. **Document API evolution**: Versioning provides a clear history of how the API has changed over time.

## How Our API Versioning Works

We use URL path versioning, which includes the version number in the URL path.

### Version 1 (Current)

All Version 1 endpoints are accessible under the `/v1` prefix:

```
/v1/auth/login
/v1/auth/register
/v1/users/:id
/v1/users/:id/profile
```

### Legacy Support

For backward compatibility, we also support the same endpoints under the `/api` prefix:

```
/api/auth/login
/api/auth/register
/api/users/:id
/api/users/:id/profile
```

These legacy endpoints provide the exact same functionality as the `/v1` endpoints. They exist to ensure that existing clients don't break when we introduce versioning.

## How to Use the Versioned API

### New Applications

For new applications, always use the versioned endpoints:

```
POST /v1/auth/login
POST /v1/auth/register
GET /v1/users/:id
GET /v1/users/:id/profile
```

### Existing Applications

Existing applications can continue to use the legacy endpoints:

```
POST /api/auth/login
POST /api/auth/register
GET /api/users/:id
GET /api/users/:id/profile
```

However, we recommend migrating to the versioned endpoints when convenient.

## API Version Lifecycle

Each API version goes through the following lifecycle:

1. **Active**: The current recommended version for all clients.
2. **Maintained**: Still supported but no longer the recommended version.
3. **Deprecated**: Still works but scheduled for removal. Clients should migrate.
4. **Retired**: No longer available. All clients must use a newer version.

### Current Status

- **v1**: Active - Current recommended version
- **Legacy** (`/api`): Maintained - Same as v1 but without version prefix

## Future Versions

When we need to make breaking changes to the API, we'll introduce a new version (e.g., `/v2`). Breaking changes might include:

- Changing the structure of request or response data
- Removing endpoints or parameters
- Changing the behavior of existing endpoints

## Testing with Postman

When testing with Postman, you can create two collections:

1. **v1 API**: Using the `/v1` prefix for all endpoints
2. **Legacy API**: Using the `/api` prefix for all endpoints

This allows you to verify that both versions work identically.

## Swagger Documentation

Our Swagger documentation includes both the versioned and legacy endpoints. You can access it at:

```
http://localhost:3000/api-docs
```

The documentation shows the endpoints with their proper version prefixes.

## Best Practices for API Consumers

1. **Always use the latest stable version** for new development
2. **Check the API documentation regularly** for updates and deprecation notices
3. **Test your application against new API versions** before migrating
4. **Include the API version in bug reports** to help with troubleshooting

## Implementation Details

Our API versioning is implemented using Express.js routers:

1. Each version has its own router in a dedicated directory (e.g., `src/v1/`)
2. The main application mounts these routers at their respective paths
3. Swagger documentation is configured to show the correct paths for each version

This approach allows us to maintain clean separation between different API versions while sharing common code where appropriate.
