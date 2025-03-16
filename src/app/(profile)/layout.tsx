import { ToastProvider } from '@/components/ui/toast-provider'
import { cookies } from 'next/headers';
import {redirect} from "next/navigation";
import NavigationComp from "@/components/navigation";

export default async function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Access cookies on the server
    const agentDataCookie = (await cookies()).get('goxi-auth-token');

    if (!agentDataCookie?.value) {
        redirect('/login');
    }

    const agentValue = JSON.parse(agentDataCookie?.value);

    return(
        <div>
            <NavigationComp agentValue={agentValue} />
            <div className="md:ml-64">
                {children}
                <ToastProvider />
            </div>
        </div>
    );
}