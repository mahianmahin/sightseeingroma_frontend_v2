# Analytics Dashboard API Documentation

## Authentication

All endpoints require JWT authentication via Bearer token in the header:
```
Authorization: Bearer <access_token>
```

## Base URL
```
http://sightseeingroma.pythonanywhere.com
```

## Endpoints

### 1. Track User Activity
Records user activities across the website.

**Endpoint:** `/track-activity/`  
**Method:** `POST`  
**Authentication:** Optional (for both authenticated and anonymous users)

**Request Body:**
```json
{
    "action": "string",          // Description of the activity
    "timestamp": "ISO string",   // When the activity occurred
    "ipAddress": "string",       // User's IP address
    "country": "string",         // User's country
    "countryCode": "string",     // 2-letter country code
    "city": "string",           // User's city
    "region": "string",         // User's region/state
    "page": "string",           // Current page URL
    "ticketType": "string",     // Optional: Type of ticket viewed
    "amount": "number",         // Optional: Payment amount
    "status": "string"          // Optional: Status of the action
}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Activity tracked successfully"
}
```

### 2. Get Main Dashboard Analytics
Fetches overview data for the main dashboard.

**Endpoint:** `/analytics/`  
**Method:** `GET`  
**Authentication:** Required (Superuser only)

**Response (200):**
```json
{
    "insights": {
        "totalVisits": 1234,
        "ticketViews": 567,
        "paymentInitiations": 89,
        "successfulPayments": 45,
        "cancelledPayments": 12
    },
    "userActivities": [
        {
            "timestamp": "ISO string",
            "user": "string or null",
            "action": "string",
            "ipAddress": "string",
            "country": "string",
            "countryCode": "string",
            "city": "string"
        }
    ]
}
```

### 3. Get Detailed Metrics
Fetches detailed information for specific metrics.

**Endpoint:** `/analytics/detailed/<metric-type>/`  
**Method:** `GET`  
**Authentication:** Required (Superuser only)

**Available metric types:**
- total-visits
- ticket-views
- payment-initiations
- successful-payments
- cancelled-payments

**Response (200):**
```json
{
    "activities": [
        {
            "timestamp": "ISO string",
            "user": "string or null",
            "details": "string",
            "ipAddress": "string",
            "country": "string",
            "countryCode": "string",
            "city": "string",
            "amount": "number or null",
            "status": "string"
        }
    ],
    "statistics": {
        "conversionRates": {
            "successful": 65,
            "pending": 20,
            "cancelled": 15
        },
        "weeklyTrends": {
            "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "data": [10, 15, 8, 12, 20, 25, 18]
        },
        "kpi": {
            "conversion_rate": 12.5,
            "average_value": 150,
            "success_rate": 85,
            "bounce_rate": 25
        }
    }
}
```

### 4. Get Geographic Distribution
Fetches user distribution by location.

**Endpoint:** `/analytics/geographic/`  
**Method:** `GET`  
**Authentication:** Required (Superuser only)

**Response (200):**
```json
{
    "countries": [
        {
            "country": "string",
            "countryCode": "string",
            "visits": 123,
            "purchases": 45,
            "revenue": 6789
        }
    ],
    "cities": [
        {
            "city": "string",
            "country": "string",
            "visits": 123,
            "purchases": 45
        }
    ]
}
```

### 5. Get Time-Based Analytics
Fetches time-based analytics data.

**Endpoint:** `/analytics/time-based/`  
**Method:** `GET`  
**Authentication:** Required (Superuser only)

**Query Parameters:**
- timeframe: "daily" | "weekly" | "monthly" | "yearly"
- start_date: "YYYY-MM-DD"
- end_date: "YYYY-MM-DD"

**Response (200):**
```json
{
    "data": [
        {
            "period": "string",      // Date or time period
            "visits": 123,
            "ticketViews": 45,
            "purchases": 67,
            "revenue": 8901,
            "conversionRate": 12.3
        }
    ],
    "trends": {
        "visitsTrend": 5.2,         // Percentage change
        "revenueTrend": -2.1,
        "conversionTrend": 1.5
    }
}
```

### 6. Get User Behavior Analytics
Fetches user behavior patterns.

**Endpoint:** `/analytics/user-behavior/`  
**Method:** `GET`  
**Authentication:** Required (Superuser only)

**Response (200):**
```json
{
    "pathAnalysis": [
        {
            "path": "string",        // Page path
            "visits": 123,
            "averageTime": 45,       // seconds
            "bounceRate": 12.3
        }
    ],
    "userSegments": {
        "newUsers": 123,
        "returningUsers": 456,
        "activeUsers": 789
    },
    "deviceStats": {
        "desktop": 45,
        "mobile": 40,
        "tablet": 15
    }
}
```

## Error Responses

### Unauthorized (401)
```json
{
    "status": "error",
    "message": "Authentication required"
}
```

### Forbidden (403)
```json
{
    "status": "error",
    "message": "Superuser access required"
}
```

### Bad Request (400)
```json
{
    "status": "error",
    "message": "Invalid request parameters",
    "errors": {
        "field": ["error message"]
    }
}
```

### Server Error (500)
```json
{
    "status": "error",
    "message": "Internal server error"
}
```

## Rate Limiting

- Standard rate limit: 100 requests per minute
- Activity tracking endpoint: 1000 requests per minute
- Detailed analytics endpoints: 30 requests per minute

## Notes

1. All timestamps should be in GMT+6 with AM/PM annotation
2. Country codes should follow ISO 3166-1 alpha-2 format
3. Monetary values are in EUR
4. Activity tracking should be implemented on:
   - Page views
   - Ticket views
   - Payment actions
   - User authentication events
5. Real-time updates can be implemented using ajax requests
6. Data retention period: 12 months 