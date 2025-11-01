import LeftSidebar from "@/components/LeftSidebar";
import {ReactNode} from "react";
import RightSidebar from "@/components/RightSidebar";

export default function layout({children}: Readonly<{children: ReactNode}>) {
    return (
        <div>
            <LeftSidebar />
            <div className="h-screen xl:mr-90 mr-0 md:ml-90 ml-0">
                {children}
            </div>
            <RightSidebar />
        </div>
    )
}