import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { ToastProvider } from '@/components/ui/toast-provider'
import { cookies } from 'next/headers';
import {redirect} from "next/navigation";

export default async function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Access cookies on the server
    const agentDataCookie = (await cookies()).get('goxi-auth-token');

    if (!agentDataCookie) {
        redirect('/login');
    }

    const agentValue = JSON.parse(agentDataCookie.value);

    return(
        <div>
            <Header agent={agentValue} />
            <Sidebar />
            <div className="ml-64">
                {children}
                <ToastProvider />
            </div>
        </div>
    );
}