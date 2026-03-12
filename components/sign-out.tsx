import { signOutAction } from "@/actions/auth-actions";
import { signOut } from "@/auth";

export default function SignOut() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="cursor-pointer text-white/80 hover:text-white">
        Sign Out
      </button>
    </form>
  );
}