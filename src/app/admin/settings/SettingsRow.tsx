"use client";

import { useFormState } from "react-dom";
import {
  INITIAL_SAVE_STATE,
  SaveToast,
  type SaveActionState,
} from "@/components/admin/SaveToast";
import { useFormStatus } from "react-dom";

export function SettingsRow({
  label,
  description,
  initial,
  action,
}: {
  label: string;
  description: string;
  initial: boolean;
  action: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
}) {
  const [saveState, formAction] = useFormState(action, INITIAL_SAVE_STATE);
  return (
    <form action={formAction} className="p-6 flex items-center gap-5">
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-extrabold">{label}</div>
        <div className="text-[12px] text-slate leading-[1.6] mt-1">
          {description}
        </div>
      </div>
      <label className="inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          name="value"
          defaultChecked={initial}
          className="peer sr-only"
        />
        <span className="relative w-[48px] h-[28px] bg-fog rounded-full transition-colors peer-checked:bg-accent">
          <span className="absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-ww-btn transition-transform peer-checked:translate-x-[20px]" />
        </span>
        <SubmitButton />
      </label>
      <SaveToast state={saveState} />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ml-3 text-[12px] font-bold text-slate hover:text-ink disabled:opacity-50 inline-flex items-center gap-1"
    >
      {pending && (
        <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-slate/40 border-t-slate animate-spin" />
      )}
      {pending ? "저장 중..." : "저장"}
    </button>
  );
}
