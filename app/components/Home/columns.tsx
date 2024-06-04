import { Item } from "@/types/typings";
import { Badge, Tag } from "antd";
import { ColumnProps } from "primereact/column";

export const columns: Array<ColumnProps> = [
  {
    field: "name",
    header: "Item",
    sortable: true,
  },
  {
    field: "type",
    header: "Type",
    sortable: true,
  },
  {
    field: "price",
    header: "Price",
  },
  {
    field: "stock",
    body: (value) => {
      return (
        <div className="flex flex-col gap-2 max-w-fit ">
          {value.wearHouseStock + value.stock > 0 ? (
            <Tag className="mr-2">
              {" "}
              <Badge
                status="success"
                text={
                  <span>
                    Available: {value.wearHouseStock + value.stock ?? 0}
                  </span>
                }
              />
            </Tag>
          ) : (
            <Tag className="mr-2">
              {" "}
              <Badge status="error" text={"Out of stock"} />
            </Tag>
          )}
        </div>
      );
    },
    header: "Stock",
  },
];

export const mobileColumns: Array<ColumnProps> = [
  {
    field: "name",
    className: "w-[100vmin]",
    colSpan: 1,
    body: (item: Item) => {
      return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-950 dark:shadow-none w-full">
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">{item.name}</h3>
          </div>
          <div className="grid gap-1 text-right">
            <p className="text-2xl font-bold">€{item.price}</p>
            <p className={`${Number(item.stock + (item.wearHouseStock ?? 0)) === 0 ? "text-red-600" : "text-gray-500 dark:text-gray-400"} text-sm  font-medium `}>
              In stock: {Number(item.stock + (item.wearHouseStock ?? 0))} 
            </p>
          </div>
        </div>
      );
    },
    header: "Product",
  },
];
