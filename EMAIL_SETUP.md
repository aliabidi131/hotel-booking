# 📧 Email Notification System - Complete Setup Guide

## 🎯 Overview

This system automatically sends email notifications when:
1. **Contact Message**: User submits contact form → Email to admin
2. **Booking**: User makes a booking → Email to admin + confirmation to guest

---

## 📋 Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Supabase project created
- Node.js 18+ installed

---

## 🚀 Step-by-Step Setup

### Step 1: Install Supabase CLI

```bash
# Windows (PowerShell)
scoop install supabase

# Or using npm
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

### Step 3: Link Your Project

```bash
cd hotel-booking
supabase link --project-ref qjlqqtgwxickcbhkeufm
```

### Step 4: Set the Resend API Key as Secret

```bash
supabase secrets set RESEND_API_KEY=re_M3LC7CZ6_7rQtkP8ABXzqVs2ymQdS9GhF
```

### Step 5: Deploy the Edge Function

```bash
supabase functions deploy send-email
```

### Step 6: Verify Deployment

```bash
supabase functions list
```

---

## 📁 Project Structure

```
hotel-booking/
├── supabase/
│   └── functions/
│       └── send-email/
│           └── index.ts          # Edge Function code
├── src/
│   └── app/
│       └── services/
│           ├── contact.service.ts  # Contact with email
│           └── booking.service.ts  # Booking with email
```

---

## 🔧 Configuration

### Environment Variables (Supabase Secrets)

| Variable | Value | Description |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_M3LC7CZ6_7rQtkP8ABXzqVs2ymQdS9GhF` | Resend API key |

### Admin Email

The admin email is configured in the Edge Function:
```typescript
const ADMIN_EMAIL = 'aliabidi131@gmail.com'
```

---

## 📨 Email Types

### 1. Contact Message Email (to Admin)

**Trigger**: User submits contact form

**Content**:
- Sender name and email
- Subject
- Full message
- Reply button

### 2. Booking Notification (to Admin)

**Trigger**: User creates a booking

**Content**:
- Booking reference
- Hotel and room details
- Guest information
- Check-in/out dates
- Total price
- Contact guest button

### 3. Booking Confirmation (to Guest)

**Trigger**: User creates a booking

**Content**:
- Booking confirmation
- Booking reference
- Hotel details
- Stay dates
- Price summary
- Important information

---

## 🧪 Testing

### Test Contact Email

```javascript
// In browser console or Angular component
const result = await supabase.functions.invoke('send-email', {
  body: {
    type: 'contact',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message'
  }
});
console.log(result);
```

### Test Booking Email

```javascript
const result = await supabase.functions.invoke('send-email', {
  body: {
    type: 'booking',
    bookingId: 'test-123',
    userEmail: 'guest@example.com',
    userName: 'John Doe',
    hotelName: 'Grand Hotel Paradise',
    checkIn: '2024-02-01',
    checkOut: '2024-02-05',
    guests: 2,
    roomType: 'Deluxe Room',
    totalPrice: 599
  }
});
console.log(result);
```

---

## 🐛 Troubleshooting

### Error: "RESEND_API_KEY is not configured"

```bash
# Set the secret
supabase secrets set RESEND_API_KEY=re_M3LC7CZ6_7rQtkP8ABXzqVs2ymQdS9GhF

# Redeploy
supabase functions deploy send-email
```

### Error: "Function not found"

```bash
# Check function status
supabase functions list

# Redeploy
supabase functions deploy send-email
```

### CORS Error

The Edge Function includes CORS headers. If issues persist:

1. Go to Supabase Dashboard → Edge Functions
2. Select `send-email`
3. Add your domain to allowed origins

### Email not received

1. Check Resend dashboard for sent emails
2. Check spam folder
3. Verify email addresses
4. Check Supabase logs:

```bash
supabase functions logs send-email
```

---

## 📊 Monitoring

### View Function Logs

```bash
# Real-time logs
supabase functions logs send-email --follow

# Last 100 lines
supabase functions logs send-email --limit 100
```

### Resend Dashboard

Visit [resend.com/emails](https://resend.com/emails) to:
- View sent emails
- Check delivery status
- Debug failures

---

## 💰 Pricing

### Resend Free Tier
- 100 emails/day
- 3,000 emails/month

### Supabase Edge Functions
- 500,000 invocations/month (free)
- 2 million invocations/month (Pro)

---

## 🔒 Security Notes

1. **API Key**: Never expose in frontend code - use Supabase secrets
2. **Email Validation**: Always validate email format
3. **Rate Limiting**: Implement in production
4. **Spam Prevention**: Add CAPTCHA for contact form

---

## ✅ Quick Commands Reference

```bash
# Link project
supabase link --project-ref qjlqqtgwxickcbhkeufm

# Set secret
supabase secrets set RESEND_API_KEY=re_M3LC7CZ6_7rQtkP8ABXzqVs2ymQdS9GhF

# Deploy function
supabase functions deploy send-email

# View logs
supabase functions logs send-email --follow

# List functions
supabase functions list

# Delete function (if needed)
supabase functions delete send-email
```

---

## 📝 Sample Emails Preview

### Contact Email (Admin receives)
```
📬 New Contact Message
━━━━━━━━━━━━━━━━━━━━━━
From: John Doe
Email: john@example.com
Subject: Question about booking

Message:
Hello, I would like to know...

[Reply to John] (button)
```

### Booking Email (Admin receives)
```
🏨 New Booking Received!
━━━━━━━━━━━━━━━━━━━━━━
Booking: ABC12345

Hotel: Grand Hotel Paradise
Room: Deluxe Room

Guest: John Doe
Email: john@example.com

Check-in: February 1, 2024
Check-out: February 5, 2024

Total: $599.00

[Contact Guest] (button)
```

### Confirmation Email (Guest receives)
```
🎉 Booking Confirmed!
━━━━━━━━━━━━━━━━━━━━━━
Your Reference: ABC12345

Dear John,

Your reservation at Grand Hotel Paradise
has been confirmed!

📥 Check-in: February 1, 2024
📤 Check-out: February 5, 2024

Total: $599.00
```
