'use client';
import React, {memo, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import MaxWidthWrapper from "@/components/container/max-width-wrapper";
import TestimonialSlider from "@/components/templates/home/testimonials/testimonial-slider";
import Image, {StaticImageData} from 'next/image';
//import './testimonial.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

//images
import UserOne from '../../../../../public/assets/user-1.png';
import UserTwo from '../../../../../public/assets/user-2.png';
import UserThree from '../../../../../public/assets/user-1.png';

/**
 * TestimonialCard Component
 * Renders an individual testimonial card with user information and feedback.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.desc - Description or feedback text
 * @param {StaticImageData} props.image - User profile image
 * @param {string} props.name - User's name
 * @param {string} props.date - Date of feedback/testimonial
 * @param {string} props.company - User's company or designation
 * @param {string} props.ext - Additional information (like location)
 *
 * @example
 * <TestimonialCard
 *   image={UserOne}
 *   name="John Doe"
 *   date="February 2024"
 *   company="Palwal"
 *   ext="Palwal"
 *   desc="Great service and support!"
 * />
 */
// Memoize SliderContent to prevent unnecessary re-renders
export const TestimonialCard = memo(({ image, name, date, company, ext, desc }: { desc: string; image: StaticImageData; name: string; date: string; company: string; ext: string }) => (
    <div className="testimonial-card bg-white m-[10px] shadow-lg rounded-[20px] flex flex-col gap-4 p-[20px]">
        <div className="flex gap-4">
            <div className="w-[60px] h-[60px] rounded-full border-[1px] border-[#e6e6e6]">
                <Image src={image} className="w-full h-full" alt={"testimonial-user"} width={100} height={100} />
            </div>
            <div>
                <div className="font-[600] text-[15px] uppercase">{name}</div>
                <div className="text-[#808080] font-[500] uppercase text-[13px]">{company}</div>
                <div className="text-[#808080] uppercase font-[500] text-[13px]">{date}</div>
                <div className="text-[#000000] uppercase text-[13px]">{ext}</div>
            </div>
        </div>
        <div className="text-[12px] text-[#333333]">
            {desc}
        </div>
    </div>
));

// Add display name for better debugging
TestimonialCard.displayName = 'SliderContentOne';


/**
 * TestimonialComp Component
 * Renders a testimonial slider section with a call-to-action (CTA) and testimonial cards.
 *
 * @component
 * @returns {JSX.Element} - Renders the full testimonial slider section.
 */
const TestimonialComp = () => {
    // State to manage slider activity
    const [isActive, setisActive] = useState(false);

    // Next.js router for navigation
    const router = useRouter();

    // Array of testimonial data
    const contents = [
        {
            image: UserOne,
            name: "CHIOMA OKAFOR\n",
            date: "february 2024",
            company: "palwal",
            ext: "palwal",
            desc: "\"Taking GOXI's program was one of the best decisions for my small business. We’re reaching new clients every day!\"\n"
        },
        {
            image: UserTwo,
            name: "CHIOMA OKAFOR\n",
            date: "february 2024",
            company: "palwal",
            ext: "palwal",
            desc: "\"Taking GOXI's program was one of the best decisions for my small business. We’re reaching new clients every day!\"\n"
        },
        {
            image: UserThree,
            name: "JOHN DOE",
            date: "february 2024",
            company: "palwal",
            ext: "palwal",
            desc: "\"Taking GOXI's program was one of the best decisions for my small business. We’re reaching new clients every day!\"\n"
        }
    ];

    // Set active state on component mount
    useEffect(() => {
        setisActive(true);
    },[]);

    return (
        <MaxWidthWrapper className="py-[50px]">
            <div className="inner-container xl:w-[80%] w-full mx-auto">
                {/*CTA*/}
                <div className="flex lg:flex-row bg-gradient-custom flex-col gap-4 border-[2px] p-6 lg:items-center border-[#e6e6e6] justify-between">
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="text-white font-semibold text-[20px]">MicroInsurance Made Simple</div>
                        <div className="w-full text-white 2xl:md:w-[700px] font-[500] text-[12px]">
                            In just a few clicks, safeguard what matters most. Flexible plans, seamless signup, and reliable coverage—designed just for you                        </div>
                    </div>
                    <div className="bg-white max-w-[150px] rounded-[5px]">
                        <button
                            onClick={() => router.push("/register")}
                            className="bg-white font-[600] px-6 py-2 !rounded-sm text-transparent bg-clip-text bg-gradient-to-r from-[#00AA47] to-[#FFC200] hover:opacity-90">
                            {"Start Today!"}
                        </button>
                    </div>
                </div>

                <div className="mt-[50px]">
                    <div className="text-[#333333] font-bold text-[26px] text-center">
                        Join Thousands <span
                        className="bg-gradient-to-r from-custom-red to-custom-yellow bg-clip-text text-transparent">Who Trust GOXI</span>
                    </div>
                    <div className="text-[#333333] opacity-70 text-center font-[500] w-full md:w-[500px] mx-auto">
                        See why individuals and small business owners rely on GOXI for reliable and affordable microinsurance.
                    </div>
                    <div className="mt-[40px]">
                        <TestimonialSlider items={contents} isActive={isActive} />
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

// Memoize the entire component
export default memo(TestimonialComp);