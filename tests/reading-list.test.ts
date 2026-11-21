import { describe, expect, it } from "vitest";
import {
  createEntry,
  toggleRead,
  addEntry,
  removeEntry,
} from "@/lib/reading-list";

const list = [
  { articleId: 6, title: "Ромео и Джульетта", read: false },
  { articleId: 10, title: "Война и мир", read: true },
  { articleId: 13, title: "Братья Карамазовы", read: false },
  { articleId: 25, title: "Преступление и наказание", read: true },
  { articleId: 50, title: "Тарас Бульба", read: true },
];

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

describe("addEntry", () => {
  const newArticle = {
    id: 2,
    title: "Капитанская дочка",
  };
  const duplicateArticle = {
    id: 25,
    title: "Гамлет",
  };

  it("adds a new entry at the end of the list", () => {
    const result = addEntry(list, newArticle);

    expect(result).toEqual([
      ...list,
      { articleId: 2, title: "Капитанская дочка", read: false },
    ]);
  });

  it("does not add an article that is already in the list", () => {
    const result = addEntry(list, duplicateArticle);

    expect(result).toEqual(list);
  });

  it("does not change the original list", () => {
    const before = structuredClone(list);

    const result = addEntry(list, newArticle);

    expect(result).not.toBe(list);
    expect(list).toEqual(before);
  });
});

describe("removeEntry", () => {
  it("removes an entry from the list", () => {
    const result = removeEntry(list, 13);

    expect(result).toEqual([
      { articleId: 6, title: "Ромео и Джульетта", read: false },
      { articleId: 10, title: "Война и мир", read: true },
      { articleId: 25, title: "Преступление и наказание", read: true },
      { articleId: 50, title: "Тарас Бульба", read: true },
    ]);
  });

  it("keps the list as is when articleId is not in it", () => {
    const result = removeEntry(list, 35);

    expect(result).toEqual(list);
  });

  it("does not change the original list", () => {
    const before = structuredClone(list);

    const result = removeEntry(list, 6);

    expect(result).not.toBe(list);
    expect(list).toEqual(before);
  });
});
