import { Link, useNavigate , useLocation } from "react-router";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";


export default function HomeAfter(){

    const [userData , setUserData] = useState([])
    const storedUserData = localStorage.getItem('userData')
    useEffect(()=>{
        if(storedUserData){
            setUserData(JSON.parse(storedUserData))
        }
    }, [])


    

    
    const navigate = useNavigate()
    const createNavigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token || token.trim === ""){
            alert("please sign up first")
            console.log("no token found")
            navigate('/')
        }
    } , [])
    
    const [posts , setposts] = useState([])

    useEffect(function(){
        axios.get('http://localhost:3000/post')
        .then((response)=>{
            setposts(response.data.posts)
            
        })
        .catch((err)=>{
            console.log(err)
        })
       
    }, [])

    

    return (
        <div className="w-screen h-screen  flex flex-col">
            <nav className="bg-white py-4 px-6 flex justify-between items-center">
                <div className=" flex cursor-pointer"> <Logo />
                    </div>
                   <h3 className="text-black text-4xl  " style={{fontFamily:"fantasy"}}>Daily Blogger</h3>
                <div className="flex justify-center items-center">
                    <div className="flex items-center text-black m-2" >
                        <img className="h-10 w-10 m-2" src="https://cdn-icons-png.flaticon.com/128/64/64572.png" alt="" />
                        {userData.firstName + '  ' + userData.lastName }  
                    </div>
                    <button onClick={(e)=>{
                        const token = localStorage.getItem('token')
                        e.preventDefault()
                        axios.post("http://localhost:3000/user/logout", {
                        },{
                            headers :{
                                'Authorization':token
                            }
                        }
                    ).then((response)=>{
                        localStorage.removeItem('token');
                        localStorage.removeItem('userData');
                        
                        navigate('/')
                        console.log(response.data)
                    }).catch((err)=>{
                        alert(err.response.data.msg)
                        console.log("Error : ", err)
                    })
        }} className="bg-[#007BFF] text-white border-[1px] hover:bg-blue-600 rounded-3xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">Log out</button>
                    
                </div>
            </nav>
            <main className="  px-4 py-6 overflow-y-auto flex flex-col items-center" >
                <div className=" flex justify-center bg-white p-2 m-2 w-[806px]">
                    <button onClick={(e)=>{
                        e.preventDefault();
                        createNavigate('/CreatePost'  , {state :{post:'Create Post' , posttitle : '' , postdesc : ''}})
                    }} className="bg-green-500 text-white border-[1px] hover:bg-green-600 rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium"> Create Post </button>
                </div>
                <div className="flex-col " >
                    {
                        posts.map((blog)=>(
                            <Post key = {blog._id} upvotee={blog.upvote} downvotee={blog.downvote} postId={blog._id} userId={blog.username} title={blog.title} content={blog.content}/>
                        ))
                    }

                </div>
            </main>

        </div>
        
    )
}


