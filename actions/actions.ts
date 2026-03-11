"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Simple helper function to get the current user or throw an error
export async function requireUser() {
  // Is user signed in right now?
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  // Does the user exist in the database?
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      slug: true,
    }
  });

  // If not, throw error
  if (!user) throw new Error("User not found.");

  // Otherwise, return user
  return user; // { id, name, email }
}

// Generates a unique slug from an email address
export async function slugFromEmail(email: string) {
  // Lowercase, trim
  const lower = email.trim().toLowerCase();

  // Take everything before the "@" symbol
  const localPart = lower.split("@")[0];

  // Remove "+" aliases
  const withoutPlus = localPart.split("+")[0];

  // Sanitize for URL
  const baseSlug = withoutPlus
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // If you somehow end up with empty (edge case)
  const base = baseSlug || "user";

  let candidate = base;
  let count = 1;

  // Keeps incrementing until unique slug is found
  while (await prisma.user.findUnique({ where: { slug: candidate } })) {
    count += 1;
    candidate = `${base}-${count}`;
  }

  return candidate;
}

// Handles submission of entry form
export async function submitEntry(formData: FormData) {
  // Handle session and get user
  const user = await requireUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const userId = user.id;

  const applications = Number(formData.get("job-applications"));
  const leetcode = Number(formData.get("leetcode"));
  const projectHours = Number(formData.get("project-hours"));

  const clientDate = formData.get("client-date") as string;
  if (typeof clientDate !== "string") {
    throw new Error("Missing client date.");
  }

  // Store midnight for today's date to avoid multiple entries on the same day.
  const today = new Date(clientDate);
  if (isNaN(today.getTime())) {
    throw new Error("Invalid client date.");
  }

  // Upsert the entry for today
  const entry = await prisma.entry.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      applications,
      leetcode,
      projectHours,
    },
    create: {
      userId,
      date: today,
      applications,
      leetcode,
      projectHours,
    },
  });

  console.log(`Submitted values: ${applications}, ${leetcode}, ${projectHours}`);
  revalidatePath("/");
}

// Records that viewerId searched for searchedId (upserts, keeps most recent timestamp)
export async function recordRecentSearch(viewerId: string, searchedId: string) {
  if (viewerId === searchedId) return;
  await prisma.recentSearch.upsert({
    where: { searcherId_searchedId: { searcherId: viewerId, searchedId } },
    update: { searchedAt: new Date() },
    create: { searcherId: viewerId, searchedId },
  });
}

// Handles submission of goals form
export async function submitGoals(formData: FormData) {
  // Handle session and get user
  const user = await requireUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const userId = user.id;

  const applications = Number(formData.get("job-applications"));
  const leetcode = Number(formData.get("leetcode"));
  const projectHours = Number(formData.get("project-hours"));

  const goals = await prisma.goals.upsert({
    where: { userId },
    update: {
      applications,
      leetcode,
      projectHours
    },
    create: {
      userId,
      applications,
      leetcode,
      projectHours
    }
  });

  console.log(`Submitted values: ${applications}, ${leetcode}, ${projectHours}`);

  redirect("/");
}