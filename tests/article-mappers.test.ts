import { describe, it, expect } from 'vitest';
import { parseArticleId, toArticle,
         toArticleComment, MAX_INTEGER } from '@/lib/article-mappers';

describe('parseArticleId', () => {
  it('parses "5" as 5', () => {
    expect(parseArticleId('5')).toBe(5)
  });
  it('parses "150" as 150', () => {
    expect(parseArticleId('150')).toBe(150)
  });
  it('accepts 0', () => {
    expect(parseArticleId('0')).toBe(0)
  });
  it('allows leading zeros', () => {
    expect(parseArticleId('007')).toBe(7)
  });
  it('accepts MAX_INTEGER', () => {
    expect(parseArticleId(String(MAX_INTEGER))).toBe(MAX_INTEGER)
  });
  it.each(['abc', '', '1.5', '-3', ' 7', '7 ',
           '1e3', '0x10', String(MAX_INTEGER + 1),
          '99999999999999999999'])('rejects «%s»', (value) => {
    expect(parseArticleId(value)).toBeNull();
  });
});

describe('toArticle', () => {
  it('collects likes and dislikes in reactions object', () => {
    const articleRow = {
      id: 1,
      title: 'His mother had always taught him',
      body: 'His mother had always taught him not to ever think of himself as better than others.',
      tags: ["history", "american", "crime"],
      likes: 192,
      dislikes: 25,
      views: 305,
      userId: 121
    };
    expect(toArticle(articleRow)).toEqual({
      id: 1,
      title: 'His mother had always taught him',
      body: 'His mother had always taught him not to ever think of himself as better than others.',
      tags: ["history", "american", "crime"],
      reactions: {
        likes: 192,
        dislikes: 25,
      },
      views: 305,
      userId: 121,
    })
  });
});

describe('toArticleComment', () => {
  it('collects firstName with lastName into fullName', () => {
    const commentRow = {
      id: 1,
      body: 'This is some awesome thinking!',
      likes: 3,
      user: {
        id: 105,
        username:'emilys',
        firstName: 'Emily',
        lastName: 'Johnson',
      }
    };
    expect(toArticleComment(commentRow)).toEqual({
      id: 1,
      body: 'This is some awesome thinking!',
      likes: 3,
      user: {
        id: 105,
        username: 'emilys',
        fullName: 'Emily Johnson'
      }
    });
  });
});