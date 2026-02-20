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
    }
];

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        try {
            const quizzes = await Quiz.find();
            console.log(`Found ${quizzes.length} quizzes.`);

            for (const quiz of quizzes) {
                if (!quiz.questions || quiz.questions.length === 0) {
                    console.log(`Populating questions for quiz: ${quiz.title}`);
                    // Customize question text slightly to match quiz title
                    const specificQuestions = defaultQuestions.map(q => ({
                        ...q,
                        questionText: q.questionText.replace("this concept", quiz.title)
                    }));
                    
                    quiz.questions = specificQuestions;
                    await quiz.save();
                }
            }
            console.log('All empty quizzes populated!');
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
