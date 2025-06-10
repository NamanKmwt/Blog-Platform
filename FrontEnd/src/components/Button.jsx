
export default function Button({onclick , title}){
    return(
        <>
        <button onClick={onclick} className="bg-[#007BFF] text-white border-[1px] hover:bg-blue-600 rounded-3xl cursor-pointer m-1.5 px-3 p-1.5 font-medium">{title}</button>
        </>
    )
}