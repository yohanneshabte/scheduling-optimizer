# Spa Booking Demo (Watercourse Way)

A scalable, mobile-first customer-facing booking demo app built with React, Vite, Tailwind CSS, and TypeScript.

## The Challenge

Currently, private hot tub bookings are primarily handled by phone, leading to staff spending an average of 15-30 minutes at the front desk per reservation. This manual process is not only time-consuming but can result in scheduling gaps, missed up-sell opportunities, and revenue lost to no-shows or late cancellations.

## The Solution

This demo app solves these operational inefficiencies by shifting the booking process to the user's phone, allowing the spa to unlock hidden revenue. Key features include:

- **Self-Serve Mobile Booking:** Guests can effortlessly select their preferred room and time via a clean, spa-themed mobile interface, bypassing the need to call the desk.
- **Automated Operations Protection:** The app's logic automatically enforces a strict 15-minute cleaning turn between sessions and ensures that no more than 6 out of 9 rooms (67% occupancy) are booked concurrently, protecting staff from burnout.
- **Revenue Optimization Tools:** The simulated Staff Insights dashboard models how the business can maximize profit by automatically filling "dead slots" (like weekday mornings) with 2-hour packages.
- **No-Show Mitigation:** Integrated mock Square payments demonstrate how capturing credit cards upfront deters no-shows and allows for the recovery of late cancellation fees.
- **Recurring Revenue (Membership Model):** A simulated membership feature allows owners to project additional revenue by offering monthly subscriptions in the style of Perspire Sauna Studio.

## Architecture

The project is structured around a scalable configuration model (`src/lib/config.ts`), making it easy to productionize or generalize for other wellness centers. Features, pricing rules (e.g. dynamic off-peak rates), operating hours, and specific room details are fully decoupled from the core application logic.

## Running the App Locally

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm run dev &`

## Deployment

Since this is a standard Vite React app, you can easily deploy it for free using services like Vercel, Netlify, or GitHub Pages.

To create a production build:
`npm run build`

You can then serve the `dist/` directory on any static host. If you have an iPhone, deploying to Vercel/Netlify will give you a public URL (e.g. `your-app.vercel.app`) that you can easily convert to a QR Code to demo to management instantly.
