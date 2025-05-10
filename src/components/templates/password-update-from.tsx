'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from "./input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const PasswordUpdateForm: React.FC = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        // currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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
        // Validation
        const { email, newPassword, confirmPassword } = formData;

        if (!email || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            setSuccess("");

            const response = await fetch("/api/agents/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: newPassword,
                    // newPassword: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw { message: data?.error || "Failed to update password" };
            }

            setSuccess("Password updated successfully!");

            // Clear form fields after successful update
            setFormData({
                email: '',
                // currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (error: any) {
            setError(error?.message || "Failed to update password. Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <Link href={"/public"} className="flex justify-center">
                    <Image src={"/assets/logo.png"} alt={"goxi-logo"} width={100} height={100} />
                </Link>

                <h2 className="text-2xl font-semibold text-center">
                    Update Your Password
                </h2>

                {error && (
                    <div className="text-destructive text-red-500 rounded-[10px] mb-2 bg-pink-200 p-[10px] text-[15px] font-[500]">{error}</div>
                )}

                {success && (
                    <div className="text-green-700 rounded-[10px] mb-2 bg-green-100 p-[10px] text-[15px] font-[500]">{success}</div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Email Address *"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {/*<Input*/}
                    {/*    label="Current Password *"*/}
                    {/*    type={showPassword ? "text" : "password"}*/}
                    {/*    name="currentPassword"*/}
                    {/*    value={formData.currentPassword}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    icon={*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={() => setShowPassword(!showPassword)}*/}
                    {/*            className="focus:outline-none"*/}
                    {/*        >*/}
                    {/*            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}*/}
                    {/*        </button>*/}
                    {/*    }*/}
                    {/*/>*/}

                    <Input
                        label="New Password *"
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
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

                    <Input
                        label="Confirm New Password *"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
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

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>
                </div>

                <p className="mt-4 text-center text-md text-gray-600">
                    <Link href="/login" className="text-orange-500 hover:text-orange-600">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default PasswordUpdateForm;