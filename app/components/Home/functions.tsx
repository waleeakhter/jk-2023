import { Item } from "@/types/typings";
import { Tag } from "antd";
import Highlighter from "react-highlight-words";
type ItemWithoutExcludedProps = Omit<
  Item,
  | "createdAt"
  | "stockUpdated"
  | "wearhouseStockUpdated"
  | "stockUpdate"
  | "wearHouseStock"
  | "purchase_price"
  | "brand"
>;
interface ItemWithPriceRange extends ItemWithoutExcludedProps {
  priceRange?: string;
}
export function sanitizeUrlParam(param: string): string {
  // Replace multiple spaces with a single space and trim leading/trailing spaces
  param = param.replace(/\s+/g, " ").trim();
  // Replace all non-alphanumeric characters except for spaces, underscores, and hyphens
  return encodeURIComponent(param.replace(/[^a-zA-Z0-9-_ ]/g, ""));
}

const getStockMessage = (type: string, stock: number) => {
  if (type === "lcd") {
    if (Number(stock) === 0) {
      return "Restocking Soon";
    } else {
      return "In Stock : " + Number(stock);
    }
  } else {
    return "Available";
  }
};
const getStock = (item: ItemWithoutExcludedProps) => {
  const { type, stock } = item;
  return (
    <Tag
      color={Number(item.stock) === 0 ? "red" : ""}
      className={`${
        Number(item.stock) === 0
          ? "text-red-600"
          : "text-gray-500 dark:text-gray-800"
      } text-sm  font-medium mr-0 w-fit ml-auto`}
    >
      {getStockMessage(type, stock)}
    </Tag>
  );
};
const sortStockItems = (items: ItemWithoutExcludedProps[]) => {
  return items.sort((a, b) => {
    const stockA = Number(a.stock);
    const stockB = Number(b.stock);

    // If both items have the same stock, maintain their order
    if (stockA === stockB) return 0;

    // Move items with zero stock to the end
    if (stockA === 0) return 1;
    if (stockB === 0) return -1;

    // Otherwise, sort by stock in descending order (highest stock first)
    return stockB - stockA;
  });
};
const combineLaptopStocks = (items: Item[] & ItemWithPriceRange[]) => {
  let combinedStock = 0;
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  const restItems: ItemWithPriceRange[] = [];

  items.forEach((item) => {
    if (
      item.type === "laptop" &&
      (item.name.includes("#UB") || item.name.includes("#UK"))
    ) {
      combinedStock += item.stock;
      minPrice = Math.min(minPrice, item.price);
      maxPrice = Math.max(maxPrice, item.price);
    } else {
      restItems.push(item);
    }
  });

  if (combinedStock > 0 && minPrice !== Infinity && maxPrice !== -Infinity) {
    restItems.push({
      type: "laptop",
      stock: combinedStock,
      name: "MIXED BRAND LAPTOPS",
      price: minPrice, // Represents price range start
      priceRange: `€${minPrice} -  €${maxPrice}`, // Price range for mixed laptops
    });
  }

  return restItems;
};
export const itemTemplate = (
  items: Item[],
  highlighterText: string,
  listType = "lcd"
) => {
  let _items: Item[] | ItemWithPriceRange[] = [];
  if (listType === "lcd") {
    _items = sortStockItems(items) as Item[];
  } else if (listType === "laptop") {
    _items = combineLaptopStocks(items);
  } else {
    _items = items;
  }

  return _items.map((item: ItemWithPriceRange) => (
    <div
      key={item._id}
      className={`grid grid-cols-[1fr_auto] items-center 
      gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-transparent 
      dark:shadow-lg   w-full card mb-3 dark:text-emerald-50 text-[#27272A] dark:backdrop-blur-lg ${
        Number(item.stock) === 0 ? " !text-red-600 opacity-70 " : "opacity-100"
      } `}
    >
      <div className="grid gap-1 text-left">
        <h3 className="text-[0.8rem] sm:text-base  font-semibold">
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[highlighterText]}
            autoEscape={true}
            textToHighlight={item.name}
          />
        </h3>
      </div>
      <div className="grid gap-1 text-right">
        <p className=" text-xl sm:text-2xl font-bold">
          {item?.priceRange ?? "€" + item.price}
        </p>
        {getStock(item)}
      </div>
    </div>
  ));
};
