'use client';
import {useRouter} from "next/navigation";
import React, {memo, useEffect, useState} from "react";
import { motion } from "framer-motion";
import HeroSlider from "@/components/templates/home/hero/slider";
import { IoMdArrowForward } from "react-icons/io";
import MaxWidthWrapper from "@/components/container/max-width-wrapper";

/**
 * @file HeroComp.tsx
 * @description This file contains the Hero Section components with animated sliders.
 * The hero section consists of two slides, each presenting unique messaging and a call-to-action.
 * The components use Framer Motion for animations and Next.js navigation for interactivity.
 */

/**
 * SliderContentOne Component
 *
 * @description A memoized hero slider content displaying the first slide. It features a heading, description, and a call-to-action button.
 * @returns {React.ReactElement} - The JSX content for the first slider.
 */
// Memoize SliderContent to prevent unnecessary re-renders
export const SliderContentOne = memo(() => {
    const router = useRouter();

    return(
        <div className={`bg-cover w-full h-screen hero flex md:pt-0 pt-[100px] md:items-center relative bg-custom-pattern`}>
            <div className="overlay absolute top-0 w-full h-full"></div>
            <MaxWidthWrapper className="z-40">
                <motion.h1
                    className="text-[32px] lg:w-[700px] w-full sm:text-[54px] font-bold text-white leading-[1.15]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                >
                    <span
                        className="bg-gradient-to-r from-custom-red to-custom-yellow bg-clip-text text-transparent">Partner</span>{" "}
                    <span>
                    {"With Goxi"}
                </span>
                </motion.h1>
                <motion.p
                    className="text-[16px] pb-10 w-[800px] md:text-[20px] font-normal text-white/90 mt-4 max-w-full sm:max-w-[90%] lg:max-w-[80%]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    {"Goxi MicroInsurance targets low-income\n" +
                        "people and micro and small enterprises\n" +
                        "that are highly vulnerable. We are Nigeria's\n" +
                        "first stand-alone Microinsurance company. "}
                </motion.p>
                <motion.button
                    onClick={() => router.push("/login")}
                    className="flex bg-gradient-to-r text-white font-[500] text-[16px] capitalize from-custom-red to-custom-yellow items-center rounded-[10px] px-[25px] py-[12px] gap-[15px]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    <span>Become A Partner</span>
                    <IoMdArrowForward className="w-[24px] h-[24px]" />
                </motion.button>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="hero-icons mt-4">
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/green-naira.png" alt="naira-icon"/>
                        </div>
                        <span>Micro Loan Protection</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/hand-plus.png" alt="hand-icon"/>
                        </div>
                        <span>Cooperative Insurance</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/bike.png" alt="bike-icon"/>
                        </div>
                        <span>Tricycle/Okada Business Insurance</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/tractor.png" alt="tractor-icon"/>
                        </div>
                        <span>Agro Micro Insurance</span>
                    </div>
                </motion.div>
            </MaxWidthWrapper>
        </div>
    )
});

// Add display name for better debugging
SliderContentOne.displayName = 'SliderContentOne';

/**
 * SliderContentTwo Component
 *
 * @description A memoized hero slider content displaying the second slide. It features a heading, description, and a call-to-action button.
 * @returns {React.ReactElement} - The JSX content for the second slider.
 */// Memoize SliderContent to prevent unnecessary re-renders
export const SliderContentTwo = memo(() => {
    const router = useRouter();

    return (
        <div
            className={`bg-cover w-full hero h-screen relative flex md:pt-0 pt-[100px] md:items-center bg-custom-pattern-2`}>
            <div className="overlay absolute w-full top-0 h-full"></div>
            <MaxWidthWrapper className="z-40">
                <motion.h1
                    className="text-[32px] lg:w-[700px] w-full sm:text-[54px] font-bold text-white leading-[1.15]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                >
                    <span
                        className="bg-gradient-to-r from-custom-red to-custom-yellow bg-clip-text text-transparent">Partner</span>{" "}
                    <span>
                    {"With Goxi"}
                </span>
                </motion.h1>
                <motion.p
                    className="text-[16px] pb-10 w-[800px] md:text-[20px] font-normal text-white/90 mt-4 max-w-full sm:max-w-[90%] lg:max-w-[80%]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    {"Goxi MicroInsurance targets low-income\n" +
                        "people and micro and small enterprises\n" +
                        "that are highly vulnerable. We are Nigeria's\n" +
                        "first stand-alone Microinsurance company. "}
                </motion.p>
                <motion.button
                    onClick={() => router.push("/login")}
                    className="flex bg-gradient-to-r text-white font-[500] text-[16px] capitalize from-custom-red to-custom-yellow items-center rounded-[10px] px-[25px] py-[12px] gap-[15px]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    <span>Become A Partner</span>
                    <IoMdArrowForward className="w-[24px] h-[24px]" />
                </motion.button>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="hero-icons mt-4">
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/green-naira.png" alt="naira-icon"/>
                        </div>
                        <span>Micro Loan Protection</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/hand-plus.png" alt="hand-icon"/>
                        </div>
                        <span>Cooperative Insurance</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/bike.png" alt="bike-icon"/>
                        </div>
                        <span>Tricycle/Okada Business Insurance</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/tractor.png" alt="tractor-icon"/>
                        </div>
                        <span>Agro Micro Insurance</span>
                    </div>
                </motion.div>
            </MaxWidthWrapper>
        </div>
    )
});

// Add display name for better debugging
SliderContentTwo.displayName = 'SliderContentTwo';


export const SliderContentThree = memo(() => {
    const router = useRouter();

    return(
        <div className={`bg-cover w-full hero h-screen relative flex md:pt-0 pt-[100px] md:items-center bg-custom-pattern-3`}>
            <div className="overlay absolute w-full top-0 h-full"></div>
            <MaxWidthWrapper className="z-40">
                <motion.h1
                    className="text-[32px] lg:w-[700px] w-full sm:text-[54px] font-bold text-white leading-[1.15]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                >
                    <span
                        className="bg-gradient-to-r from-custom-red to-custom-yellow bg-clip-text text-transparent">Partner</span>{" "}
                    <span>
                    {"With Goxi"}
                </span>
                </motion.h1>
                <motion.p
                    className="text-[16px] pb-10 w-[800px] md:text-[20px] font-normal text-white/90 mt-4 max-w-full sm:max-w-[90%] lg:max-w-[80%]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    {"Goxi MicroInsurance targets low-income\n" +
                        "people and micro and small enterprises\n" +
                        "that are highly vulnerable. We are Nigeria's\n" +
                        "first stand-alone Microinsurance company. "}
                </motion.p>
                <motion.button
                    onClick={() => router.push("/login")}
                    className="flex bg-gradient-to-r text-white font-[500] text-[16px] capitalize from-custom-red to-custom-yellow items-center rounded-[10px] px-[25px] py-[12px] gap-[15px]"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    <span>Become A Partner</span>
                    <IoMdArrowForward className="w-[24px] h-[24px]" />
                </motion.button>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="hero-icons mt-4">
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/green-naira.png" alt="naira-icon"/>
                        </div>
                        <span>Micro Loan Protection</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/hand-plus.png" alt="hand-icon"/>
                        </div>
                        <span>Cooperative Insurance</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/bike.png" alt="bike-icon"/>
                        </div>
                        <span>Tricycle/Okada Business Insurance</span>
                    </div>
                    <div className="icon-card">
                        <div className="icon-img">
                            <img src="/assets/tractor.png" alt="tractor-icon"/>
                        </div>
                        <span>Agro Micro Insurance</span>
                    </div>
                </motion.div>
            </MaxWidthWrapper>
        </div>
    )
});

// Add display name for better debugging
SliderContentThree.displayName = 'SliderContentThree';


/**
 * HeroComp Component
 *
 * @description The main Hero Component that renders the HeroSlider. It initializes the `isActive` state to trigger the slider animation.
 * @returns {React.ReactElement} - The JSX content for the Hero slider component.
 */
const HeroComp = () => {
    const [isActive, setisActive] = useState(false);

    useEffect(() => {
        setisActive(true);
    },[]);

    return (
        <HeroSlider isActive={isActive} />
    );
};

// Memoize the entire component
export default memo(HeroComp);