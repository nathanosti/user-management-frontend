"use client";

import { ReactNode } from "react";
import {
  QueryClientProvider,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { UserProvider } from "@/contexts/UserContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserProvider>{children}</UserProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
