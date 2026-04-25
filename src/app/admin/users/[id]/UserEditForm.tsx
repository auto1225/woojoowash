"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleUserStatus, updateUser } from "../actions";

type Role = "USER" | "OWNER" | "ADMIN";
type Status = "ACTIVE" | "SUSPENDED";

export function UserEditForm({
  userId,
  isSelf,
  defaults,
}: {
  userId: string;
  isSelf: boolean;
  defaults: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    status: Status;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(defaults.name);
  const [phone, setPhone] = useState(defaults.phone);
  const [role, setRole] = useState<Role>(defaults.role);
  const [status, setStatus] = useState<Status>(defaults.status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const r = await updateUser(userId, {
        name: name.trim() || null,
        phone: phone.trim() || null,
        role,
      });
      if (r?.error) {
        setError(r.error);
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function onToggleStatus() {
    startTransition(async () => {
      const next: Status = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      await toggleUserStatus(userId, next);
      setStatus(next);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-fog rounded-[20px] p-8 flex flex-col gap-5"
    >
      <Field label="이메일" hint="(변경 불가)">
        <input
          type="email"
          value={defaults.email}
          disabled
          className="w-full h-12 px-4 bg-cloud border border-fog rounded-[12px] text-[14px] text-slate"
        />
      </Field>

      <Field label="회원명">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 미입력 시 이메일로 표시됩니다"
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
        />
      </Field>

      <Field label="전화번호">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink ww-num"
        />
      </Field>

      <Field
        label="권한"
        hint={isSelf ? "(본인 권한은 변경 불가)" : undefined}
      >
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          disabled={isSelf}
          className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink disabled:opacity-60"
        >
          <option value="USER">일반 회원</option>
          <option value="OWNER">매장 운영자</option>
          <option value="ADMIN">서비스 관리자</option>
        </select>
        <p className="text-[11px] text-slate mt-2 leading-[1.6]">
          · 일반 회원: 앱 이용만 가능
          <br />· 매장 운영자: <code className="bg-cloud px-1 rounded">/partner</code>{" "}
          접근 가능 (소유 매장 관리)
          <br />· 서비스 관리자: <code className="bg-cloud px-1 rounded">/admin</code>{" "}
          전체 백오피스 접근
        </p>
      </Field>

      <Field
        label="계정 상태"
        hint={isSelf ? "(본인 상태는 변경 불가)" : undefined}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-[12px] font-bold px-3 py-[6px] rounded-full ${
              status === "ACTIVE"
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {status === "ACTIVE" ? "정상" : "정지"}
          </span>
          <button
            type="button"
            onClick={onToggleStatus}
            disabled={pending || isSelf}
            className={`h-9 px-4 rounded-full text-[12px] font-bold disabled:opacity-40 ${
              status === "ACTIVE"
                ? "bg-danger/10 text-danger hover:bg-danger/20"
                : "bg-success/10 text-success hover:bg-success/20"
            }`}
          >
            {status === "ACTIVE" ? "계정 정지" : "정지 해제"}
          </button>
        </div>
      </Field>

      {error && (
        <div className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-[10px] px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="h-12 px-6 rounded-full bg-ink text-white font-bold text-[14px] disabled:opacity-50"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
        {saved && (
          <span className="text-[12px] text-success font-semibold">
            저장됐어요
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {hint && (
          <span className="text-slate font-medium ml-2">{hint}</span>
        )}
      </span>
      {children}
    </label>
  );
}
