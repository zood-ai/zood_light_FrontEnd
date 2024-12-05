
const CustomCircle = ({ text }: { text: string }) => {
    return (
        <div className=" flex items-center">
            <div className="w-[32px] h-[32px] bg-primary rounded-full mr-[4px] flex justify-center items-center">
                <div className=" text-white text-[13px] ">
                    {text
                        ?.toString()
                        ?.split("")[0]
                        ?.toLocaleUpperCase()}
                    {text
                        ?.toString()
                        ?.split("")[1]
                        ?.toLocaleUpperCase()}
                </div>
            </div>
            <div >{text || "-"}</div>
        </div>
    )
}

export default CustomCircle