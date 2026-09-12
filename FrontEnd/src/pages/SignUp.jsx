import axios from 'axios'
import Logo from "../components/Logo"
import Input from "../components/Input"
import { useState } from "react"
import { useNavigate , Link} from "react-router"
import toast from "react-hot-toast"

export default function SignUp(){

    const [firstName , setfirstName] = useState("");
    const [lastName , setlastName] = useState("");
    const [Username , setUsername] = useState("");
    const [password , setpassword] = useState("");
    const [submitting , setSubmitting] = useState(false)

    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        setSubmitting(true)
        axios.post('http://localhost:3000/user/signup' , {
            firstName : firstName,
            lastName : lastName,
            username : Username,
            password : password
        }).then((response)=>{
            const token =  response.data.token;
            localStorage.setItem('token' , token)
            localStorage.setItem('userData' , JSON.stringify(response.data.user))
            navigate('/Home')
        }).catch((err)=>{
            toast.error(err.response?.data?.msg || "Couldn't create account")
        }).finally(()=>{
            setSubmitting(false)
        })
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-100">
        <form onSubmit={handleSubmit} className="flex rounded-3xl text-black bg-white flex-col w-2xs p-9 shadow-lg box-content">
            <div className="w-full flex justify-center"><Logo/></div>
            <h1 className="w-full flex justify-center text-3xl p-2 font-semibold text-slate-900">Create Account</h1>
            <Input onChange={(e)=>{setUsername(e.target.value)}} type="email" placeholder="Username / email" />
            <Input onChange={(e)=>{setfirstName(e.target.value)}} type="text" placeholder="First name" />
            <Input onChange={(e)=>{setlastName(e.target.value)}} type="text" placeholder="Last name" />
            <Input onChange={(e)=>{setpassword(e.target.value)}} type="password" placeholder="Password" />
            <button type="submit" disabled={submitting} className="bg-[#007BFF] text-white border-[1px] border-transparent hover:bg-blue-600 rounded-xl cursor-pointer m-1.5 px-3.5 py-1.5 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Creating…" : "Submit"}</button>
            <h5 className="w-full flex justify-center text-sm text-slate-600 font-medium mt-1">Already have an account? <Link className='pl-1.5 text-[#007BFF] hover:text-blue-800 underline' to="/Signin">Sign in</Link> </h5>
        </form>
        </div>
    )
}
