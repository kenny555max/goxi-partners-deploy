'use client';
'use client';
// components/forms/NewPolicyForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Define option types
type SelectOption = {
    value: string;
    label: string;
};

// Define product and product type interfaces
interface ProductType {
    plan: string;
    sumInsured: number;
    annualPayment: number;
    monthlyPayment: number;
}

// Update the Product interface to include productID
interface Product {
    id: string;
    name: string;
    productID: string; // Added productID field
    types: ProductType[];
}

// Update the productsData array with productID for each product
const productsData: Product[] = [
    {
        id: "asset-protection",
        name: "ASSET PROTECTION",
        productID: "AP", // Added productID
        types: [
            { plan: "Basic", sumInsured: 100000, annualPayment: 1000, monthlyPayment: 100 },
            { plan: "Bronze", sumInsured: 120000, annualPayment: 1500, monthlyPayment: 150 }
        ]
    },
    {
        id: "goxi-coperative",
        name: "GOXI COPERATIVE MEMBERS INSURANCE",
        productID: "GCM", // Added productID
        types: [
            { plan: "Basic", sumInsured: 100000, annualPayment: 1890, monthlyPayment: 160 },
            { plan: "Bronze", sumInsured: 250000, annualPayment: 5400, monthlyPayment: 450 }
        ]
    },
    {
        id: "goxi-family",
        name: "GOXI FAMILY WELFARE INSURANCE",
        productID: "GFMW", // Added productID
        types: [
            { plan: "Basic", sumInsured: 300000, annualPayment: 12000, monthlyPayment: 1000 },
            { plan: "Bronze", sumInsured: 400000, annualPayment: 14400, monthlyPayment: 1200 },
            { plan: "Gold", sumInsured: 600000, annualPayment: 15600, monthlyPayment: 1300 }
        ]
    },
    {
        id: "goxi-4-sure",
        name: "GOXI 4 SURE",
        productID: "GS", // Added productID
        types: [
            { plan: "Basic", sumInsured: 300000, annualPayment: 12000, monthlyPayment: 1000 }
        ]
    },
    {
        id: "ma-business",
        name: "MA BUSINESS",
        productID: "MAB", // Added productID
        types: [
            { plan: "Basic", sumInsured: 50000, annualPayment: 3000, monthlyPayment: 250 },
            { plan: "Bronze", sumInsured: 70000, annualPayment: 4500, monthlyPayment: 375 },
            { plan: "Silver", sumInsured: 100000, annualPayment: 6000, monthlyPayment: 500 },
            { plan: "Gold", sumInsured: 120000, annualPayment: 7500, monthlyPayment: 625 },
            { plan: "Platinum", sumInsured: 150000, annualPayment: 9000, monthlyPayment: 725 }
        ]
    },
    {
        id: "microleasing-protection",
        name: "MICROLEASING PROTECTION",
        productID: "MLP", // Added productID
        types: [
            { plan: "Basic 100K", sumInsured: 100000, annualPayment: 1000, monthlyPayment: 100 },
            { plan: "Basic 150K", sumInsured: 150000, annualPayment: 2000, monthlyPayment: 200 }
        ]
    }
];

// Define other option arrays
const stateOptions: SelectOption[] = [
    { value: "lagos", label: "Lagos" }
];

const genderOptions: SelectOption[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

const maritalStatusOptions: SelectOption[] = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
];

const paymentFrequencyOptions: SelectOption[] = [
    { value: "monthly", label: "Monthly" },
    { value: "annually", label: "Annually" },
];

// const policyCoverTypeOptions: SelectOption[] = [
//     { value: "basic", label: "Asset Protection Basic Cover" },
//     { value: "additional", label: "Asset Protection Additional Cover" },
//     { value: "ml-basic", label: "Micro Leasing Basic Cover" },
//     { value: "ml-extension", label: "Micro Leasing Extension" },
// ];

// Update PolicyFormData interface to include productID
interface PolicyFormData {
    product: string;
    productType: string;
    productID: string; // Added productID field
    agentEmail: string;
    sumInsured: string;
    premium: string;
    policyType: string;
    startDate: Date | null;
    maturityDate: Date | null;
    frequency: string;
    surname: string;
    otherNames: string;
    customerEmail: string;
    phoneNo: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    gender: string;
    maritalStatus: string;
    dob: Date | null;
    terms: boolean;
}

// API response type
interface ApiResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

export default function NewPolicyForm({ agentValue }: { agentValue?: any }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [currentProductTypes, setCurrentProductTypes] = useState<SelectOption[]>([]);
    const url = window.location.href;

    // Convert products data to select options
    const productOptions: SelectOption[] = productsData.map(product => ({
        value: product.id,
        label: product.name
    }));

    // Update initial formData to include productID
    const [formData, setFormData] = useState<PolicyFormData>({
        product: "",
        productType: "",
        productID: "", // Added productID with empty initial value
        agentEmail: "",
        sumInsured: "",
        premium: "",
        policyType: "Basic",
        startDate: new Date(),
        maturityDate: new Date(),
        frequency: "",
        surname: "",
        otherNames: "",
        customerEmail: "",
        phoneNo: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        gender: "",
        maritalStatus: "",
        dob: new Date(),
        terms: false
    });

    // Update the handleSelectChange function or add a new effect to set productID when product changes
// This should be inside the component but outside of other functions
    useEffect(() => {
        if (formData.product) {
            const selectedProduct = productsData.find(p => p.id === formData.product);
            if (selectedProduct) {
                // Set the productID when a product is selected
                setFormData(prev => ({
                    ...prev,
                    productID: selectedProduct.productID
                }));

                // Rest of the existing product selection logic...
                const typeOptions = selectedProduct.types.map(type => ({
                    value: `${type.plan}|${type.sumInsured}|${type.annualPayment}|${type.monthlyPayment}`,
                    label: `Plan: ${type.plan} | SI: ${type.sumInsured} | AP: ${type.annualPayment} | MP: ${type.monthlyPayment}`
                }));
                setCurrentProductTypes(typeOptions);

                // Reset product type when product changes
                setFormData(prev => ({
                    ...prev,
                    productType: "",
                    sumInsured: "",
                    premium: ""
                }));
            }
        }
    }, [formData.product]);

    // Effect to update sum insured and premium when product type or frequency changes
    useEffect(() => {
        if (formData.productType && formData.frequency) {
            const [plan, sumInsured, annualPayment, monthlyPayment] = formData.productType.split('|');

            setFormData(prev => ({
                ...prev,
                sumInsured: sumInsured,
                premium: formData.frequency === 'annually' ? annualPayment : monthlyPayment
            }));
        } else if (formData.productType) {
            const [plan, sumInsured] = formData.productType.split('|');

            setFormData(prev => ({
                ...prev,
                sumInsured: sumInsured,
                // Don't update premium if frequency not selected
            }));
        }
    }, [formData.productType, formData.frequency]);

    // Handle standard input changes with type safety
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (name: keyof PolicyFormData, date: Date | null) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: date
        }));
    };

    // Handle select changes with proper typing
    const handleSelectChange = (name: keyof PolicyFormData, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Ensure dates are valid SQL Server dates (after 1753-01-01)
    const validateDates = () => {
        const minSqlDate = new Date('1753-01-01');

        // Check each date field
        if (formData.startDate && formData.startDate < minSqlDate) {
            toast({
                title: "Invalid Date",
                description: "Start date must be after January 1, 1753",
                variant: "destructive"
            });
            return false;
        }

        if (formData.maturityDate && formData.maturityDate < minSqlDate) {
            toast({
                title: "Invalid Date",
                description: "Maturity date must be after January 1, 1753",
                variant: "destructive"
            });
            return false;
        }

        if (formData.dob && formData.dob < minSqlDate) {
            toast({
                title: "Invalid Date",
                description: "Date of birth must be after January 1, 1753",
                variant: "destructive"
            });
            return false;
        }

        return true;
    }

    // Form validation
    const validateForm = (): boolean => {
        const requiredFields: (keyof PolicyFormData)[] = [
            'product', 'productType', 'agentEmail', 'sumInsured',
            'policyType', 'startDate', 'maturityDate', 'frequency',
            'surname', 'otherNames', 'customerEmail', 'phoneNo',
            'address', 'city', 'state', 'gender', 'maritalStatus', 'dob'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast({
                title: "Validation Error",
                description: `Please fill in all required fields: ${missingFields.join(', ')}`,
                variant: "destructive"
            });
            return false;
        }

        if (!validateDates()) {
            return false;
        }

        if (!formData.terms) {
            toast({
                title: "Terms Agreement Required",
                description: "You must agree to the terms and conditions",
                variant: "destructive"
            });
            return false;
        }

        return true;
    };

    // Make sure to also reset productID when resetForm is called
    const resetForm = () => {
        setFormData({
            product: "",
            productType: "",
            productID: "", // Reset productID as well
            agentEmail: "",
            sumInsured: "",
            premium: "",
            policyType: "",
            startDate: null,
            maturityDate: null,
            frequency: "",
            surname: "",
            otherNames: "",
            customerEmail: "",
            phoneNo: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            gender: "",
            maritalStatus: "",
            dob: null,
            terms: false
        });
        setCurrentProductTypes([]);
    }

    // Form submission handler
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        console.log(formData)

        try {
            const response = await fetch('/api/policies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    agentID: agentValue?.agentID,
                    isOrg: url.includes("group-policy"),
                    // Convert dates to ISO strings
                    startDate: formData.startDate ? formData.startDate.toISOString() : null,
                    maturityDate: formData.maturityDate ? formData.maturityDate.toISOString() : null,
                    dob: formData.dob ? formData.dob.toISOString() : null,
                }),
            });

            const data: ApiResponse = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Policy created successfully!"
                });
                // Reset form and redirect to policies list
                resetForm();

                if (url.includes("group-policy")){
                    router.push("/group-policy/group-life");
                }else {
                    router.push('/individual-policy/all');
                }
            } else {
                throw new Error(data.message || 'Failed to create policy');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred while creating the policy",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
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
                                        <Select
                                            name="product"
                                            required
                                            value={formData.product}
                                            onValueChange={(value) => handleSelectChange('product', value)}
                                        >
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
                                        <Select
                                            name="productType"
                                            required
                                            value={formData.productType}
                                            onValueChange={(value) => handleSelectChange('productType', value)}
                                            disabled={!formData.product}
                                        >
                                            <SelectTrigger id="productType">
                                                <SelectValue placeholder="Choose..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currentProductTypes.length > 0 ? (
                                                    currentProductTypes.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-types" disabled>
                                                        Select a product first
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="frequency" className="mb-1 block">Frequency of Payment</Label>
                                    <Select
                                        name="frequency"
                                        required
                                        value={formData.frequency}
                                        onValueChange={(value) => handleSelectChange('frequency', value)}
                                    >
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

                                <div>
                                    <Label htmlFor="agentEmail" className="mb-1 block">Agent Email</Label>
                                    <Input
                                        type="email"
                                        id="agentEmail"
                                        name="agentEmail"
                                        placeholder="agent@example.com"
                                        value={formData.agentEmail}
                                        onChange={handleInputChange}
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
                                            value={formData.sumInsured}
                                            onChange={handleInputChange}
                                            required
                                            readOnly={!!formData.productType}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="premium" className="mb-1 block">Premium</Label>
                                        <Input
                                            type="number"
                                            id="premium"
                                            name="premium"
                                            placeholder="0.00"
                                            value={formData.premium}
                                            onChange={handleInputChange}
                                            required
                                            readOnly={!!(formData.productType && formData.frequency)}
                                        />
                                    </div>
                                </div>

                                {/*<div>*/}
                                {/*    <Label htmlFor="policyType" className="mb-1 block">Policy Cover Type</Label>*/}
                                {/*    <Select*/}
                                {/*        name="policyType"*/}
                                {/*        required*/}
                                {/*        value={formData.policyType}*/}
                                {/*        onValueChange={(value) => handleSelectChange('policyType', value)}*/}
                                {/*    >*/}
                                {/*        <SelectTrigger id="policyType">*/}
                                {/*            <SelectValue placeholder="Choose..." />*/}
                                {/*        </SelectTrigger>*/}
                                {/*        <SelectContent>*/}
                                {/*            {policyCoverTypeOptions.map((option) => (*/}
                                {/*                <SelectItem key={option.value} value={option.value}>*/}
                                {/*                    {option.label}*/}
                                {/*                </SelectItem>*/}
                                {/*            ))}*/}
                                {/*        </SelectContent>*/}
                                {/*    </Select>*/}
                                {/*</div>*/}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate" className="mb-1 block">Start Date</Label>
                                        <DatePicker
                                            placeholder="Start Date"
                                            value={formData.startDate || undefined}
                                            onChange={(date) => handleDateChange('startDate', date || null)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="maturityDate" className="mb-1 block">Maturity Date</Label>
                                        <DatePicker
                                            placeholder="Maturity Date"
                                            value={formData.maturityDate || undefined}
                                            onChange={(date) => handleDateChange('maturityDate', date || null)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="policyDocuments" className="mb-1 block">Policy Documents</Label>
                                    <Input
                                        type="file"
                                        id="policyDocuments"
                                        name="policyDocuments"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const file = e.target.files[0];
                                                setFormData(prevData => ({
                                                    ...prevData,
                                                    policyDocuments: file
                                                }));
                                            }
                                        }}
                                        className="cursor-pointer"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Upload policy documents (PDF, DOC, DOCX)</p>
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
                                            value={formData.surname}
                                            onChange={handleInputChange}
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
                                            value={formData.otherNames}
                                            onChange={handleInputChange}
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
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
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
                                        value={formData.phoneNo}
                                        onChange={handleInputChange}
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
                                        value={formData.address}
                                        onChange={handleInputChange}
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
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state" className="mb-1 block">State</Label>
                                        <Select
                                            name="state"
                                            required
                                            value={formData.state}
                                            onValueChange={(value) => handleSelectChange('state', value)}
                                        >
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
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="gender" className="mb-1 block">Gender</Label>
                                        <Select
                                            name="gender"
                                            required
                                            value={formData.gender}
                                            onValueChange={(value) => handleSelectChange('gender', value)}
                                        >
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
                                        <Select
                                            name="maritalStatus"
                                            required
                                            value={formData.maritalStatus}
                                            onValueChange={(value) => handleSelectChange('maritalStatus', value)}
                                        >
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
                                    <DatePicker
                                        placeholder="Date of Birth"
                                        value={formData.dob || undefined}
                                        onChange={(date) => handleDateChange('dob', date || null)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="identificationDocument" className="mb-1 block">Identification Document</Label>
                                    <Input
                                        type="file"
                                        id="identificationDocument"
                                        name="identificationDocument"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const file = e.target.files[0];
                                                setFormData(prevData => ({
                                                    ...prevData,
                                                    identificationDocument: file
                                                }));
                                            }
                                        }}
                                        className="cursor-pointer"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Upload ID document (PDF, JPG, JPEG, PNG)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center">
                        <Checkbox
                            id="terms"
                            name="terms"
                            className="mr-2"
                            checked={formData.terms}
                            onChange={(e) => {
                                setFormData(prevData => ({
                                    ...prevData,
                                    terms: e.target.checked
                                }));
                            }}
                            required
                        />
                        <Label htmlFor="terms" className="text-sm">
                            I agree to Terms and Conditions
                        </Label>
                    </div>
                </CardContent>

                <CardFooter className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <div className="flex justify-end w-full">
                        <Button
                            variant="outline"
                            type="button"
                            className="mr-2"
                            onClick={() => resetForm()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Policy'}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}