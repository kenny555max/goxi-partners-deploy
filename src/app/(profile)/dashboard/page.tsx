import Dashboard from "@/components/dashboard";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

export default async function DashboardPage(){
    // Access cookies on the server
    const agentDataCookie = (await cookies()).get('goxi-auth-token');

    if (!agentDataCookie) {
        redirect('/login');
    }

    const agentValue = JSON.parse(agentDataCookie.value);

    return(
        <div>
            <Dashboard agent={agentValue} />
        </div>
    );
}