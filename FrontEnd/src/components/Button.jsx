
export default function Button({onclick , title}){
    return(
        <>
        <button onClick={onclick} className="bg-[#007BFF] text-white border-[1px] border-transparent hover:bg-blue-600 rounded-xl cursor-pointer m-1.5 px-3.5 py-1.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">{title}</button>
        </>
    )
}
