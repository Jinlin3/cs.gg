import { signOutAction } from "@/actions/auth-actions";
import { signOut } from "@/auth";

export default function SignOut() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="cursor-pointer hover:underline">
        Sign Out
      </button>
    </form>
  );
}