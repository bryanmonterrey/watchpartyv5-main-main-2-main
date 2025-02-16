// app/(dashboard)/u/[username]/subscription/_components/channelSubscriptionsColumns.tsx

"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";
import { EditPaymentMethodButton } from "./editPaymentMethodButton";
import { format } from "date-fns";

export type ChannelSubscription = {
  id: string;
  channelName: string;
  dateJoined: string;
  status: string;
  tierName: string;
  endDate?: string;
  paymentMethod: 'stripe' | 'crypto';
  lastFourDigits?: string;
}

export const columns: ColumnDef<ChannelSubscription>[] = [
  {
    accessorKey: "channelName",
    header: ({ column }) => (
    <div className="inline-flex items-center justify-center">
      <p>Channel Name</p>
      <Button
        className="px-1 h-7 ml-1"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Image src="/unsorted.svg" alt="sort" width={16} height={12} className="h-3 w-4" />
      </Button>
      </div>
    ),
  },
  {
    accessorKey: "dateJoined",
    header: ({ column }) => (
        <div className="inline-flex items-center justify-center">
            <p>Date Joined</p>
      <Button
        className="px-1 h-7 ml-1"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        
        <Image src="/unsorted.svg" alt="sort" width={16} height={12} className=" h-3 w-4" />
      </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateJoined"));
      return <div>{format(date, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "tierName",
    header: "Tier",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const endDate = row.original.endDate;
      
      if (status === "active" && endDate) {
        return <div>Active (Renews on {format(new Date(endDate), "MMM d, yyyy")})</div>;
      } else if (status === "canceled" && endDate) {
        return <div>Canceled (Ends on {format(new Date(endDate), "MMM d, yyyy")})</div>;
      }
      return <div>{status}</div>;
    }
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;
      const lastFourDigits = row.original.lastFourDigits;
      return (
        <div className="flex items-center gap-2">
          {paymentMethod === 'stripe' ? (
            <>
              <span>Card {lastFourDigits ? `ending in ${lastFourDigits}` : ''}</span>
              <EditPaymentMethodButton subscriptionId={row.original.id} />
            </>
          ) : (
            <span>Crypto</span>
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => null, // This will be replaced in channelSubscriptionsTable.tsx
  },
]