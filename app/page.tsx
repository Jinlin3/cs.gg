import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-y-5 pt-10 px-6 text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Daily Commit!</h1>
      <p className="text-md italic sm:text-lg max-w-3xl">Struggling to find a SWE job? Having trouble sticking to the grind? Well this app is for you! This will help you set and track daily goals to improve your productivity and job search efforts.</p>
      <div>
        <ol className="list-decimal space-y-3 text-left text-xs pl-5 sm:text-sm sm:text-center sm:list-inside">
          <li>Sign in with Google to get started!</li>
          <li>Set your daily goals in the <Link className="italic font-semibold" href="/goals">Edit Goals</Link> section!</li>
          <li>Track your progress each day on your <span className="italic font-semibold">User Page</span>!</li>
          <li>Check your history to see your progress over time!</li>
          <li>Look up other users' progress in the <Link className="italic font-semibold" href="/users">Users</Link> section!</li>
        </ol>
      </div>
    </main>
  );
}