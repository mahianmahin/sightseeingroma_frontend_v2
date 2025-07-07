# Newsletter Subscription API Requirements

To make the newsletter subscription box functional, the backend should provide an API endpoint that allows users to subscribe with their email address. Upon successful subscription, the backend should send a confirmation or welcome email to the user.

## Endpoint
- **URL:** `/newsletter/subscribe/`
- **Method:** `POST`
- **Content-Type:** `application/json`

## Request Body
```
{
  "email": "user@example.com"
}
```

## Response
- **Success (200 OK):**
```
{
  "message": "Subscription successful. Confirmation email sent."
}
```
- **Error (4xx/5xx):**
```
{
  "error": "Subscription failed. Reason..."
}
```

## Backend Requirements
- Validate the email address format.
- Add the email to the newsletter subscribers list (database or mailing list provider).
- Send a confirmation or welcome email to the provided address.
- Return a clear success or error message in the response.

## Example Workflow
1. User enters their email and clicks "HOP IN!".
2. Frontend sends a POST request to `/newsletter/subscribe/` with the email in the body.
3. Backend validates and processes the request.
4. Backend sends a confirmation email to the user.
5. Backend responds with success or error message.

---

**Note:** The endpoint URL should be accessible at `${baseUrl}newsletter/subscribe/` as used in the frontend code.
