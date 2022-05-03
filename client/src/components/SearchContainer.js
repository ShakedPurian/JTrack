import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'

export const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext()

  const handleSearch= (e)=>{
    if (isLoading) return
    handleChange({name: e.target.name, value:e.target.value})
  }

  const handleSubmit= (e)=>{
    e.preventDefault()
    clearFilters()
  }
  return (
    <Wrapper>
      <form className='form'>
        <div className="form-center">
          <FormRow type='text' labelText='Search company' name='search' value={search} handleChange={handleSearch} />
          <FormRowSelect 
          name='searchStatus' 
          labelText='Status' 
          value={searchStatus} 
          handleChange={handleSearch} 
          list={['all',...statusOptions]}/>
          <FormRowSelect 
          name='searchType' 
          labelText='Job type' 
          value={searchType} 
          handleChange={handleSearch} 
          list={['all',...jobTypeOptions]}/>
          <FormRowSelect 
          name='sort' 
          labelText='Sort' 
          value={sort} 
          handleChange={handleSearch} 
          list={sortOptions}/>
          <button className='btn btn-block btn-danger' disabled={isLoading} onClick={handleSubmit}>Clear</button>
        </div>
      </form>
    </Wrapper>
  )
}
