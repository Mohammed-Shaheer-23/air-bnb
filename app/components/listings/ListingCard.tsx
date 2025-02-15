'use client';

import { useCallback, useMemo } from "react";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";

interface ListingCardProps {
  data: Listing;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "", 
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  
  const location = useMemo(() => getByValue?.(data.locationValue), [getByValue, data.locationValue]);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => reservation?.totalPrice ?? data.price, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    return `${format(new Date(reservation.startDate), "PP")} - ${format(new Date(reservation.endDate), "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listing/${data.id}`)}
      className="
       col-span-1 cursor-pointer group
      "
    >
      <div className="flex flex-col gap-2 w-full">

        <div 
        className="
          aspect-square
          w-full
          relative
          overflow-hidden
          rounded-xl
        "
        >
          <Image
            fill
            alt="listing"
            src={data.imageSrc}
            className="
             object-cover
             h-full
             w-full
             group-hover:scale-110
             transition
            "
          />
          <div className="absolute top-3 right-3">
          
          <HeartButton
            listingId={data.id}
            currentUser={currentUser}
            
          />
            
          </div>

        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}

        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
          
        </div>

      </div>
      
    </div>
  );
};

export default ListingCard;
