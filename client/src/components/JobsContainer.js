import { useEffect } from "react"
import { Job } from "./Job.js"
import { useAppContext } from "../context/appContext.js"
import Loading from "./Loading.js"
import Wrapper from '../assets/wrappers/JobsContainer'
import { PageBtnContainer } from "./PageBtnContainer.js"

export const JobsContainer = () => {
    const { getJobs, jobs, isLoading, totalJobs, search, sort, searchType,searchStatus, page } = useAppContext()

    useEffect(() => {
        getJobs()
        //eslint-disable-next-line
    }, [search, sort, searchType,searchStatus, page])

    if (isLoading) {
        return <Loading center />
    }

    if (jobs.length === 0) {
        return (
            <Wrapper>
                <h2> No jobs to display...</h2>
            </Wrapper>
        )
    }
    return (
        <Wrapper>
            <h5>{totalJobs} job{jobs.length>1 && 's'} found:</h5>
            <div className="jobs">
                {jobs.map((job)=>{
                    return <Job key={job._id}{...job} />
                })}
            </div>
            <PageBtnContainer/>
        </Wrapper>
    )
}
