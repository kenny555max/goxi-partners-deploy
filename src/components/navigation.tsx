'use client';
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import {AgentData} from "@/utils/agentCookies";
import {useState} from "react";

export default function NavigationComp({ agentValue }: { agentValue: AgentData }) {
    const [toggleSidebar, handleSidebarToggle] = useState(false);

    return(
        <>
            <Header handleSidebarToggle={handleSidebarToggle} agent={agentValue} />
            <Sidebar toggleSidebar={toggleSidebar} handleSidebarToggle={handleSidebarToggle} />
        </>
    );
}