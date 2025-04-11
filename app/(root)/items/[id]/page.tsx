import { redirect } from "next/navigation";
import { getItemDetail } from "@/lib/actions/items.actions";
import { PostDetail } from "@/lib/types";
import ItemDetail from "@/components/pages/item/ItemDetail";

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const postInfo: PostDetail | null = await getItemDetail(parseInt(id, 10));
  if (!postInfo) redirect("/not-found");

  return <ItemDetail {...postInfo} />;
}
