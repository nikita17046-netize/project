const mongoose = require('mongoose');
require('dotenv').config();
const { Course } = require('./models/Schemas');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';

const courses = [
    {
        title: "Advanced React Patterns",
        instructor: "Dr. Logic",
        rating: 4.8,
        students: 1240,
        status: "Active",
        duration: "12h 30m",
        lessons: 24,
        level: "Advanced",
        category: "Development",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8" // React Video
    },
    {
        title: "Full Stack Ecosystems",
        instructor: "Prof. Byte",
        rating: 4.9,
        students: 850,
        status: "Active",
        duration: "22h 15m",
        lessons: 42,
        level: "Intermediate",
        category: "Development",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/nu_pCVPKzTk" // Full Stack Video
    },
    {
        title: "AI & Neural Networks",
        instructor: "Neural AI",
        rating: 5.0,
        students: 2100,
        status: "Active",
        duration: "8h 45m",
        lessons: 15,
        level: "Advanced",
        category: "AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk" // Neural Networks Video
    },
    {
        title: "Machine Learning Basics",
        instructor: "Dr. Sarah Logic",
        rating: 4.7,
        students: 1800,
        status: "Active",
        duration: "14h 20m",
        lessons: 20,
        level: "Beginner",
        category: "AI",
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU" // ML Basics Video
    },
    {
        title: "UI/UX Principles 2024",
        instructor: "Elena Flow",
        rating: 4.7,
        students: 530,
        status: "Active",
        duration: "6h 20m",
        lessons: 18,
        level: "Beginner",
        category: "Design",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU" // UI/UX Video
    },
    {
        title: "Figma Mastery",
        instructor: "Elena Flow",
        rating: 4.9,
        students: 1200,
        status: "Active",
        duration: "10h 00m",
        lessons: 25,
        level: "Intermediate",
        category: "Design",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/4W4JwLqAm-E" // Figma Video
    },
    {
        title: "Cybersecurity Basics",
        instructor: "David Code",
        rating: 4.8,
        students: 920,
        status: "Active",
        duration: "10h 15m",
        lessons: 28,
        level: "Beginner",
        category: "Security",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/inWWhr5tnEA" // Cyber Security Video
    },
    {
        title: "Ethical Hacking",
        instructor: "David Code",
        rating: 4.9,
        students: 800,
        status: "Active",
        duration: "15h 30m",
        lessons: 35,
        level: "Advanced",
        category: "Security",
        image: "https://images.unsplash.com/photo-1563206767-5b1d97289374?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/3Kq1MIfTWCE" // Hacking Video
    },
    {
        title: "Data Science with Python",
        instructor: "Dr. Sarah Logic",
        rating: 4.9,
        students: 1500,
        status: "Active",
        duration: "18h 00m",
        lessons: 36,
        level: "Intermediate",
        category: "Data Science",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/QA-F5t4R_oo" // Data Science Video
    },
    {
        title: "Big Data Analysis",
        instructor: "Prof. Byte",
        rating: 4.6,
        students: 1100,
        status: "Active",
        duration: "20h 00m",
        lessons: 40,
        level: "Advanced",
        category: "Data Science",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/bAyrObl7TYE" // Big Data Video
    },
    {
        title: "DevOps Essentials",
        instructor: "Dr. Logic",
        rating: 4.7,
        students: 950,
        status: "Active",
        duration: "12h 00m",
        lessons: 22,
        level: "Intermediate",
        category: "Development",
        image: "https://images.unsplash.com/photo-1607799275518-d58665d099db?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/hQcFE0RD0cQ" // DevOps Video
    },
    {
        title: "Mobile App Development",
        instructor: "Elena Flow",
        rating: 4.8,
        students: 1300,
        status: "Active",
        duration: "16h 00m",
        lessons: 30,
        level: "Beginner",
        category: "Development",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/fis26HvvDII" // Mobile App Video
    },
    {
        title: "Cloud Computing AWS",
        instructor: "Prof. Byte",
        rating: 4.9,
        students: 1600,
        status: "Active",
        duration: "14h 00m",
        lessons: 28,
        level: "Advanced",
        category: "Development",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/3hLmDS179YE" // AWS Video
    },
    {
        title: "Game Dev with Unity",
        instructor: "Dr. Logic",
        rating: 4.7,
        students: 800,
        status: "Active",
        duration: "25h 00m",
        lessons: 50,
        level: "Intermediate",
        category: "Development",
        image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/gB1F9G0JXOo" // Unity Video
    },
    {
        title: "Blockchain Fundamentals",
        instructor: "David Code",
        rating: 4.5,
        students: 600,
        status: "Active",
        duration: "8h 00m",
        lessons: 12,
        level: "Beginner",
        category: "Security",
        image: "https://images.unsplash.com/photo-1621504450168-38f683a4208e?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4" // Blockchain Video
    },
    {
        title: "Natural Language Processing",
        instructor: "Neural AI",
        rating: 4.9,
        students: 1100,
        status: "Active",
        duration: "11h 30m",
        lessons: 21,
        level: "Advanced",
        category: "AI",
        image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/CMrHM8a3hqw" // NLP Video
    },
    {
        title: "Graphic Design Masterclass",
        instructor: "Elena Flow",
        rating: 4.8,
        students: 1400,
        status: "Active",
        duration: "9h 45m",
        lessons: 19,
        level: "Beginner",
        category: "Design",
        image: "https://images.unsplash.com/photo-1626785774573-4b7993143d2d?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/sTNmfrpn1Ij4" // Graphic Design Video
    },
    {
        title: "Penetration Testing",
        instructor: "David Code",
        rating: 4.9,
        students: 750,
        status: "Active",
        duration: "13h 00m",
        lessons: 26,
        level: "Advanced",
        category: "Security",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/fTDb0NyG6T0" // Pen Testing Video
    },
    {
        title: "SQL Database Admin",
        instructor: "Prof. Byte",
        rating: 4.6,
        students: 900,
        status: "Active",
        duration: "16h 00m",
        lessons: 32,
        level: "Intermediate",
        category: "Data Science",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY" // SQL Video
    },
    {
        title: "Prompt Engineering",
        instructor: "Neural AI",
        rating: 4.7,
        students: 2000,
        status: "Active",
        duration: "5h 00m",
        lessons: 10,
        level: "Beginner",
        category: "AI",
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/_ZvnD72jT50" // Prompt Engineering Video
    }
];

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        await Course.deleteMany({}); // Clear existing to avoid duplicates
        console.log('🗑️ Cleared existing courses');
        await Course.insertMany(courses);
        console.log(`🌱 Seeded ${courses.length} courses successfully`);
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error seeding:', err);
        mongoose.disconnect();
    });
