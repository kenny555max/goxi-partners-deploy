import NewPolicyForm from "@/components/forms/new-policy-form";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function NewPolicyPage(){
    // Access cookies on the server
    const agentDataCookie = (await cookies()).get('goxi-auth-token');

    if (!agentDataCookie?.value) {
        redirect('/login');
    }

    const agentValue = JSON.parse(agentDataCookie?.value);

    return(
        <div>
            <NewPolicyForm agentValue={agentValue} />
        </div>
    );
}