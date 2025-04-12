# BusyBrain Task

A BusyBrain task web app for Associate React Developer assessment.

## Project Overview

This project demonstrates a Next.js application that fetches and displays data from an API, implements user authentication, and provides features like search and pagination.

## Getting Started

First, create a `.env` file in the root directory with the following variables:

```
AUTH_SECRET="your_auth_secret_here"

DATABASE_URL="your_database_url_here"

AUTH_GOOGLE_ID="your_google_id_here"
AUTH_GOOGLE_SECRET="your_google_secret_here"

GMAIL_USER="your-google-user-email"
GMAIL_PASSWORD="your-google-password"

PUBLIC_API="your_public_api_here"
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Requirements

- Next.js project built using create-next-app
- `/items` page that fetches and displays data from JSONPlaceholder API
- Client-side rendering for data fetching
- Tailwind CSS for styling
- Search functionality to filter posts by title
- Pagination for the items list
- Authentication with protected routes
- Login page (Google login or email/password)

## Features

- Data table displaying id, userId, title, and body from API
- Responsive design using Tailwind CSS
- Real-time search filtering
- Paginated data display
- Authentication and protected routes

## Authentication

This project implements:

- Login page with form validation
- Protected routes for authenticated users
- Session management

## Technical Implementation

- Next.js App Router
- Client Components for interactive UI elements
- Server Components where appropriate
- Tailwind CSS for styling
- External API integration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
