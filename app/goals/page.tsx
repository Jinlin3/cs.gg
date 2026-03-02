import { requireUser } from "@/actions/actions";
import { auth } from "@/auth";
import GoalsForm from "@/components/goals-form";
import { prisma } from "@/lib/prisma";

export default async function GoalsPage() {
  const user = await requireUser();

  if (!user) {
    return (
      <main className="flex flex-col items-center gap-y-5 pt-10 text-center px-6">
        <h1 className="text-lg italic">Please sign in to edit your goals.</h1>
      </main>
    );
  }

  const userId = user.id;

  const goals = await prisma.goals.findUnique({
    where: { userId },
  })

  return (
    <main className="flex flex-col items-center gap-y-4 mt-10 px-6">
      <h1 className="text-3xl font-semibold">Set your Daily Goals</h1>
      <GoalsForm
        initialApplications={goals!.applications}
        initialLeetcode={goals!.leetcode}
        initialProjectHours={goals!.projectHours}
      />
    </main>
  );
}