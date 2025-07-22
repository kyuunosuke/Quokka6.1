import { redirect } from "next/navigation";

// Redirect dashboard to member portal
export default function Dashboard() {
  redirect("/member");
}
