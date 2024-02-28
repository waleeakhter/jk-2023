
import dbConnect from "@/utils/dbConnect";
import Item from "@/models/Item";
import SaleModel from "@/models/Sale"
import { Sale } from "@/types/typings";
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
    await dbConnect()
    try {
        const itemType = "lcd"
        const typeFilter = itemType ? { 'type': itemType } : {}; // Create a filter based on item type

        const monthlySales = await SaleModel.aggregate([
            {
              $lookup: {
                from: 'items', // Name of the Item collection in your database
                localField: 'item',
                foreignField: '_id',
                as: 'itemDetails',
              },
            },
            {
              $unwind: '$itemDetails',
            },
            {
              $match: typeFilter, // Apply the type-based filter
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                },
                totalSales: { $sum: '$total_amount' },
              },
            },
            {
              $project: {
                _id: 0,
                Month: {
                  $dateToString: {
                    format: '%m-%Y', // Format month and year (e.g., 10-2023)
                    date: {
                      $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: 1, // Set day to 1 for consistency
                      },
                    },
                  },
                },
                Sales: '$totalSales',
              },
            },
            { $sort: { 'Month': 1 } },
          ]);
      
          console.log(monthlySales); 
        // Rest of the code remains the same...
        // ... (processing monthly sales and profits)
        
        console.log(monthlySales , "dsads") // Check the final formatted data
        return NextResponse.json({data : monthlySales , success : true} );
      } catch (error) {
        console.error('Error retrieving monthly sales and profit:', error);
      
        return NextResponse.json({data : [] , error : error} , {status : 404, statusText : "Error retrieving monthly sales and profit"});
      }
   
}



