// ============================================
// 📧 SUPABASE EDGE FUNCTION - SEND EMAIL
// ============================================
// Handles both Contact Messages and Booking Notifications
// Deploy: supabase functions deploy send-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'aliabidi131@gmail.com'
const FROM_EMAIL = 'HotelBook <onboarding@resend.dev>' // Use your verified domain

interface ContactPayload {
  type: 'contact'
  name: string
  email: string
  subject: string
  message: string
}

interface BookingPayload {
  type: 'booking'
  userEmail: string
  userName: string
  hotelName: string
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
  totalPrice: number
  bookingId: string
}

type EmailPayload = ContactPayload | BookingPayload

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function generateContactEmailHtml(data: ContactPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📬 New Contact Message</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; width: 100px;"><strong>From:</strong></td>
                  <td style="color: #333;">${data.name}</td>
                </tr>
                <tr>
                  <td style="color: #666;"><strong>Email:</strong></td>
                  <td><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="color: #666;"><strong>Subject:</strong></td>
                  <td style="color: #333;">${data.subject}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <div style="margin-top: 25px; padding: 20px; background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px;">💬 Message:</h3>
          <p style="margin: 0; color: #444; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" 
             style="display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: 600;">
            ↩️ Reply to ${data.name}
          </a>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0; color: #999; font-size: 12px;">
          This email was sent from the HotelBook contact form<br>
          © ${new Date().getFullYear()} HotelBook. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateBookingEmailHtml(data: BookingPayload): string {
  const checkInDate = new Date(data.checkIn).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })
  const checkOutDate = new Date(data.checkOut).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏨 New Booking Received!</h1>
      </td>
    </tr>
    
    <!-- Booking ID Banner -->
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #e8f5e9;">
        <span style="color: #2e7d32; font-size: 14px;">Booking Reference:</span>
        <div style="color: #1b5e20; font-size: 18px; font-weight: bold; font-family: monospace; margin-top: 5px;">
          ${data.bookingId.slice(0, 8).toUpperCase()}
        </div>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <!-- Hotel Info -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">🏨 ${data.hotelName}</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${data.roomType}</p>
        </div>
        
        <!-- Guest Details -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">👤 Guest Information</h3>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr>
              <td style="color: #666; width: 120px;">Name:</td>
              <td style="color: #333; font-weight: 500;">${data.userName}</td>
            </tr>
            <tr>
              <td style="color: #666;">Email:</td>
              <td><a href="mailto:${data.userEmail}" style="color: #667eea;">${data.userEmail}</a></td>
            </tr>
            <tr>
              <td style="color: #666;">Guests:</td>
              <td style="color: #333;">${data.guests} person(s)</td>
            </tr>
          </table>
        </div>
        
        <!-- Stay Details -->
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #e65100; font-size: 16px;">📅 Stay Details</h3>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr>
              <td style="color: #666; width: 120px;">Check-in:</td>
              <td style="color: #333; font-weight: 500;">📥 ${checkInDate}</td>
            </tr>
            <tr>
              <td style="color: #666;">Check-out:</td>
              <td style="color: #333; font-weight: 500;">📤 ${checkOutDate}</td>
            </tr>
          </table>
        </div>
        
        <!-- Price -->
        <div style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); padding: 25px; border-radius: 8px; text-align: center;">
          <span style="color: rgba(255,255,255,0.9); font-size: 14px;">Total Price</span>
          <div style="color: #ffffff; font-size: 36px; font-weight: bold; margin-top: 5px;">
            $${data.totalPrice.toFixed(2)}
          </div>
        </div>
        
        <!-- Actions -->
        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${data.userEmail}?subject=Your booking at ${encodeURIComponent(data.hotelName)} - Confirmation" 
             style="display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 5px;">
            ✉️ Contact Guest
          </a>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0; color: #999; font-size: 12px;">
          This is an automated notification from HotelBook<br>
          © ${new Date().getFullYear()} HotelBook. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateGuestConfirmationHtml(data: BookingPayload): string {
  const checkInDate = new Date(data.checkIn).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })
  const checkOutDate = new Date(data.checkOut).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for choosing HotelBook</p>
      </td>
    </tr>
    
    <!-- Booking Reference -->
    <tr>
      <td style="padding: 25px; text-align: center; background-color: #f0f4ff;">
        <span style="color: #667eea; font-size: 14px;">Your Booking Reference</span>
        <div style="color: #333; font-size: 24px; font-weight: bold; font-family: monospace; margin-top: 8px; letter-spacing: 2px;">
          ${data.bookingId.slice(0, 8).toUpperCase()}
        </div>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Dear <strong>${data.userName}</strong>,<br><br>
          Your reservation has been successfully confirmed. Here are your booking details:
        </p>
        
        <!-- Hotel Card -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
          <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 22px;">🏨 ${data.hotelName}</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 0;">${data.roomType}</p>
        </div>
        
        <!-- Details Grid -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
          <tr>
            <td width="50%" style="padding: 15px; background-color: #e8f5e9; border-radius: 8px 0 0 8px; text-align: center;">
              <div style="color: #2e7d32; font-size: 12px; text-transform: uppercase;">Check-in</div>
              <div style="color: #1b5e20; font-size: 16px; font-weight: bold; margin-top: 5px;">📥 ${checkInDate}</div>
            </td>
            <td width="50%" style="padding: 15px; background-color: #ffebee; border-radius: 0 8px 8px 0; text-align: center;">
              <div style="color: #c62828; font-size: 12px; text-transform: uppercase;">Check-out</div>
              <div style="color: #b71c1c; font-size: 16px; font-weight: bold; margin-top: 5px;">📤 ${checkOutDate}</div>
            </td>
          </tr>
        </table>
        
        <!-- Summary -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <table width="100%" cellpadding="10" cellspacing="0">
            <tr>
              <td style="color: #666; border-bottom: 1px solid #e9ecef;">Number of Guests</td>
              <td style="color: #333; text-align: right; border-bottom: 1px solid #e9ecef;">${data.guests}</td>
            </tr>
            <tr>
              <td style="color: #666; border-bottom: 1px solid #e9ecef;">Room Type</td>
              <td style="color: #333; text-align: right; border-bottom: 1px solid #e9ecef;">${data.roomType}</td>
            </tr>
            <tr>
              <td style="color: #333; font-weight: bold; font-size: 18px; padding-top: 15px;">Total</td>
              <td style="color: #4caf50; text-align: right; font-weight: bold; font-size: 24px; padding-top: 15px;">$${data.totalPrice.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <!-- Important Info -->
        <div style="margin-top: 25px; padding: 20px; background-color: #fff8e1; border-left: 4px solid #ffc107; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 10px 0; color: #f57c00;">📋 Important Information</h4>
          <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
            <li>Check-in time: 3:00 PM</li>
            <li>Check-out time: 11:00 AM</li>
            <li>Please bring a valid ID for check-in</li>
            <li>Free cancellation up to 24 hours before check-in</li>
          </ul>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0 0 15px 0; color: #666;">Need help? Contact us at</p>
        <a href="mailto:aliabidi131@gmail.com" style="color: #667eea; font-weight: 500;">aliabidi131@gmail.com</a>
        <p style="margin: 20px 0 0 0; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} HotelBook. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()
    
    if (!res.ok) {
      console.error('Resend API error:', data)
      return { success: false, error: data.message || 'Failed to send email' }
    }
    
    console.log('Email sent successfully:', data)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: String(error) }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()
    console.log('Received payload:', payload)

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    const results: { admin?: any; guest?: any } = {}

    if (payload.type === 'contact') {
      // Send contact notification to admin
      const html = generateContactEmailHtml(payload)
      const result = await sendEmail(
        ADMIN_EMAIL,
        `[HotelBook Contact] ${payload.subject}`,
        html
      )
      results.admin = result
    } 
    else if (payload.type === 'booking') {
      // Send booking notification to admin
      const adminHtml = generateBookingEmailHtml(payload)
      const adminResult = await sendEmail(
        ADMIN_EMAIL,
        `[HotelBook] New Booking - ${payload.hotelName}`,
        adminHtml
      )
      results.admin = adminResult

      // Send confirmation to guest
      const guestHtml = generateGuestConfirmationHtml(payload)
      const guestResult = await sendEmail(
        payload.userEmail,
        `Your booking at ${payload.hotelName} is confirmed!`,
        guestHtml
      )
      results.guest = guestResult
    }
    else {
      throw new Error('Invalid payload type. Must be "contact" or "booking"')
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
