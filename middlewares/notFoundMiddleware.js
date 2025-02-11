const notFoundMiddleware = (req,res,next)=>{
    res.status(404).json({
        status: 404,
        success : false,
        error : 'page not found'
    });
}
module.exports = notFoundMiddleware;