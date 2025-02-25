'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from "./input";
import AuthHero from "./auth-hero";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";

// Hero Section Props
type HeroProps = {
    title: string;
    imageSrc: string;
    imageAlt?: string;
    overlayOpacity?: number;
};

// Form Props
type AuthFormProps = {
    heroProps: HeroProps;
};

// Main Form Component
const RegistrationForm: React.FC<AuthFormProps> = ({ heroProps }) => {
    const pathname = usePathname();
    const [error, setError] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        confirm_password: '',
        phone: '',
        password: ''
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const { email, fullName, phone, password, confirm_password } = formData;

        if (!email || !fullName || !phone || !password || !confirm_password){
            setError("Fill all fields");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({})
            })

            const data = await response.json();

            if (!response.ok){
                throw { message: data?.error || "Failed to create user" }
            }

            console.log(data);
            router.push("/admin/home");
        }catch(error){
            console.log(error);
            setError("Failed to create user");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-6xl h-[90vh] md:h-[80vh] flex rounded-lg shadow-lg overflow-hidden bg-white">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 lg:p-12">
                    <Link href={"/"} className="text-red-600 flex-shrink-0 text-2xl font-bold">
                        <Image src={"/assets/logo.png"} alt={"goxi-logo"} width={100} height={100} />
                    </Link>

                    <h2 className="text-xl font-semibold mt-8 mb-6">Lets get you started</h2>

                    {error && (
                        <div className="text-destructive text-red-500 rounded-[10px] mb-2 bg-pink-200 p-[10px] text-[15px] font-[500]">{error}</div>
                    )}

                    <div className="space-y-4 form-scroll h-[300px] overflow-y-scroll">
                        {pathname?.includes("/register") && <Input
                            label="Full name"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />}

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {pathname?.includes("/register") && <Input
                            label="Phone number"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            icon={<span className="text-sm text-gray-500">+1</span>}
                        />}

                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                            }
                        />

                        {pathname?.includes("/register") && (
                            <Input
                                label="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                icon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                }
                            />
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                        >
                            {pathname?.includes("/login") ?
                                isLoading ? "Loading..." : "Sign In" :
                                isLoading ? "Loading..." : "Sign Up"
                            }
                        </button>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already a user?{' '}
                        <Link href={pathname?.includes("/login") ? "/register" : "/login"} className="text-orange-500 hover:text-orange-600">
                            {pathname?.includes("/login") ? "register" : "login"}
                        </Link>
                    </p>
                </div>

                {/* Hero Section */}
                <AuthHero {...heroProps} />
            </div>
        </div>
    );
};

export default RegistrationForm;