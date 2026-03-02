import { requireUser } from "@/actions/actions";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const user = await requireUser();
  return <NavbarClient user={user} />;
}