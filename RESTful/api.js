exports.allowDevice = function (req, res, next) {
    token = req.query.token
    res.send({ token })
}