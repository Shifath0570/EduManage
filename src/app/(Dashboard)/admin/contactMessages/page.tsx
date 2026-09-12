"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/app/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Building2,
  School,
  Users,
  Headphones,
  Reply,
  Sparkles,
  ChevronRight,
  X,
  Inbox,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactMessagesPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("userRole", "admin");
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      let res = await fetch(`/api/contact?${params.toString()}`, {
        headers: { "x-user-role": "admin" },
      });

      if (!res.ok && process.env.NEXT_PUBLIC_API_URL) {
        try {
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact?${params.toString()}`, {
            headers: { "x-user-role": "admin" },
          });
        } catch {
          // ignore
        }
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMessages(data.data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      toast.error("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, roleFilter, searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Update status
  const handleUpdateStatus = async (id: string, newStatus: "unread" | "read" | "replied") => {
    setActionLoading(true);
    try {
      let res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin",
        },
        body: JSON.stringify({ status: newStatus, userRole: "admin" }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Message marked as ${newStatus}.`);
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error updating message.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    setActionLoading(true);
    try {
      let res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": "admin" },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Contact message deleted.");
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } else {
        toast.error(data.message || "Failed to delete message.");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Error deleting message.");
    } finally {
      setActionLoading(false);
    }
  };

  // Open detail modal and mark as read if unread
  const handleOpenMessage = (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      handleUpdateStatus(msg._id, "read");
    }
  };

  // Filter stats
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const repliedCount = messages.filter((m) => m.status === "replied").length;
  const adminRoleCount = messages.filter((m) => m.role.toLowerCase().includes("admin")).length;

  // Render role icon
  const getRoleIcon = (roleName: string) => {
    const lower = roleName.toLowerCase();
    if (lower.includes("admin")) return <Building2 className="h-3.5 w-3.5 text-purple-600" />;
    if (lower.includes("teacher")) return <School className="h-3.5 w-3.5 text-teal-600" />;
    if (lower.includes("parent")) return <Users className="h-3.5 w-3.5 text-amber-600" />;
    return <Headphones className="h-3.5 w-3.5 text-blue-600" />;
  };

  if (!isPending && !isAdmin && user?.role) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 text-rose-700 m-6">
        <AlertCircle className="h-12 w-12 mx-auto text-rose-500 mb-3" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-sm mt-1 text-slate-600">Only school administrators have permission to view contact inquiries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact & Inquiries <span className="text-emerald-500">Inbox</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Messages and demo requests submitted from the public contact page. Visible only to school administrators.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:bg-slate-50 hover:text-emerald-700 shadow-2xs transition active:scale-95"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* =====================================================
          METRICS OVERVIEW CARDS
      ====================================================== */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Inquiries */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Received</span>
            <Inbox className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">All contact submissions</p>
        </div>

        {/* Unread */}
        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Unread</span>
            <Mail className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">{unreadCount}</p>
          <p className="text-[11px] text-amber-600/90 mt-0.5">Requires review</p>
        </div>

        {/* Replied */}
        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Responded</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{repliedCount}</p>
          <p className="text-[11px] text-emerald-600/90 mt-0.5">Resolved inquiries</p>
        </div>

        {/* Administrator Roles */}
        <div className="rounded-3xl border border-purple-200/80 bg-purple-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">School Admins</span>
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-700">{adminRoleCount}</p>
          <p className="text-[11px] text-purple-600/90 mt-0.5">Principal / Admin leads</p>
        </div>
      </div>

      {/* =====================================================
          FILTER & SEARCH CONTROLS
      ====================================================== */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, subject, phone..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="School Administrator">School Administrator</option>
              <option value="Teacher / Faculty">Teacher / Faculty</option>
              <option value="Parent / Guardian">Parent / Guardian</option>
              <option value="Student">Student</option>
            </select>
          </div>

        </div>
      </div>

      {/* =====================================================
          MESSAGES LIST
      ====================================================== */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading contact inquiries...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center space-y-3">
          <Inbox className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No contact inquiries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" || roleFilter !== "all"
              ? "Try resetting your search or filter options."
              : "When visitors fill the contact form on your website, their messages will appear here in real time."}
          </p>
          {(searchQuery || statusFilter !== "all" || roleFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setRoleFilter("all");
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isUnread = msg.status === "unread";
            const isReplied = msg.status === "replied";

            return (
              <motion.div
                key={msg._id}
                whileHover={{ y: -2 }}
                onClick={() => handleOpenMessage(msg)}
                className={`group cursor-pointer rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${
                  isUnread
                    ? "border-emerald-300 bg-white shadow-md shadow-emerald-900/5 hover:border-emerald-500"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  
                  {/* Sender Info & Role */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isUnread
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {isUnread ? <Mail className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                        
                        {/* Role Chip */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          {getRoleIcon(msg.role)}
                          <span>{msg.role}</span>
                        </span>

                        {/* Status Chip */}
                        {isUnread && (
                          <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">
                            NEW
                          </span>
                        )}
                        {isReplied && (
                          <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                            REPLIED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span>{msg.email}</span>
                        {msg.phone && (
                          <>
                            <span>•</span>
                            <span>{msg.phone}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(msg.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(msg._id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* Subject & Preview */}
                <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          MESSAGE DETAIL MODAL
      ====================================================== */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xs">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Inquiry Details</h3>
                    <p className="text-xs text-slate-400">
                      Received {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Sender Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-[#FAFDFA] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-400 block text-[11px]">SENDER NAME</span>
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mt-0.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {selectedMessage.name}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400 block text-[11px]">ROLE</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                      {getRoleIcon(selectedMessage.role)}
                      {selectedMessage.role}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400 block text-[11px]">EMAIL ADDRESS</span>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Mail className="h-3.5 w-3.5 text-emerald-500" />
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400 block text-[11px]">PHONE NUMBER</span>
                    {selectedMessage.phone ? (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="font-bold text-slate-700 hover:underline flex items-center gap-1.5 mt-0.5"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {selectedMessage.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400 mt-0.5 block">Not provided</span>
                    )}
                  </div>
                </div>

                {/* Subject & Message Content */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Subject
                  </label>
                  <h4 className="text-base font-extrabold text-slate-900 mb-3">
                    {selectedMessage.subject}
                  </h4>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Message Body
                  </label>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                    {selectedMessage.message}
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 p-5">
                <div className="flex items-center gap-2">
                  {selectedMessage.status !== "replied" ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedMessage._id, "replied")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Mark as Replied
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedMessage._id, "unread")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                    >
                      Mark as Unread
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>

                {/* Direct Mailto Action */}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  onClick={() => handleUpdateStatus(selectedMessage._id, "replied")}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition hover:scale-105 active:scale-95"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply via Email</span>
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
