"use client";

import Link from "next/link";
import { Modal } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Eye, Trash2, Loader2 } from "lucide-react";

const NoticeAction = ({ notice }: { notice: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notices/${notice._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete notice");
      }

      setIsOpen(false);
      toast.success("Notice deleted successfully");
      router.refresh();
      router.push("/admin/viewNotice");

      console.log("Notice deleted successfully");
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50/80 p-1 border border-emerald-100">
        {/* Edit Notice */}
        <Link
          href={`/admin/updateNotice/${notice._id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700 transition-colors duration-150 hover:bg-amber-500 hover:text-white"
          title="Edit Notice"
        >
          <Pencil className="h-4 w-4" />
        </Link>

        {/* View Notice */}
        <Link
          href={`/notice/${notice._id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700 transition-colors duration-150 hover:bg-emerald-600 hover:text-white"
          title="View Notice"
        >
          <Eye className="h-4 w-4" />
        </Link>

        {/* Delete Notice */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700 transition-colors duration-150 hover:bg-rose-600 hover:text-white"
          title="Delete Notice"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Delete Notice</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Are you sure you want to delete this notice? This action
                  cannot be undone.
                </p>
                <p className="text-sm text-gray-500">
                  Notice ID: {notice._id}
                </p>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};

export default NoticeAction;