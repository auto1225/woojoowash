import { notFound, redirect } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getFlag } from "@/lib/settings";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  if (!(await getFlag("shopEnabled"))) return notFound();
  const session = await auth();
  if (!session?.user) {
    redirect("/app/login?callbackUrl=/app/market/checkout");
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-paper pb-[140px]">
      <AppBar title="주문/결제" />
      <CheckoutForm
        addresses={addresses.map((a) => ({
          id: a.id,
          label: a.label ?? null,
          recipientName: a.recipientName,
          phone: a.phone,
          postalCode: a.postalCode,
          addr1: a.addr1,
          addr2: a.addr2 ?? null,
          isDefault: a.isDefault,
        }))}
      />
    </div>
  );
}
