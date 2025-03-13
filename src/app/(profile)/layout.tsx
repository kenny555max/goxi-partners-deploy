import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { ToastProvider } from '@/components/ui/toast-provider'

export default function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return(
        <div>
            <Header title={"Title"} username={"Kenny"} />
            <Sidebar />
            <div className="ml-64">
                {children}
                <ToastProvider />
            </div>
        </div>
    );
}