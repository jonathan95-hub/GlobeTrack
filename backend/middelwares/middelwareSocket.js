const socketMiddelware = (io) => {
    return (req, res, next) => {
        req.io = io,
        next()
    };
};

module.exports = socketMiddelware