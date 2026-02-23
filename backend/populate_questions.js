const mongoose = require('mongoose');
require('dotenv').config();
const { Quiz } = require('./models/Schemas'); // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';

const defaultQuestions = [
    {
        questionText: "What is the primary function of this concept?",
        options: ["Optimization", "Structure", "Data Storage", "Networking"],
        correctOption: 0,
        explanation: "It is primarily used for optimization."
    },
    {
        questionText: "Which feature is essential here?",
        options: ["Speed", "Color", "Taste", "Sound"],
        correctOption: 0,
        explanation: "Speed is critical."
    },
    {
        questionText: "How does it handle errors?",
        options: ["Gracefully", "It crashes", "Ignores them", "None of these"],
        correctOption: 0,
        explanation: "Graceful error handling is key."
    },
    {
        questionText: "What is the best use case?",
        options: ["Web Apps", "System Kernels", "Embedded Systems", "All"],
        correctOption: 0,
        explanation: "It shines in web applications."
    },
    {
        questionText: "True or False: This is scalable.",
        options: ["True", "False", "Maybe", "Unknown"],
        correctOption: 0,
        explanation: "It is designed to be scalable."
    },
    {
        questionText: "What is the security implication?",
        options: ["High", "Low", "None", "Unknown"],
        correctOption: 0,
        explanation: "Security must be prioritized."
    },
    {
        questionText: "Is it thread-safe?",
        options: ["Yes", "No", "Depends", "N/A"],
        correctOption: 2,
        explanation: "Thread safety depends on implementation."
    },
    {
        questionText: "What is the memory footprint?",
        options: ["Minimal", "Heady", "Gigantic", "Varies"],
        correctOption: 3,
        explanation: "Memory usage varies by use case."
    },
    {
        questionText: "How do you test this?",
        options: ["Unit Tests", "Manual only", "No testing", "Production triage"],
        correctOption: 0,
        explanation: "Unit testing is mandatory for quality."
    },
    {
        questionText: "What is the maintenance cost?",
        options: ["Low", "High", "Moderate", "None"],
        correctOption: 2,
        explanation: "Quality code keeps maintenance moderate."
    },
    {
        questionText: "How do you handle scaling?",
        options: ["Vertical", "Horizontal", "Both", "Manual only"],
        correctOption: 2,
        explanation: "Modern apps use both vertical and horizontal scaling."
    },
    {
        questionText: "What is the primary goal of refactoring?",
        options: ["New features", "Bug fixes", "Clean code", "Faster UI"],
        correctOption: 2,
        explanation: "Refactoring improves internal structure without changing behavior."
    },
    {
        questionText: "Which environment is for final testing?",
        options: ["Local", "Staging", "Production", "Development"],
        correctOption: 1,
        explanation: "Staging mimics production for final verification."
    },
    {
        questionText: "How often should you commit code?",
        options: ["Daily", "Weekly", "Frequently", "Monthly"],
        correctOption: 2,
        explanation: "Small, frequent commits are easier to manage."
    },
    {
        questionText: "What is the impact of technical debt?",
        options: ["Increased speed", "Lower quality", "Better UI", "No impact"],
        correctOption: 1,
        explanation: "Technical debt slows down future development."
    }
];

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        try {
            const quizzes = await Quiz.find();
            console.log(`Found ${quizzes.length} quizzes.`);

            for (const quiz of quizzes) {
                // Force pool expansion and set count
                console.log(`Expanding questions for quiz: ${quiz.title}`);
                const specificQuestions = defaultQuestions.map(q => ({
                    ...q,
                    questionText: q.questionText.replace("this concept", quiz.title)
                }));
                
                quiz.questions = specificQuestions;
                quiz.questionCount = quiz.questionCount || 10; 
                await quiz.save();
            }
            console.log('All quizzes synchronized to 15-question pool!');
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
