This is a Next.js 15 app with Prisma, SQLite, and minimal auth, moderation, votes, comments, and an import from rscripts.net.

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## GitHub Repository
1. Initialize and commit:
```bash
git init
git add -A
git commit -m "Initial commit"
git branch -M main
```
2. Create a new GitHub repository, then add and push:
```bash
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```
3. CI is configured via `.github/workflows/ci.yml`:
- Node `20`, runs `npm ci`, `npx prisma generate`, `npm run lint`, `npm run build`.

## Environment
Create `.env` from the example:
```bash
cp .env.example .env
```
Node `>=20` is required for Prisma.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out Next.js deployment docs for more details.
