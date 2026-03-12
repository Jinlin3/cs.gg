import { signInWithGoogle } from "@/actions/auth-actions"
 
export default function SignIn() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit" className="cursor-pointer text-white/80 hover:text-white">Sign In</button>
    </form>
  )
} 