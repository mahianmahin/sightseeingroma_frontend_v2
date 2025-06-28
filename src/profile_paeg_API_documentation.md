# User Profile API Documentation

This document outlines the endpoints available for managing user profiles and viewing purchase statistics in the SightseeingRoma application.

## Authentication Required

All endpoints in this document require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get User Profile

Retrieves the user's profile information.

**Endpoint:** `/profile/`  
**Method:** `GET`  
**Authentication:** Required

#### Response

**Success (200 OK)**
```json
{
    "status": 200,
    "data": {
        "username": "john_doe",
        "email": "john@example.com",
        "phone_number": "+1234567890"
    }
}
```

### 2. Update User Profile

Update user's email and/or phone number. Username cannot be changed.

**Endpoint:** `/profile/update/`  
**Method:** `PUT`  
**Content-Type:** `application/json`  
**Authentication:** Required

#### Request Body
```json
{
    "email": "newemail@example.com",
    "phone_number": "+1234567890"
}
```
Note: Both fields are optional. Send only the fields you want to update.

#### Responses

**Success (200 OK)**
```json
{
    "status": 200,
    "message": "Profile updated successfully"
}
```

**Error Cases**

*Email Already Registered (400 Bad Request)*
```json
{
    "status": 400,
    "error": "This email is already registered"
}
```

### 3. Change Password

Change the user's password.

**Endpoint:** `/profile/change-password/`  
**Method:** `POST`  
**Content-Type:** `application/json`  
**Authentication:** Required

#### Request Body
```json
{
    "current_password": "currentPassword123",
    "new_password": "newPassword123"
}
```

#### Responses

**Success (200 OK)**
```json
{
    "status": 200,
    "message": "Password changed successfully"
}
```

**Error Cases**

*Missing Fields (400 Bad Request)*
```json
{
    "status": 400,
    "error": "Both current and new passwords are required"
}
```

*Incorrect Password (400 Bad Request)*
```json
{
    "status": 400,
    "error": "Current password is incorrect"
}
```

### 4. Get Purchase Statistics

Retrieve user's purchase statistics and history.

**Endpoint:** `/profile/statistics/`  
**Method:** `GET`  
**Authentication:** Required

#### Response

**Success (200 OK)**
```json
{
    "status": 200,
    "data": {
        "total_purchases": 10,
        "total_spent": 550.50,
        "recent_purchases": 3,
        "recent_spent": 150.00,
        "purchase_breakdown": {
            "bus_tours": 6,
            "museum_tickets": 4
        },
        "recent_tickets": [
            {
                "package": "Rome City Tour",
                "date": "2024-02-20T14:30:00Z",
                "total_price": 45.00,
                "ticket_count": 2
            },
            // ... up to 5 recent tickets
        ]
    }
}
```

## Statistics Details

The purchase statistics endpoint provides:
- Total number of purchases and amount spent
- Recent activity (last 30 days)
- Breakdown by ticket type (bus tours vs museum tickets)
- 5 most recent ticket purchases

## Implementation Notes

1. All monetary values are returned as floats in EUR
2. Dates are returned in ISO 8601 format
3. Phone numbers should be sent in international format (e.g., +1234567890)
4. Email changes require verification that the new email isn't already in use
5. The username field is read-only and cannot be changed

## Error Handling

All endpoints may return these common error responses:

**Server Error (500 Internal Server Error)**
```json
{
    "status": 500,
    "error": "Error message details"
}
```

**Authentication Error (401 Unauthorized)**
```json
{
    "detail": "Authentication credentials were not provided."
}
```

## Example Implementation

```javascript
// Get user profile
async function getUserProfile() {
    try {
        const response = await fetch('/profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Update profile
async function updateProfile(data) {
    try {
        const response = await fetch('/profile/update/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    try {
        const response = await fetch('/profile/change-password/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Get purchase statistics
async function getPurchaseStats() {
    try {
        const response = await fetch('/profile/statistics/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```
