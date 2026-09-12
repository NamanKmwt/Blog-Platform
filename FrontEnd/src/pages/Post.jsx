import axios from "axios"
import { useState , useEffect  } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

function ArrowIcon({ direction, active }){
    return (
        <svg
            className={`w-4 h-4 transition-colors ${active ? "" : "opacity-70"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: direction === "down" ? "rotate(180deg)" : "none" }}
        >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
        </svg>
    )
}

export default function Post({title , upvoters , downvoters , content , userId , postId}){

    const [userData , setUserData] = useState([])
    useEffect(()=>{
        const storedUserData = localStorage.getItem('userData')
        if(storedUserData){
            setUserData(JSON.parse(storedUserData))
        }
    }, [])

    const navigate = useNavigate()

    const [upvoteCount , setUpvoteCount] = useState(upvoters?.length || 0)
    const [downvoteCount , setDownvoteCount] = useState(downvoters?.length || 0)
    const [userVote , setUserVote] = useState(null)
    const [voting , setVoting] = useState(false)

    useEffect(()=>{
        if(userData && userData._id){
            if(upvoters?.includes(userData._id)) setUserVote("up")
            else if(downvoters?.includes(userData._id)) setUserVote("down")
        }
    }, [userData])

    function handleVote(type){
        if(voting) return
        const token = localStorage.getItem('token')
        if(!token){
            toast.error("Please sign in to vote")
            return
        }
        setVoting(true)
        axios.put(`http://localhost:3000/post/${type}vote`, {
            postId : postId
        } , {
            headers:{
                'Authorization':token
            }
        }).then((response)=>{
            setUpvoteCount(response.data.upvote)
            setDownvoteCount(response.data.downvote)
            setUserVote(response.data.userVote)
        }).catch((err)=>{
            toast.error(err.response?.data?.msg || "Couldn't record your vote")
        }).finally(()=>{
            setVoting(false)
        })
    }

    function handleDelete(e){
        e.preventDefault()
        if(!window.confirm("Delete this post? This can't be undone.")) return
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
        }).then(()=>{
            toast.success("Post deleted")
            window.location.reload();
        }).catch((err)=>{
            toast.error(err.response?.data?.msg || "Couldn't delete post")
        })
    }

    return (
        <div className="w-full max-w-3xl mx-auto mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 break-words">
                  {title}
                </h2>
                <div className="mt-2 max-h-56 overflow-y-auto whitespace-pre-wrap text-slate-600 leading-relaxed" style={{scrollbarWidth: "thin"}}>
                    {content}
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e)=>{ e.preventDefault(); handleVote("up") }}
                        disabled={voting}
                        aria-pressed={userVote === "up"}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                            userVote === "up"
                                ? "bg-green-50 border-green-400 text-green-600"
                                : "bg-white border-slate-200 text-slate-500 hover:border-green-300 hover:text-green-600"
                        }`}
                    >
                        <ArrowIcon direction="up" active={userVote === "up"} />
                        {upvoteCount}
                    </button>
                    <button
                        onClick={(e)=>{ e.preventDefault(); handleVote("down") }}
                        disabled={voting}
                        aria-pressed={userVote === "down"}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                            userVote === "down"
                                ? "bg-red-50 border-red-400 text-red-600"
                                : "bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600"
                        }`}
                    >
                        <ArrowIcon direction="down" active={userVote === "down"} />
                        {downvoteCount}
                    </button>
                </div>
                {userId == userData._id ?
                <div className="flex items-center gap-2">
                    <button onClick={(e)=>{
                        e.preventDefault()
                        navigate('/createPost' , {state: {post : 'Update Post' , posttitle : title , postdesc : content , postID : postId}})
                    }} className="rounded-xl border border-[#007BFF] text-[#007BFF] hover:bg-[#007BFF] hover:text-white cursor-pointer px-3 py-1.5 font-medium transition-colors">Edit</button>
                    <button onClick={handleDelete} className="rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer px-3 py-1.5 font-medium transition-colors">Delete</button>
                </div> : null}
            </div>
        </div>
    )
}
