const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        course_id: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        mark: {
            type: Number,
            required: true,
        },
        exam_date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        problem: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const History = mongoose.model('History', HistorySchema);

module.exports = History;
