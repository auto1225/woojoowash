import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function requireOwner() {
  const session = await auth();
  if (!session?.user) redirect("/partner/login");
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    redirect("/app");
  }
  return session.user;
}

export async function getOwnerStores(userId: string, role: string) {
  if (role === "ADMIN") {
    return db.store.findMany({ orderBy: { name: "asc" } });
  }
  return db.store.findMany({
    where: { ownerId: userId },
    orderBy: { name: "asc" },
  });
}

export async function requireOwnedStore(id: string) {
  const user = await requireOwner();
  const store = await db.store.findUnique({ where: { id } });
  if (!store) redirect("/partner");
  if (user.role !== "ADMIN" && store.ownerId !== user.id) redirect("/partner");
  return store;
}
