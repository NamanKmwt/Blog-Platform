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
    const [showposts , setshowposts] = useState(false)


    useEffect(function (){
        axios.get('http://localhost:3000/post')
        .then((response)=>{
            setposts(response.data.posts)
            
        })
        .catch((err)=>{
            console.log(err)
        })
       
    }, []);

    return (
        <div className="w-screen h-screen  flex flex-col">
            <nav className="bg-white py-4 px-6 flex justify-between items-center">
                <div className=" flex cursor-pointer"> <Logo />
                    </div>
                   <h3 className="text-black text-4xl  " style={{fontFamily:"fantasy"}}>Daily Blogger</h3>
                <div>
                    <Button onclick={()=>{navigateSignUp('/SignUp')}} title={"Sign Up"}/>
                    <Button onclick={()=>{navigateSignIn('/SignIn')}} title={"Sign In"}/>
                </div>
            </nav>
            <main className="  px-4 py-6 overflow-y-auto flex flex-col items-center" >
                <div className="flex-col " >
                    { (
                        posts.map((blog) => (
                        <Post key={blog._id} upvotee={blog.upvote} downvotee={blog.downvote} userId={""} postId={blog.username} title={blog.title} content={blog.content} />
                        ))
                    ) }
                </div>
            </main>

        </div>
        
    )
}


