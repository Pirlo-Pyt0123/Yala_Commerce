"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DrawerCtx = {
  slug: string | null;
  openDrawer: (slug: string) => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerCtx>({
  slug: null,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  return (
    <DrawerContext.Provider
      value={{ slug, openDrawer: setSlug, closeDrawer: () => setSlug(null) }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  return useContext(DrawerContext);
}
