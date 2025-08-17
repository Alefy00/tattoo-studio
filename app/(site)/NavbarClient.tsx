"use client";

import { useEffect, useState } from "react";
import Navbar from "../(components)/Navbar";

export default function NavbarClient() {
  // monta no cliente para evitar qualquer mismatch causado por extensões
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <Navbar />;
}
