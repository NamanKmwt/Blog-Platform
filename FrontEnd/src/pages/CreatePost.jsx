import axios from "axios";
import { useState  } from "react"
import { useLocation , useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function CreatePost(){
    const location = useLocation();
    const { post, posttitle, postdesc , postID } = location.state || {};
    const [isEdit , setisEdit] = useState("Save")
    const [title , settitle] = useState(posttitle)
    const [desc , setDesc] = useState(postdesc)
    const [submitting , setSubmitting] = useState(false)
    const navigate = useNavigate()

    const mode = ()=>{
        if(isEdit == "Save"){
            setisEdit("Edit");
        }else{
            setisEdit("Save")
        }
    }

    function handleUpload(e){
        e.preventDefault();
        const token = localStorage.getItem('token')
        if(isEdit == 'Save'){
            toast.error("Save your changes first")
            return
        }
        setSubmitting(true)
        if(post == 'Create Post'){
            axios.post('http://localhost:3000/post/create' , {
                title : title,
                content : desc
            },{
                headers :{
                    'Authorization':token
                }
            }).then(()=>{
                toast.success("Post created")
                settitle("")
                setDesc("")
                navigate('/home')
            }).catch((err)=>{
                toast.error(err.response?.data?.msg || "Couldn't create post")
            }).finally(()=>{
                setSubmitting(false)
            })
        }else{
            axios.put('http://localhost:3000/post/update', {
                postId : postID,
                title : title,
                content : desc
            },{
                headers:{
                    'Authorization': token
                }
            }).then(()=>{
                toast.success("Post updated")
                navigate('/home')
            }).catch((err)=>{
                toast.error(err.response?.data?.msg || "Couldn't update post")
            }).finally(()=>{
                setSubmitting(false)
            })
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-100">
        <div className="m-2.5 p-6 flex rounded-2xl flex-col justify-center items-center bg-white shadow-lg box-content">
        <div className="w-full relative flex justify-center items-end">
        <div className="text-slate-900 text-5xl font-semibold" style={{fontFamily:"fantasy"}}>{post}</div>
        <span className="absolute right-0">
            <button onClick={
                (e)=>{
                    e.preventDefault()
                    navigate('/home')
                }
            } className="bg-red-500 text-white border-[1px] hover:bg-red-600 rounded-lg cursor-pointer m-1.5 px-3 py-1.5 font-medium transition-colors">✕</button>
        </span>
        </div>
        <div className="flex flex-col w-full">
            {isEdit == "Save"? <input defaultValue={title} onInput={(e)=>{settitle(e.target.value)}} type="text" placeholder="Title"  className="w-3xl max-w-full m-2 border border-slate-300 text-slate-800 rounded-2xl p-2 pl-3.5 box-border focus:outline-none focus:ring-2 focus:ring-blue-300"/> : <div className="w-3xl max-w-full m-2 border border-slate-200 bg-slate-50 rounded-2xl text-slate-900 p-2 pl-3.5 font-medium" >{title}</div>}

            {isEdit == "Save" ? <textarea defaultValue={desc} onInput={(e)=>{setDesc(e.target.value)}}  placeholder="Description" style={{scrollbarWidth : "none"}} className="w-3xl max-w-full h-90 m-2 border border-slate-300 text-slate-800 rounded-2xl p-2 pl-3.5 box-border focus:outline-none focus:ring-2 focus:ring-blue-300"></textarea> :
            <div className="w-3xl max-w-full overflow-y-auto h-90 m-2 border border-slate-200 bg-slate-50 rounded-2xl text-slate-900 p-2 pl-3.5 whitespace-pre-wrap" style={{scrollbarWidth:"none"}}>{desc}</div>}

        </div>
        <div className="w-full flex justify-end">
            {isEdit == "Save" ? <button onClick={mode} className="bg-green-500 text-white border-[1px] hover:bg-green-600 rounded-xl cursor-pointer m-1.5 px-3 py-1.5 font-medium transition-colors">{isEdit}</button> : <button onClick={mode} className="bg-[#007BFF] text-white border-[1px] hover:bg-blue-600 rounded-xl cursor-pointer m-1.5 px-3 py-1.5 font-medium transition-colors">{isEdit}</button> }

            <button onClick={handleUpload} disabled={submitting} className="bg-green-500 text-white border-[1px] hover:bg-green-600 rounded-xl cursor-pointer m-1.5 px-3 py-1.5 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Uploading…" : "Upload"}</button>
        </div>
        </div>
        </div>
    )
}
