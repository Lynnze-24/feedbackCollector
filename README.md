# Insight Sphere

A demo dashboard for collecting customer feedback, built with Angular, PrimeNG and AG Grid.

**Live:** https://insight-sphere.vercel.app (click **Explore with the demo account**)

## Features

- Sign up / sign in, plus a one-click demo account
- Insights at a glance: response rate, average rating, satisfaction breakdown, best-service votes and rating distribution
- Customer table with search (name, email, phone, location), Pending / Received filter, sorting and pagination
- Record feedback per customer (satisfaction, rating, best service and why, social channels) and view it later
- Add and delete customers, export the current view to CSV, reset the demo data
- Responsive layout: columns collapse on small screens and dialogs become full-screen sheets

This is a front-end-only demo: accounts and data are stored in the browser's localStorage.

## Tech

Angular 14 · PrimeNG 14 · AG Grid 28 · TypeScript · RxJS

## Run it locally

```bash
npm install
npm start          # http://localhost:4200
npm test           # unit tests (Karma + Jasmine)
npm run build      # production build in dist/feedback-collector
```

Developed by Lynnze.
