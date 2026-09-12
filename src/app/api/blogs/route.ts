import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

const INITIAL_SEED_BLOGS = [
    {
        title: "The Importance of Quality Education",
        slug: "the-importance-of-quality-education",
        description: "Discover how quality education helps students build a strong foundation for their academic and personal growth.",
        category: "Education",
        author: "School Administration",
        authorEmail: "admin@edumanage.com",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
        tags: ["Education", "Learning", "Academic", "Future"],
        status: "published",
        featured: true,
        views: 142,
        content: `Quality education plays an important role in shaping the future of students and society. It provides students with the knowledge, skills, confidence, and values they need to succeed in life.

A good educational environment encourages students to ask questions, explore new ideas, solve problems, and develop critical thinking skills. Schools play an important role in creating this environment through experienced teachers, modern facilities, and effective learning methods.

Education is not only about academic results. It also helps students develop communication skills, leadership abilities, teamwork, creativity, discipline, and responsibility.

Our school focuses on providing students with a safe, inclusive, and inspiring environment where every student gets the opportunity to learn and grow.

By combining quality teaching, modern technology, extracurricular activities, and personal guidance, we aim to prepare our students for higher education, professional careers, and responsible citizenship.`,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "How Technology & AI Are Changing Education",
        slug: "how-technology-and-ai-are-changing-education",
        description: "Learn how modern technology, AI study tools, and smart digital classrooms are transforming learning experiences for students.",
        category: "Technology",
        author: "Technology Department",
        authorEmail: "admin@edumanage.com",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        tags: ["Technology", "AI", "Artificial Intelligence", "EdTech", "Innovation", "Digital Learning", "Smart Classroom"],
        status: "published",
        featured: false,
        views: 98,
        content: `Technology and Artificial Intelligence (AI) have become an essential part of modern education. Digital tools and smart learning assistants are helping teachers provide more interactive, engaging, and personalized learning experiences.

Online resources, digital classrooms, smart boards, educational applications, and learning management systems allow students to access high-quality educational materials more easily.

Technology also makes it easier for teachers to monitor student performance, detect learning difficulties early, and identify areas where students may need additional support.

However, AI and technology should always be used as empowering tools to support teachers and students rather than completely replacing traditional human guidance and interaction.

Our goal is to use AI and technology responsibly to make education more accessible, engaging, and effective for every student.`,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Building a Better Learning Environment",
        slug: "building-a-better-learning-environment",
        description: "A positive and supportive learning environment can improve student engagement, confidence, and performance.",
        category: "Learning",
        author: "Academic Department",
        authorEmail: "admin@edumanage.com",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
        tags: ["Classroom", "Motivation", "Wellbeing", "Growth"],
        status: "published",
        featured: false,
        views: 84,
        content: `A positive learning environment is essential for student success. Students learn better when they feel safe, respected, supported, and motivated.

Teachers can create a better classroom environment by encouraging participation, respecting different opinions, and providing constructive feedback.

Schools should also provide comfortable classrooms, modern learning resources, libraries, laboratories, sports facilities, and opportunities for extracurricular activities.

When students feel connected to their school community, they become more confident and motivated to participate in academic and social activities.

Building a better learning environment is a shared responsibility between students, teachers, parents, and school administrators.`,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "The Role of Teachers in Student Success",
        slug: "the-role-of-teachers-in-student-success",
        description: "Teachers play an important role in guiding students and helping them achieve their academic goals.",
        category: "Teachers",
        author: "Teacher Development Team",
        authorEmail: "admin@edumanage.com",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
        tags: ["Teachers", "Mentorship", "Pedagogy", "Inspiration"],
        status: "published",
        featured: false,
        views: 110,
        content: `Teachers are one of the most important parts of the education system. They guide students academically and help them develop important life skills.

An effective teacher understands that every student is different. Students have different learning styles, interests, strengths, and challenges.

Teachers can help students reach their potential by providing individual guidance, meaningful feedback, and encouragement.

Beyond academic lessons, teachers also help students develop discipline, communication, teamwork, leadership, and problem-solving skills.

A strong relationship between teachers and students creates a supportive environment where students feel comfortable asking questions and seeking help.`,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Preparing Students for the Future",
        slug: "preparing-students-for-the-future",
        description: "Explore how schools can prepare students with the skills they need to succeed in a rapidly changing world.",
        category: "Future",
        author: "Career Development Team",
        authorEmail: "admin@edumanage.com",
        image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1200&auto=format&fit=crop",
        tags: ["Future Skills", "Career", "Innovation", "Preparation"],
        status: "published",
        featured: false,
        views: 76,
        content: `The world is changing rapidly, and students need more than traditional academic knowledge to succeed in the future.

Schools should help students develop communication, creativity, critical thinking, collaboration, digital literacy, and problem-solving skills.

Students should also get opportunities to participate in projects, competitions, clubs, presentations, and other practical activities.

Career guidance can help students understand different career opportunities and make informed decisions about their future.

Our education system aims to prepare students not only for examinations but also for real-world challenges and opportunities.`,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Why Extracurricular Activities Matter",
        slug: "why-extracurricular-activities-matter",
        description: "Extracurricular activities help students develop teamwork, leadership, communication, and creativity.",
        category: "Activities",
        author: "Student Activities Department",
        authorEmail: "admin@edumanage.com",
        image: "https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?q=80&w=1471&auto=format&fit=crop",
        tags: ["Activities", "Sports", "Arts", "Teamwork"],
        status: "published",
        featured: false,
        views: 92,
        content: `Extracurricular activities are an important part of a student's overall development. They provide opportunities to learn outside the traditional classroom.

Sports, cultural programs, debates, science clubs, programming clubs, art, music, and volunteer activities can help students discover their interests and talents.

Participation in these activities teaches students teamwork, leadership, discipline, communication, and time management.

These activities also help students build friendships and develop confidence in social situations.

For this reason, our school encourages students to participate in a wide range of extracurricular activities alongside their academic studies.`,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const status = searchParams.get("status");
        const tag = searchParams.get("tag");
        const featured = searchParams.get("featured");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "50", 10);
        const userRole = (searchParams.get("userRole") || req.headers.get("x-user-role") || "").toLowerCase().trim();
        const isAdmin = userRole === "admin";

        const db = await getDatabase();
        const collection = db.collection("Blogs");

        // Auto-seed if empty
        const count = await collection.countDocuments();
        if (count === 0) {
            try {
                await collection.insertMany(INITIAL_SEED_BLOGS);
            } catch (seedErr) {
                console.error("Auto-seed blogs error in Next.js API:", seedErr);
            }
        }

        const filter: any = {};

        // Only show published to public unless admin explicitly requested drafts or all
        if (!isAdmin) {
            filter.status = "published";
        } else if (status && status !== "all") {
            filter.status = status;
        }

        if (category && category !== "All") {
            const escapedCategory = category.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            filter.category = { $regex: new RegExp(`^${escapedCategory}$`, "i") };
        }

        if (tag && tag !== "All") {
            const escapedTag = tag.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            filter.tags = { $regex: new RegExp(`^${escapedTag}$`, "i") };
        }

        if (featured !== null && featured !== undefined) {
            filter.featured = featured === "true";
        }

        if (search && search.trim()) {
            const term = search.trim();
            const safeTerm = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            const words = term.split(/\s+/).filter(Boolean).map(w => w.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));
            const searchTerms = Array.from(new Set([safeTerm, ...words]));
            const regexList = searchTerms.map(t => new RegExp(t, "i"));

            filter.$or = [
                { title: { $in: regexList } },
                { tags: { $in: regexList } }
            ];
        }

        const total = await collection.countDocuments(filter);
        const skip = (page - 1) * limit;
        const blogs = await collection
            .find(filter)
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit) || 1,
            data: blogs
        });
    } catch (error: any) {
        console.error("Error in GET /api/blogs:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            content,
            category = "Education",
            author = "School Administration",
            authorEmail,
            image,
            tags,
            status = "published",
            featured = false
        } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ success: false, message: "Blog title is required." }, { status: 400 });
        }
        if (!content || !content.trim()) {
            return NextResponse.json({ success: false, message: "Blog content is required." }, { status: 400 });
        }

        const cleanSlug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
        const parsedTags = Array.isArray(tags)
            ? tags
            : (typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []);

        const newDoc = {
            title: title.trim(),
            slug: cleanSlug,
            description: description?.trim() || content.trim().slice(0, 160) + "...",
            content: content.trim(),
            category: category.trim(),
            author: author.trim() || "School Administration",
            authorEmail: authorEmail || "admin@edumanage.com",
            image: image?.trim() || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
            tags: parsedTags,
            status: status || "published",
            featured: Boolean(featured),
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const db = await getDatabase();
        const result = await db.collection("Blogs").insertOne(newDoc);

        return NextResponse.json({
            success: true,
            message: "Blog published successfully!",
            data: { _id: result.insertedId, ...newDoc }
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error in POST /api/blogs:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create blog" },
            { status: 500 }
        );
    }
}





