module.exports = function (handler) {
    return async (req, res, next) => {
        try{
            await handler(res, res);
        } catch(ex){
            next(ex);
        }
    };
}