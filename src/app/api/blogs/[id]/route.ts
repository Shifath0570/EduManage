import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const db = await getDatabase();
        const collection = db.collection("Blogs");

        let blog = null;

        if (ObjectId.isValid(id)) {
            blog = await collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $inc: { views: 1 } },
                { returnDocument: "after" }
            );
        }

        if (!blog) {
            blog = await collection.findOneAndUpdate(
                { slug: id },
                { $inc: { views: 1 } },
                { returnDocument: "after" }
            );
        }

        if (!blog && !isNaN(Number(id))) {
            const index = Number(id) - 1;
            const all = await collection.find({ status: "published" }).sort({ createdAt: 1 }).toArray();
            if (all[index]) {
                blog = await collection.findOneAndUpdate(
                    { _id: all[index]._id },
                    { $inc: { views: 1 } },
                    { returnDocument: "after" }
                );
            }
        }

        if (!blog) {
            return NextResponse.json(
                { success: false, message: "Blog article not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: blog
        });
    } catch (error: any) {
        console.error("Error in GET /api/blogs/[id]:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch blog details" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const {
            title,
            description,
            content,
            category,
            author,
            authorEmail,
            image,
            tags,
            status,
            featured
        } = body;

        const updateData: any = {};
        if (title) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (content !== undefined) updateData.content = content.trim();
        if (category) updateData.category = category.trim();
        if (author) updateData.author = author.trim();
        if (authorEmail) updateData.authorEmail = authorEmail.trim();
        if (image) updateData.image = image.trim();
        if (status) updateData.status = status;
        if (featured !== undefined) updateData.featured = Boolean(featured);

        if (tags !== undefined) {
            updateData.tags = Array.isArray(tags)
                ? tags
                : (typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []);
        }

        updateData.updatedAt = new Date();

        const db = await getDatabase();
        const collection = db.collection("Blogs");

        let filter: any = null;
        if (ObjectId.isValid(id)) {
            filter = { _id: new ObjectId(id) };
        } else {
            filter = { slug: id };
        }

        const updatedBlog = await collection.findOneAndUpdate(
            filter,
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!updatedBlog) {
            return NextResponse.json(
                { success: false, message: "Blog article not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Blog updated successfully!",
            data: updatedBlog
        });
    } catch (error: any) {
        console.error("Error in PUT /api/blogs/[id]:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update blog" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const db = await getDatabase();
        const collection = db.collection("Blogs");

        let filter: any = null;
        if (ObjectId.isValid(id)) {
            filter = { _id: new ObjectId(id) };
        } else {
            filter = { slug: id };
        }

        const result = await collection.deleteOne(filter);

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Blog article not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Blog deleted successfully."
        });
    } catch (error: any) {
        console.error("Error in DELETE /api/blogs/[id]:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to delete blog" },
            { status: 500 }
        );
    }
}
