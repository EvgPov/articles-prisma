import type { TagCrumb } from "@/types/tag";

export function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags) return [];
  return [
    ...new Set(
      tags.map((tag) => tag.toLowerCase()).filter((tag) => tag !== ""),
    ),
  ].sort();
}

export function tagCrumbs(tags: string[]): TagCrumb[] {
  return tags.map((tag, index) => ({
    label: tag,
    href: `/tags/${tags.slice(0, index + 1).join("/")}`,
  }));
}
