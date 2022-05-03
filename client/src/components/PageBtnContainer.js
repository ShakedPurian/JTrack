import { useAppContext } from "../context/appContext"
import Wrapper from '../assets/wrappers/PageBtnContainer'

export const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext()
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1
  })

  const prevPage = () => {
    let newPage= page-1
    if(newPage<1){
      newPage=1
    }
    changePage(newPage)
  }
  const nextPage = () => {
    let newPage= page+1
    if(newPage> numOfPages){
      newPage=numOfPages
    }
    changePage(newPage)
  }
  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>prev</button>
      <div className="btn-container">
        {pages.map((pageNum) => {
          return (
            <button
              type="button"
              key={pageNum}
              onClick={()=>changePage(pageNum)}
              className={pageNum === page ? 'pageBtn active' : 'pageBtn'}>
              {pageNum}
            </button>
          )
        })}
      </div>
      <button className="next-btn" onClick={nextPage}>next</button>
    </Wrapper>
  )
}
