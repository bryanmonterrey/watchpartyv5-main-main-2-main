"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditPaymentMethodDialog } from "./editPaymentMethodDialog";
import { Pencil } from "lucide-react";

interface EditPaymentMethodButtonProps {
  subscriptionId: string;
}

export function EditPaymentMethodButton({ subscriptionId }: EditPaymentMethodButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="ghost"
        size="sm"
        className="px-1"
      >
        <Pencil className="h-4 w-4 mx-0.5"/>
      </Button>
      <EditPaymentMethodDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        subscriptionId={subscriptionId}
      />
    </>
  );
}