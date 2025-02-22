'use client';
import React from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";

interface StepCardProps {
    icon: string;
    stepNumber: string;
    title: string;
    description: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon, stepNumber, title, description }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex bg-[#ffc200] w-14 rounded-full mx-auto h-14 justify-center items-center">
            <Image src={icon} width={30} height={30} alt="step-icon" />
        </div>
        <div className="mt-4">
            <div className="text-[#333333] text-center font-semibold text-lg">
                {stepNumber}. {title}
            </div>
            <div className="text-[#333333] text-center mt-2">
                {description}
            </div>
        </div>
    </div>
);

const AboutSection: React.FC = () => {
    const steps: StepCardProps[] = [
        {
            icon: "/assets/shake.png",
            stepNumber: "1",
            title: "Register as a Partner",
            description: "Sign up as a trusted partner with GOXI by providing your basic business details. It's quick, simple, and you'll be part of a trusted network from day one."
        },
        {
            icon: "/assets/checklist.png",
            stepNumber: "2",
            title: "Choose your preferred product offerings",
            description: "Select from our range of easy-to-implement insurance products. Tailor the offerings that align best with your customers' needs—whether it's Family Welfare Insurance or Micro-Loan Protection."
        },
        {
            icon: "/assets/naira.png",
            stepNumber: "3",
            title: "Start Earning and Helping Your Customers",
            description: "Once onboard, start offering these products and earn commissions while helping your community. It's an easy, rewarding partnership with tangible results."
        }
    ];
    const router = useRouter();

    return (
        <div id="about" className="py-8">
            <div className="mx-auto w-full max-w-[80%] lg:max-w-[60%]">
                {/* CTA Section */}
                <div className="flex lg:flex-row step-cta flex-col gap-4 border-2 p-6 lg:items-center border-[#e6e6e6] justify-between">
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="text-[#333333] font-semibold text-[20px]">
                            Have A Customer To Refer To GOXI?
                        </div>
                        <div className="text-[#333333] font-medium w-full 2xl:md:w-[700px]">
                            You can easily refer a customer by completing this 1 minute form that starts your registeration process
                        </div>
                    </div>
                    <div>
                        <button onClick={() => router.push("/login")} className="bg-custom-green px-6 py-3 !rounded-md !hover:text-white !text-white font-semibold transition-colors">
                            Submit Contact
                        </button>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="mt-12">
                    <div className="text-[#333333] font-bold text-2xl text-center">
                        3 Simple Steps{' '}
                        <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              To Partner With GOXI
            </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                        {steps.map((step, index) => (
                            <StepCard
                                key={index}
                                icon={step.icon}
                                stepNumber={step.stepNumber}
                                title={step.title}
                                description={step.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;