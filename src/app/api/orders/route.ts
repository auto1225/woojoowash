import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

type Body = {
  items: Array<{ productId: string; quantity: number }>;
  addressId?: string;
  // 비회원·새 주소 즉석 입력용
  recipientName?: string;
  phone?: string;
  postalCode?: string;
  addr1?: string;
  addr2?: string;
  memo?: string;
  paymentMethod?: string;
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "주문 항목이 없어요." },
      { status: 400 },
    );
  }

  const productIds = body.items.map((i) => i.productId);
  const products = await db.marketProduct.findMany({
    where: { id: { in: productIds } },
  });
  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "일부 상품을 찾을 수 없어요." },
      { status: 400 },
    );
  }

  let recipientName = "";
  let phone = "";
  let postalCode = "";
  let addr1 = "";
  let addr2: string | null = null;
  let addressId: string | null = null;

  if (body.addressId) {
    const addr = await db.address.findFirst({
      where: { id: body.addressId, userId: session.user.id },
    });
    if (!addr) {
      return NextResponse.json(
        { error: "배송지를 찾을 수 없어요." },
        { status: 400 },
      );
    }
    addressId = addr.id;
    recipientName = addr.recipientName;
    phone = addr.phone;
    postalCode = addr.postalCode;
    addr1 = addr.addr1;
    addr2 = addr.addr2;
  } else {
    recipientName = String(body.recipientName ?? "").trim();
    phone = String(body.phone ?? "").trim();
    postalCode = String(body.postalCode ?? "").trim();
    addr1 = String(body.addr1 ?? "").trim();
    addr2 = String(body.addr2 ?? "").trim() || null;
    if (!recipientName || !phone || !postalCode || !addr1) {
      return NextResponse.json(
        { error: "배송지 정보를 입력해 주세요." },
        { status: 400 },
      );
    }
  }

  // 합계 계산
  const itemsData = body.items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;
    return {
      productId: p.id,
      productName: p.name,
      productImage: p.imageUrl,
      price: p.price,
      quantity: Math.max(1, Math.floor(i.quantity)),
    };
  });
  const subtotal = itemsData.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      addressId,
      recipientName,
      phone,
      postalCode,
      addr1,
      addr2,
      memo: String(body.memo ?? "").trim() || null,
      subtotal,
      shippingFee,
      total,
      paymentMethod: body.paymentMethod || "easy",
      paidAt: new Date(),
      status: "PAID",
      items: { create: itemsData },
      shipment: { create: {} },
    },
    select: { id: true },
  });

  return NextResponse.json(order, { status: 201 });
}
