export type ArticleComment = {
  id: number;
  body: string;
  likes: number;
  author: {
    id: number;
    username: string;
    fullName: string;
  };
};
