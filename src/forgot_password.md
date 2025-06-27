# Password Reset API Documentation

This document outlines the endpoints available for implementing password reset functionality in the SightseeingRoma application.

## Overview

The password reset process consists of two steps:
1. Requesting a password reset code (sent via email)
2. Verifying the code and setting a new password

## Endpoints

### 1. Request Password Reset

Sends a 6-digit verification code to the user's email address.

**Endpoint:** `/request-password-reset/`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body
```json
{
    "email": "user@example.com"
}
```

#### Responses

**Success (200 OK)**
```json
{
    "status": 200,
    "message": "Reset code sent successfully"
}
```

**Error Cases**

*Email Not Provided (400 Bad Request)*
```json
{
    "status": 400,
    "error": "Email is required"
}
```

*User Not Found (400 Bad Request)*
```json
{
    "status": 400,
    "error": "No account found with this email"
}
```

*Email Sending Failed (500 Internal Server Error)*
```json
{
    "status": 500,
    "error": "Failed to send reset code. Please try again."
}
```

### 2. Verify Code and Reset Password

Verifies the reset code and sets a new password for the user's account.

**Endpoint:** `/verify-reset-code/`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body
```json
{
    "email": "user@example.com",
    "code": "123456",
    "new_password": "newSecurePassword123"
}
```

#### Responses

**Success (200 OK)**
```json
{
    "status": 200,
    "message": "Password reset successful"
}
```

**Error Cases**

*Missing Fields (400 Bad Request)*
```json
{
    "status": 400,
    "error": "Email, code and new password are required"
}
```

*Invalid Code (400 Bad Request)*
```json
{
    "status": 400,
    "error": "Invalid or expired reset code"
}
```

*Expired Code (400 Bad Request)*
```json
{
    "status": 400,
    "error": "Reset code has expired"
}
```

*User Not Found (400 Bad Request)*
```json
{
    "status": 400,
    "error": "No account found with this email"
}
```

## Important Notes

1. The reset code expires after 15 minutes
2. Each reset code can only be used once
3. The verification code is 6 digits long
4. The email template includes:
   - The verification code
   - Security notices
   - Expiry information
   - Brand styling

## Implementation Flow

1. **Request Reset:**
   - User enters their email
   - Frontend calls `/request-password-reset/`
   - User receives email with verification code

2. **Verify and Reset:**
   - User enters the code from their email
   - User enters new password
   - Frontend calls `/verify-reset-code/` with all details
   - On success, redirect to login page
   - On error, show appropriate error message

## Security Recommendations

1. Implement rate limiting on the frontend for both endpoints
2. Validate password strength before submission
3. Don't store the reset code in localStorage/sessionStorage
4. Clear all form fields after successful password reset
5. Implement proper error handling and user feedback

## Example Implementation

```javascript
// Request reset code
async function requestPasswordReset(email) {
    try {
        const response = await fetch('/request-password-reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Verify code and reset password
async function verifyAndResetPassword(email, code, newPassword) {
    try {
        const response = await fetch('/verify-reset-code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                code,
                new_password: newPassword
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```