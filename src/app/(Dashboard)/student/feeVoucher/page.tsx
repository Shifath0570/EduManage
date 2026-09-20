"use client";

import { useEffect, useState, useRef } from "react";
import { authClient } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PaymentHistory {
  _id: string;
  studentId: string;
  paidAmount: number;
  paymentMethod: string;
  remarks: string;
  paymentDate: string;
}

interface FeeData {
  _id: string;
  studentId: string;
  name: string;
  roll: string;
  className: string;
  section: string;
  phone: string;
  profileImage: string;
  status: string;
  totalFee: number;
  totalPaid: number;
  dueAmount: number;
  paymentStatus: string;
  paymentHistory: PaymentHistory[];
}

const Page = () => {
  const { data: session, isPending } = authClient.useSession();
  const voucherRef = useRef<HTMLDivElement>(null);

  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const studentIdentifier =
    (session?.user as { studentId?: string; id?: string } | undefined)?.studentId ||
    session?.user?.id ||
    null;

  useEffect(() => {
    if (!studentIdentifier) return;

    const fetchFeeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/fees/${studentIdentifier}`
        );
        const result = await res.json();

        if (res.ok && result.success) {
          setFeeData(result.data);
        } else {
          setError(result.message || "Failed to fetch fee details.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, [studentIdentifier]);

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;

    try {
      setDownloading(true);

      // Dynamic imports prevent SSR / bundling conflicts
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(voucherRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Force-inline plain hex/rgb fallbacks to prevent lab() color syntax crashes
          const clonedElement = clonedDoc.querySelector("[data-voucher]") as HTMLElement;
          if (clonedElement) {
            clonedElement.style.backgroundColor = "#ffffff";
            clonedElement.style.color = "#000000";
          }

          // Override all elements with computed styles to strip modern color functions
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            const computed = window.getComputedStyle(element);

            // Force safe color values
            element.style.color = computed.color.includes("lab") || computed.color.includes("oklch")
              ? "#000000"
              : computed.color;
            element.style.backgroundColor = computed.backgroundColor.includes("lab") || computed.backgroundColor.includes("oklch")
              ? "transparent"
              : computed.backgroundColor;
            element.style.borderColor = computed.borderColor.includes("lab") || computed.borderColor.includes("oklch")
              ? "#e5e7eb"
              : computed.borderColor;
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Fee_Receipt_${feeData?.studentId || "Voucher"}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to download PDF voucher.");
    } finally {
      setDownloading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading receipt details...
      </div>
    );
  }

  if (error || !feeData) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "No data found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      {/* Voucher Card Container */}
      <div
        ref={voucherRef}
        className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              EDUMANAGE SCHOOL & COLLEGE
            </h1>
            <h1 className="text-xl  text-gray-600">
              FEE RECEIPT VOUCHER
            </h1>
            <p className="text-sm text-gray-500">Receipt ID: {feeData._id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${feeData.paymentStatus === "Paid"
                ? "bg-green-100 text-green-800"
                : feeData.paymentStatus === "Partial"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
          >
            {feeData.paymentStatus} Payment
          </span>
        </div>

        {/* Student Info Section */}
        <div className="flex items-center space-x-4 mb-6 bg-gray-50 p-4 rounded-md">
          {feeData.profileImage && (
            <img
              src={feeData.profileImage}
              alt={feeData.name}
              crossOrigin="anonymous"
              className="w-16 h-16 rounded-full object-cover border"
            />
          )}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm w-full">
            <div>
              <span className="font-semibold text-gray-600">Name:</span>{" "}
              {feeData.name}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Student ID:</span>{" "}
              {feeData.studentId}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Roll:</span>{" "}
              {feeData.roll}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Class:</span>{" "}
              {feeData.className} ({feeData.section})
            </div>
            <div>
              <span className="font-semibold text-gray-600">Phone:</span>{" "}
              {feeData.phone}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Status:</span>{" "}
              {feeData.status}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mb-6">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Fee Summary
          </h2>
          <div className="border rounded-md overflow-hidden">
            <div className="flex justify-between px-4 py-2 bg-gray-50 text-sm font-medium border-b">
              <span>Description</span>
              <span>Amount (BDT)</span>
            </div>
            <div className="flex justify-between px-4 py-2 border-b text-sm">
              <span>Total Fee</span>
              <span>৳{feeData.totalFee}</span>
            </div>
            <div className="flex justify-between px-4 py-2 border-b text-sm text-green-600 font-medium">
              <span>Total Paid</span>
              <span>৳{feeData.totalPaid}</span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-gray-50 text-sm font-bold text-red-600">
              <span>Due Amount</span>
              <span>৳{feeData.dueAmount}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Transaction History
          </h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2 text-gray-600">Date</th>
                <th className="p-2 text-gray-600">Method</th>
                <th className="p-2 text-gray-600 text-right">Paid Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeData.paymentHistory.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">
                    {new Date(item.paymentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-2">{item.paymentMethod}</td>
                  <td className="p-2 text-right font-medium text-green-600">
                    ৳{item.paidAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
          Generated automatically on {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Download Button */}
      <div className="w-full max-w-2xl mt-4 flex justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {downloading ? "Generating PDF..." : "Download Voucher"}
        </button>
      </div>
    </div>
  );
};

export default Page;