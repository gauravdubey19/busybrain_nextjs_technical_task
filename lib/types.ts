export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface PostDetail {
  info: Post;
  comments: Comment[];
}

export interface APIData {
  posts: Post[];
  totalPosts: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface ItemsProps {
  page: number;
  limit: number;
}
