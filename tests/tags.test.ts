import { describe, expect, it } from "vitest";
import { normalizeTags, tagCrumbs } from "@/lib/tags";

describe("normalizeTags", () => {
  it.each([
    [undefined, []],
    [["history"], ["history"]],
    [
      ["love", "history"],
      ["history", "love"],
    ],
    [
      ["Love", "HISTORY"],
      ["history", "love"],
    ],
    [["love", "love"], ["love"]],
    [
      ["love", "", "history"],
      ["history", "love"],
    ],
  ])("normalizes %j to %j", (input, expected) => {
    expect(normalizeTags(input)).toEqual(expected);
  });
});

describe("tagCrumbs", () => {
  it("returns [] for empty tags", () => {
    expect(tagCrumbs([])).toEqual([]);
  });
  it("returns one crumb for one tag", () => {
    expect(tagCrumbs(["history"])).toEqual([
      { label: "history", href: "/tags/history" },
    ]);
  });
  it("returns two crumbs for two tags", () => {
    expect(tagCrumbs(["history", "love"])).toEqual([
      { label: "history", href: "/tags/history" },
      { label: "love", href: "/tags/history/love" },
    ]);
  });
});
