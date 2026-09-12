
export default function Input({onChange ,  placeholder , type}){
    return(
        <input onChange={onChange} type={type} className="m-2 border border-slate-300 p-2 text-slate-800 rounded-xl pl-3.5 box-border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" placeholder={placeholder}  />
    )
}
