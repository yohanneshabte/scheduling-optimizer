# Watercourse Book Demo

A customer-facing booking demo for Watercourse Way Bath House Spa. This app demonstrates how a mobile-friendly booking system could streamline operations and protect critical resources like cleaning times.

## Manager Pitch

"Phone-only tub booking takes 15–30 min at the desk. This lets guests pick room + time on their phone, protects 15 min clean time, and shows which empty hours you can sell as 2-hour packages."

## Running the App

1. Ensure you have Node.js installed.
2. Install dependencies:
   `npm install`
3. Start the development server:
   `npm run dev`
4. Open the provided localhost link in your browser. For the best demo experience, view it on a mobile device or use your browser's responsive design mode to simulate a phone (e.g., iPhone X).

## Features

- **Mobile First:** Clean spa aesthetic (warm stone, dark wood, cream, sage) with large tap targets.
- **Smart Scheduling:** Automatically enforces a 15-minute cleaning buffer between bookings and caps occupancy at 75% to prevent staff burnout.
- **Dynamic Pricing:** Calculates live pricing based on weekday/weekend rates and standard/premium room types.
- **Mock Data:** Pre-seeds 2 weeks of mock bookings to demonstrate real-world usage patterns.
- **Manager Insights:** Interactive dashboard to model potential revenue and profit impacts.
