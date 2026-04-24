export function ProductForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: {
    title?: string;
    subtitle?: string;
    description?: string;
    type?: string;
    price?: number;
    durationMin?: number;
    imageUrl?: string;
    cautions?: string;
  };
}) {
  const d = defaults ?? {};
  return (
    <form
      action={action}
      className="bg-white border border-fog rounded-[20px] p-8 max-w-[760px] grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <Field
        label="상품명"
        name="title"
        defaultValue={d.title}
        required
        className="md:col-span-2"
      />
      <Field
        label="부제"
        name="subtitle"
        defaultValue={d.subtitle}
        className="md:col-span-2"
      />
      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">
          상품 설명
        </span>
        <textarea
          name="description"
          defaultValue={d.description}
          rows={4}
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
        />
      </label>

      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">유형</span>
        <select
          name="type"
          defaultValue={d.type ?? "HAND"}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        >
          <option value="SELF">셀프세차</option>
          <option value="HAND">손세차</option>
          <option value="PICKUP">배달세차</option>
          <option value="VISIT">출장세차</option>
          <option value="PREMIUM">프리미엄</option>
        </select>
      </label>

      <Field
        label="소요 (분)"
        name="durationMin"
        type="number"
        defaultValue={String(d.durationMin ?? 60)}
        required
      />
      <Field
        label="가격 (원)"
        name="price"
        type="number"
        defaultValue={String(d.price ?? 0)}
        required
      />
      <Field
        label="대표 이미지 URL"
        name="imageUrl"
        defaultValue={d.imageUrl}
        placeholder="https://…"
      />

      <label className="block md:col-span-2">
        <span className="text-[12px] font-bold mb-[6px] block">
          유의사항 (한 줄에 한 개)
        </span>
        <textarea
          name="cautions"
          defaultValue={d.cautions}
          rows={3}
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
          placeholder="예:&#10;차량 상태에 따라 추가요금이 발생할 수 있어요&#10;잔여물 제거는 기본 범위에 포함돼요"
        />
      </label>

      <button
        type="submit"
        className="md:col-span-2 justify-self-start h-11 px-6 rounded-full bg-ink text-white font-bold text-[14px]"
      >
        저장
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
      />
    </label>
  );
}
