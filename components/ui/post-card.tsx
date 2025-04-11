import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/lib/types";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Card key={post?.id} className="h-full">
      <CardHeader>
        <CardTitle>{post?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {post.body && <p className="line-clamp-3">{post.body}</p>}
        <div className="mt-2">User ID: {post?.userId}</div>
      </CardContent>
      <CardFooter className="h-full flex items-end justify-end">
        <Link
          href={`/items/${post?.id}`}
          className="text-blue-600 hover:underline"
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

{
  /* {items.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">No items found</div>
      )} */
}
