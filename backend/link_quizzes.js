const mongoose = require('mongoose');
require('dotenv').config();
const { Quiz, Course } = require('./models/Schemas');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        
        const quizzes = await Quiz.find();
        const courses = await Course.find();

        if (courses.length === 0) {
            console.log('❌ No courses found to link.');
            return;
        }

        console.log(`Found ${quizzes.length} quizzes and ${courses.length} courses.`);

        for (const quiz of quizzes) {
            // Try to find a course with matching category or just random
            let matchingCourse = courses.find(c => c.category === quiz.category) || courses[Math.floor(Math.random() * courses.length)];
            
            if (matchingCourse) {
                quiz.relatedCourse = matchingCourse._id;
                await quiz.save();
                console.log(`🔗 Linked Quiz "${quiz.title}" to Course "${matchingCourse.title}"`);
            }
        }

        console.log('✅ All quizzes linked.');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error:', err);
        mongoose.disconnect();
    });
