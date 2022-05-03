import { StatusCodes } from 'http-status-codes'


const errorHandlerMiddleware = (err, req, res, next) => {
    const defaultEroor = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message ||'something went wrong...'
    }
    if (err.name === 'ValidationError') {
        defaultEroor.statusCode = StatusCodes.BAD_REQUEST
        defaultEroor.msg = Object.values(err.errors).map((item) => item.message).join(',')
    }
    res.status(defaultEroor.statusCode).json({ msg: defaultEroor.msg })
};

export default errorHandlerMiddleware