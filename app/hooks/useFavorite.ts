"use client";

import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 15
import { useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";

interface IuseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IuseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  // ✅ Check if user has favorited the listing
  const hasFavorited = useMemo(() => {
    return currentUser?.favoriteIds?.includes(listingId) || false;
  }, [currentUser, listingId]);

  // ✅ API Call to Toggle Favorite
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        if (hasFavorited) {
          await axios.delete(`/api/favorites/${listingId}`);
        } else {
          await axios.post(`/api/favorites/${listingId}`);
        }

        toast.success("Updated favorites");

        // ✅ Ensure the UI updates correctly
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return { hasFavorited, toggleFavorite };
};

export default useFavorite;
