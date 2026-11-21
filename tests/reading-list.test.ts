import { describe, expect, it } from "vitest";
import { createEntry } from "@/lib/reading-list";

describe("createEntry", () => {
  const article = {
    id: 5,
    title: "Title article",
  };

  it("creates an unread entry from an article", () => {
    expect(createEntry(article)).toEqual({
      articleId: 5,
      title: "Title article",
      read: false,
    });
  });

  it.each([
    { id: 1, title: "" },
    { id: 1, title: "    " },
  ])("rejects empty title %j", (input) => {
    expect(() => createEntry(input)).toThrow("Статья должна иметь заголовок");
  });

  it.each([
    { id: 0, title: "Война и мир" },
    { id: -1, title: "Братья Карамазовы" },
    { id: 1.5, title: "Преступление и наказание" },
    { id: NaN, title: "Тарас Бульба" },
  ])("rejects invalid id $id", (input) => {
    expect(() => createEntry(input)).toThrow(
      "id статьи должен быть целым положительным числом",
    );
  });
});
