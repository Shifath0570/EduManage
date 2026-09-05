
"use client";

import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { Trash2, Loader2 } from "lucide-react";

interface StudentDeleteActionProps {
  studentId: string | number;
  studentName?: string;
  onSuccess?: () => void;
}

export function StudentDeleteAction({
  studentId,
  studentName,
  onSuccess,
}: StudentDeleteActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiURL}/api/students/${studentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete student");
      }

      setIsOpen(false);

      if (onSuccess) {
        onSuccess();
      }

      // Automatically reload the page to purge the deleted item
      window.location.reload();
    } catch (err: any) {
      console.error("Delete student error:", err);
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        aria-label="Delete Student"
        className="p-1.5 text-rose-500 bg-white hover:bg-rose-50 rounded-md border border-rose-100 transition-colors"
      >
        <Trash2 size={15} />
      </Button>

      <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Delete student record?</AlertDialog.Heading>
              </AlertDialog.Header>

              <AlertDialog.Body>
                <p>
                  This will permanently delete <strong>{studentName || "this student"}</strong> and all associated data. This action cannot be undone.
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
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="flex items-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Student"
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
