export interface Blog {
    id: number;
    title: string;
    description: string;
    category: string;
    date: string;
    author: string;
    image: string;
    content: string[];
}

export const blogs: Blog[] = [
    {
        id: 1,
        title: "The Importance of Quality Education",
        description:
            "Discover how quality education helps students build a strong foundation for their academic and personal growth.",
        category: "Education",
        date: "August 15, 2026",
        author: "School Administration",
        image:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
        content: [
            "Quality education plays an important role in shaping the future of students and society. It provides students with the knowledge, skills, confidence, and values they need to succeed in life.",
            "A good educational environment encourages students to ask questions, explore new ideas, solve problems, and develop critical thinking skills. Schools play an important role in creating this environment through experienced teachers, modern facilities, and effective learning methods.",
            "Education is not only about academic results. It also helps students develop communication skills, leadership abilities, teamwork, creativity, discipline, and responsibility.",
            "Our school focuses on providing students with a safe, inclusive, and inspiring environment where every student gets the opportunity to learn and grow.",
            "By combining quality teaching, modern technology, extracurricular activities, and personal guidance, we aim to prepare our students for higher education, professional careers, and responsible citizenship.",
        ],
    },

    {
        id: 2,
        title: "How Technology Is Changing Education",
        description:
            "Learn how modern technology is transforming classrooms and creating better learning experiences for students.",
        category: "Technology",
        date: "August 12, 2026",
        author: "Technology Department",
        image:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        content: [
            "Technology has become an important part of modern education. Digital tools are helping teachers provide more interactive and engaging learning experiences.",
            "Online resources, digital classrooms, smart boards, educational applications, and learning management systems allow students to access educational materials more easily.",
            "Technology also makes it easier for teachers to monitor student performance and identify areas where students may need additional support.",
            "However, technology should be used as a tool to support teachers and students rather than completely replacing traditional learning methods.",
            "Our goal is to use technology responsibly to make education more accessible, engaging, and effective for every student.",
        ],
    },

    {
        id: 3,
        title: "Building a Better Learning Environment",
        description:
            "A positive and supportive learning environment can improve student engagement, confidence, and performance.",
        category: "Learning",
        date: "August 10, 2026",
        author: "Academic Department",
        image:
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
        content: [
            "A positive learning environment is essential for student success. Students learn better when they feel safe, respected, supported, and motivated.",
            "Teachers can create a better classroom environment by encouraging participation, respecting different opinions, and providing constructive feedback.",
            "Schools should also provide comfortable classrooms, modern learning resources, libraries, laboratories, sports facilities, and opportunities for extracurricular activities.",
            "When students feel connected to their school community, they become more confident and motivated to participate in academic and social activities.",
            "Building a better learning environment is a shared responsibility between students, teachers, parents, and school administrators.",
        ],
    },

    {
        id: 4,
        title: "The Role of Teachers in Student Success",
        description:
            "Teachers play an important role in guiding students and helping them achieve their academic goals.",
        category: "Teachers",
        date: "August 7, 2026",
        author: "Teacher Development Team",
        image:
            "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
        content: [
            "Teachers are one of the most important parts of the education system. They guide students academically and help them develop important life skills.",
            "An effective teacher understands that every student is different. Students have different learning styles, interests, strengths, and challenges.",
            "Teachers can help students reach their potential by providing individual guidance, meaningful feedback, and encouragement.",
            "Beyond academic lessons, teachers also help students develop discipline, communication, teamwork, leadership, and problem-solving skills.",
            "A strong relationship between teachers and students creates a supportive environment where students feel comfortable asking questions and seeking help.",
        ],
    },

    {
        id: 5,
        title: "Preparing Students for the Future",
        description:
            "Explore how schools can prepare students with the skills they need to succeed in a rapidly changing world.",
        category: "Future",
        date: "August 5, 2026",
        author: "Career Development Team",
        image:
            "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1200&auto=format&fit=crop",
        content: [
            "The world is changing rapidly, and students need more than traditional academic knowledge to succeed in the future.",
            "Schools should help students develop communication, creativity, critical thinking, collaboration, digital literacy, and problem-solving skills.",
            "Students should also get opportunities to participate in projects, competitions, clubs, presentations, and other practical activities.",
            "Career guidance can help students understand different career opportunities and make informed decisions about their future.",
            "Our education system aims to prepare students not only for examinations but also for real-world challenges and opportunities.",
        ],
    },

    {
        id: 6,
        title: "Why Extracurricular Activities Matter",
        description:
            "Extracurricular activities help students develop teamwork, leadership, communication, and creativity.",
        category: "Activities",
        date: "August 2, 2026",
        author: "Student Activities Department",
        image:"https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        content: [
            "Extracurricular activities are an important part of a student's overall development. They provide opportunities to learn outside the traditional classroom.",
            "Sports, cultural programs, debates, science clubs, programming clubs, art, music, and volunteer activities can help students discover their interests and talents.",
            "Participation in these activities teaches students teamwork, leadership, discipline, communication, and time management.",
            "These activities also help students build friendships and develop confidence in social situations.",
            "For this reason, our school encourages students to participate in a wide range of extracurricular activities alongside their academic studies.",
        ],
    },
];