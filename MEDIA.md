# Package and Media Management API Documentation

## MediaLibrary CRUD Operations

### 1. Get All Media Library Items

**URL:** `GET /media-library/`

**Authentication:** Not required

**Response:**
```json
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Rome Colosseum Image",
            "alt_text": "The Colosseum exterior at sunset in Rome",
            "file": "/media/media_library/colosseum.jpg",
            "media_type": "image",
            "file_size": 512000,
            "uploaded_at": "2025-08-30T10:30:00Z"
        },
        {
            "id": 2,
            "name": "Vatican Video Tour",
            "alt_text": null,
            "file": "/media/media_library/vatican_tour.mp4",
            "media_type": "video",
            "file_size": 15728640,
            "uploaded_at": "2025-08-30T09:15:00Z"
        }
    ]
}
```

### 2. Get Specific Media Item

**URL:** `GET /media-library/{media_id}/`

**Authentication:** Not required

**Example:** `GET /media-library/1/`

**Response:**
```json
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Rome Colosseum Image",
        "alt_text": "The Colosseum exterior at sunset in Rome",
        "file": "/media/media_library/colosseum.jpg",
        "media_type": "image",
        "file_size": 512000,
        "uploaded_at": "2025-08-30T10:30:00Z"
    }
}
```

### 3. Create Media Item

**URL:** `POST /media-library/create/`

**Authentication:** Required (JWT Token)

**Permissions:** User must be an Editor or Superuser

**Content-Type:** `multipart/form-data`

**Example Request:**
```bash
POST /media-library/create/
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

{
    "name": "New Bus Tour Image",
    "alt_text": "Open-top sightseeing bus passing the Colosseum",
    "file": <file_upload>,
    "media_type": "image"
}
```

**Response:**
```json
{
    "status": 201,
    "message": "Media item created successfully",
    "data": {
        "id": 3,
        "name": "New Bus Tour Image",
        "alt_text": "Open-top sightseeing bus passing the Colosseum",
        "file": "/media/media_library/bus_tour_new.jpg",
        "media_type": "image",
        "file_size": 768000,
        "uploaded_at": "2025-08-30T11:45:00Z"
    }
}
```

### 4. Update Media Item

**URL:** `PATCH /media-library/{media_id}/update/`

**Authentication:** Required (JWT Token)

**Permissions:** User must be an Editor or Superuser

**Example:** `PATCH /media-library/3/update/`

**Request:**
```json
{
    "name": "Updated Bus Tour Image",
    "alt_text": "Red sightseeing bus near Roman Forum",
    "media_type": "image"
}
```

**Response:**
```json
{
    "status": 200,
    "message": "Media item updated successfully",
    "data": {
        "id": 3,
        "name": "Updated Bus Tour Image",
        "alt_text": "Red sightseeing bus near Roman Forum",
        "file": "/media/media_library/bus_tour_new.jpg",
        "media_type": "image",
        "file_size": 768000,
        "uploaded_at": "2025-08-30T11:45:00Z"
    }
}
```

### 5. Delete Media Item

**URL:** `DELETE /media-library/{media_id}/delete/`

**Authentication:** Required (JWT Token)

**Permissions:** User must be an Editor or Superuser

**Example:** `DELETE /media-library/3/delete/`

**Response:**
```json
{
    "status": 200,
    "message": "Media item deleted successfully"
}
```

## Enhanced Package Update Endpoints with MediaLibrary Support

### 1. Update Bus Package with MediaLibrary URLs

**URL:** `PATCH /update-bus-package/{package_tag}/`

**Authentication:** Required (JWT Token)

**Permissions:** User must be an Editor or Superuser

#### Using MediaLibrary URLs for Images

You can now use MediaLibrary file URLs directly in image fields. The system will automatically download and assign these images to the package.

**Example Request:**
```bash
PATCH /update-bus-package/12345/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "Rome Hop-On Hop-Off Premium Tour",
    "description": "<h2>Explore Rome</h2><p>Premium 48-hour bus tour...</p>",
    "thumbnail_small": "https://yourdomain.com/media/media_library/rome_thumb_small.jpg",
    "thumbnail_large": "https://yourdomain.com/media/media_library/rome_thumb_large.jpg",
    "carousel_one_small": "https://yourdomain.com/media/media_library/colosseum_small.jpg",
    "carousel_one_large": "https://yourdomain.com/media/media_library/colosseum_large.jpg",
    "carousel_two_small": "https://yourdomain.com/media/media_library/vatican_small.jpg",
    "carousel_two_large": "https://yourdomain.com/media/media_library/vatican_large.jpg",
    "adult_price": 35,
    "youth_price": 25,
    "infant_price": 0,
    "is_featured": true
}
```

#### Mixed Update (Text + MediaLibrary Images)

**Example Request:**
```bash
PATCH /update-bus-package/12345/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "Updated Bus Tour Title",
    "description": "<h1>New Description</h1><p>Updated HTML content...</p>",
    "meta_title": "Best Rome Bus Tour - Updated",
    "meta_description": "Experience Rome with our updated premium tour",
    "duration": "48 hours",
    "ticket_type": "48 hours",
    "company": "big bus",
    "thumbnail_small": "https://yourdomain.com/media/media_library/new_thumbnail.jpg",
    "carousel_one_large": "https://yourdomain.com/media/media_library/new_carousel_image.jpg",
    "adult_price": 40,
    "youth_price": 30
}
```

**Response:**
```json
{
    "status": 200,
    "message": "Bus package updated successfully",
    "data": {
        "id": 1,
        "title": "Updated Bus Tour Title",
        "description": "<h1>New Description</h1><p>Updated HTML content...</p>",
        "thumbnail_small": "/media/bus_packages/thumbnails/new_thumbnail.jpg",
        "thumbnail_small_alt": "Open-top sightseeing bus passing the Colosseum",
        "thumbnail_large": "/media/bus_packages/thumbnails/rome_thumb_large.jpg",
        "thumbnail_large_alt": "Panoramic view of Rome skyline from bus",
        "carousel_one_small": "/media/bus_packages/carousel/colosseum_small.jpg",
        "carousel_one_small_alt": "Colosseum close-up arches",
        "carousel_one_large": "/media/bus_packages/carousel/new_carousel_image.jpg",
        "carousel_one_large_alt": "Evening light on the Colosseum",
        "adult_price": 40,
        "youth_price": 30,
        "package_tag": 12345,
        "is_featured": true,
        ...
    }
}
```

### 2. Update Museum Package with MediaLibrary URLs

**URL:** `PATCH /update-museum-package/{package_tag}/`

**Authentication:** Required (JWT Token)

**Permissions:** User must be an Editor or Superuser

#### Complete Image Set Update

**Example Request:**
```bash
PATCH /update-museum-package/67890/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "Vatican Museums Premium Experience",
    "description": "<h2>Skip the Lines</h2><p>VIP access to Vatican Museums...</p>",
    "thumbnail_small": "https://yourdomain.com/media/media_library/vatican_thumb_s.jpg",
    "thumbnail_large": "https://yourdomain.com/media/media_library/vatican_thumb_l.jpg",
    "carousel_one_small": "https://yourdomain.com/media/media_library/sistine_s.jpg",
    "carousel_one_large": "https://yourdomain.com/media/media_library/sistine_l.jpg",
    "carousel_two_small": "https://yourdomain.com/media/media_library/museum_s.jpg",
    "carousel_two_large": "https://yourdomain.com/media/media_library/museum_l.jpg",
    "carousel_three_small": "https://yourdomain.com/media/media_library/raphael_s.jpg",
    "carousel_three_large": "https://yourdomain.com/media/media_library/raphael_l.jpg",
    "carousel_four_small": "https://yourdomain.com/media/media_library/gallery_s.jpg",
    "carousel_four_large": "https://yourdomain.com/media/media_library/gallery_l.jpg",
    "adult_price": 65,
    "youth_price": 55,
    "infant_price": 15,
    "duration": "3 hours",
    "type": "Skip-the-Line VIP",
    "is_featured": true
}
```

#### Partial Image Update

**Example Request:**
```bash
PATCH /update-museum-package/67890/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "Vatican Museums - Updated",
    "thumbnail_large": "https://yourdomain.com/media/media_library/new_vatican_thumb.jpg",
    "carousel_one_small": "https://yourdomain.com/media/media_library/new_sistine.jpg",
    "adult_price": 70
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Museum package updated successfully",
  "data": {
    "id": 2,
    "title": "Vatican Museums - Updated",
    "thumbnail_small": "/media/museum_packages/thumbnails/vatican_thumb_s.jpg",
    "thumbnail_small_alt": "Entrance to Vatican Museums",
    "thumbnail_large": "/media/museum_packages/thumbnails/new_vatican_thumb.jpg",
    "thumbnail_large_alt": "Aerial view of Vatican City",
    "carousel_one_small": "/media/museum_packages/carousel/new_sistine.jpg",
    "carousel_one_small_alt": "Detail of Sistine Chapel ceiling",
    "carousel_one_large": "/media/museum_packages/carousel/sistine_l.jpg",
    "carousel_one_large_alt": "Full view of Sistine Chapel ceiling",
    "adult_price": 70,
    "youth_price": 55,
    "package_tag": 67890,
    "is_featured": true,
    ...
  }
}
```

## How MediaLibrary Integration Works

### Workflow:
1. **Upload Media**: Use `POST /media-library/create/` to upload images/videos to MediaLibrary (add optional `alt_text` for accessibility)
2. **Get Media URL**: The response includes the file URL (e.g., `/media/media_library/image.jpg`)
3. **Use in Packages**: Use the full URL in package update requests for image fields
4. **Automatic Processing**: The system automatically downloads and assigns the media to the package
5. **Alt Text Propagation**: The API automatically tries to populate `*_alt` fields in package responses by matching the stored image filename with a `MediaLibrary` entry's filename and returning its `alt_text`.

### Supported Image Fields:
- `thumbnail_small`
- `thumbnail_large`
- `carousel_one_small`
- `carousel_one_large`
- `carousel_two_small`
- `carousel_two_large`
- `carousel_three_small`
- `carousel_three_large`
- `carousel_four_small`
- `carousel_four_large`

For every field above, the response now also includes an accompanying alt text field named `{field_name}_alt`.

### Alt Text Mapping Details
- Mapping is filename-based: the system extracts the basename of each package image file and looks for a `MediaLibrary.file` ending with that filename.
- If found and `alt_text` is present, it is returned in `{field}_alt`.
- If not found or blank, an empty string `""` is returned.
- To avoid ambiguity, ensure uploaded filenames are unique or use descriptive names.

### Error Handling:

**MediaLibrary Not Found:**
```json
{
    "status": 404,
    "error": "Media item with ID \"123\" not found"
}
```

**Permission Denied:**
```json
{
    "status": 403,
    "error": "Only editors or superusers can modify packages"
}
```

**Package Not Found:**
```json
{
    "status": 404,
    "error": "Bus package with tag \"12345\" not found"
}
```

**Validation Errors:**
```json
{
    "status": 400,
    "error": {
        "adult_price": ["This field must be a positive integer."],
        "name": ["This field may not be blank."]
    }
}
```

### Notes:
- MediaLibrary URLs must contain `/media_library/` in the path to be processed
- If a MediaLibrary URL fails to download, that field is skipped (no error thrown)
- Regular file uploads still work normally for package updates
- Both BusPackages and MuseumPackages support the same MediaLibrary integration
- All image fields are optional and support partial updates
- Provide meaningful `alt_text` for accessibility (screen readers, SEO)
