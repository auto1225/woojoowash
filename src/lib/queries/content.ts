import { db } from "@/lib/db";

export async function getActiveHeroes() {
  const heroes = await db.homeHero.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return heroes.map((h) => ({
    src: h.imageUrl,
    title: h.title,
    subtitle: h.subtitle ?? undefined,
    href: h.linkHref ?? undefined,
  }));
}

export async function getActiveFaqs() {
  return db.faq.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
}

export async function getPublishedNotices(limit = 10) {
  return db.notice.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}
