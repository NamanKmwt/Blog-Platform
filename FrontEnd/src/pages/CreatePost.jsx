import axios from "axios";
import { useState  } from "react"
import { useLocation , Link, useNavigate } from "react-router";

export default function CreatePost(){
    const location = useLocation();
    const { post, posttitle, postdesc , postID } = location.state || {};
    const [isEdit , setisEdit] = useState("Save")
    const [title , settitle] = useState(posttitle)
    const [desc , setDesc] = useState(postdesc)
    const navigate = useNavigate()

    const mode = ()=>{
        if(isEdit == "Save"){
            setisEdit("Edit");
        }else{
            setisEdit("Save")
        }
    }

    return (
        <div className="w-screen h-screen flex  items-center justify-center">
        <div className= "m-2.5 p-2.5 flex rounded-2xl flex-col justify-center items-center bg-white shadow-white shadow-xl box-content">
        <div className="w-full relative flex justify-center items-end ">
        <div className="text-black text-7xl">{post}</div>
        <span className="absolute right-0">
            <button onClick={
                (e)=>{
                    e.preventDefault()
                    navigate('/home')
                }
            } className="bg-red-600 text-black border-[1px] hover:bg-red-500 rounded-lg cursor-pointer m-1.5 px-3 p-1.5 font-medium"><img className="w-6" src="https://cdn-icons-png.flaticon.com/128/3405/3405244.png" alt="" /></button>
        </span>
        </div>
        <div className="flex flex-col">
            {isEdit == "Save"? <input defaultValue={title} onInput={(e)=>{settitle(e.target.value)}} type="text" placeholder="Title"  className="w-3xl m-2 border-2 border-black text-gray-800 rounded-2xl p-1 pl-2"/> : <div className="w-3xl m-2 border-2 border-black rounded-2xl text-black p-1 pl-2" >{title}</div>}
            
            {isEdit == "Save" ? <textarea defaultValue={desc} onInput={(e)=>{setDesc(e.target.value)}}  placeholder="Description" style={{scrollbarWidth : "none"}} className="w-3xl h-90 m-2 border-2 border-black text-gray-800 rounded-2xl p-1 pl-2 "></textarea> : 
            <div className="w-3xl h-90 m-2 border-2 border-black rounded-2xl text-black p-1 pl-2 ">{desc}</div>}
            
        </div>
        <div className="w-full flex justify-end">
            {isEdit == "Save" ? <button onClick={mode} className="bg-green-500 text-white border-[1px] hover:bg-green-600 rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">{isEdit}</button> : <button onClick={mode} className="bg-[#007BFF] text-white border-[1px] hover:bg-blue-600 rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">{isEdit}</button> }
            
            <button onClick={(e)=>{
                e.preventDefault();
                const token = localStorage.getItem('token')
                if(post == 'Create Post'){
                if(isEdit == 'Save'){
                    alert( "Save first");
                }else{
                    axios.post('http://localhost:3000/post/create' , {
                        title : title , 
                        content : desc 
                    },{
                            headers :{
                                'Authorization':token
                            }
                        }).then((response)=>{
                        console.log(response.data)
                        settitle("")
                        setDesc("")
                        navigate('/home')
                    }).catch((err)=>{
                        console.log("Error : " , err)
                    })
                }}else{
                    if(isEdit =='Save'){
                        alert('Save First')
                    }else{
                        axios.put('http://localhost:3000/post/update', {
                            postId : postID, 
                            title : title , 
                            content : desc
                        },{
                            headers:{
                                'Authorization': token
                            }
                        }).then((response)=>{
                            console.log(response.data)
                            navigate('/home')
                        }).catch((err)=>{
                            console.log("Error " , err)
                        })
                    }
                }
            }} className="bg-green-500 text-white border-[1px] hover:bg-green-600 rounded-xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">Upload</button>
        </div>
        </div>
        </div>
    )
}

