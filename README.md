# LittleFidan Platform

Premium botanical-inspired educational content platform for mindful parenting and natural child development.

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.8.3
- **Styling**: TailwindCSS with custom botanical design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Mollie (European market focus)
- **Media**: Instagram Graph API integration

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase CLI

### Installation

1. Clone the repository and navigate to the platform directory:
```bash
cd littlefidan-platform
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables template:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your actual credentials

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
littlefidan-platform/
├── app/                    # Next.js App Router
├── components/             # Reusable components
├── lib/                    # Utilities & configurations
├── types/                  # TypeScript definitions
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Design System

The platform uses a botanical-inspired design system with:
- Sage green color palette
- Earth tones for backgrounds
- Terracotta and coral accents
- Generous whitespace and organic shapes
- Professional yet warm typography

## License

Private - All rights reserved

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/littlefidan/littlefidan?utm_source=oss&utm_medium=github&utm_campaign=littlefidan%2Flittlefidan&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)