import Input from "../components/Input"
import Button from "../components/Button"
import Logo from "../components/Logo"
import { useState } from "react"
import { useNavigate , Link } from "react-router"
import axios from "axios"

export default function Signin(){
    const [username , setusername] = useState("")
    const [password , setpassword] = useState("")
    const navigate = useNavigate()
    return(
        <div className="w-screen h-screen flex items-center justify-center">
                <form className="flex rounded-4xl text-black  bg-white flex-col w-2xs p-9 shadow-white shadow-xl box-content" action="">
                    <div className="w-full flex justify-center"> <Logo/> </div>
                    <h1 className="w-full flex justify-center text-4xl p-2 font-semibold">Sign in</h1>
                    <Input onChange={(e)=>{
                        setusername(e.target.value)
                    }} placeholder={"Username / email"} type={"email"}/>
                    <Input onChange={(e)=>{
                        setpassword(e.target.value) }}placeholder={"password"} type={"password"}/>
                    <Button onclick={
                        (e)=>{
                            e.preventDefault();
                            axios.post('http://localhost:3000/user/signin', {
                                username : username, 
                                password : password
                            }).then( (response)=>{
                                        const token =  response.data.token;
                                        localStorage.setItem('token' , token)
                                        
                                        localStorage.setItem('userData' , JSON.stringify(response.data.user))
                                        navigate('/Home')
                                    }).catch((err)=>{
                                        alert(err.response.data.msg)
                                    })
                        }
                    } title={"Submit"} />
                    <h5 className="w-full flex justify-center text-lg font-medium">Didn't have an account ? <Link className='pl-1.5 hover:text-blue-800 underline' to="/Signup">Sign up</Link> </h5>
                </form>
            </div>
    )
}