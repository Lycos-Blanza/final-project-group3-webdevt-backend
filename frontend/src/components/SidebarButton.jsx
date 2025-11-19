export default function SidebarButton({ children, isActive = false, onClick }) {
    return (
        <>
            <div className={`bg-none
            border-0
            text-[#6D3811]
            text-[1em]
            text-left
            py-2
            w-full
            cursor-pointer
            hover:bg-[#6D3811]/20
            hover:text-[#6D3811]
            flex
            items-center
            gap-2
            p-2
            rounded-md
            ${isActive && 'bg-[#6D3811] text-white'}`} onClick={onClick}>
                {children}
            </div>
        </>
    )
}