import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function createAddress(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/app/login");
  const label = String(formData.get("label") ?? "").trim() || null;
  const recipientName = String(formData.get("recipientName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const addr1 = String(formData.get("addr1") ?? "").trim();
  const addr2 = String(formData.get("addr2") ?? "").trim() || null;
  const isDefault = formData.get("isDefault") === "on";
  if (!recipientName || !phone || !postalCode || !addr1) return;

  if (isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }
  const count = await db.address.count({ where: { userId: session.user.id } });
  await db.address.create({
    data: {
      userId: session.user.id,
      label,
      recipientName,
      phone,
      postalCode,
      addr1,
      addr2,
      isDefault: isDefault || count === 0,
    },
  });
  revalidatePath("/app/me/addresses");
}

async function deleteAddress(id: string) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/app/login");
  await db.address.deleteMany({
    where: { id, userId: session.user.id },
  });
  revalidatePath("/app/me/addresses");
}

async function setDefault(id: string) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/app/login");
  await db.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });
  await db.address.updateMany({
    where: { id, userId: session.user.id },
    data: { isDefault: true },
  });
  revalidatePath("/app/me/addresses");
}

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/addresses");

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-paper pb-[120px]">
      <AppBar title="배송지 관리" />

      <section className="px-5 pt-5 flex flex-col gap-3">
        {addresses.length === 0 ? (
          <div className="py-10 text-center text-slate text-[13px]">
            등록된 배송지가 없어요.
          </div>
        ) : (
          addresses.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-[14px] border border-fog p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold">
                    {a.label ? `${a.label} · ` : ""}
                    {a.recipientName}
                  </span>
                  {a.isDefault && (
                    <span className="text-[10px] font-bold bg-ink text-white px-2 py-[3px] rounded">
                      기본
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-[11px] font-semibold">
                  {!a.isDefault && (
                    <form action={setDefault.bind(null, a.id)}>
                      <button
                        type="submit"
                        className="text-accent hover:underline"
                      >
                        기본 지정
                      </button>
                    </form>
                  )}
                  <form action={deleteAddress.bind(null, a.id)}>
                    <button
                      type="submit"
                      className="text-danger hover:underline"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </div>
              <div className="text-[12px] text-slate ww-num">{a.phone}</div>
              <div className="text-[13px] mt-1">
                ({a.postalCode}) {a.addr1} {a.addr2 ?? ""}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="px-5 pt-5">
        <form
          action={createAddress}
          className="bg-white rounded-[14px] border border-fog p-5 flex flex-col gap-2"
        >
          <div className="text-[14px] font-bold mb-2">새 배송지 추가</div>
          <Field name="label" placeholder="별칭 (예: 집 / 회사)" />
          <Field name="recipientName" placeholder="받는 분" required />
          <Field name="phone" placeholder="연락처" type="tel" required />
          <Field name="postalCode" placeholder="우편번호" required />
          <Field name="addr1" placeholder="기본 주소" required />
          <Field name="addr2" placeholder="상세 주소" />
          <label className="flex items-center gap-2 text-[13px] mt-1">
            <input
              type="checkbox"
              name="isDefault"
              className="w-4 h-4 accent-accent"
            />
            기본 배송지로 설정
          </label>
          <button
            type="submit"
            className="h-12 rounded-full bg-ink text-white font-bold text-[14px] mt-2"
          >
            추가
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({
  name,
  placeholder,
  required,
  type = "text",
}: {
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
    />
  );
}
