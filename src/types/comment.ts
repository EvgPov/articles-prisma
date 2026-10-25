export type ArticleComment = {
   id: number;
  body: string;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}