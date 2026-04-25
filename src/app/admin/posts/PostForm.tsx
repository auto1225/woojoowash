export function PostForm({
  action,
  defaults,
  submitLabel = "저장",
}: {
  action: (fd: FormData) => void | Promise<void>;
  defaults?: {
    title?: string;
    body?: string;
    authorName?: string;
    category?: string;
    pinned?: boolean;
  };
  submitLabel?: string;
}) {
  const d = defaults ?? {};
  return (
    <form
      action={action}
      className="bg-white border border-fog rounded-[20px] p-8 max-w-[820px] flex flex-col gap-5"
    >
      <div className="grid md:grid-cols-[1fr_200px] gap-3">
        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">제목</span>
          <input
            type="text"
            name="title"
            required
            defaultValue={d.title}
            className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">카테고리</span>
          <input
            type="text"
            name="category"
            defaultValue={d.category}
            placeholder="후기·팁 등"
            className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px]"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">작성자</span>
        <input
          type="text"
          name="authorName"
          required
          defaultValue={d.authorName ?? "우주워시"}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px]"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">본문</span>
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={d.body}
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-y min-h-[200px]"
        />
      </label>
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          name="pinned"
          defaultChecked={d.pinned}
          className="w-4 h-4 accent-warning"
        />
        상단 고정
      </label>
      <button
        type="submit"
        className="self-start h-11 px-6 rounded-full btn-brand text-[13px]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
