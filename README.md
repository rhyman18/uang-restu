# Uang Restu - Household Cashflow Manager

A modern, mobile-first web application for tracking household income, expenses, and transfers. Built for couples to manage shared finances with a focus on "who paid" and separating "Cash" vs "Bank" balances.

![Dashboard Preview](./public/dashboard-preview.png)
*(Note: Add a screenshot here if available)*

## Features

-   **Shared Budgeting**: Track expenses for a household (Husband & Wife).
-   **Cash Out Identity**: Explicitly track who paid for an expense.
-   **Cash vs Bank**: Separate balances for cash in hand and bank accounts.
-   **Transfers**: Record money movement between Cash and Bank.
-   **History & Filters**: detailed transaction history with date, category, and type filters.
-   **Mobile First**: Designed to look and feel like a native app on mobile browsers.

## Tech Stack

-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **Icons**: Lucide React

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm
-   A Supabase project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/uang-restu.git
    cd uang-restu
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```



4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is ready to be deployed on [Netlify](https://www.netlify.com/).

1.  Import the repository to Netlify.
2.  Set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify's Environment Variables.
3.  Deploy.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
