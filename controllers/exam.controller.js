const Course = require("./../models/course.model");
const History = require("./../models/history.model");

exports.readAction = async (req, res) => {
    try {
        const { type, count } = req.body;
        const randomProblems = await Course.aggregate([
            { $match: { type } },
            { $sample: { size: Number(count) }, },
            { $unset: "answer" }
        ]).exec();

        res.status(200).json({
            status: 'success',
            problems: randomProblems
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}

exports.saveAction = async (req, res) => {
    const data= {
        user_id:"",
        course_id:"",
        answer:"",
        mark:"",
        exam_date:"",
        type:""
    }
    
    try {
        req.cnt=0;

        for (let i = 0; i < req.body.length; i++) {
            const CourseData = await Course.find({ _id: req.body[i]._id }).exec();

            data.user_id=req.user._id;
            data.course_id=req.body[i]._id;
            if(!req.body[i].answer||req.body[i].answer==""){
                data.answer="???";
            }else{
                data.answer=req.body[i].answer;
            }
            data.mark=0;
            data.problem=req.body[i].problem;
            data.exam_date=new Date;
            data.type=req.body[i].type;
            data.items=req.body[i].items

            if (CourseData[0].answer == req.body[i].answer) {
                req.cnt++;
                data.mark=100;
            }

            const history = new History({
                user_id: data.user_id,
                course_id: data.course_id,
                answer: data.answer,
                mark: data.mark,
                exam_date: data.exam_date,
                type: data.type,
                problem:data.problem,
                items:data.items
            });
            await history.save();

        }
        const mark=req.cnt/req.body.length*100;
        res.status(200).json({
            status: 'success',
            mark: mark
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}
