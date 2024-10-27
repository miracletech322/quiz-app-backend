const History = require("./../models/history.model");

exports.readAction = async (req, res) => {
    const user_id = req.user._id;
    const coursetype = req.body.courseType;
    const viewType = req.body.viewtype;
    const Historydata = {};
    if (viewType === "all") {
        const Historydata = await History.find({ user_id: user_id, type: coursetype});
        return res.status(200).json({ status: 'success', data: Historydata});
    }else if(viewType === "right"){
        const Historydata = await History.find({ user_id: user_id, type: coursetype, mark:100});
        return res.status(200).json({ status: 'success', data: Historydata});
    }else{
        const Historydata = await History.find({ user_id: user_id, type: coursetype, mark:0});
        return res.status(200).json({ status: 'success', data: Historydata});
    }
}