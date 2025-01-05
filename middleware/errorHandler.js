export const errorHandler = (err, req, res, next) => {
    if (err) {
        return res.status(400).json({
            status: "fail",
            msg: err.message
        })
    }
    else {
        return next()
    }
}