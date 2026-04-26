// 서버·클라이언트 양쪽에서 import 가능 (no "use client" 지시문).

export type SaveActionState = {
  ok: boolean;
  ts: number;
  error?: string;
};

export const INITIAL_SAVE_STATE: SaveActionState = { ok: false, ts: 0 };

/**
 * 서버 액션을 try/catch 로 감싸 SaveActionState 를 돌려주는 헬퍼.
 *
 *   async function saveX(_p: SaveActionState, fd: FormData) {
 *     "use server";
 *     return withSaveResult(async () => {
 *       // ...업데이트 + revalidate
 *     });
 *   }
 *
 * NEXT_REDIRECT 와 NEXT_NOT_FOUND 는 Next 런타임이 처리해야 하므로 다시 throw.
 */
export async function withSaveResult(
  work: () => Promise<unknown>,
): Promise<SaveActionState> {
  try {
    await work();
    return { ok: true, ts: Date.now() };
  } catch (e) {
    // Next.js 의 redirect()/notFound() 는 던져진 에러로 흐름 제어를 함.
    // 절대 swallow 하면 안 됨.
    if (
      e &&
      typeof e === "object" &&
      "digest" in e &&
      typeof (e as { digest?: unknown }).digest === "string" &&
      ((e as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
        (e as { digest: string }).digest === "NEXT_NOT_FOUND")
    ) {
      throw e;
    }
    return {
      ok: false,
      ts: Date.now(),
      error:
        e instanceof Error
          ? e.message
          : "저장 중 알 수 없는 오류가 발생했어요.",
    };
  }
}
