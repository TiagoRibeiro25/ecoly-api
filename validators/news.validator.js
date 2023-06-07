const validateImgs = require("../utils/validateImgs");

exports.validateNews = async (req, res, next) => {

    const { title, content, imgs } = req.body;
    
    if (!title) {return res.status(400).send({
        success: false,
        message: "title of the new not given"
    })}

    if (typeof title != "string") {return res.status(400).send({
        success: false,
        message: "invalid title"
    })}

    if (!content) {return res.status(400).send({
        success: false,
        message: "content of the new not given"
    })}

    if (typeof content != "string") {return res.status(400).send({
        success: false,
        message: "invalid content"
    })}

    if (!imgs) {return res.status(400).send({
        success: false,
        message: "images of the new not given"
    })}

    if (validateImgs(imgs)) {
		return res.status(400).json({
			success: false,
			error: "images must be a valid base64 string",
		});
	}
}