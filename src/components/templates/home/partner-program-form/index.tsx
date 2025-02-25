'use client';
import React, { useState } from 'react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export default function PartnerProgramForm() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setSubmitStatus('idle');
        setErrorMessage("");

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to schedule call');
            }

            setSubmitStatus('success');
            setFormData({
                firstName: "",
                lastName: "",
                email: ""
            });
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to schedule call');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-white p-4 pb-8">
            <div className="w-full max-w-5xl flex flex-col md:flex-row">
                {/* Left section with heading */}
                <div className="md:w-1/2 flex flex-col justify-center p-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                            Schedule a call
                        </span>
                        <br />
                        <span className="text-gray-800">to learn more</span>
                    </h1>
                    <p className="text-gray-700 mb-4">
                        about joining{" "}
                        <span className="font-semibold">
                            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                                GOXI
                            </span>{" "}
                            Partner Program
                        </span>
                    </p>
                </div>

                {/* Right section with form */}
                <div className="md:w-1/2">
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        {submitStatus === 'success' && (
                            <div className="bg-green-50 p-4 mb-6 border border-green-200 rounded-[8px]">
                                <div className="text-green-800 font-medium">Success!</div>
                                <div className="text-green-700">
                                    Your call has been scheduled successfully. We'll get back to you soon.
                                </div>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="bg-red-50 p-4 mb-6 border border-red-200 rounded-[8px]">
                                <div className="text-red-800 font-medium">Error</div>
                                <div className="text-red-700">
                                    {errorMessage}
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full p-3 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-[8px] shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                                />
                                {formErrors.firstName && (
                                    <p className="mt-1 text-red-500 text-sm">{formErrors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full p-3 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-[8px] shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                                />
                                {formErrors.lastName && (
                                    <p className="mt-1 text-red-500 text-sm">{formErrors.lastName}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Work Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-[8px] shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                                />
                                {formErrors.email && (
                                    <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
                                )}
                            </div>

                            <div className="pt-2 w-[200px] m-auto">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-6 rounded-[8px] shadow-lg font-medium text-lg bg-gradient-to-r from-red-600 to-orange-500 text-white transition-transform transform hover:scale-105 disabled:opacity-70"
                                >
                                    {isLoading ? "Processing..." : "Schedule A Call"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};