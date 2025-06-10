import axios from "axios"
import { useState , useEffect  } from "react"
import { useNavigate } from "react-router"

export default function Post({title ,upvotee , downvotee , content , userId , postId}){

    const [userData , setUserData] = useState([])
        const storedUserData = localStorage.getItem('userData')
        useEffect(()=>{
            if(storedUserData){
                setUserData(JSON.parse(storedUserData))
            }
        }, [])
    
    const navigate = useNavigate()
    
    
    
    

    const [upvote , setUpvote] = useState(upvotee)
    const [downvote , setDownvote] = useState(downvotee)
    const [isEditable , setisEditable] = useState(false)
    return (
        <div className="m-2 p-2.5 rounded-3xl text-black bg-white">
            <div className="w-3xl h-56 border-2 rounded-3xl box-border p-5 border-black">
                <div className="text-3xl h-1/5 font-bold overflow-scroll  " style={{scrollbarWidth:"none"}}>
                  {title}
                </div>
                <div className="w-full h-4/5 mt-1 overflow-scroll  " style={{scrollbarWidth: "none"}}>
                    {content} 
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-50 flex">
                    <button onClick={(e)=>{
                        e.preventDefault();
                        const token = localStorage.getItem('token')
                        axios.put('http://localhost:3000/post/upvote', {
                            postId : postId , 
                            inc : true
                        } , {
                            headers:{
                                'Authorization':token
                            }
                        }).then((response)=>{
                            console.log(response.data)
                            setUpvote(response.data.upvote)
                        })
                    }} className=" flex text-black border-[1px] rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium"><img className="w-5 h-5 " src="https://cdn-icons-png.flaticon.com/128/929/929769.png" alt="" /> {upvote}</button>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        const token = localStorage.getItem('token')
                        axios.put('http://localhost:3000/post/downvote', {
                            postId : postId , 
                            inc : true
                        } , {
                            headers:{
                                'Authorization':token
                            }
                        }).then((response)=>{
                            console.log(response.data)
                            setDownvote(response.data.downvote)
                        })
                    }} className="flex text-black border-[1px]  rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium"><img className="rotate-180 w-5 h-5" src="https://cdn-icons-png.flaticon.com/128/929/929769.png" alt="" /> {downvote}</button>
                </div>
                {userId == userData._id ? 
                <div>
                    <button onClick={(e)=>{
                        e.preventDefault()
                        const token =  localStorage.getItem('token')
                        axios({
                            method:'delete', 
                            url : 'http://localhost:3000/post/deletePost', 
                            headers :{
                                'Authorization': token
                            }, 
                            data : {
                                postId : postId
                            }
                        }).then((response)=>{
                        console.log(response.data)
                        window.location.reload();
                    }).catch((err)=>{
                        console.log("error : " , err)
                    })
                    }} className="bg-red-500 text-white border-[1px] hover:bg-red-600 rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">Delete Post</button>
                    <button onClick={(e)=>{
                        e.preventDefault()
                        navigate('/createPost' , {state: {post : 'Update Post' , posttitle : title , postdesc : content , postID : postId}})
                    }} className="bg-[#007BFF] text-white border-[1px] hover:bg-blue-600 rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">Edit</button>
                </div> : <div></div>}
            </div>
        </div>
    )
}