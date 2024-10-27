const OpenAI = require("openai");

exports.send = async (req, res) => {

    try {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: req.body.message,
                },
            ],
        });
        console.log(req.body.message);
        const chatText = completion.choices[0].message.content;
        res.status(200).json({
            chatText,
            status: "success",
        })

    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}