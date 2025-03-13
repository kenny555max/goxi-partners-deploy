'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
    policyNo: string;
    surname: string;
    othernames: string;
    certificateNo: string;
    mobileNo: string;
    email: string;
    lossDetails: string;
    lossDate: Date | undefined;
    supportFile: File | null;
}

const ClaimForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        policyNo: '',
        surname: '',
        othernames: '',
        certificateNo: '',
        mobileNo: '',
        email: '',
        lossDetails: '',
        lossDate: undefined,
        supportFile: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                supportFile: e.target.files[0],
            });
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setFormData({
            ...formData,
            lossDate: date,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Create FormData for file upload
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'supportFile' && value) {
                    data.append(key, value);
                } else if (key === 'lossDate' && value) {
                    data.append(key, value.toISOString());
                } else if (typeof value === 'string') {
                    data.append(key, value);
                }
            });

            // API integration for submitting claim
            const response = await fetch('/api/claims/submit', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit claim');
            }

            setSuccess('Your claim has been submitted successfully!');
            // Reset form after successful submission
            setFormData({
                policyNo: '',
                surname: '',
                othernames: '',
                certificateNo: '',
                mobileNo: '',
                email: '',
                lossDetails: '',
                lossDate: undefined,
                supportFile: null,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="shadow-lg border-t-4 border-t-custom-green">
                <CardHeader className="bg-gradient-custom text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Report A Claim</CardTitle>
                    <p className="text-gray-100">Complete the form below to report your insurance claim</p>
                </CardHeader>
                <CardContent className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-custom-red text-custom-red rounded-md">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-custom-green text-custom-green rounded-md">
                            {success}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="policyNo" className="text-foreground font-medium">Policy Number</Label>
                            <Input
                                id="policyNo"
                                name="policyNo"
                                value={formData.policyNo}
                                onChange={handleInputChange}
                                placeholder="Enter Policy Number"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="surname" className="text-foreground font-medium">Surname</Label>
                            <Input
                                id="surname"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                placeholder="Enter Surname"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="othernames" className="text-foreground font-medium">Other Names</Label>
                            <Input
                                id="othernames"
                                name="othernames"
                                value={formData.othernames}
                                onChange={handleInputChange}
                                placeholder="Enter Other Names"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="certificateNo" className="text-foreground font-medium">Certificate Number</Label>
                            <Input
                                id="certificateNo"
                                name="certificateNo"
                                value={formData.certificateNo}
                                onChange={handleInputChange}
                                placeholder="Enter Certificate Number"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobileNo" className="text-foreground font-medium">Mobile Number</Label>
                            <Input
                                id="mobileNo"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleInputChange}
                                placeholder="Enter Mobile Number"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter Email Address"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="lossDetails" className="text-foreground font-medium">Loss Details</Label>
                            <Textarea
                                id="lossDetails"
                                name="lossDetails"
                                value={formData.lossDetails}
                                onChange={handleInputChange}
                                placeholder="Describe the loss or damage in detail"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lossDate" className="text-foreground font-medium">Loss Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.lossDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.lossDate ? format(formData.lossDate, "PPP") : "Select date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.lossDate}
                                        onSelect={handleDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="supportFile" className="text-foreground font-medium">Upload Claim Support File (PDF/JPG)</Label>
                            <Input
                                id="supportFile"
                                name="supportFile"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="border-gray-300 focus:ring-custom-green focus:border-custom-green"
                            />
                            <p className="text-xs text-gray-500">Max file size: 5MB</p>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-custom-green hover:bg-green-600 text-white font-medium py-2.5 rounded-md transition-all"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Claim"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-l-custom-yellow">
                <h3 className="text-lg font-semibold text-foreground mb-2">Our Office</h3>
                <div className="space-y-1 text-gray-700">
                    <p className="font-bold text-custom-green">GOXI MICROINSURANCE LTD</p>
                    <p>Edwards & Valerie Plaza, 107,</p>
                    <p>Obafemi Awolowo Road,</p>
                    <p>Ikeja - Lagos,</p>
                    <p>Nigeria.</p>
                    <p className="mt-2"><span className="font-medium">Phone:</span> 07052379916, 07052380311</p>
                    <p className="mt-2">
                        <span className="font-medium">Email:</span>
                        <a href="mailto:goxi.microinsurance@gmail.com" className="text-custom-green hover:underline ml-1">
                            goxi.microinsurance@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClaimForm;