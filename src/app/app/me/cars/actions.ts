"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function createCar(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/cars/new");

  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const plate = String(formData.get("plate") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim() || null;
  const wantDefault = formData.get("isDefault") === "on";

  if (!brand || !model || !plate) return;

  const count = await db.car.count({ where: { userId: session.user.id } });
  const isDefault = wantDefault || count === 0;

  if (isDefault) {
    await db.car.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await db.car.create({
    data: {
      userId: session.user.id,
      brand,
      model,
      plate,
      color,
      isDefault,
    },
  });
  revalidatePath("/app/me/cars");
  revalidatePath("/app");
  redirect("/app/me/cars");
}

export async function deleteCar(id: string) {
  const session = await auth();
  if (!session?.user) return;
  const car = await db.car.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!car) return;
  const wasDefault = car.isDefault;
  await db.car.delete({ where: { id } });
  if (wasDefault) {
    const another = await db.car.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });
    if (another) {
      await db.car.update({
        where: { id: another.id },
        data: { isDefault: true },
      });
    }
  }
  revalidatePath("/app/me/cars");
  revalidatePath("/app");
}

export async function setDefaultCar(id: string) {
  const session = await auth();
  if (!session?.user) return;
  await db.car.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });
  await db.car.updateMany({
    where: { id, userId: session.user.id },
    data: { isDefault: true },
  });
  revalidatePath("/app/me/cars");
  revalidatePath("/app");
}
