# SmartPark - Smart Parking Slot Booking and Management System

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing page with hero, features, how-it-works, benefits, footer
- User authentication (login/signup) using authorization component
- User dashboard with parking slot grid (color-coded: green=available, red=occupied, yellow=booked)
- Booking page: select slot, date/time, price, confirm booking
- Mock payment page (UPI/Card UI)
- Booking history page (active/completed/cancelled)
- QR code generation after booking
- Navigation/directions UI to parking slot
- Mock number plate verification input
- Parking time reminder/alert UI
- Dynamic slot recommendation
- Admin panel: login, manage slots, view bookings, analytics dashboard with charts

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- User roles: user and admin
- ParkingSlot: id, zone, number, status (available/booked/occupied), floor, price
- Booking: id, userId, slotId, vehicleNumber, startTime, endTime, duration, status, qrCode, paymentStatus
- APIs:
  - getParkingSlots: returns all slots with current status
  - bookSlot: creates a booking, marks slot as booked, returns booking with QR string
  - cancelBooking: cancels a booking, frees slot
  - getUserBookings: returns bookings for authenticated user
  - getAllBookings (admin): returns all bookings
  - updateSlotStatus (admin): mark slot occupied/available
  - addSlot / removeSlot (admin)
  - getAnalytics (admin): total bookings, available vs occupied counts
  - confirmPayment: mock payment confirmation

### Frontend
- Landing page (hero, features, how it works, benefits, footer)
- Auth pages (login/signup)
- User dashboard (slot grid with color coding, recommended slots)
- Booking flow (slot selection, date/time, price, confirm)
- Payment page (mock UPI/Card UI)
- Booking history
- QR code display after booking
- Slot navigation UI (simple path/map indicator)
- Admin panel (slot management, booking list, analytics with charts)
- Responsive, blue/green tech theme, smooth animations
