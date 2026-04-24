"use client";

import { useTransition } from "react";
import { changeUserRole, toggleUserStatus } from "./actions";

export function UserRowActions({
  userId,
  role,
  status,
  selfId,
}: {
  userId: string;
  role: "USER" | "OWNER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  selfId: string;
}) {
  const [pending, startTransition] = useTransition();
  const isSelf = userId === selfId;

  return (
    <div className="inline-flex gap-2 items-center">
      <select
        defaultValue={role}
        disabled={pending || isSelf}
        onChange={(e) => {
          const next = e.target.value as "USER" | "OWNER" | "ADMIN";
          startTransition(() => changeUserRole(userId, next));
        }}
        className="h-8 px-2 bg-paper border border-fog rounded-[8px] text-[12px]"
      >
        <option value="USER">일반</option>
        <option value="OWNER">운영자</option>
        <option value="ADMIN">관리자</option>
      </select>
      <button
        type="button"
        disabled={pending || isSelf}
        onClick={() => {
          const next = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          startTransition(() => toggleUserStatus(userId, next));
        }}
        className={`h-8 px-3 rounded-full text-[12px] font-bold ${
          status === "ACTIVE"
            ? "bg-danger/10 text-danger hover:bg-danger/20"
            : "bg-success/10 text-success hover:bg-success/20"
        } disabled:opacity-40`}
      >
        {status === "ACTIVE" ? "정지" : "해제"}
      </button>
    </div>
  );
}
