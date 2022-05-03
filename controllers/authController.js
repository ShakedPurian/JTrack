import User from "../models/User.js"
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticated } from "../errors/index.js"

const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.create({ name, email, password })
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user, token }) //status codes is a library for the http req nums

}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new UnAuthenticated('Email / password is invalid')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnAuthenticated('Email / password is invalid')
    }
    const token = user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({ user, token })
}

const updateUser = async (req, res) => {
    const { email, name } = req.body
    if (!email || !name) {
        throw new UnAuthenticated('Please provide all values')
    }
    const user = await User.findOne({ _id: req.user.userId })
    user.email = email
    user.name = name

    await user.save()
    const token= user.createJWT()
    res.status(StatusCodes.OK).json({ user,token })
}


export { register, login, updateUser }