"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

export function useDebouncedRouterPush(delayMs: number, initialUrl = "") {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRef = useRef<string>(initialUrl);

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const pushNow = (url: string) => {
    cancel();
    if (url === lastPushedRef.current) return;
    lastPushedRef.current = url;
    startTransition(() => router.push(url));
  };

  const pushDebounced = (url: string) => {
    cancel();
    timerRef.current = setTimeout(() => {
      if (url === lastPushedRef.current) return;
      lastPushedRef.current = url;
      startTransition(() => router.push(url));
    }, delayMs);
  };

  useEffect(() => cancel, []);

  return { pushNow, pushDebounced, cancel };
}
