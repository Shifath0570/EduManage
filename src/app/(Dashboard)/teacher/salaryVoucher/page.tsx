"use client";

import { useEffect, useState, useRef } from "react";
import { authClient } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/api";
import {
  FileText,
  Download,
  Calendar,
  CreditCard,
  Building,
  User,
  GraduationCap,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface SalaryItem {
  _id: string;
  teacherId: string;
  employeeId: string;
  fullName: string;
  month: string;
  baseSalary: number;
  paidAmount: number;
  paymentMethod: string;
  status: string;
  remarks: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SalaryData {
  _id: string;
  teacherId: string;
  salaries: SalaryItem[];
}

const Page = () => {
  const { data: session, isPending } = authClient.useSession();
  const voucherRef = useRef<HTMLDivElement>(null);

  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const teacherId =
    (session?.user as { teacherId?: string; id?: string } | undefined)?.teacherId ||
    session?.user?.id ||
    "6aa007f58be90e8c496da101";

  useEffect(() => {
    if (!teacherId) return;

    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetchWithAuth(`${baseUrl}/api/salaries/${teacherId}`);
        const result = await res.json();

        if (res.ok && result.success) {
          setSalaryData(result.data);
          if (result.data?.salaries?.length > 0) {
            setSelectedMonth(result.data.salaries[0].month);
          }
        } else {
          setError(result.message || "Failed to fetch salary details.");
        }
      } catch (err) {
        setError("An error occurred while fetching salary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [teacherId]);

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;

    try {
      setDownloading(true);

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(voucherRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector("[data-voucher]") as HTMLElement;
          if (clonedElement) {
            clonedElement.style.backgroundColor = "#ffffff";
            clonedElement.style.color = "#000000";
          }

          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            const computed = window.getComputedStyle(element);

            element.style.color =
              computed.color.includes("lab") || computed.color.includes("oklch")
                ? "#000000"
                : computed.color;
            element.style.backgroundColor =
              computed.backgroundColor.includes("lab") ||
              computed.backgroundColor.includes("oklch")
                ? "transparent"
                : computed.backgroundColor;
            element.style.borderColor =
              computed.borderColor.includes("lab") ||
              computed.borderColor.includes("oklch")
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
      pdf.save(`Salary_Voucher_${selectedMonth || "Receipt"}.pdf`);
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
        Loading salary voucher details...
      </div>
    );
  }

  if (error || !salaryData) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "No salary data found."}
      </div>
    );
  }

  const salaries = salaryData.salaries || [];

  // Empty Salary Array Handler
  if (salaries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Salary Records Found</h2>
          <p className="text-sm text-gray-600 mb-4">
            There are no salary transactions available for this teacher record yet.
          </p>
          <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-500 text-left border">
            <p><strong>Teacher ID:</strong> {salaryData.teacherId}</p>
            <p><strong>Record ID:</strong> {salaryData._id}</p>
          </div>
        </div>
      </div>
    );
  }

  const availableMonths = Array.from(new Set(salaries.map((item) => item.month)));
  const selectedSalaryList = salaries.filter((item) => item.month === selectedMonth);

  const totalBase = selectedSalaryList.reduce((sum, item) => sum + item.baseSalary, 0);
  const totalPaid = selectedSalaryList.reduce((sum, item) => sum + item.paidAmount, 0);
  const teacherInfo = selectedSalaryList[0] || salaries[0];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      {/* Control Bar: Month Selector on Left, Download Button on Right */}
      <div className="w-full max-w-2xl mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label htmlFor="month-select" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Select Month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 text-sm font-medium shadow-sm"
        >
          {downloading ? "Generating PDF..." : "Download Voucher"}
        </button>
      </div>

      {/* Voucher Container for PDF Snapshot */}
      <div
        ref={voucherRef}
        data-voucher
        className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              EDUMANAGE SCHOOL & COLLEGE
            </h1>
            <h2 className="text-xl text-gray-600 font-semibold">
              SALARY RECEIPT VOUCHER
            </h2>
            <p className="text-sm text-gray-500">Receipt ID: {salaryData._id}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            {selectedMonth}
          </span>
        </div>

        {/* Teacher Info */}
        {teacherInfo && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm w-full">
              <div>
                <span className="font-semibold text-gray-600">Employee Name:</span>{" "}
                {teacherInfo.fullName}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Employee ID:</span>{" "}
                {teacherInfo.employeeId}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Teacher ID:</span>{" "}
                {salaryData.teacherId}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Month:</span>{" "}
                {selectedMonth}
              </div>
            </div>
          </div>
        )}

        {/* Salary Summary */}
        <div className="mb-6">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Fee Summary ({selectedMonth})
          </h2>
          <div className="border rounded-md overflow-hidden">
            <div className="flex justify-between px-4 py-2 bg-gray-50 text-sm font-medium border-b">
              <span>Description</span>
              <span>Amount (BDT)</span>
            </div>
            <div className="flex justify-between px-4 py-2 border-b text-sm">
              <span>Base Salary</span>
              <span>৳{totalBase}</span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-gray-50 text-sm font-bold text-green-600">
              <span>Paid Amount</span>
              <span>৳{totalPaid}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Transaction Details
          </h2>
          {selectedSalaryList.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">
              No salary record found for {selectedMonth}.
            </p>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-2 text-gray-600">Payment Date</th>
                  <th className="p-2 text-gray-600">Method</th>
                  <th className="p-2 text-gray-600">Remarks</th>
                  <th className="p-2 text-gray-600 text-right">Paid Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedSalaryList.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2">
                      {new Date(item.paymentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-2">{item.paymentMethod}</td>
                    <td className="p-2">{item.remarks}</td>
                    <td className="p-2 text-right font-medium text-green-600">
                      ৳{item.paidAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
          Generated automatically on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Page;