import Image from "next/image";
import React from "react";

interface Props {
    num: number;
    size: string;
}

const Start = (props: Props) => {
    return (
        <div className="flex gap-2">
            {[...Array(props.num)].map((_, index) => (
                <Image
                    key={index}
                    className={`${props.size === "sm" ? "w-[19px] h-[19px]" : "w-[30px] h-[30px]"
                        }`}
                    src="/images/icons/star.png"
                    alt=""
                    width={25}
                    height={25}
                />
            ))}
        </div>
    );
};

export default Start;