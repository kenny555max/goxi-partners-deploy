'use client';
// components/forms/NewPolicyForm.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Updated the empty string to "default"
const productOptions = [
    { value: "life", label: "Life Insurance" },
    { value: "health", label: "Health Insurance" },
    { value: "property", label: "Property Insurance" },
    { value: "auto", label: "Auto Insurance" },
];

const productTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "family", label: "Family" },
    { value: "group", label: "Group" },
];

const stateOptions = [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "oyo", label: "Oyo" },
    // Add more states as needed
];

const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
];

const paymentFrequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "biannually", label: "Biannually" },
    { value: "annually", label: "Annually" },
];

const policyCoverTypeOptions = [
    { value: "basic", label: "Basic" },
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
    { value: "comprehensive", label: "Comprehensive" },
];

export default function NewPolicyForm() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted");
    };

    return (
        <Card className="w-full max-w-full bg-white shadow-md">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-xl text-custom-green">New Policy</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <h3 className="text-lg font-medium mb-4">Policy Information</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="product" className="mb-1 block">Product</Label>
                                        <Select name="product" required>
                                            <SelectTrigger id="product">
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {productOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="productType" className="mb-1 block">Product Type</Label>
                                        <Select name="productType" required>
                                            <SelectTrigger id="productType">
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {productTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="agentEmail" className="mb-1 block">Agent Email</Label>
                                    <Input
                                        type="email"
                                        id="agentEmail"
                                        name="agentEmail"
                                        placeholder="agent@example.com"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sumInsured" className="mb-1 block">Sum Insured</Label>
                                        <Input
                                            type="number"
                                            id="sumInsured"
                                            name="sumInsured"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="premium" className="mb-1 block">Premium</Label>
                                        <Input
                                            type="number"
                                            id="premium"
                                            name="premium"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="policyType" className="mb-1 block">Policy Cover Type</Label>
                                    <Select name="policyType" required>
                                        <SelectTrigger id="policyType">
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {policyCoverTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate" className="mb-1 block">Start Date</Label>
                                        <DatePicker placeholder="Start Date" />
                                    </div>
                                    <div>
                                        <Label htmlFor="maturityDate" className="mb-1 block">Maturity Date</Label>
                                        <DatePicker placeholder="Maturity Date" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="frequency" className="mb-1 block">Frequency of Payment</Label>
                                    <Select name="frequency" required>
                                        <SelectTrigger id="frequency">
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentFrequencyOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <h3 className="text-lg font-medium mb-4">Customer Information</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="surname" className="mb-1 block">Surname</Label>
                                        <Input
                                            type="text"
                                            id="surname"
                                            name="surname"
                                            placeholder="Surname"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="otherNames" className="mb-1 block">Other Names</Label>
                                        <Input
                                            type="text"
                                            id="otherNames"
                                            name="otherNames"
                                            placeholder="Other Names"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="customerEmail" className="mb-1 block">Customer Email</Label>
                                    <Input
                                        type="email"
                                        id="customerEmail"
                                        name="customerEmail"
                                        placeholder="customer@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phoneNo" className="mb-1 block">Phone No</Label>
                                    <Input
                                        type="tel"
                                        id="phoneNo"
                                        name="phoneNo"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address" className="mb-1 block">Address</Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder="Street Address"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city" className="mb-1 block">City</Label>
                                        <Input
                                            type="text"
                                            id="city"
                                            name="city"
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state" className="mb-1 block">State</Label>
                                        <Select name="state" required>
                                            <SelectTrigger id="state">
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {stateOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="postalCode" className="mb-1 block">Postal Code</Label>
                                        <Input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            placeholder="Postal Code"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="gender" className="mb-1 block">Gender</Label>
                                        <Select name="gender" required>
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {genderOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="maritalStatus" className="mb-1 block">Marital Status</Label>
                                        <Select name="maritalStatus" required>
                                            <SelectTrigger id="maritalStatus">
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {maritalStatusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="dob" className="mb-1 block">Date of Birth</Label>
                                    <DatePicker placeholder="Date of Birth" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center">
                        <Checkbox id="terms" name="terms" className="mr-2" required />
                        <Label htmlFor="terms" className="text-sm">
                            I agree to Terms and Conditions
                        </Label>
                    </div>
                </CardContent>

                <CardFooter className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <div className="flex justify-end w-full">
                        <Button variant="outline" type="button" className="mr-2">
                            Cancel
                        </Button>
                        <Button type="submit">Create Policy</Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}