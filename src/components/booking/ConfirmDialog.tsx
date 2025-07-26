import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { PendingChange } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
    cancelChange: () => void;
    confirmChange: () => void;
    pendingChange: PendingChange;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    cancelChange,
    confirmChange,
    pendingChange,
}) => {
    return (
        <Dialog open onOpenChange={(open) => !open && cancelChange()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Change</DialogTitle>
                    <DialogDescription>
                        Move booking of{" "}
                        <strong>
                            {pendingChange.customerName} ({pendingChange.type})
                        </strong>{" "}
                        from{" "}
                        {format(
                            new Date(
                                pendingChange.type === "end"
                                    ? pendingChange.endDate
                                    : pendingChange.startDate,
                            ),
                            "EEEE dd MMM",
                        )}{" "}
                        to{" "}
                        {format(new Date(pendingChange.newDate), "EEEE dd MMM")}{" "}
                        ?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-2 pt-4">
                    <Button variant={"default"} onClick={cancelChange}>
                        Cancel
                    </Button>
                    <Button variant={"destructive"} onClick={confirmChange}>
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
