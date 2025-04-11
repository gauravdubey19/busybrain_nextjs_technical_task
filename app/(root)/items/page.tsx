import { ItemsProps } from "@/lib/types";
import Items from "@/components/pages/item/Items";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { page, limit } = (await searchParams) || {};
  const pageValue = page ? Number(page) : 1;
  const limitValue = limit ? Number(limit) : 8;

  const items: ItemsProps = {
    page: pageValue,
    limit: limitValue,
  };
  // console.log("items", items);

  return <Items {...items} />;
}
