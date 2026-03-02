import { signInWithGoogle } from "@/actions/auth-actions"
 
export default function SignIn() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit" className="cursor-pointer hover:underline">Sign In</button>
    </form>
  )
} 