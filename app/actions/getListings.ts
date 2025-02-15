

import  Prisma  from "@/app/libs/prismadb";

export default async function getListings() {
    try {
        const listings = await Prisma.listing.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return listings;
    }   catch (error:any) {
        throw new Error(error.message) // error.message is the error message from the server 
    }
}