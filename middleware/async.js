function asyncMiddleware(routeHandler) {
    return async (req, res, next) => {
        try {
            await routeHandler(req, res, next);
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}

module.exports = asyncMiddleware;