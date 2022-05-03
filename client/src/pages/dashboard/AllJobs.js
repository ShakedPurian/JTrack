import { JobsContainer, SearchContainer,StatsContainer } from "../../components/index.js"
import { useEffect } from "react"
import { useAppContext } from "../../context/appContext"

export const AllJobs = () => {
  const { showStats} = useAppContext()
  useEffect(()=>{
    showStats()
  },[])
  return <>
    <StatsContainer />
    <SearchContainer />
    <JobsContainer />
  </>
}
