
export default function Input({onChange ,  placeholder , type}){
    return(
        <input onChange={onChange} type={type} className="m-2 border-2 p-1 text-gray-800 border-black rounded-2xl pl-3 box-border  " placeholder={placeholder}  />
    )
}