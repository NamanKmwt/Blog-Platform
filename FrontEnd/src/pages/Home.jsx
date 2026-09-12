import { useNavigate } from "react-router";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home(){

    const navigateSignUp = useNavigate();
    const navigateSignIn = useNavigate()
    const [posts , setposts]  = useState([])
    const [loading , setLoading] = useState(true)

    useEffect(function (){
        axios.get('http://localhost:3000/post')
        .then((response)=>{
            setposts(response.data.posts)
        })
        .catch((err)=>{
            console.log(err)
        })
        .finally(()=>{
            setLoading(false)
        })
    }, []);

    return (
        <div className="w-screen h-screen flex flex-col bg-slate-100">
            <nav className="bg-white py-3 px-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex cursor-pointer items-center gap-2">
                    <Logo />
                    <h3 className="text-slate-900 text-2xl font-semibold" style={{fontFamily:"fantasy"}}>Daily Blogger</h3>
                </div>
                <div className="flex items-center">
                    <Button onclick={()=>{navigateSignUp('/SignUp')}} title={"Sign Up"}/>
                    <Button onclick={()=>{navigateSignIn('/SignIn')}} title={"Sign In"}/>
                </div>
            </nav>
            <main className="px-4 py-8 overflow-y-auto flex flex-col items-center flex-1">
                <div className="w-full max-w-3xl mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">Latest posts</h1>
                    <p className="text-slate-500 mt-1 mb-6">Sign in to create posts, and to upvote or downvote your favorites.</p>
                </div>
                <div className="w-full flex flex-col items-center">
                    {loading ? (
                        <p className="text-slate-500 mt-10">Loading posts…</p>
                    ) : posts.length === 0 ? (
                        <p className="text-slate-500 mt-10">No posts yet.</p>
                    ) : (
                        posts.map((blog) => (
                            <Post key={blog._id} upvoters={blog.upvoters} downvoters={blog.downvoters} userId={blog.username} postId={blog._id} title={blog.title} content={blog.content} />
                        ))
                    )}
                </div>
            </main>

        </div>

    )
}

