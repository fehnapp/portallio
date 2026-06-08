import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(Number(amount || 0));
}

export function formatDate(date: string | null | undefined) {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function resolveAppUrl(fallback?: string) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const baseUrl = envUrl || (vercelUrl ? `https://${vercelUrl}` : fallback || "");

  return baseUrl.replace(/\/$/, "");
}

export function publicPortalUrl(slug: string, baseUrl?: string) {
  const appUrl = resolveAppUrl(baseUrl);
  if (!appUrl) return `/p/${slug}`;
  return `${appUrl}/p/${slug}`;
}
