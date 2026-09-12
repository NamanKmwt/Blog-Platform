import Input from "../components/Input"
import Logo from "../components/Logo"
import { useState } from "react"
import { useNavigate , Link } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"

export default function Signin(){
    const [username , setusername] = useState("")
    const [password , setpassword] = useState("")
    const [submitting , setSubmitting] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault();
        setSubmitting(true)
        axios.post('http://localhost:3000/user/signin', {
            username : username,
            password : password
        }).then((response)=>{
            const token =  response.data.token;
            localStorage.setItem('token' , token)
            localStorage.setItem('userData' , JSON.stringify(response.data.user))
            navigate('/Home')
        }).catch((err)=>{
            toast.error(err.response?.data?.msg || "Couldn't sign in")
        }).finally(()=>{
            setSubmitting(false)
        })
    }

    return(
        <div className="w-screen h-screen flex items-center justify-center bg-slate-100">
                <form onSubmit={handleSubmit} className="flex rounded-3xl text-black bg-white flex-col w-2xs p-9 shadow-lg box-content">
                    <div className="w-full flex justify-center"> <Logo/> </div>
                    <h1 className="w-full flex justify-center text-3xl p-2 font-semibold text-slate-900">Sign in</h1>
                    <Input onChange={(e)=>{
                        setusername(e.target.value)
                    }} placeholder={"Username / email"} type={"email"}/>
                    <Input onChange={(e)=>{
                        setpassword(e.target.value) }}placeholder={"password"} type={"password"}/>
                    <button type="submit" disabled={submitting} className="bg-[#007BFF] text-white border-[1px] border-transparent hover:bg-blue-600 rounded-xl cursor-pointer m-1.5 px-3.5 py-1.5 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Signing in…" : "Submit"}</button>
                    <h5 className="w-full flex justify-center text-sm text-slate-600 font-medium mt-1">Didn't have an account? <Link className='pl-1.5 text-[#007BFF] hover:text-blue-800 underline' to="/Signup">Sign up</Link> </h5>
                </form>
            </div>
    )
}
