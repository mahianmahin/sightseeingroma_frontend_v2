# Analytics API Implementation Documentation

## Overview
This document describes the implemented analytics system for the Sightseeing Roma platform. The system includes user activity tracking, analytics dashboards, and detailed metrics analysis.

## Models

### 1. UserActivity
Tracks individual user activities across the website:
- User actions (page views, ticket views, payments)
- Geographic information
- Device information
- Timestamps
- Payment details

### 2. DailyMetrics
Aggregated daily statistics:
- Total visits
- Unique visitors
- Ticket views
- Payment metrics
- Revenue data

### 3. GeographicMetrics
Geographic distribution of users:
- Country and city-level data
- Visit counts
- Purchase statistics
- Revenue by region

### 4. UserBehaviorMetrics
User behavior patterns:
- Path analysis
- Time spent
- Bounce rates
- Device usage
- User segments

## API Endpoints

### 1. Track Activity
```
POST /track-activity/
```
Records user activities. No authentication required.

**Request Body:**
```json
{
    "action": "page_view",
    "ipAddress": "127.0.0.1",
    "country": "Italy",
    "countryCode": "IT",
    "city": "Rome",
    "region": "Lazio",
    "page": "https://sightseeingroma.com/tickets",
    "ticketType": "museum",
    "amount": 50.00,
    "status": "success"
}
```

### 2. Dashboard Analytics
```
GET /analytics/
```
Gets overview data for the main dashboard. Requires admin access.

**Response:**
```json
{
    "insights": {
        "totalVisits": 1234,
        "ticketViews": 567,
        "paymentInitiations": 89,
        "successfulPayments": 45,
        "cancelledPayments": 12
    },
    "userActivities": [...]
}
```

### 3. Detailed Metrics
```
GET /analytics/detailed/{metric-type}/
```
Gets detailed metrics for specific types. Requires admin access.

Available metric types:
- total-visits
- ticket-views
- payment-initiations
- successful-payments
- cancelled-payments

### 4. Geographic Analytics
```
GET /analytics/geographic/
```
Gets user distribution by location. Requires admin access.

### 5. Time-Based Analytics
```
GET /analytics/time-based/
```
Gets time-based analytics data. Requires admin access.

Query Parameters:
- timeframe: daily | weekly | monthly | yearly
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD

### 6. User Behavior Analytics
```
GET /analytics/user-behavior/
```
Gets user behavior patterns. Requires admin access.

## Implementation Details

### Data Storage Optimization
1. Indexed fields for frequent queries
2. Aggregated metrics for faster retrieval
3. Automatic cleanup of old data (12-month retention)
4. Optimized field types for storage efficiency

### Caching
- Redis caching implemented
- 5-minute cache duration
- Separate cache keys for different metrics
- Cache invalidation on data updates

### Security
1. Admin-only access for analytics endpoints
2. Rate limiting:
   - Standard: 100 requests/minute
   - Activity tracking: 1000 requests/minute
   - Detailed analytics: 30 requests/minute

### Data Processing
1. Real-time activity tracking
2. Daily aggregation of metrics
3. Geographic data enrichment
4. Device detection and categorization

## Usage Examples

### Track a Page View
```python
import requests

response = requests.post('https://sightseeingroma.com/track-activity/', json={
    'action': 'page_view',
    'page': 'https://sightseeingroma.com/tickets',
    'ipAddress': '127.0.0.1',
    'country': 'Italy'
})
```

### Get Dashboard Analytics
```python
import requests

headers = {'Authorization': 'Bearer your_admin_token'}
response = requests.get('https://sightseeingroma.com/analytics/', headers=headers)
```

## Error Handling

All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden (non-admin)
- 500: Server Error

Error responses include detailed messages:
```json
{
    "status": "error",
    "message": "Detailed error description",
    "errors": {
        "field": ["error details"]
    }
}
```

## Data Retention and Cleanup

- Raw activity data: 12 months
- Aggregated metrics: 12 months
- Automatic cleanup process
- Data archival before deletion

## Future Enhancements

1. Real-time Analytics
   - WebSocket implementation
   - Live dashboard updates
   - Real-time alerts

2. Advanced Analytics
   - Predictive analytics
   - User behavior patterns
   - Revenue forecasting

3. Export Features
   - CSV/Excel export
   - Scheduled reports
   - Custom report builder

4. Integration Features
   - Google Analytics integration
   - Custom event tracking
   - Third-party analytics tools

## Maintenance

Regular maintenance tasks:
1. Index optimization
2. Cache cleanup
3. Data aggregation
4. Performance monitoring

## Best Practices

1. Use appropriate timeframes for queries
2. Implement client-side caching
3. Handle rate limits appropriately
4. Monitor data growth
5. Regular backup of analytics data 