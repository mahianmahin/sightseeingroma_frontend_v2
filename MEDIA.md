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




GET /packages/

HTTP 200 OK
Allow: OPTIONS, GET
Content-Type: application/json
Vary: Accept

{
    "status": 200,
    "bus_data": [
        {
            "id": 2,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-08-30T00:56:46.046397+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Rome Bus Ticket: Discover Package",
            "meta_title": "Hello test, this is meta inforamtion title",
            "meta_description": "Hello test, this is meta inforamtion description",
            "duration": "24 HOURS",
            "thumbnail_small": "/media/bus_packages/thumbnails/Phone_P2EpL8c.jpg",
            "thumbnail_large": "/media/bus_packages/thumbnails/Laptop_2Fu8Dmi.jpg",
            "carousel_one_small": "/media/bus_packages/carousel/Artboard_5.jpg",
            "carousel_one_large": "/media/bus_packages/carousel/Phone.jpg",
            "carousel_two_small": "/media/bus_packages/carousel/Artboard_6.jpg",
            "carousel_two_large": "/media/bus_packages/carousel/Phone-1_eTHvNCO.jpg",
            "carousel_three_small": "/media/bus_packages/carousel/Artboard_7.jpg",
            "carousel_three_large": "/media/bus_packages/carousel/Phone-2_XCGWEhd.jpg",
            "carousel_four_small": "/media/bus_packages/carousel/Artboard_8.jpg",
            "carousel_four_large": "/media/bus_packages/carousel/Phone-3_W2yDQ0F.jpg",
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>Discover Package</strong></span><span style=\"color:#000000\"> lets you explore Rome at your own pace with 24-hour hop-on hop-off access to landmarks like the Colosseum, Pantheon, Trevi Fountain, and Spanish Steps. Enjoy insightful multilingual audio commentary as you travel around the city.</span></p>\r\n\r\n<p><span style=\"color:#000000\">With free Wi-Fi, a detailed route map, and a helpful mobile app, the Discover Package offers flexibility and convenience.</span></p>\r\n\r\n<p><span style=\"color:#000000\"><strong>Ideal For</strong></span><span style=\"color:#000000\">: Perfect for those wanting to see the best of Rome in one day. Ideal for first-time visitors and those with limited time.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<h3><span style=\"color:#000000\"><strong>What&rsquo;s Included:</strong></span></h3>\r\n\r\n<p><span style=\"color:#000000\"><span style=\"color:#000000\">✔ Full</span><span style=\"color:#000000\">&nbsp;access to all bus routes</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary</span><br />\r\n<span style=\"color:#000000\">✔ Free Vox City Digital Walking Tours</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Flexible ticketing</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></span></p>",
            "off_price": 36,
            "adult_price": 29,
            "youth_price": 10,
            "infant_price": 0,
            "package_tag": 76979,
            "is_featured": true,
            "ticket_type": "24 hours",
            "company": "big bus",
            "folder": 1
        },
        {
            "id": 3,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:30:36.472000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Rome Bus Ticket: Essential Package",
            "meta_title": null,
            "meta_description": null,
            "duration": "48 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Make the most of your visit to Rome with the </span><span style=\"color:#000000\"><strong>48-hour Essential Package</strong></span><span style=\"color:#000000\">. Explore the city&#39;s top landmarks like the Colosseum, Vatican, and Spanish Steps at your own pace with unlimited hop-on hop-off access. Enjoy insightful pre-recorded commentary in 7 languages and discover the rich history of Rome with free Vox City Digital Walking Tours.</span></p>\r\n\r\n<p><span style=\"color:#000000\">With free Wi-Fi, a mobile app, and flexible ticketing, the Essential Package offers maximum convenience for your sightseeing.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 48-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary</span><br />\r\n<span style=\"color:#000000\">✔ Free Vox City Digital Walking Tours</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Flexible ticketing</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 45,
            "adult_price": 32,
            "youth_price": 14,
            "infant_price": 0,
            "package_tag": 76978,
            "is_featured": false,
            "ticket_type": "48 hours",
            "company": "big bus",
            "folder": 1
        },
        {
            "id": 4,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:30:10.213000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Rome Bus Ticket: Explore Package",
            "meta_title": null,
            "meta_description": null,
            "duration": "72 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>72-Hour Explore Package</strong></span><span style=\"color:#000000\"> gives you the chance to fully immerse yourself in Rome&#39;s top attractions over three days. With unlimited hop-on hop-off access, you can explore landmarks like the Colosseum, Vatican, and Spanish Steps at your own pace. Enjoy pre-recorded commentary in 7 languages, free Vox City Digital Walking Tours, and a night tour to discover the beauty of Rome after dark.&nbsp;</span></p>\r\n\r\n<p><span style=\"color:#000000\">The Explore Package is perfect for those wanting a deeper experience of the Eternal City.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 72-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary</span><br />\r\n<span style=\"color:#000000\">✔ Free Vox City Digital Walking Tours</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Night tour of Rome</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Flexible ticketing</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 50,
            "adult_price": 36,
            "youth_price": 19,
            "infant_price": 0,
            "package_tag": 94458,
            "is_featured": true,
            "ticket_type": "72 hours",
            "company": "big bus",
            "folder": 1
        },
        {
            "id": 5,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:31:05.680000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Big Bus | One day |",
            "meta_title": null,
            "meta_description": null,
            "duration": "1 DAY",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Make the most of your time in Rome with the </span><span style=\"color:#000000\"><strong>One Day Ticket</strong></span><span style=\"color:#000000\">. Enjoy hop-on hop-off access for one full day and discover iconic landmarks like the Colosseum, Pantheon, Trevi Fountain, and Spanish Steps. With insightful pre-recorded commentary available in 7 languages, you can learn about the city&rsquo;s rich history while exploring at your own pace.&nbsp;</span></p>\r\n\r\n<p><span style=\"color:#000000\">This ticket is valid for the day of purchase only, providing a quick and convenient way to experience the best of Rome in just one day.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ One Day Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Flexible ticketing</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>\r\n\r\n<p>&nbsp;</p>",
            "off_price": 26,
            "adult_price": 19,
            "youth_price": 15,
            "infant_price": 0,
            "package_tag": 94445,
            "is_featured": false,
            "ticket_type": "1 day",
            "company": "big bus",
            "folder": 1
        },
        {
            "id": 6,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-08-29T19:09:38.430708+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Hop-On Hop-Off Panoramic Rome Bus Tour | 24 Hours",
            "meta_title": "",
            "meta_description": "",
            "duration": "24 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p>\n  <span style=\"color:#000000\">\n    Explore Rome at your own pace with the\n  </span>\n  <span style=\"color:#000000\">\n    <strong>\n      24-Hour Hop-On Hop-Off Panoramic Bus Tour\n    </strong>\n  </span>\n  <span style=\"color:#000000\">\n    . With unlimited access to 3 routes and 15 stops, discover the city&rsquo;s top landmarks on your terms. Choose from the Green, Orange, or Blue Routes, each offering a unique perspective of the Eternal City. Enjoy commentary in 16 languages and hop off at attractions like the Colosseum, Vatican, and more. Perfect for those looking to explore Rome in a day!\n  </span>\n</p>\n<p>\n  &nbsp;\n</p>\n<p>\n  <span style=\"color:#000000\">\n    <strong>\n      What&rsquo;s Included\n    </strong>\n  </span>\n  <span style=\"color:#000000\">\n    :\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ 24-Hour Unlimited Access\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ 3 Routes, 15 Stops\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ Multilingual audio commentary in 16 languages\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ Flexible itinerary with hop-on hop-off convenience\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ Comprehensive route map\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ Mobile app access with live bus times\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ Timetable of bus rides\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✔ Electronic voucher\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✖ Entrance fees\n  </span>\n  <br />\n  <span style=\"color:#000000\">\n    ✖ Drinks, foods, and souvenir shopping 12345\n  </span>\n</p>",
            "off_price": 27,
            "adult_price": 22,
            "youth_price": 13,
            "infant_price": 0,
            "package_tag": 63265,
            "is_featured": false,
            "ticket_type": "24 hours",
            "company": "green line",
            "folder": 2
        },
        {
            "id": 7,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:38:32.559000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Hop-On Hop-Off Panoramic Rome Bus Tour | 48 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "48 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">With the </span><span style=\"color:#000000\"><strong>48-Hour Hop-On Hop-Off Panoramic Bus Tour</strong></span><span style=\"color:#000000\">, you have more time to explore Rome&#39;s top landmarks across 3 routes and 15 stops. From the Green Route&rsquo;s iconic landmarks to the Italian food experience on the Orange Route, and off-the-beaten-path treasures on the Blue Route, you&rsquo;ll see Rome from every angle. Enjoy insightful commentary available in 16 languages, making this tour perfect for those who want to see more in two days.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 48-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 3 Routes, 15 Stops</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary in 16 languages</span><br />\r\n<span style=\"color:#000000\">✔ Flexible itinerary with hop-on hop-off convenience</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 34,
            "adult_price": 28,
            "youth_price": 15,
            "infant_price": 0,
            "package_tag": 63258,
            "is_featured": true,
            "ticket_type": "48 hours",
            "company": "green line",
            "folder": 2
        },
        {
            "id": 8,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:40:57.128000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Hop-On Hop-Off Panoramic Rome Bus Tour | 72 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "72 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>72-Hour Hop-On Hop-Off Panoramic Bus Tour</strong></span><span style=\"color:#000000\"> lets you take full advantage of Rome&rsquo;s most iconic attractions over three days. With three routes covering 15 stops, including the Green, Orange, and Blue Routes, you&rsquo;ll have ample time to explore landmarks, food destinations, and hidden gems. This extended tour is perfect for travelers who want to experience Rome in-depth with flexibility and ease.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 72-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 3 Routes, 15 Stops</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary in 16 languages</span><br />\r\n<span style=\"color:#000000\">✔ Flexible itinerary with hop-on hop-off convenience</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 39,
            "adult_price": 31,
            "youth_price": 19,
            "infant_price": 0,
            "package_tag": 63311,
            "is_featured": false,
            "ticket_type": "72 hours",
            "company": "green line",
            "folder": 2
        },
        {
            "id": 9,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:41:10.923000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Hop-On Hop-Off Panoramic Rome Bus Tour | Daily Ticket",
            "meta_title": null,
            "meta_description": null,
            "duration": "1 DAY",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>Daily Ticket</strong></span><span style=\"color:#000000\"> offers a single day of hop-on hop-off access to all 3 routes and 15 stops across Rome. Perfect for visitors who want to explore at their own pace, this ticket allows you to jump on and off the buses as much as you like throughout the day. With commentary in 16 languages and a flexible itinerary, you&rsquo;ll have everything you need to see Rome&rsquo;s top sights in one day.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ One Day Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 3 Routes, 15 Stops</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary in 16 languages</span><br />\r\n<span style=\"color:#000000\">✔ Flexible itinerary with hop-on hop-off convenience</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 24,
            "adult_price": 19,
            "youth_price": 12,
            "infant_price": 0,
            "package_tag": 63411,
            "is_featured": true,
            "ticket_type": "1 day",
            "company": "green line",
            "folder": 2
        },
        {
            "id": 10,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:41:31.598000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "Hop-On Hop-Off Panoramic Rome Bus Tour | 3 Pass Ticket",
            "meta_title": null,
            "meta_description": null,
            "duration": "3 PASS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">The 3-</span><span style=\"color:#000000\"><strong>Pass Ticket</strong></span><span style=\"color:#000000\"> allows you to get on and off at 3 different stops of your choice within the day, making it perfect for those who want a more focused exploration of the city. With access to all 3 routes, you can visit landmarks at your leisure. This pass offers flexibility, allowing you to explore Rome in-depth with minimal time commitment.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 3 Stops on Any Route</span><br />\r\n<span style=\"color:#000000\">✔ Multilingual audio commentary in 16 languages</span><br />\r\n<span style=\"color:#000000\">✔ Flexible itinerary with hop-on hop-off convenience</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile app access with live bus times</span><br />\r\n<span style=\"color:#000000\">✔ Timetable of bus rides</span><br />\r\n<span style=\"color:#000000\">✔ Electronic voucher</span><br />\r\n<span style=\"color:#000000\">✖ Entrance fees</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 18,
            "adult_price": 14,
            "youth_price": 10,
            "infant_price": 0,
            "package_tag": 63561,
            "is_featured": true,
            "ticket_type": "3 pass",
            "company": "green line",
            "folder": 2
        },
        {
            "id": 11,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:42:10.169000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "I Love Rome Hop On Hop Off Panoramic Tour | 24 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "24 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Explore Rome at your own pace with the </span><span style=\"color:#000000\"><strong>24-Hour Hop-On Hop-Off Panoramic Tour</strong></span><span style=\"color:#000000\">. Enjoy unlimited rides on our pink double-decker buses, visiting the city&rsquo;s iconic landmarks like the Colosseum, Pantheon, and Trevi Fountain. With commentary available in 12 languages, including a kids&rsquo; version in English and Italian, you&rsquo;ll gain fascinating insights into Rome&rsquo;s history and culture. Enjoy free Wi-Fi onboard and a detailed route map to guide your journey. Valid for 24 hours from your first ride.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 24-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 12 Languages Audio Guide</span><br />\r\n<span style=\"color:#000000\">✔ Kids Audio Commentary (English &amp; Italian)</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile &amp; printed vouchers accepted</span><br />\r\n<span style=\"color:#000000\">✔ Eco-Friendly, Pet Friendly (medium-size animals allowed onboard)</span><br />\r\n<span style=\"color:#000000\">✖ Admission tickets to attractions</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 30,
            "adult_price": 27,
            "youth_price": 16,
            "infant_price": 0,
            "package_tag": 52120,
            "is_featured": false,
            "ticket_type": "24 hours",
            "company": "i love rome",
            "folder": 3
        },
        {
            "id": 12,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:42:29.273000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "I Love Rome Hop On Hop Off Panoramic Tour | 48 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "48 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Maximize your Roman adventure with the </span><span style=\"color:#000000\"><strong>48-Hour Hop-On Hop-Off Panoramic Tour</strong></span><span style=\"color:#000000\">. With two full days of access, explore Rome&rsquo;s best landmarks at your leisure, hopping on and off as many times as you like. The tour includes multilingual commentary and children&rsquo;s audio guides. Perfect for those who want a deeper exploration of Rome&rsquo;s vibrant culture and history, this tour offers a great balance of flexibility and convenience.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 48-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 12 Languages Audio Guide</span><br />\r\n<span style=\"color:#000000\">✔ Kids Audio Commentary (English &amp; Italian)</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile &amp; printed vouchers accepted</span><br />\r\n<span style=\"color:#000000\">✔ Eco-Friendly, Pet Friendly (medium-size animals allowed onboard)</span><br />\r\n<span style=\"color:#000000\">✖ Admission tickets to attractions</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 34,
            "adult_price": 28,
            "youth_price": 15,
            "infant_price": 0,
            "package_tag": 52116,
            "is_featured": false,
            "ticket_type": "48 hours",
            "company": "i love rome",
            "folder": 3
        },
        {
            "id": 13,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:42:47.986000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "I Love Rome Hop On Hop Off Panoramic Tour | 72 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "72 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Experience Rome like never before with the </span><span style=\"color:#000000\"><strong>72-Hour Hop-On Hop-Off Panoramic Tour</strong></span><span style=\"color:#000000\">. Enjoy three full days to explore the Eternal City at your own pace, hopping on and off at Rome&rsquo;s top landmarks. With insightful audio commentary available in 12 languages, including a special kids&rsquo; guide, you&rsquo;ll immerse yourself in the history and culture of this vibrant city. This extended ticket gives you ample time to fully appreciate all that Rome has to offer.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 72-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 12 Languages Audio Guide</span><br />\r\n<span style=\"color:#000000\">✔ Kids Audio Commentary (English &amp; Italian)</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile &amp; printed vouchers accepted</span><br />\r\n<span style=\"color:#000000\">✔ Eco-Friendly, Pet Friendly (medium-size animals allowed onboard)</span><br />\r\n<span style=\"color:#000000\">✖ Admission tickets to attractions</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 38,
            "adult_price": 31,
            "youth_price": 21,
            "infant_price": 0,
            "package_tag": 52457,
            "is_featured": false,
            "ticket_type": "72 hours",
            "company": "i love rome",
            "folder": 3
        },
        {
            "id": 14,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-07-12T16:41:50.352651+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "I Love Rome Hop On Hop Off Panoramic Tour | Daily",
            "meta_title": null,
            "meta_description": null,
            "duration": "DAILY TOUR",
            "thumbnail_small": "/media/bus_packages/thumbnails/4_small.jpg",
            "thumbnail_large": "/media/bus_packages/thumbnails/4_small_a34kNHY.jpg",
            "carousel_one_small": "/media/bus_packages/carousel/1_large.jpg",
            "carousel_one_large": "/media/bus_packages/carousel/1_large_95Wb2On.jpg",
            "carousel_two_small": "/media/bus_packages/carousel/1_large_tHEo5jH.jpg",
            "carousel_two_large": "/media/bus_packages/carousel/4_small.jpg",
            "carousel_three_small": "/media/bus_packages/carousel/1_large_78OJ6TN.jpg",
            "carousel_three_large": "/media/bus_packages/carousel/1_large_DCOX74Z.jpg",
            "carousel_four_small": "/media/bus_packages/carousel/1_large_W24thHG.jpg",
            "carousel_four_large": "/media/bus_packages/carousel/1_large_3WwfY8o.jpg",
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>Daily Ticket</strong></span><span style=\"color:#000000\"> provides a full day of hop-on hop-off access, allowing you to explore Rome at your own pace. Enjoy unlimited rides between the city&rsquo;s top landmarks, with detailed audio commentary in 12 languages. Ideal for those wanting to see the best of Rome in one day, this ticket offers flexibility, convenience, and a rich cultural experience, complete with free Wi-Fi and a route map to guide your journey.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ One Day Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 12 Languages Audio Guide</span><br />\r\n<span style=\"color:#000000\">✔ Kids Audio Commentary (English &amp; Italian)</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile &amp; printed vouchers accepted</span><br />\r\n<span style=\"color:#000000\">✔ Eco-Friendly, Pet Friendly (medium-size animals allowed onboard)</span><br />\r\n<span style=\"color:#000000\">✖ Admission tickets to attractions</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 22,
            "adult_price": 19,
            "youth_price": 11,
            "infant_price": 0,
            "package_tag": 52234,
            "is_featured": false,
            "ticket_type": "daily tour",
            "company": "i love rome",
            "folder": 3
        },
        {
            "id": 15,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:43:22.057000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "I Love Rome Hop On Hop Off | Half Day",
            "meta_title": null,
            "meta_description": null,
            "duration": "HALF DAY",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Short on time? The </span><span style=\"color:#000000\"><strong>Half Day Ticket</strong></span><span style=\"color:#000000\"> is perfect for a quick exploration of Rome&rsquo;s highlights. This ticket is valid for 4 hours from the first use and allows you to hop on and off at major landmarks, from the Colosseum to the Vatican. Enjoy the flexibility to tailor your experience with audio commentary in 12 languages and a special kids&rsquo; guide. This ticket is ideal for those looking to experience Rome&rsquo;s essence in just a few hours.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 4-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ 12 Languages Audio Guide</span><br />\r\n<span style=\"color:#000000\">✔ Kids Audio Commentary (English &amp; Italian)</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile &amp; printed vouchers accepted</span><br />\r\n<span style=\"color:#000000\">✔ Eco-Friendly, Pet Friendly (medium-size animals allowed onboard)</span><br />\r\n<span style=\"color:#000000\">✖ Admission tickets to attractions</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 20,
            "adult_price": 16,
            "youth_price": 11,
            "infant_price": 0,
            "package_tag": 76119,
            "is_featured": true,
            "ticket_type": "half day",
            "company": "i love rome",
            "folder": 3
        },
        {
            "id": 16,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:43:38.036000+06:00",
            "type": "NO HOP-OFF TOUR",
            "title": "I Love Rome. Panoramic One Round Tour | One Run",
            "meta_title": null,
            "meta_description": null,
            "duration": "ONE RUN",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">For those who prefer a quicker, non-stop experience, the </span><span style=\"color:#000000\"><strong>One Run Ticket</strong></span><span style=\"color:#000000\"> offers a one-time, uninterrupted ride through Rome&rsquo;s iconic landmarks. This ticket is ideal for those short on time but still looking to experience the essence of Rome.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ One-Time Non-Stop Tour</span><br />\r\n<span style=\"color:#000000\">✔ 12 Languages Audio Guide</span><br />\r\n<span style=\"color:#000000\">✔ Kids Audio Commentary (English &amp; Italian)</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Comprehensive route map</span><br />\r\n<span style=\"color:#000000\">✔ Mobile &amp; printed vouchers accepted</span><br />\r\n<span style=\"color:#000000\">✔ Eco-Friendly, Pet Friendly (medium-size animals allowed onboard)</span><br />\r\n<span style=\"color:#000000\">✖ Admission tickets to attractions</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, foods, and souvenir shopping</span></p>",
            "off_price": 19,
            "adult_price": 15,
            "youth_price": 8,
            "infant_price": 0,
            "package_tag": 58919,
            "is_featured": true,
            "ticket_type": "one run",
            "company": "i love rome",
            "folder": 3
        },
        {
            "id": 23,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:33:56.982000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "CitySightseeing | Hop-on Hop-off | 24 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "24 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">Explore Rome at your own pace with the </span><span style=\"color:#000000\"><strong>CitySightseeing 24-Hour Ticket</strong></span><span style=\"color:#000000\">. Hop on and off as many times as you like, and discover the city&#39;s most famous sites such as the Colosseum, Roman Forum, and Vatican. With multilingual audio guides and access to the </span><span style=\"color:#000000\"><strong>Sightseeing Experience App</strong></span><span style=\"color:#000000\">, you can easily plan your route and enjoy an informative, comfortable tour. Valid for 24 hours from the first ride, this ticket is perfect for flexible sightseeing.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 24-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ Audio guide in 8 languages</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Free app &#39;Sightseeing Experience&#39; for real-time bus tracking</span><br />\r\n<span style=\"color:#000000\">✔ Walking tour included (5 languages)</span><br />\r\n<span style=\"color:#000000\">✔ Hop on and off as many times as you want</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, meals, and pick-up service</span></p>",
            "off_price": 33,
            "adult_price": 28,
            "youth_price": 13,
            "infant_price": 0,
            "package_tag": 22514,
            "is_featured": true,
            "ticket_type": "24 hours",
            "company": "city sightseeing",
            "folder": 5
        },
        {
            "id": 24,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-06-03T12:34:45.218000+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "CitySightseeing | Hop-on Hop-off | 48 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "48 HOURS",
            "thumbnail_small": null,
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>CitySightseeing 48-Hour Ticket</strong></span><span style=\"color:#000000\"> offers two full days to explore Rome. Take your time to see the city&rsquo;s top attractions, from the Colosseum to Piazza Santa Maria Maggiore, with unlimited hop-on hop-off access. With audio guides in 8 languages, you&rsquo;ll gain a deeper understanding of Rome&#39;s rich history. The </span><span style=\"color:#000000\"><strong>Sightseeing Experience App</strong></span><span style=\"color:#000000\"> ensures you can easily navigate, check bus locations in real-time, and make the most of your 48-hour adventure.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 48-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ Audio guide in 8 languages</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Free app &#39;Sightseeing Experience&#39; for real-time bus tracking</span><br />\r\n<span style=\"color:#000000\">✔ Walking tour included (5 languages)</span><br />\r\n<span style=\"color:#000000\">✔ Hop on and off as many times as you want</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, meals, and pick-up service</span></p>",
            "off_price": 39,
            "adult_price": 32,
            "youth_price": 15,
            "infant_price": 0,
            "package_tag": 22515,
            "is_featured": true,
            "ticket_type": "48 hours",
            "company": "city sightseeing",
            "folder": 5
        },
        {
            "id": 25,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-07-12T16:53:27.549074+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "CitySightseeing | Hop-on Hop-off | 72 Hours",
            "meta_title": null,
            "meta_description": null,
            "duration": "72 HOURS",
            "thumbnail_small": "/media/bus_packages/thumbnails/1_large_n9y9S6p.jpg",
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<p><span style=\"color:#000000\">The </span><span style=\"color:#000000\"><strong>CitySightseeing 72-Hour Ticket</strong></span><span style=\"color:#000000\"> gives you three days to experience all of Rome&#39;s must-see attractions. Hop on and off at your own pace, and explore the Colosseum, Vatican Museums, and more. Enjoy 8-language audio commentary and use the </span><span style=\"color:#000000\"><strong>Sightseeing Experience App</strong></span><span style=\"color:#000000\"> to track bus locations and plan your visit. With three full days to explore, this is the ideal ticket for anyone wanting a more leisurely experience of Rome&rsquo;s landmarks.</span></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><span style=\"color:#000000\"><strong>What&rsquo;s Included</strong></span><span style=\"color:#000000\">:</span><br />\r\n<span style=\"color:#000000\">✔ 72-Hour Unlimited Access</span><br />\r\n<span style=\"color:#000000\">✔ Audio guide in 8 languages</span><br />\r\n<span style=\"color:#000000\">✔ Free Wi-Fi onboard</span><br />\r\n<span style=\"color:#000000\">✔ Free app &#39;Sightseeing Experience&#39; for real-time bus tracking</span><br />\r\n<span style=\"color:#000000\">✔ Walking tour included (5 languages)</span><br />\r\n<span style=\"color:#000000\">✔ Hop on and off as many times as you want</span><br />\r\n<span style=\"color:#000000\">✖ Drinks, meals, and pick-up service</span></p>",
            "off_price": 46,
            "adult_price": 38,
            "youth_price": 19,
            "infant_price": 0,
            "package_tag": 22518,
            "is_featured": false,
            "ticket_type": "72 hours",
            "company": "city sightseeing",
            "folder": 5
        },
        {
            "id": 26,
            "thumbnail_small_alt": "",
            "thumbnail_large_alt": "",
            "carousel_one_small_alt": "",
            "carousel_one_large_alt": "",
            "carousel_two_small_alt": "",
            "carousel_two_large_alt": "",
            "carousel_three_small_alt": "",
            "carousel_three_large_alt": "",
            "carousel_four_small_alt": "",
            "carousel_four_large_alt": "",
            "purchased_date": "2025-08-29T19:02:06.419632+06:00",
            "type": "HOP-ON HOP-OFF TOUR",
            "title": "CitySightseeing | Hop-on Hop-off | 1 Day",
            "meta_title": "",
            "meta_description": "",
            "duration": "1 DAY",
            "thumbnail_small": "/media/bus_packages/thumbnails/1_large.jpg",
            "thumbnail_large": null,
            "carousel_one_small": null,
            "carousel_one_large": null,
            "carousel_two_small": null,
            "carousel_two_large": null,
            "carousel_three_small": null,
            "carousel_three_large": null,
            "carousel_four_small": null,
            "carousel_four_large": null,
            "description": "<div className=\"space-y-6\">\n  <div className=\"bg-gradient-to-r from-red-50 to-white p-6 rounded-lg text-lg\">\n    <p className=\"text-gray-800 leading-relaxed\">\n      Experience the Eternal City in just one day with the\n      <span className=\"font-bold\">\n        CitySightseeing 1 Day Ticket\n      </span>\n      .\n            Hop on the red open-top double-decker buses at\n      <span className=\"font-semibold\">\n        Roma Termini Station\n      </span>\n      and explore iconic landmarks like the Colosseum, Imperial Forums, and Circus Maximus.\n      <br />\n      Enjoy the flexibility to hop on and off at your leisure and discover Rome from a unique perspective.\n            With audio commentary available in 8 languages and free Wi-Fi onboard, this tour offers an unforgettable view of Rome.\n    </p>\n  </div>\n  <div className=\"bg-white p-6 rounded-lg shadow-md border\">\n    <h3 className=\"text-xl font-bold text-gray-900 mb-4 flex items-center\">\n      <span className=\"w-2 h-2 bg-red-500 rounded-full mr-3\">\n      </span>\n      What's Included\n    </h3>\n    <div className=\"space-y-3\">\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-green-500 font-bold text-lg mt-0.5\">\n          ✓\n        </span>\n        <span className=\"text-gray-700\">\n          1-Day Unlimited Access\n        </span>\n      </div>\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-green-500 font-bold text-lg mt-0.5\">\n          ✓\n        </span>\n        <span className=\"text-gray-700\">\n          Audio guide in 8 languages\n        </span>\n      </div>\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-green-500 font-bold text-lg mt-0.5\">\n          ✓\n        </span>\n        <span className=\"text-gray-700\">\n          Free Wi-Fi onboard\n        </span>\n      </div>\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-green-500 font-bold text-lg mt-0.5\">\n          ✓\n        </span>\n        <span className=\"text-gray-700\">\n          Free app 'Sightseeing Experience' for real-time bus tracking\n        </span>\n      </div>\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-green-500 font-bold text-lg mt-0.5\">\n          ✓\n        </span>\n        <span className=\"text-gray-700\">\n          Walking tour included (5 languages)\n        </span>\n      </div>\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-green-500 font-bold text-lg mt-0.5\">\n          ✓\n        </span>\n        <span className=\"text-gray-700\">\n          Hop on and off as many times as you want\n        </span>\n      </div>\n      <div className=\"flex items-start space-x-3\">\n        <span className=\"text-red-500 font-bold text-lg mt-0.5\">\n          ✗\n        </span>\n        <span className=\"text-gray-600 italic\">\n          Drinks, meals, and pick-up service 1234\n        </span>\n      </div>\n    </div>\n  </div>\n</div>",
            "off_price": 35,
            "adult_price": 27,
            "youth_price": 10,
            "infant_price": 0,
            "package_tag": 22613,
            "is_featured": false,
            "ticket_type": "1 day",
            "company": "city sightseeing",
            "folder": 5
        }
    ],
    "museum_data": [],
    "folders": [
        {
            "id": 1,
            "name": "BIG BUS",
            "image": "/media/folder_images/bu4_RjuQb4o.jpg",
            "company_slug": "big-bus",
            "active": true
        },
        {
            "id": 2,
            "name": "GREEN LINE",
            "image": "/media/folder_images/2-glt-hop-on-hop-off-rome-min_6W6iRsu.jpg",
            "company_slug": "green-line",
            "active": true
        },
        {
            "id": 3,
            "name": "I LOVE ROME",
            "image": "/media/folder_images/i_love_rome_pic-min.jpg",
            "company_slug": "i-love-rome",
            "active": true
        },
        {
            "id": 5,
            "name": "CITY SIGHTSEEING",
            "image": "/media/folder_images/ct1.jpg",
            "company_slug": "city-sightseeing",
            "active": true
        }
    ]
}

