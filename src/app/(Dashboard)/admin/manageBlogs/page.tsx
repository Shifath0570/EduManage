"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    BookOpen,
    Sparkles,
    Upload,
    Image as ImageIcon,
    Trash2,
    Edit3,
    Eye,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    RotateCcw,
    Plus,
    X,
    ExternalLink,
    Wand2,
    FileText,
    Layers,
    Share2,
    RefreshCw,
    AlertCircle,
    Flame
} from "lucide-react";
import { toast } from "react-hot-toast";

interface BlogItem {
    _id: string;
    title: string;
    slug?: string;
    description: string;
    content: string;
    category: string;
    author: string;
    authorEmail?: string;
    image: string;
    tags: string[];
    status: "published" | "draft" | "archived";
    featured?: boolean;
    views: number;
    createdAt: string;
}

const CATEGORY_OPTIONS = [
    "Education",
    "Technology",
    "Teachers",
    "Student Life",
    "Activities",
    "Learning",
    "Future",
    "School News",
    "Achievements"
];

const TONE_OPTIONS = [
    "Inspirational and Educational",
    "Informative and Academic",
    "Engaging and Conversational",
    "Storytelling and Reflective",
    "Official Announcement"
];

const AUDIENCE_OPTIONS = [
    "Students, Teachers & Parents",
    "Students & Youth",
    "Teachers & Faculty",
    "Parents & Guardians",
    "General Public"
];

export default function AdminManageBlogsPage() {
    const [activeTab, setActiveTab] = useState<"studio" | "list">("studio");
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Education");
    const [customCategory, setCustomCategory] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("School Administration");
    const [tagsInput, setTagsInput] = useState("Education, Learning, School");
    const [image, setImage] = useState("https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop");
    const [status, setStatus] = useState<"published" | "draft">("published");
    const [featured, setFeatured] = useState(false);

    // Image Upload State
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI Generation Modal / State
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiTopic, setAiTopic] = useState("");
    const [aiCategory, setAiCategory] = useState("Education");
    const [aiTone, setAiTone] = useState("Inspirational and Educational");
    const [aiAudience, setAiAudience] = useState("Students, Teachers & Parents");
    const [aiKeywords, setAiKeywords] = useState("");
    const [generatingAi, setGeneratingAi] = useState(false);
    const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
    const [generatingTitles, setGeneratingTitles] = useState(false);

    // Content Editor Mode
    const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "split">("edit");

    // Filter list state
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Use Next.js internal API routes by default for seamless hosting and reliability
    const API_BASE = "";
    const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

    // Fetch all blogs for admin list
    const fetchBlogs = useCallback(async () => {
        setLoadingList(true);
        try {
            const params = new URLSearchParams();
            params.append("userRole", "admin");
            if (filterCategory !== "All") params.append("category", filterCategory);
            if (filterStatus !== "all") params.append("status", filterStatus);
            if (searchQuery.trim()) params.append("search", searchQuery.trim());

            let res = await fetch(`/api/blogs?${params.toString()}`, {
                headers: { "x-user-role": "admin" }
            });

            // If local route returns 404 or fails, fallback to configured NEXT_PUBLIC_API_URL if present
            if (!res.ok && process.env.NEXT_PUBLIC_API_URL) {
                try {
                    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${params.toString()}`, {
                        headers: { "x-user-role": "admin" }
                    });
                } catch {
                    // ignore
                }
            }

            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setBlogs(data.data);
            } else {
                setBlogs([]);
            }
        } catch (err) {
            console.error("Error fetching blogs:", err);
            toast.error("Failed to load school blogs.");
        } finally {
            setLoadingList(false);
        }
    }, [filterCategory, filterStatus, searchQuery]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Handle Image Upload to ImgBB
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            toast.error("Image file size should be less than 15MB.");
            return;
        }

        setUploadingImage(true);
        setUploadProgress(20);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const uploadUrl = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;
            setUploadProgress(50);

            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            setUploadProgress(90);

            if (data.success && data.data?.url) {
                const uploadedUrl = data.data.display_url || data.data.url;
                setImage(uploadedUrl);
                toast.success("Cover image uploaded successfully!");
            } else {
                throw new Error(data.error?.message || "Image upload failed");
            }
        } catch (error: any) {
            console.error("Image upload error:", error);
            toast.error(error.message || "Failed to upload image. You can also paste an image URL directly.");
        } finally {
            setUploadingImage(false);
            setUploadProgress(0);
        }
    };

    // AI Full Article Generation
    const handleGenerateAiArticle = async () => {
        if (!aiTopic.trim()) {
            toast.error("Please enter a blog topic or prompt for AI generation.");
            return;
        }

        setGeneratingAi(true);
        try {
            const res = await fetch(`${API_BASE}/api/blogs/ai-generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": "admin"
                },
                body: JSON.stringify({
                    topic: aiTopic,
                    category: aiCategory,
                    tone: aiTone,
                    targetAudience: aiAudience,
                    keywords: aiKeywords,
                    action: "full_article"
                })
            });

            const result = await res.json();
            if (result.success && result.data) {
                const aiData = result.data;
                setTitle(aiData.title || title);
                setDescription(aiData.description || description);
                setContent(aiData.content || content);
                if (aiData.category) setCategory(aiData.category);
                if (Array.isArray(aiData.tags) && aiData.tags.length > 0) {
                    setTagsInput(aiData.tags.join(", "));
                }

                setShowAiModal(false);
                toast.success("✨ AI generated your blog draft successfully!");
            } else {
                throw new Error(result.message || "AI generation failed");
            }
        } catch (err: any) {
            console.error("AI Generation error:", err);
            toast.error(err.message || "Gemini AI generation failed. Please try again.");
        } finally {
            setGeneratingAi(false);
        }
    };

    // AI Polish Draft
    const handlePolishDraft = async () => {
        if (!content.trim()) {
            toast.error("Please write some content first to polish with AI.");
            return;
        }

        setGeneratingAi(true);
        try {
            const res = await fetch(`${API_BASE}/api/blogs/ai-generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": "admin"
                },
                body: JSON.stringify({
                    topic: title || "Educational Article",
                    existingDraft: content,
                    category,
                    tone: "Engaging and Clear",
                    action: "polish_draft"
                })
            });

            const result = await res.json();
            if (result.success && result.data) {
                if (result.data.title) setTitle(result.data.title);
                if (result.data.description) setDescription(result.data.description);
                if (result.data.content) setContent(result.data.content);
                toast.success("✨ Draft polished and formatted by Gemini AI!");
            } else {
                throw new Error(result.message || "Failed to polish draft");
            }
        } catch (err: any) {
            toast.error(err.message || "AI polishing failed.");
        } finally {
            setGeneratingAi(false);
        }
    };

    // AI Suggest Titles
    const handleSuggestTitles = async () => {
        if (!title && !aiTopic) {
            toast.error("Enter a topic or working title first.");
            return;
        }

        setGeneratingTitles(true);
        try {
            const res = await fetch(`${API_BASE}/api/blogs/ai-generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": "admin"
                },
                body: JSON.stringify({
                    topic: title || aiTopic,
                    category,
                    action: "suggest_titles"
                })
            });

            const result = await res.json();
            if (result.success && result.data?.titles) {
                setSuggestedTitles(result.data.titles);
                toast.success("AI generated 5 title ideas!");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingTitles(false);
        }
    };

    // Handle Submit / Save Blog
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a blog title.");
            return;
        }

        if (!content.trim()) {
            toast.error("Please provide content for the blog article.");
            return;
        }

        const effectiveCategory = category === "Custom" ? (customCategory.trim() || "Education") : category;
        const parsedTags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);

        const payload = {
            title: title.trim(),
            description: description.trim() || content.trim().slice(0, 160) + "...",
            content: content.trim(),
            category: effectiveCategory,
            author: author.trim() || "School Administration",
            image: image.trim(),
            tags: parsedTags,
            status,
            featured,
            userRole: "admin"
        };

        setSubmitting(true);
        try {
            const url = editingId ? `${API_BASE}/api/blogs/${editingId}` : `${API_BASE}/api/blogs`;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": "admin"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? "Blog updated successfully!" : "Blog published successfully!");
                handleResetForm();
                fetchBlogs();
                setActiveTab("list");
            } else {
                throw new Error(data.message || "Failed to save blog");
            }
        } catch (err: any) {
            console.error("Submit blog error:", err);
            toast.error(err.message || "Failed to publish blog article.");
        } finally {
            setSubmitting(false);
        }
    };

    // Load Blog into Editor for Edit
    const handleEditBlog = (blog: BlogItem) => {
        setEditingId(blog._id);
        setTitle(blog.title);
        setDescription(blog.description);
        setContent(blog.content);
        if (CATEGORY_OPTIONS.includes(blog.category)) {
            setCategory(blog.category);
            setCustomCategory("");
        } else {
            setCategory("Custom");
            setCustomCategory(blog.category);
        }
        setAuthor(blog.author || "School Administration");
        setImage(blog.image || "");
        setTagsInput(Array.isArray(blog.tags) ? blog.tags.join(", ") : "");
        setStatus(blog.status === "draft" ? "draft" : "published");
        setFeatured(Boolean(blog.featured));
        setActiveTab("studio");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete Blog
    const handleDeleteBlog = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog article? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
                method: "DELETE",
                headers: { "x-user-role": "admin" }
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Blog article deleted successfully.");
                setBlogs(prev => prev.filter(b => b._id !== id));
            } else {
                throw new Error(data.message || "Failed to delete");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to delete blog article.");
        }
    };

    const handleResetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setContent("");
        setCategory("Education");
        setCustomCategory("");
        setAuthor("School Administration");
        setTagsInput("Education, Learning, School");
        setImage("https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop");
        setStatus("published");
        setFeatured(false);
        setSuggestedTitles([]);
    };

    return (
        <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header Card */}
                <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs mt-0.5 sm:mt-0">
                            <BookOpen className="h-6 w-6" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-snug">
                                School Blog <span className="text-emerald-500">Studio & Manager</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                                Compose, edit, and publish school blog articles with image upload and Gemini AI writing assistant.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0 self-start 2xl:self-center">
                        {/* Tab Switcher */}
                        <div className="inline-flex items-center rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200/80 shadow-inner gap-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab("studio")}
                                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === "studio"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                                }`}
                            >
                                <Edit3 className="h-4 w-4" />
                                <span>{editingId ? "Edit Article" : "Write / Studio"}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab("list");
                                    fetchBlogs();
                                }}
                                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === "list"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                                }`}
                            >
                                <Layers className="h-4 w-4" />
                                <span>All Articles</span>
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] rounded-full font-extrabold transition-colors ${
                                    activeTab === "list"
                                        ? "bg-white/25 text-white"
                                        : "bg-slate-200 text-slate-700"
                                }`}>
                                    {blogs.length}
                                </span>
                            </button>
                        </div>

                        {/* Public Link */}
                        <Link
                            href="/blog"
                            target="_blank"
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-700 hover:border-emerald-300 shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <ExternalLink className="h-4 w-4 text-emerald-600" />
                            <span>View Public Blog</span>
                        </Link>
                    </div>
                </div>

                {/* TAB 1: STUDIO (WRITE / EDIT BLOG) */}
                {activeTab === "studio" && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Left Column: Main Editor (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Gemini AI Writing Assistant Banner (Matching Homepage Gradient) */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-[#03204c] p-6 text-white shadow-xl shadow-emerald-950/10 border border-emerald-700/50">
                                <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
                                
                                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs text-amber-300 shadow-xs">
                                                <Sparkles className="h-4 w-4 fill-amber-300 text-amber-300" />
                                            </span>
                                            <h3 className="text-lg font-extrabold text-white">
                                                Gemini AI Blog Writer
                                            </h3>
                                        </div>
                                        <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
                                            Generate complete educational articles from a topic, auto-format sections, or polish your current draft in seconds.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAiTopic(title);
                                                setShowAiModal(true);
                                            }}
                                            className="flex items-center gap-1.5 rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-amber-300 transition shadow-md hover:scale-105"
                                        >
                                            <Wand2 className="h-3.5 w-3.5 text-slate-900" />
                                            Write with AI
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePolishDraft}
                                            disabled={generatingAi}
                                            className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/25 transition border border-white/20 backdrop-blur-md disabled:opacity-50"
                                        >
                                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                                            {generatingAi ? "Enhancing..." : "Polish Draft"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Title & Suggested Titles */}
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-emerald-600" /> Blog Title *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleSuggestTitles}
                                        disabled={generatingTitles}
                                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 disabled:opacity-50"
                                    >
                                        <Sparkles className="h-3 w-3" />
                                        {generatingTitles ? "Thinking..." : "Suggest AI Titles"}
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. How Modern STEM Education Inspires Future Leaders"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                                />

                                {suggestedTitles.length > 0 && (
                                    <div className="mt-2 space-y-1.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                                        <span className="text-[11px] font-bold text-emerald-800">
                                            💡 AI Title Suggestions (click to apply):
                                        </span>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {suggestedTitles.map((t, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setTitle(t)}
                                                    className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-emerald-500 hover:text-emerald-700 text-left transition shadow-2xs"
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Short Summary / Excerpt */}
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Short Description / Excerpt
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        {description.length}/300 chars
                                    </span>
                                </div>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    placeholder="A brief 1-2 sentence hook summarizing the key takeaway of this article..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"
                                />
                            </div>

                            {/* Main Content Area with Edit / Preview Switch */}
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                        <Edit3 className="h-3.5 w-3.5 text-emerald-600" /> Article Content (Markdown Supported) *
                                    </label>

                                    <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewMode("edit")}
                                            className={`rounded-lg px-3 py-1 transition ${
                                                previewMode === "edit"
                                                    ? "bg-white text-emerald-700 shadow-xs"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewMode("preview")}
                                            className={`rounded-lg px-3 py-1 transition ${
                                                previewMode === "preview"
                                                    ? "bg-white text-emerald-700 shadow-xs"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                {previewMode === "edit" ? (
                                    <div className="space-y-2">
                                        {/* Formatting Toolbar */}
                                        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-50 p-2.5 border border-slate-200/80 text-xs text-slate-600">
                                            <button
                                                type="button"
                                                onClick={() => setContent(prev => prev + "\n\n## Section Heading\n")}
                                                className="rounded-lg px-2.5 py-1 hover:bg-slate-200 font-bold"
                                            >
                                                H2 Heading
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setContent(prev => prev + "\n\n### Subheading\n")}
                                                className="rounded-lg px-2.5 py-1 hover:bg-slate-200 font-semibold"
                                            >
                                                H3
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setContent(prev => prev + " **bold text** ")}
                                                className="rounded-lg px-2.5 py-1 hover:bg-slate-200 font-bold"
                                            >
                                                Bold
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setContent(prev => prev + " *italic text* ")}
                                                className="rounded-lg px-2.5 py-1 hover:bg-slate-200 italic"
                                            >
                                                Italic
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setContent(prev => prev + "\n- Bullet item 1\n- Bullet item 2\n")}
                                                className="rounded-lg px-2.5 py-1 hover:bg-slate-200"
                                            >
                                                • List
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setContent(prev => prev + "\n> Inspirational quote or key highlight.\n")}
                                                className="rounded-lg px-2.5 py-1 hover:bg-slate-200"
                                            >
                                                “ Quote
                                            </button>
                                        </div>

                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={14}
                                            placeholder="Write your article here, or use the 'Write with AI' button above to generate a rich draft..."
                                            className="w-full font-mono rounded-2xl border border-slate-200 bg-slate-50/40 p-4 text-xs sm:text-sm leading-relaxed text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
                                        />
                                    </div>
                                ) : (
                                    <div className="min-h-[300px] max-h-[500px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 text-sm leading-relaxed text-slate-700">
                                        {content ? (
                                            content.split("\n\n").map((para, idx) => {
                                                if (para.startsWith("## ")) {
                                                    return (
                                                        <h3 key={idx} className="text-lg font-bold text-slate-900 mt-4 first:mt-0 flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            {para.replace(/^##\s*/, "")}
                                                        </h3>
                                                    );
                                                }
                                                if (para.startsWith("### ")) {
                                                    return (
                                                        <h4 key={idx} className="text-base font-bold text-slate-800 mt-3">
                                                            {para.replace(/^###\s*/, "")}
                                                        </h4>
                                                    );
                                                }
                                                if (para.startsWith("> ")) {
                                                    return (
                                                        <blockquote key={idx} className="border-l-4 border-emerald-500 bg-emerald-50/70 p-3.5 italic text-emerald-950 rounded-r-xl">
                                                            {para.replace(/^>\s*/, "")}
                                                        </blockquote>
                                                    );
                                                }
                                                return <p key={idx}>{para}</p>;
                                            })
                                        ) : (
                                            <p className="text-center text-slate-400 py-10">No content entered yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Metadata & ImgBB Upload (1 col) */}
                        <div className="space-y-6">

                            {/* Publish & Status Card */}
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
                                    Publishing Settings
                                </h3>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    >
                                        <option value="published">🟢 Published (Live for Everyone)</option>
                                        <option value="draft">🟡 Draft (Admin Only)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2.5 pt-1">
                                    <input
                                        type="checkbox"
                                        id="featuredCheck"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                        className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                    />
                                    <label htmlFor="featuredCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                        Set as Featured / Editor's Pick
                                    </label>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Author Name</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="e.g. Principal's Office"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="pt-2 flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {submitting ? "Saving..." : editingId ? "Update Article" : "Publish Article"}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleResetForm}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                                        >
                                            Cancel Editing
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Cover Image Uploader Card */}
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                        <ImageIcon className="h-3.5 w-3.5 text-emerald-600" /> Cover Image
                                    </h3>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Upload Ready
                                    </span>
                                </div>

                                {/* Image Preview */}
                                <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 group">
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt="Cover Preview"
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center text-slate-400 text-xs">
                                            <ImageIcon className="h-8 w-8 mb-1 text-slate-300" />
                                            No cover image selected
                                        </div>
                                    )}

                                    {uploadingImage && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white">
                                            <RefreshCw className="h-6 w-6 animate-spin text-amber-300 mb-2" />
                                            <span className="text-xs font-bold">Uploading image... {uploadProgress}%</span>
                                        </div>
                                    )}
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                {/* Upload Trigger Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                        className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs disabled:opacity-50"
                                    >
                                        <Upload className="h-3.5 w-3.5" />
                                        Upload Image
                                    </button>

                                    {image && (
                                        <button
                                            type="button"
                                            onClick={() => setImage("")}
                                            className="p-2.5 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                            title="Clear Image"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* URL fallback input */}
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                        Or Paste Direct Image URL:
                                    </label>
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://... direct image URL"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Category & Tags Card */}
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
                                    Category & Tags
                                </h3>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    >
                                        {CATEGORY_OPTIONS.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                        <option value="Custom">+ Add Custom Category</option>
                                    </select>
                                </div>

                                {category === "Custom" && (
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Custom Category Name</label>
                                        <input
                                            type="text"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            placeholder="e.g. Science Fair"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Tags (Comma Separated)</label>
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        placeholder="Education, Innovation, HighSchool"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                )}

                {/* TAB 2: ALL ARTICLES LIST */}
                {activeTab === "list" && (
                    <div className="space-y-6">

                        {/* Filter Bar */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                    <Filter className="h-3.5 w-3.5 text-emerald-600" /> Filter Published & Draft Articles
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilterCategory("All");
                                        setFilterStatus("all");
                                        setSearchQuery("");
                                    }}
                                    className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    <RotateCcw className="h-3 w-3" /> Reset
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Search Keyword</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search title, description..."
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Category</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500 font-semibold"
                                    >
                                        <option value="All">All Categories</option>
                                        {CATEGORY_OPTIONS.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500 font-semibold"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Articles Grid */}
                        {loadingList ? (
                            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-sm">
                                Loading school blog articles...
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
                                <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
                                <h3 className="text-base font-bold text-slate-800">No blog articles found</h3>
                                <p className="text-xs text-slate-500">Create your first blog post using the studio editor!</p>
                                <button
                                    onClick={() => setActiveTab("studio")}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20"
                                >
                                    <Plus className="h-4 w-4" /> Create Blog
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {blogs.map((b) => (
                                    <div
                                        key={b._id}
                                        className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-44 w-full bg-slate-100">
                                            {b.image ? (
                                                <Image
                                                    src={b.image}
                                                    alt={b.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-400 text-xs">
                                                    No Image
                                                </div>
                                            )}

                                            <span className="absolute left-3.5 top-3.5 rounded-full bg-emerald-600/90 backdrop-blur-xs px-3 py-1 text-[10px] font-bold text-white shadow-sm">
                                                {b.category}
                                            </span>

                                            {b.featured && (
                                                <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-slate-900 shadow-xs">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-emerald-500" />
                                                        {new Date(b.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                                                            b.status === "published"
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                                        }`}
                                                    >
                                                        {b.status.toUpperCase()}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-emerald-600 transition">
                                                    {b.title}
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {b.description}
                                                </p>
                                            </div>

                                            {/* Action bar */}
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                    <Eye className="h-3.5 w-3.5" /> {b.views || 0} reads
                                                </span>

                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={`/blog/${b.slug || b._id}`}
                                                        target="_blank"
                                                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition"
                                                        title="View Public Post"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditBlog(b)}
                                                        className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                                        title="Edit Article"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteBlog(b._id)}
                                                        className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                                                        title="Delete Article"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                )}

                {/* AI GENERATOR MODAL */}
                {showAiModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                        <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-[#03204c] text-white">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs text-amber-300">
                                        <Sparkles className="h-5 w-5 fill-amber-300 text-amber-300" />
                                    </span>
                                    <div>
                                        <h3 className="text-base font-extrabold">Write Full Article with Gemini AI</h3>
                                        <p className="text-[11px] text-emerald-100">
                                            Provide your topic idea and let AI compose an inspirational blog post.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAiModal(false)}
                                    className="rounded-xl p-1 text-emerald-100 hover:bg-white/10 hover:text-white transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">
                                        Article Topic / Idea *
                                    </label>
                                    <input
                                        type="text"
                                        value={aiTopic}
                                        onChange={(e) => setAiTopic(e.target.value)}
                                        placeholder="e.g. The benefits of integrating AI literacy into primary and secondary curricula"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                                        <select
                                            value={aiCategory}
                                            onChange={(e) => setAiCategory(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                        >
                                            {CATEGORY_OPTIONS.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Writing Tone</label>
                                        <select
                                            value={aiTone}
                                            onChange={(e) => setAiTone(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500"
                                        >
                                            {TONE_OPTIONS.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Target Audience</label>
                                    <select
                                        value={aiAudience}
                                        onChange={(e) => setAiAudience(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500"
                                    >
                                        {AUDIENCE_OPTIONS.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                                        Specific Keywords / Key Points (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={aiKeywords}
                                        onChange={(e) => setAiKeywords(e.target.value)}
                                        placeholder="e.g. critical thinking, future skills, safety"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 p-5 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setShowAiModal(false)}
                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGenerateAiArticle}
                                    disabled={generatingAi}
                                    className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition disabled:opacity-50"
                                >
                                    <Wand2 className="h-3.5 w-3.5 text-amber-300" />
                                    {generatingAi ? "Generating Article with Gemini..." : "Generate Blog Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
