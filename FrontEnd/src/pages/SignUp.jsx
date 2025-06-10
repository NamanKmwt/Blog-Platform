import axios from 'axios'
import Logo from "../components/Logo"
import { useState } from "react"
import { useNavigate , Link} from "react-router"

export default function SignUp(){
    
    const [firstName , setfirstName] = useState("");
    const [lastName , setlastName] = useState("");
    const [Username , setUsername] = useState("");
    const [password , setpassword] = useState("");
    
    const navigate = useNavigate()
    
    
    return (
        <div className="w-screen h-screen flex items-center justify-center">
        <form className="flex rounded-4xl text-black  bg-white flex-col w-2xs p-9 shadow-white shadow-xl box-content" action="">
            <div className="w-full flex justify-center"><Logo/></div>
            <h1 className="w-full flex justify-center text-4xl p-2 font-semibold">Create Account</h1>
            <input onChange={(e)=>{setUsername(e.target.value)}} type="email" className="m-2 border-2 p-1 text-gray-800 border-black rounded-2xl pl-3 box-border  " placeholder="Username / email"  />
            <input onChange={(e)=>{setfirstName(e.target.value)}} type="text" className="m-2 border-2 p-1 text-gray-800 border-black rounded-2xl pl-3 box-border  " placeholder="first name"  />
            <input onChange={(e)=>{setlastName(e.target.value)}} type="text" className="m-2 border-2 p-1 text-gray-800 border-black rounded-2xl pl-3 box-border  " placeholder="last name"  />
            <input onChange={(e)=>{setpassword(e.target.value)}} type="password" className="m-2 border-2 p-1 text-gray-800 border-black rounded-2xl pl-3 box-border  " placeholder="password"  />
            <button onClick={(e)=>{
                e.preventDefault()
               axios.post('http://localhost:3000/user/signup' , {
                                        firstName : firstName, 
                                        lastName : lastName, 
                                        username : Username, 
                                        password : password
                                    }).then( (response)=>{
                                        const token =  response.data.token;
                                        localStorage.setItem('token' , token)
                                        navigate('/Home')
                                    }).catch((err)=>{
                                        alert(err.response.data.msg)
                                    })
            }} className="bg-[#007BFF] text-white border-[1px] hover:bg-blue-600 rounded-3xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">Submit</button>
            <h5 className="w-full flex justify-center text-lg font-medium">Already have an account ? <Link className='pl-1.5 hover:text-blue-800 underline' to="/Signin">Sign in</Link> </h5>
        </form>
        </div>
    )
}