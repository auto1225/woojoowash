export function MarketProductForm({
  action,
  defaults,
  submitLabel = "저장",
}: {
  action: (fd: FormData) => void | Promise<void>;
  defaults?: {
    name?: string;
    price?: number;
    imageUrl?: string;
    tag?: string;
    category?: string;
    description?: string;
    stock?: number | null;
    active?: boolean;
  };
  submitLabel?: string;
}) {
  const d = defaults ?? {};
  return (
    <form
      action={action}
      className="bg-white border border-fog rounded-[20px] p-8 max-w-[820px] grid gap-5 md:grid-cols-2"
    >
      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">
          상품명 <span className="text-danger">*</span>
        </span>
        <input
          type="text"
          name="name"
          required
          defaultValue={d.name}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">
          가격 (원) <span className="text-danger">*</span>
        </span>
        <input
          type="number"
          name="price"
          required
          defaultValue={d.price ?? 0}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">재고 (비우면 무제한)</span>
        <input
          type="number"
          name="stock"
          defaultValue={d.stock ?? ""}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">카테고리</span>
        <input
          type="text"
          name="category"
          defaultValue={d.category ?? ""}
          placeholder="예: 세정제 / 용품 / 장비"
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px]"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">뱃지</span>
        <select
          name="tag"
          defaultValue={d.tag ?? ""}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px]"
        >
          <option value="">없음</option>
          <option value="BEST">BEST</option>
          <option value="NEW">NEW</option>
          <option value="HOT">HOT</option>
        </select>
      </label>
      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">
          대표 이미지 URL <span className="text-danger">*</span>
        </span>
        <input
          type="text"
          name="imageUrl"
          required
          defaultValue={d.imageUrl}
          placeholder="https://…"
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px]"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">설명 (선택)</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={d.description ?? ""}
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
        />
      </label>
      <label className="flex items-center gap-2 text-[13px] md:col-span-2">
        <input
          type="checkbox"
          name="active"
          defaultChecked={d.active ?? true}
          className="w-4 h-4 accent-accent"
        />
        활성 (앱과 홈페이지에 노출)
      </label>
      <button
        type="submit"
        className="md:col-span-2 justify-self-start h-11 px-6 rounded-full bg-ink text-white font-bold text-[13px]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
