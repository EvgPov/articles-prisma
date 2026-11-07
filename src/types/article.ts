type Reaction = {
  likes: number;
  dislikes: number;
};

export interface Article {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: Reaction;
  views: number;
  authorId: number;
  summary: string | null;
}
