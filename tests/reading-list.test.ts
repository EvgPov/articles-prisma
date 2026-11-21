import { describe, expect, it } from "vitest";
import { createEntry, toggleRead } from "@/lib/reading-list";

describe("createEntry", () => {
  const article = {
    id: 5,
    title: "Ромео и Джульетта",
  };

  it("creates an unread entry from an article", () => {
    expect(createEntry(article)).toEqual({
      articleId: 5,
      title: "Ромео и Джульетта",
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

describe("toggleRead", () => {
  const entry = {
    articleId: 5,
    title: "Ромео и Джульетта",
    read: false,
  };

  it("marks an unread entry as read", () => {
    const result = toggleRead(entry);

    expect(result).toEqual({ ...entry, read: true });
  });

  it("marks a read entry as unread", () => {
    const readEntry = { ...entry, read: true };

    const result = toggleRead(readEntry);
    expect(result).toEqual({ ...readEntry, read: false });
  });

  it("does not change the original entry", () => {
    const before = structuredClone(entry);

    const result = toggleRead(entry);

    expect(result).not.toBe(entry);
    expect(entry).toEqual(before);
  });
});
