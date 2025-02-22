// Input Props
type InputProps = {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    className?: string;
};

// Input Component
const Input = ({
                   label,
                   type,
                   name,
                   placeholder,
                   value,
                   onChange,
                   icon,
                   className = ''
               }: InputProps) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${className}`}
            />
            {icon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {icon}
                </div>
            )}
        </div>
    </div>
);

export default Input;