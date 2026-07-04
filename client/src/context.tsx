import { signal } from "@preact/signals-react";

export const isBlogHost = signal(
  typeof window !== "undefined" &&
  (window.location.hostname === "blog.mahermah.com" ||
    window.location.hostname.startsWith("blog."))
);

export const transformImageUrl = (src: string) => {
  if (isBlogHost.value && src.startsWith("/api/blog/assets/")) {
    return `https://mahermah.com${src}`;
  }
  return src;
};