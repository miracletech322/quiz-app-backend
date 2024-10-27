const formidable = require('formidable');
const Course = require("./../models/course.model");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const fs = require('fs');
const OpenAI = require("openai");

exports.makeProAction = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ uploadDir: __dirname + '/../uploads', keepExtensions: true });
        console.log(form, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        form.parse(req, async (err, fields, files) => {
            const filePath = files.problemPdf[0].filepath;

            const type = fields.type[0];
            const count = Number(fields.count[0]);

            const pdf = new PDFExtract();
            const openai = new OpenAI();
            const options = {};
            const buffer = fs.readFileSync(filePath);

            const data = await pdf.extractBuffer(buffer, options);
            let textContent = '';
            data.pages.forEach(page => {
                page.content.forEach(item => {
                    if (item.str) {
                        textContent += item.str + ' ';
                    }
                });
            });
            
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: `Please make quiz problem and answer with text content. It's checkable problem and total ${count} problems. Just ${count}. Don't have "All of the above" as answer. Also you must always follow my format because I made code with your formated text. Here is format:What is your name?<$$$>Petro<$$$>Maksim<$$$>Bakumenko<$$$>Daniel<$$$>$ANSWER$Maksim----------`},
                    {
                        role: "user",
                        content: textContent,
                    },
                ],
            });
        
            const quizText = completion.choices[0].message.content;
            const lst = quizText.split("----------");

            for(var i = 0; i < lst.length - 1; i++) {
                var proList = lst[i].split("<$$$>");
                var tmpList = []
                for(var j = 1; j < proList.length - 1; j++) {
                    tmpList.push(proList[j]);
                }

                const courseData = new Course({
                    problem: proList[0],
                    items: tmpList,
                    answer: proList[proList.length - 1].replace("$ANSWER$", ""),
                    type: fields.type[0],
                    user_id: req.user._id
                })
                await courseData.save();
            }

            res.status(200).json({
                status: "success",
                quizText
            })
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}

exports.deleteAction = async (req, res) => {
    try {
        const { _id } = req.body;
        await Course.deleteOne({ _id });
        res.status(200).json({
            status: "success"
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}

exports.readAction = async (req, res) => {
    try {
        const { type } = req.body;
        const problems = await Course.find({ type });
        res.status(200).json({
            status: "success",
            problems: problems
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}

exports.readMineAction = async (req, res) => {
    try {

        const { type } = req.body;
        const user_id = req.user._id;

        const problems = await Course.find({ type, user_id });
        res.status(200).json({
            status: "success",
            problems: problems
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}