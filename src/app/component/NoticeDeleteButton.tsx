// 'use client';
// import { NoticeData } from '@/types/types';
// import { authClient } from "../lib/auth-client";
// import { HiOutlineTrash } from 'react-icons/hi';
// import { useEffect, useState } from "react";

// interface NoticeDeleteButtonProps {
//     notice: NoticeData;
//     onDeleteSuccess?: () => void; // Optional callback for successful deletion
// }
// const NoticeDeleteButton = ({ notice, onDeleteSuccess }: NoticeDeleteButtonProps) => {
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [token, setToken] = useState("");

//   useEffect(() => {
//     const getToken = async () => {
//       const { data } = await authClient.token();
//       setToken(data?.token || "");
//     };
//     getToken();
//   }, []);



//   console.log("Token is:", token);

//     // Handle delete with confirmation
//     const handleDelete = () => {
//         setError(null);
//         setShowDeleteModal(true);
//     };

//     // Confirm delete
//     const confirmDelete = async () => {
//         setIsDeleting(true);
//         setError(null);
        
//         try {
//             // ✅ Fixed: Using notice._id instead of notice.id
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices/${notice._id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || 'Failed to delete notice');
//             }

//             // Success - close modal and trigger callback
//             setShowDeleteModal(false);
//             onDeleteSuccess?.();
            
//             // Optional: Show success message or refresh the list
//             // You could also use a toast notification here
            
//         } catch (error) {
//             const errorMessage = error instanceof Error ? error.message : 'Failed to delete notice';
//             setError(errorMessage);
//             console.error('Failed to delete notice:', error);
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     // Close modal and reset error
//     const closeModal = () => {
//         setShowDeleteModal(false);
//         setError(null);
//     };

//     return (
//         <>
//             {/* Delete Button */}
//             <button
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//                 className="group/btn inline-flex items-center gap-1.5 px-3.5 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                 aria-label={`Delete ${notice.notice.title}`}
//             >
//                 <HiOutlineTrash className={`text-base transition-all duration-300 ${
//                     isDeleting 
//                         ? 'animate-spin' 
//                         : 'group-hover/btn:scale-110 group-hover/btn:rotate-12'
//                 }`} />
//                 <span className="hidden xs:inline">
//                     {isDeleting ? 'Deleting...' : 'Delete'}
//                 </span>
//             </button>

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div 
//                     className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
//                     onClick={closeModal} // Close on backdrop click
//                 >
//                     <div 
//                         className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
//                         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
//                     >
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="p-3 bg-red-100 rounded-full">
//                                 <HiOutlineTrash className="text-2xl text-red-600" />
//                             </div>
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900">Delete Notice</h3>
//                                 <p className="text-sm text-gray-500">This action cannot be undone</p>
//                             </div>
//                         </div>

//                         <p className="text-gray-700 mb-2">
//                             Are you sure you want to delete <span className="font-semibold">"{notice.notice.title}"</span>?
//                         </p>
                        
//                         {notice.notice.content?.subject && (
//                             <p className="text-sm text-gray-500 mb-4">
//                                 Subject: {notice.notice.content.subject}
//                             </p>
//                         )}

//                         {/* Error Message */}
//                         {error && (
//                             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                                 <p className="text-sm text-red-600">
//                                     <span className="font-medium">Error:</span> {error}
//                                 </p>
//                             </div>
//                         )}

//                         <div className="flex gap-3 justify-end mt-6">
//                             <button
//                                 onClick={closeModal}
//                                 disabled={isDeleting}
//                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmDelete}
//                                 disabled={isDeleting}
//                                 className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[120px] justify-center"
//                             >
//                                 {isDeleting ? (
//                                     <>
//                                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Deleting...
//                                     </>
//                                 ) : (
//                                     'Delete Notice'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default NoticeDeleteButton;


'use client';

import { NoticeItem } from '@/types/types';
import { authClient } from "../lib/auth-client";
import { HiOutlineTrash } from 'react-icons/hi';
import { useEffect, useState } from "react";

interface NoticeDeleteButtonProps {
    notice: NoticeItem;
    onDeleteSuccess?: () => void;
}

const NoticeDeleteButton = ({ notice, onDeleteSuccess }: NoticeDeleteButtonProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const getToken = async () => {
            const { data } = await authClient.token();
            setToken(data?.token || "");
        };
        getToken();
    }, []);

    const handleDelete = () => {
        setError(null);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setError(null);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices/${notice._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete notice');
            }

            setShowDeleteModal(false);
            onDeleteSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete notice';
            setError(errorMessage);
            console.error('Failed to delete notice:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setError(null);
    };

    return (
        <>
            {/* Delete Button */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="group/btn inline-flex items-center gap-1.5 px-3.5 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label={`Delete ${notice.title}`}
            >
                <HiOutlineTrash className={`text-base transition-all duration-300 ${
                    isDeleting 
                        ? 'animate-spin' 
                        : 'group-hover/btn:scale-110 group-hover/btn:rotate-12'
                }`} />
                <span className="hidden xs:inline">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </span>
            </button>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <HiOutlineTrash className="text-2xl text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Notice</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-2">
                            Are you sure you want to delete <span className="font-semibold">{notice.title}</span>?
                        </p>
                        
                        {notice.content?.subject && (
                            <p className="text-sm text-gray-500 mb-4">
                                Subject: {notice.content.subject}
                            </p>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    <span className="font-medium">Error:</span> {error}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={closeModal}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[120px] justify-center"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Notice'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NoticeDeleteButton;







