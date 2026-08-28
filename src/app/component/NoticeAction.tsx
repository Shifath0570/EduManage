"use client";
import { FaRegEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { Modal } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NoticeAction = ({ notice }: { notice: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/notices/${notice._id}`,
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
      
      // Force a refresh with cache busting
      router.refresh();
      // Force a hard refresh of the page data
      router.push('/admin/viewNotice');
      
      console.log("Notice deleted successfully");
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert(error instanceof Error ? error.message : "Failed to delete notice");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2">
        {/* Edit Notice */}
        {/* Edit Notice - Pass data via query params */}
        <Link
          href={`/admin/updateNotice/${notice._id}`}
        >
          <span className="flex items-center justify-center text-amber-400 transition-colors duration-200 hover:text-blue-800">
            <FaRegEdit className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        </Link>


        {/* View Notice */}
        <Link href={`/notice/${notice._id}`}>
          <span className="flex items-center justify-center text-blue-400 transition-colors duration-200 hover:text-blue-800">
            <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        </Link>

        {/* Delete Notice */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center text-red-400 transition-colors duration-200 hover:text-red-700"
        >
          <FaTrashAlt className="h-4 w-4 sm:h-5 sm:w-5" />
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
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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