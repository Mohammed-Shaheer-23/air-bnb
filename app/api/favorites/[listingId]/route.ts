"use server";

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

// 🟢 FIXED: POST (Adding to Favorites)
export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = params;
  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid listingId" }, { status: 400 });
  }

  let favoriteIds = currentUser.favoriteIds || [];

  // Prevent duplicates
  if (!favoriteIds.includes(listingId)) {
    favoriteIds.push(listingId);
  }

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  return NextResponse.json(updatedUser);
}

// 🟢 FIXED: DELETE (Removing from Favorites)
export async function DELETE(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = params;
  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid listingId" }, { status: 400 });
  }

  let favoriteIds = currentUser.favoriteIds || [];

  // 🟢 FIXED: Remove only the specific `listingId`
  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  return NextResponse.json(updatedUser);
}
