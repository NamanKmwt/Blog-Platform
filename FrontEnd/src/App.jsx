import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/Button'
import Logo from './components/Logo'
import Input from './components/Input'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CreatePost from './pages/CreatePost'
import Post from './pages/Post'
import Home from './pages/Home'
import {BrowserRouter, Route , Routes} from 'react-router'
import HomeAfter from './pages/HomeAfter'


function App() {


  return (
    <>
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
