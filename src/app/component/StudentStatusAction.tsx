"use client";

import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { ToggleRight, ToggleLeft, Loader2 } from "lucide-react";

interface StudentStatusActionProps {
  studentId: string | number;
  studentName?: string;
  currentStatus: "Active" | "Inactive" | "Suspended" | "Graduated";
  onSuccess?: () => void;
}

export function StudentStatusAction({
  studentId,
  studentName,
  currentStatus,
  onSuccess,
}: StudentStatusActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActive = currentStatus === "Active";
  const newStatus = isActive ? "Inactive" : "Active";

  const handleToggleStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiURL}/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update student status");
      }

      setIsOpen(false);

      if (onSuccess) {
        onSuccess();
      }

      // Reload page to reflect updated data
      window.location.reload();
    } catch (err: unknown) {
      console.error("Update status error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        aria-label="Toggle Student Status"
        className="p-1.5 bg-slate-100 rounded-md hover:bg-slate-200 transition"
      >
        {isActive ? (
          <ToggleRight size={18} className="text-emerald-600" />
        ) : (
          <ToggleLeft size={18} className="text-slate-400" />
        )}
      </Button>

      <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status={isActive ? "warning" : "accent"} />
                <AlertDialog.Heading>
                  {isActive ? "Deactivate" : "Activate"} student record?
                </AlertDialog.Heading>
              </AlertDialog.Header>

              <AlertDialog.Body>
                <p>
                  Are you sure you want to change the status of{" "}
                  <strong>{studentName || "this student"}</strong> to{" "}
                  <strong className={isActive ? "text-amber-600" : "text-emerald-600"}>
                    {newStatus}
                  </strong>
                  ?
                </p>

                {error && (
                  <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                    {error}
                  </p>
                )}
              </AlertDialog.Body>

              <AlertDialog.Footer>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="tertiary"
                  isDisabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleToggleStatus}
                  className={
                    isActive
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }
                  isDisabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `Mark as ${newStatus}`
                  )}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
}