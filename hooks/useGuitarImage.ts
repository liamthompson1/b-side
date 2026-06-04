"use client";

import { useEffect, useState } from "react";
import { type Product } from "@/lib/products";

type State = "idle" | "loading" | "done" | "error";

export function useGuitarImage(product: Product, venue?: string) {
  const [src, setSrc] = useState<string | null>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    setState("loading");
    fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guitarName: product.name, brand: product.brand, venue }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.imageData) {
          setSrc(`data:${d.mimeType ?? "image/png"};base64,${d.imageData}`);
          setState("done");
        } else {
          setState("error");
        }
      })
      .catch(() => setState("error"));
  // Run once per product+venue combination
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, venue]);

  return { src, state, isLoading: state === "loading" };
}
