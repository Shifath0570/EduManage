import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const userRole = (body.userRole || req.headers.get("x-user-role") || "").toLowerCase().trim();
    const isAdmin = userRole === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Access denied: Only administrators can update contact messages." },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid message ID." }, { status: 400 });
    }

    const { status, notes } = body;
    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const db = await getDatabase();
    const result = await db.collection("ContactMessages").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ success: false, message: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Message status updated successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/contact/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update contact message." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userRole = (req.headers.get("x-user-role") || "").toLowerCase().trim();
    const isAdmin = userRole === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Access denied: Only administrators can delete contact messages." },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid message ID." }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection("ContactMessages").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/contact/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete contact message." },
      { status: 500 }
    );
  }
}
