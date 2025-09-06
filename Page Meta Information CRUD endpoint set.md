# Page API Documentation

This document describes the full CRUD API endpoints for the `Page` model in SightseeingRoma.

## Model: Page

| Field           | Type         | Description                                 |
|-----------------|--------------|---------------------------------------------|
| title           | string       | Page title                                  |
| meta_title      | string       | SEO meta title                              |
| meta_description| string       | SEO meta description                        |
| meta_keywords   | string       | SEO keywords                                |
| schema_json     | JSON         | Structured data (JSON-LD)                   |
| slug            | string       | Unique URL slug for the page                |
| created_at      | datetime     | Creation timestamp                          |
| updated_at      | datetime     | Last update timestamp                       |

---

## Endpoints

### 1. Get All Pages
- **URL:** `/pages/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "title": "Home Page",
      "meta_title": "Welcome to SightseeingRoma",
      "meta_description": "Discover the beauty of Rome...",
      "meta_keywords": "rome, sightseeing, tours",
      "schema_json": null,
      "slug": "home",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T15:45:00Z"
    }
  ]
}
```

---

### 2. Get Single Page
- **URL:** `/pages/{slug}/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "title": "Home Page",
    "meta_title": "Welcome to SightseeingRoma",
    "meta_description": "Discover the beauty of Rome...",
    "meta_keywords": "rome, sightseeing, tours",
    "schema_json": null,
    "slug": "home",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T15:45:00Z"
  }
}
```

---

### 3. Create New Page
- **URL:** `/pages/create/`
- **Method:** `POST`
- **Auth:** Required (Editors or Superusers)
- **Request Body:**
```json
{
  "title": "About Us",
  "meta_title": "About SightseeingRoma - Your Roman Adventure Partner",
  "meta_description": "Learn about our story and mission to provide the best sightseeing experiences in Rome",
  "meta_keywords": "about us, rome tours, sightseeing company",
  "slug": "about-us",
  "schema_json": {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us"
  }
}
```
- **Response:**
```json
{
  "status": 201,
  "message": "Page created successfully",
  "data": { ...page fields... }
}
```

---

### 4. Update Page
- **URL:** `/pages/{slug}/update/`
- **Method:** `PATCH`
- **Auth:** Required (Editors or Superusers)
- **Request Body:** (Partial update allowed)
```json
{
  "meta_description": "Updated description about our Roman adventure services",
  "meta_keywords": "about us, rome tours, sightseeing company, roman adventures"
}
```
- **Response:**
```json
{
  "status": 200,
  "message": "Page updated successfully",
  "data": { ...page fields... }
}
```

---

### 5. Delete Page
- **URL:** `/pages/{slug}/delete/`
- **Method:** `DELETE`
- **Auth:** Required (Editors or Superusers)
- **Response:**
```json
{
  "status": 200,
  "message": "Page \"About Us\" deleted successfully"
}
```

---

## Error Responses

- **403 Forbidden:**
```json
{
  "status": 403,
  "error": "Only editors or superusers can create/update/delete pages"
}
```

- **404 Not Found:**
```json
{
  "status": 404,
  "error": "Page with slug \"non-existent\" not found"
}
```

- **400 Bad Request (duplicate slug):**
```json
{
  "status": 400,
  "error": "Page with slug \"home\" already exists"
}
```

---

## Notes
- All timestamps are in ISO 8601 format (UTC).
- Only editors and superusers can create, update, or delete pages.
- Slug must be unique for each page.
- PATCH endpoint supports partial updates.
- All operations by editors are logged in EditLog.
