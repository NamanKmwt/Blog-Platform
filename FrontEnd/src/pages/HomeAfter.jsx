import { useNavigate } from "react-router";
import Logo from "../components/Logo";
import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


export default function HomeAfter(){

    const [userData , setUserData] = useState([])
    useEffect(()=>{
        const storedUserData = localStorage.getItem('userData')
        if(storedUserData){
            setUserData(JSON.parse(storedUserData))
        }
    }, [])

    const navigate = useNavigate()
    const createNavigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token || token.trim === ""){
            toast.error("Please sign in first")
            navigate('/')
        }
    } , [])

    const [posts , setposts] = useState([])
    const [loading , setLoading] = useState(true)

    useEffect(function(){
        axios.get('http://localhost:3000/post')
        .then((response)=>{
            setposts(response.data.posts)
        })
        .catch((err)=>{
            console.log(err)
            toast.error("Couldn't load posts")
        })
        .finally(()=>{
            setLoading(false)
        })
    }, [])

    function handleLogout(e){
        e.preventDefault()
        const token = localStorage.getItem('token')
        axios.post("http://localhost:3000/user/logout", {},{
            headers :{
                'Authorization':token
            }
        }).then(()=>{
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            navigate('/')
        }).catch((err)=>{
            toast.error(err.response?.data?.msg || "Couldn't log out")
        })
    }

    return (
        <div className="w-screen h-screen flex flex-col bg-slate-100">
            <nav className="bg-white py-3 px-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex cursor-pointer items-center gap-2" onClick={()=>navigate('/home')}>
                    <Logo />
                    <h3 className="text-slate-900 text-2xl font-semibold" style={{fontFamily:"fantasy"}}>Daily Blogger</h3>
                </div>
                <div className="flex justify-center items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <img className="h-9 w-9 rounded-full" src="https://cdn-icons-png.flaticon.com/128/64/64572.png" alt="" />
                        <span>{userData.firstName} {userData.lastName}</span>
                    </div>
                    <button onClick={handleLogout} className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl cursor-pointer px-3.5 py-1.5 font-medium transition-colors">Log out</button>
                </div>
            </nav>
            <main className="px-4 py-8 overflow-y-auto flex flex-col items-center flex-1">
                <div className="flex justify-center w-full max-w-3xl mb-6">
                    <button onClick={(e)=>{
                        e.preventDefault();
                        createNavigate('/CreatePost'  , {state :{post:'Create Post' , posttitle : '' , postdesc : ''}})
                    }} className="w-full bg-green-500 text-white border-[1px] hover:bg-green-600 rounded-xl cursor-pointer px-3 py-2.5 font-medium shadow-sm transition-colors"> + Create Post </button>
                </div>
                <div className="w-full flex flex-col items-center">
                    {loading ? (
                        <p className="text-slate-500 mt-10">Loading posts…</p>
                    ) : posts.length === 0 ? (
                        <p className="text-slate-500 mt-10">No posts yet. Be the first to write one!</p>
                    ) : (
                        posts.map((blog)=>(
                            <Post key = {blog._id} upvoters={blog.upvoters} downvoters={blog.downvoters} postId={blog._id} userId={blog.username} title={blog.title} content={blog.content}/>
                        ))
                    )}
                </div>
            </main>

        </div>

    )
}
