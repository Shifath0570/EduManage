import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, role, subject, message } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "Your name is required." }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: "Your email address is required." }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ success: false, message: "Message subject is required." }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, message: "Message content is required." }, { status: 400 });
    }

    const newDoc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      role: role?.trim() || "School Administrator",
      subject: subject.trim(),
      message: message.trim(),
      status: "unread",
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const db = await getDatabase();
    const result = await db.collection("ContactMessages").insertOne(newDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully. Our team will contact you shortly!",
        data: { _id: result.insertedId, ...newDoc },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit contact message." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userRole = (searchParams.get("userRole") || req.headers.get("x-user-role") || "").toLowerCase().trim();
    const isAdmin = userRole === "admin";

    // Strictly ensure only admin can view contact messages
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Access denied: Only administrators can view contact messages." },
        { status: 403 }
      );
    }

    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (role && role !== "all") {
      filter.role = { $regex: new RegExp(`^${role.trim()}$`, "i") };
    }

    if (search && search.trim()) {
      const term = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const words = search.trim().split(/\s+/).filter(Boolean).map(w => w.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));
      const regexList = Array.from(new Set([term, ...words])).map(t => new RegExp(t, "i"));

      filter.$or = [
        { name: { $in: regexList } },
        { email: { $in: regexList } },
        { phone: { $in: regexList } },
        { subject: { $in: regexList } },
        { message: { $in: regexList } },
      ];
    }

    const db = await getDatabase();
    const collection = db.collection("ContactMessages");

    const total = await collection.countDocuments(filter);
    const unreadCount = await collection.countDocuments({ status: "unread" });
    const skip = (page - 1) * limit;

    const messages = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: messages,
    });
  } catch (error: any) {
    console.error("Error in GET /api/contact:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch contact messages." },
      { status: 500 }
    );
  }
}
