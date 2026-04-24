import { notFound } from "next/navigation";
import { getFlag } from "@/lib/settings";
import { CartClient } from "./CartClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  if (!(await getFlag("shopEnabled"))) return notFound();
  return <CartClient />;
}
