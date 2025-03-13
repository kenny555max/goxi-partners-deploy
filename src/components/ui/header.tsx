import { Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
    return (
        <div className="h-16 fixed right-0 top-0 left-64 bg-white border-b z-10 flex items-center justify-between px-6">
            <div className="font-medium text-blue-800">
                Info! Notification Bar.
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
                </div>

                <div className="flex items-center space-x-2 cursor-pointer">
                    <Avatar>
                        <AvatarImage src="/avatar-placeholder.png" />
                        <AvatarFallback className="bg-gray-200">KJ</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700">Kunle Joseph</span>
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );
};

export default Header;