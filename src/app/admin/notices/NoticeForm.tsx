export function NoticeForm({
  action,
  defaults,
  submitLabel = "저장",
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: {
    title?: string;
    body?: string;
    pinned?: boolean;
    publishedAt?: string;
  };
  submitLabel?: string;
}) {
  const d = defaults ?? {};
  return (
    <form
      action={action}
      className="bg-white border border-fog rounded-[20px] p-8 max-w-[820px] flex flex-col gap-5"
    >
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">제목</span>
        <input
          type="text"
          name="title"
          defaultValue={d.title}
          required
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        />
      </label>
      <label className="block">
        <span className="text-[12px] font-bold mb-[6px] block">본문</span>
        <textarea
          name="body"
          defaultValue={d.body}
          rows={10}
          required
          className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-y min-h-[200px]"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={d.pinned}
            className="w-4 h-4 accent-warning"
          />
          상단 고정
        </label>
        <label className="block">
          <span className="text-[12px] font-bold mb-[4px] block">
            발행일 (비워두면 작성일 기준)
          </span>
          <input
            type="date"
            name="publishedAt"
            defaultValue={d.publishedAt}
            className="w-full h-11 px-3 bg-paper border border-fog rounded-[10px] text-[13px]"
          />
        </label>
      </div>
      <button
        type="submit"
        className="self-start h-11 px-6 rounded-full bg-ink text-white font-bold text-[13px]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
