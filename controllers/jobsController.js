import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticated } from "../errors/index.js"
import mongoose from 'mongoose'

const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.userId === resourceUserId.toString()) return

    throw new UnAuthenticatedError('Not authorized to access this route')
}

const createJob = async (req, res) => {
    const { position, company } = req.body
    if (!position || !company) {
        throw new BadRequestError('Please provide all values')
    }
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobs = async (req, res) => {
    const { status, jobType, sort, search } = req.query
    const queryObject = {
        createdBy: req.user.userId
    }

    if (status && status !== 'all') {
        queryObject.status = status
    }
    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }
    if (search) {
        queryObject.company = { $regex: search, $options: 'i' }
    }

    let result = Job.find(queryObject)

    if (sort === 'latest') {
        result = result.sort('-createdAt')
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt')
    }
    if (sort === 'a-z') {
        result = result.sort('company')
    }
    if (sort === 'z-a') {
        result = result.sort('-company')
    }

    //pagination:
    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * 10
    result = result.skip(skip).limit(limit) //mongoose methods

    const jobs = await result

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs / limit)
    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const updateJob = async (req, res) => {
    const { id: jobId } = req.params
    const job = await Job.findOne({ _id: jobId })

    if (!job) {
        throw new NotFoundError('No job was found')
    }

    checkPermissions(req.user, job.createdBy)

    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({ updatedJob })
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
    const job = await Job.findOne({ _id: jobId })

    if (!job) {
        throw new NotFoundError('No job was found')
    }
    checkPermissions(req.user, job.createdBy)

    await job.remove()
    res.status(StatusCodes.OK).json({ msg: 'Job removed' })
}

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }
    let weeklyApplications = []
    res.status(StatusCodes.OK).json({ defaultStats, weeklyApplications })
}

export { createJob, getAllJobs, updateJob, deleteJob, showStats }