const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        problem: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
