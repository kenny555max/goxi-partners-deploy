'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from "./input";
import AuthHero from "./auth-hero";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
const AgentRegistrationForm: React.FC<AuthFormProps> = ({ heroProps }) => {
    const [error, setError] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone1: '',
        phone2: '',
        address: '',
        area: '',
        city: '',
        state: '',
        faxNo: '',
        insPerson: '',
        finPerson: '',
        accountNo: '',
        bankname: '',
        password: '',
        confirm_password: ''
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
        const { fullName, email, phone1, address, password, confirm_password } = formData;

        if (!fullName || !email || !phone1 || !address || !password || !confirm_password) {
            setError("Fill all required fields");
            return;
        }

        if (password !== confirm_password) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            // First authenticate to get token
            const authResponse = await fetch("/api/auth", {
                method: "POST"
            });

            if (!authResponse.ok) {
                throw new Error("Authentication failed");
            }

            // Then create the agent
            const agentData = {
                unitID: Math.random().toString(36).substring(2, 10), // Generate a random ID
                agent: formData.fullName,
                address: formData.address,
                area: formData.area || "",
                city: formData.city || "",
                state: formData.state || "",
                phone1: formData.phone1,
                phone2: formData.phone2 || "",
                faxNo: formData.faxNo || "",
                email: formData.email,
                insPerson: formData.insPerson || "",
                finPerson: formData.finPerson || "",
                balance: 0,
                creditLimit: 0,
                comRate: 0,
                remark: "",
                accountNo: formData.accountNo || "",
                bankname: formData.bankname || "",
                tag: "",
                submittedBy: formData.fullName,
                modifiedBy: ""
            };

            const response = await fetch("/api/agents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(agentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw { message: data?.error || "Failed to create agent" }
            }

            console.log("Agent created successfully:", data);

            router.push("/thank-you");
        } catch (error: any) {
            console.error(error);
            setError(error.message || "Failed to create agent");
        } finally {
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

                    <h2 className="text-xl font-semibold mt-8 mb-6">Register as an Agent</h2>

                    {error && (
                        <div className="text-destructive text-red-500 rounded-[10px] mb-2 bg-pink-200 p-[10px] text-[15px] font-[500]">{error}</div>
                    )}

                    <div className="space-y-4 form-scroll h-[300px] overflow-y-scroll">
                        <Input
                            label="Full Name *"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                        <Input
                            label="Email Address *"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            label="Primary Phone *"
                            type="tel"
                            name="phone1"
                            value={formData.phone1}
                            onChange={handleChange}
                        />

                        <Input
                            label="Secondary Phone"
                            type="tel"
                            name="phone2"
                            value={formData.phone2}
                            onChange={handleChange}
                        />

                        <Input
                            label="Address *"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <Input
                            label="Area"
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                        />

                        <Input
                            label="City"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />

                        <Input
                            label="State"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />

                        <Input
                            label="Bank Name"
                            type="text"
                            name="bankname"
                            value={formData.bankname}
                            onChange={handleChange}
                        />

                        <Input
                            label="Account Number"
                            type="text"
                            name="accountNo"
                            value={formData.accountNo}
                            onChange={handleChange}
                        />

                        <Input
                            label="Password *"
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

                        <Input
                            label="Confirm Password *"
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

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                        >
                            {isLoading ? "Loading..." : "Register as Agent"}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already registered?{' '}
                        <Link href="/login" className="text-orange-500 hover:text-orange-600">
                            Login
                        </Link>
                    </p>
                </div>

                {/* Hero Section */}
                <AuthHero {...heroProps} />
            </div>
        </div>
    );
};

export default AgentRegistrationForm;