# Global Head Code API Endpoint Examples

This document provides usage examples for the `global_head_code_api` endpoint, which allows CRUD operations for the `global_head_code` field of the `WebsiteSettings` model.

---

## Endpoint

**URL:** `/website-settings/global-head-code/`

**Supported Methods:**
- `GET` (Read)
- `PUT` (Update)

**Authentication:**
- `PUT` requires authentication (Editor or Superuser)
- `GET` is public

---

## 1. Get Global Head Code

**Request:**
```http
GET /website-settings/global-head-code/
```

**Response:**
```json
{
  "status": 200,
  "global_head_code": "<script>console.log('Hello World');</script>"
}
```


---

## 2. Update Global Head Code

**Request:**
```http
PUT /website-settings/global-head-code/
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "global_head_code": "<script>console.log('Updated Head Code');</script>"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Global head code updated successfully",
  "global_head_code": "<script>console.log('Updated Head Code');</script>"
}
```


---

## Error Responses

**403 Forbidden:**
```json
{
  "status": 403,
  "error": "Only editors or superusers can perform this action"
}
```

**400 Bad Request:**
```json
{
  "status": 400,
  "error": "global_head_code field is required"
}
```

**404 Not Found:**
```json
{
  "status": 404,
  "error": "Website settings not found"
}
```

---

## Notes
- Only the `global_head_code` field is affected by this endpoint.
- All code should be valid HTML/JS for insertion into the `<head>` section.
- Authentication is required for create, update, and delete operations.
