import Image from "next/image";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { AppBar } from "@/components/app/AppBar";
import { IconCamera } from "@/components/icons";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BeforeAfterPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/before-after");

  const records = await db.beforeAfter.findMany({
    where: { reservation: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    include: {
      reservation: {
        include: {
          store: { select: { name: true } },
          product: { select: { title: true } },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="Before / After" />
      <section className="px-5 pt-5">
        {records.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-cloud flex items-center justify-center mb-4">
              <IconCamera size={24} stroke={1.4} className="text-slate" />
            </div>
            <div className="text-[13px] text-slate">
              아직 기록이 없어요.
              <br />
              세차를 완료하면 여기에 쌓여요.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {records.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-[16px] border border-fog overflow-hidden"
              >
                <div className="grid grid-cols-2">
                  {[
                    { t: "Before", src: r.beforePhoto },
                    { t: "After", src: r.afterPhoto },
                  ].map((x, i) => (
                    <div
                      key={x.t}
                      className={`relative aspect-square ${
                        i === 0 ? "border-r border-fog" : ""
                      }`}
                    >
                      <Image
                        src={x.src}
                        alt={x.t}
                        fill
                        className="object-cover"
                        sizes="(max-width: 480px) 50vw, 200px"
                      />
                      <span className="absolute left-2 bottom-2 text-[10px] font-bold text-white bg-ink/70 px-2 py-[2px] rounded">
                        {x.t}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-5 border-t border-fog">
                  <div className="text-[11px] text-slate font-medium">
                    {format(r.createdAt, "yyyy-MM-dd")} · {r.reservation.store.name}
                  </div>
                  <div className="text-[14px] font-bold mt-1">
                    {r.reservation.product.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
