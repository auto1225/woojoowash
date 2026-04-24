"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCartButton({
  product,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function onClick() {
    add(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-9 rounded-full text-[12px] font-bold transition ${
        added ? "bg-success text-white" : "bg-ink text-white"
      }`}
    >
      {added ? "담겼어요" : "담기"}
    </button>
  );
}
