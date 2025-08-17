"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSignedIn } from "../lib/auth";


export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn()) {
      setOk(true);
    } else {
      setOk(false);
      router.replace("/login");
    }
  }, [router]);

  if (ok === null) return null; // evita flicker no SSR
  if (!ok) return null;

  return <>{children}</>;
}
