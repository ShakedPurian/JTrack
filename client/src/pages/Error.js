import {Link} from 'react-router-dom';
import img from '../assets/images/not-found.svg';
import Wrapper from '../assets/wrappers/ErrorPage';

export const Error = () => {
  return (
      <Wrapper className='full-page'>
          <div>
              <img src={img} alt="not found"/>
              <h3> Oops...</h3>
              <p>Page not found</p>
              <Link to='/'>Back home</Link>
          </div>
        </Wrapper>
  )
}
