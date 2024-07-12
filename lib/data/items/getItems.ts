import Item from "@/models/Item";
import dbConnect from "@/utils/dbConnect";

 const fetchItems = async (searchParams  : any) => {
    const {name , type  = "lcd"} = searchParams || {};
    await  dbConnect();
    const res = await Item.find(
      { 
        ...(name && { "name": { $regex: decodeURIComponent(name.toString()), $options: "i" }}),
        type: type ,   $or: [
          { stock: { $gt: 0 } },
          { wearHouseStock: { $gt: 0 } }
      ], },
      { name: 1, price: 1, _id: 1, type: 1, stock: 1, wearHouseStock: 1 }
    )
      .sort({ name: 1 })
      .collation({ locale: "en" })
      .lean();

    const customSort = function (a: any, b: any): number {
        const nameA = (a.name as string).toUpperCase();
        const nameB = (b.name as string).toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    };
    const _res = res.length ? res.map((item) => ({...item,_id : (item._id as string).toString() , })) : []
    return _res.sort(customSort);
  };
  export default fetchItems