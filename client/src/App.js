import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { SharedLayout, Profile, AllJobs, AddJob } from './pages/dashboard'
import { Landing, Error, Register, ProtectedRoute} from './pages';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute><SharedLayout/></ProtectedRoute>}>
          <Route index element={<AllJobs />} />
          <Route path='add-job' element={<AddJob/>} />
          <Route path='profile' element={<Profile />} />
        </Route>

        <Route path='/landing' element={<Landing />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
