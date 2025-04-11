import { PostDetail } from "@/lib/types";

const ItemDetail: React.FC<PostDetail> = ({ info, comments }) => {
  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-4xl animate-fade-in">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold">Item/Post Detail</h2>
        </div>

        <div className="grid gap-6">
          <div className="rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">
              Title: {info?.title}
            </h3>
            <p className=" leading-relaxed text-muted-foreground">
              Body: {info?.body}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">Post Details</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <span className="w-20">Post ID:</span>
                  <span className="font-medium">{info?.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20">User ID:</span>
                  <span className="font-medium">{info?.userId}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-sm p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-3">
                Comments{" "}
                <span className="font-normal text-lg">
                  ({comments?.length})
                </span>
              </h3>

              <div className="space-y-6 mt-5">
                {comments.map((comment) => (
                  <div
                    key={comment?.id}
                    className="flex gap-4 pb-5 border-b border-muted-foreground last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden uppercase bg-primary/15 text-primary backdrop-blur-md font-bold text-lg">
                      {comment?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium">{comment?.name}</h4>
                      <p className="text-sm mb-2">{comment?.email}</p>
                      <p className="text-muted-foreground">{comment?.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ItemDetail;
