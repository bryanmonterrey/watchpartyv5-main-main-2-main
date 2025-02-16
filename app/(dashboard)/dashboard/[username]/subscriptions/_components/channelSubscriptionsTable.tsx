// app/(dashboard)/u/[username]/subscription/_components/channelSubscriptionsTable.tsx

"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { columns, ChannelSubscription } from "./channelSubscriptionsColumns"
import { toast } from "sonner"
import { CancelChannelSubscriptionButton } from "./cancelChannelSubscriptionButton"
import { ColumnDef, Row } from "@tanstack/react-table"  // Add this import

async function getChannelSubscriptions(): Promise<ChannelSubscription[]> {
  const response = await fetch('/api/channel-subscriptions')
  if (!response.ok) {
    throw new Error('Failed to fetch channel subscriptions')
  }
  return response.json()
}

export function ChannelSubscriptionsTable() {
  const [subscriptions, setSubscriptions] = React.useState<ChannelSubscription[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const data = await getChannelSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      toast.error("Failed to load subscriptions")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSubscriptions()
  }, [])

  const handleCancelSubscription = (cancelledSubscriptionId: string) => {
    setSubscriptions(prevSubscriptions => 
      prevSubscriptions.map(sub => 
        sub.id === cancelledSubscriptionId 
          ? { ...sub, status: 'canceled' } 
          : sub
      )
    );
  };

  const columnsWithCancelHandler: ColumnDef<ChannelSubscription>[] = React.useMemo(() => 
    columns.map(column => {
      if (column.id === 'actions') {
        return {
          ...column,
          cell: ({ row }: { row: Row<ChannelSubscription> }) => (
            <CancelChannelSubscriptionButton 
              subscriptionId={row.original.id} 
              status={row.original.status}
              paymentMethod={row.original.paymentMethod}
              onCancel={handleCancelSubscription}
            />
          )
        };
      }
      return column;
    }), []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <DataTable columns={columnsWithCancelHandler} data={subscriptions} />
}