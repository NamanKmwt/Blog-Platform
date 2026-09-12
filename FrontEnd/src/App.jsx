import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CreatePost from './pages/CreatePost'
import Home from './pages/Home'
import {BrowserRouter, Route , Routes} from 'react-router'
import HomeAfter from './pages/HomeAfter'
import { Toaster } from 'react-hot-toast'


function App() {


  return (
    <>
    <Toaster position="top-center" toastOptions={{duration: 3000}} />
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/SignUp' element={<SignUp/>} />
      <Route path='/SignIn' element={<SignIn/>} />
      <Route path='/home' element={<HomeAfter/>}/>
      <Route path='/createpost' element={<CreatePost/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
