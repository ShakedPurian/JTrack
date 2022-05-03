import { Logo } from '../components';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <Wrapper>
        <nav>
            <Logo />
        </nav>
        <div className='container page'>
            <div className='info'>
                <h1>Job tracking app</h1>
                <p> Track your job applications and keep your job search organized, all in one place. <br/>
                     Free job tracking tool made just for you. It is the most efficient way to manage a job search and find your next job!
                </p>
                <Link to='/register' className='btn btn-hero'>Login / Register</Link>
            </div>
            <img src={main} className='img main-img' alt="main background"/>
        </div>
    </Wrapper>
  )
};

