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
    formType: string;
};

// Form Props
type AuthFormProps = {
    heroProps: HeroProps;
};

// Main Form Component
const AuthForm: React.FC<AuthFormProps> = ({ heroProps }) => {
    const [error, setError] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone1: '',
        agentID: '',
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
    const isLoginForm = heroProps.formType === 'login';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Validation differs based on form type
        if (isLoginForm) {
            // Login validation
            const { email, password } = formData;
            if (!email || !password) {
                setError("Email and password are required");
                return;
            }
        } else {
            // Register validation
            const { fullName, email, phone1, address, password, confirm_password } = formData;
            if (!fullName || !email || !phone1 || !address || !password || !confirm_password) {
                setError("Fill all required fields");
                return;
            }
            if (password !== confirm_password) {
                setError("Passwords do not match");
                return;
            }
        }

        try {
            setIsLoading(true);
            setError("");

            // First authenticate to get token
            //const authResponse = await fetch("/api/auth", {
            //    method: "POST"
            //});

            //if (!authResponse.ok) {
            //    throw new Error("Authentication failed");
            //}

            // Prepare data for submission - different for login vs register
            // For login, populate default values for required fields
            const agentData = {
                unitID: Math.random().toString(36).substring(2, 10), // Generate a random ID
                agent: isLoginForm ? "Default Agent" : formData.fullName,
                address: isLoginForm ? "Default Address" : formData.address,
                area: isLoginForm ? "" : (formData.area || ""),
                agentId: isLoginForm ? (formData.agentID || "") : "",
                city: isLoginForm ? "" : (formData.city || ""),
                state: isLoginForm ? "" : (formData.state || ""),
                phone1: isLoginForm ? "0000000000" : formData.phone1,
                phone2: isLoginForm ? "" : (formData.phone2 || ""),
                faxNo: isLoginForm ? "" : (formData.faxNo || ""),
                email: formData.email, // Email is required for both
                insPerson: isLoginForm ? "" : (formData.insPerson || ""),
                finPerson: isLoginForm ? "" : (formData.finPerson || ""),
                balance: 0,
                password: formData.password,
                creditLimit: 0,
                comRate: 0,
                remark: "",
                accountNo: isLoginForm ? "" : (formData.accountNo || ""),
                bankname: isLoginForm ? "" : (formData.bankname || ""),
                tag: isLoginForm ? "login" : "register", // Mark the type of submission
                submittedBy: isLoginForm ? "LoginSystem" : formData.fullName,
                modifiedBy: ""
            };

            // For login, show success message instead of redirecting
            if (isLoginForm) {
                // check if agent is registered
                const check_agent_response = await fetch(`/api/agents/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        appID: agentData.email,
                        password: formData.password
                    })
                });

                const check_agent_data = await check_agent_response.json();

                if (!check_agent_response.ok) {
                    throw { message: `Failed to ${isLoginForm ? 'login' : 'create agent'}` }
                }

                //setError("");
                router.push("/dashboard");
            } else {
                // Same endpoint for both login and register
                const response = await fetch("/api/agents", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(agentData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw { message: data?.error || `Failed to ${isLoginForm ? 'login' : 'create agent'}` }
                }

                //console.log(`${isLoginForm ? 'Login' : 'Agent registration'} successful:`, data);

               router.push(`/thank-you?agentId=${data.agentID}`);
            }
        } catch (error) {
            setError(error?.message || `Failed to ${isLoginForm ? 'login' : 'register'}. Please check your credentials and try again.`);
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

                    <h2 className="text-[1.6rem] font-semibold mt-8 mb-6">
                        {isLoginForm ? "Login to Your Account" : "Register as an Agent"}
                    </h2>

                    {error && (
                        <div className="text-destructive text-red-500 rounded-[10px] mb-2 bg-pink-200 p-[10px] text-[15px] font-[500]">{error}</div>
                    )}

                    <div className={`space-y-4 ${!isLoginForm ? "form-scroll h-[300px] overflow-y-scroll" : ""}`}>
                        {/* Show fullName only for registration */}
                        {!isLoginForm && (
                            <Input
                                label="Full Name *"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        )}

                        {/* Email - common to both forms */}
                        <Input
                            label="Email Address *"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {/* Registration-only fields */}
                        {!isLoginForm && (
                            <>
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
                            </>
                        )}

                        {/*isLoginForm && <Input
                            label="AgentID"
                            type="text"
                            placeholder="Enter AgentId"
                            name="agentID"
                            value={formData.agentID}
                            onChange={handleChange}
                        />*/}

                        {/* Password field - common to both forms */}
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

                        {/* Confirm password - only for registration */}
                        {!isLoginForm && (
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
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full hover:bg-blue-600 bg-orange-500 text-lg text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                        >
                            {isLoading ? "Loading..." : (isLoginForm ? "Login" : "Register as Agent")}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-md text-gray-600">
                        {isLoginForm ? (
                            <>
                                Dont have an account?{' '}
                                <Link href="/register" className="text-orange-500 hover:text-orange-600">
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                Already registered?{' '}
                                <Link href="/login" className="text-orange-500 hover:text-orange-600">
                                    Login
                                </Link>
                            </>
                        )}
                    </p>
                </div>

                {/* Hero Section */}
                <AuthHero {...heroProps} />
            </div>
        </div>
    );
};

export default AuthForm;