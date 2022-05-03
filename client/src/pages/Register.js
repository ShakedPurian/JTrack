import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';


const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

export const Register = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialState); //local values
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } = useAppContext(); //global values

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const onSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, isMember } = values
    if (!email || !password || (!isMember && !name)) {
      displayAlert()
      return
    }
    const currentUser = { name, email, password }
    if (isMember) {
      loginUser(currentUser)
    } else {
      registerUser(currentUser)
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>

        {showAlert && <Alert />}

        {!values.isMember ? <FormRow
          type='text'
          name='name'
          value={values.name}
          handleChange={handleChange} /> : ''}

        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange} />
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange} />
        <button type='submit' className='btn btn-block' disabled={isLoading}>Submit</button>
        <p>
          {values.isMember ?
            <p>Don't have an account? <br />{<button type='button' className='member-btn' onClick={toggleMember}> Register </button>} </p>
            : <p>Already have an account? <br />{<button type='button' className='member-btn' onClick={toggleMember}> Login </button>} </p>}
        </p>


      </form>
    </Wrapper>
  )
}
