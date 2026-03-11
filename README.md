# cs.gg — Daily Tracker for Coding Goals

`cs.gg` is a small web app I built to help myself (and anyone else) stay on track during a notoriously difficult job search. Think of it as a personal “commit history” for daily productivity: you set three simple goals, log each day, and the app shows you how consistent you’ve been.

---

## Quick start (for non‑technical visitors)

1. **Sign in** with Google. You’ll be given a short username depending on your email address.
2. **Set your daily targets** on the **Edit Goals** page: how many job applications, LeetCode problems, and project hours you want per day.
3. **Record today’s progress** by sliding the dials on your personal page and submitting the form. You can only have one entry per calendar day.
4. **See your history**: past entries appear as colored cards (green = all goals met, yellow = some, red = none) and there’s a GitHub‑style grid that highlights streaks.
5. **Browse other users** via the **Search Users** page. Enter a slug to view someone else’s progress and motivate each other.

---

## Behind the scenes (tech overview)

- Built with **Next.js 16.1** (App Router); most pages are server‑rendered React components.
- Written in **TypeScript** for safety and clarity.
- Uses **Prisma** with PostgreSQL for the database. Models include `User`, `Goals`, `Entry`, and `RecentSearch`.
- **NextAuth.js** handles login; a new user triggers a transaction that creates an empty goals record and generates a unique slug.
- Styling is done with **Tailwind CSS**; the layout is responsive and lightweight.
- A simple API route (`/api/users/search`) powers the live username search box.
- Deployed on **Vercel**; pushes to GitHub automatically build and deploy the site.

---

Feel free to fork this repo, explore the code, or use it as inspiration for your own projects.

