import React from "react";
import Slider, { Settings } from "react-slick";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import {TestimonialCard} from "./testimonials";
import {StaticImageData} from "next/image";

/**
 * TestimonialSlider Component
 *
 * This component renders a slider containing testimonial cards.
 * It uses the `react-slick` library to manage the carousel behavior and supports responsive layouts.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isActive - Determines whether navigation arrows are active.
 * @param {Array} props.items - Array of testimonial items to display.
 * @param {string} props.items[].desc - Description or content of the testimonial.
 * @param {StaticImageData} props.items[].image - Image associated with the testimonial.
 * @param {string} props.items[].name - Name of the person giving the testimonial.
 * @param {string} props.items[].date - Date of the testimonial.
 * @param {string} props.items[].company - Company or organization associated with the testimonial.
 * @param {string} props.items[].ext - Additional details (e.g., role, extension).
 *
 * @returns {JSX.Element} A responsive carousel slider showcasing testimonials.
 */
export default function TestimonialSlider({ isActive = false, items }: { isActive: boolean, items: { desc: string; image: StaticImageData; name: string; date: string; company: string; ext: string }[] }) {
    /**
     * Slider settings for `react-slick`.
     * Adjusts the number of slides, autoplay, speed, responsiveness, and custom arrows.
     */
    const defaultSettings: Settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: isActive,
        slidesToScroll: 1,
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        dotsClass: "slick-dots custom-dots",
        lazyLoad: 'ondemand',
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    } as const;

    return (
        <Slider {...defaultSettings} className="testimonial-slider">
            {items.map((item, index) => {
                return <TestimonialCard
                    image={item.image}
                    desc={item.desc}
                    name={item.name}
                    company={item.company}
                    date={item.date}
                    ext={item.ext}
                    key={index}
                />
            })}
        </Slider>
    );
}

/**
 * PrevArrow Component
 *
 * Custom "Previous" arrow for the slider.
 *
 * @param {Object} props - Component props passed by `react-slick`.
 * @param {Function} props.onClick - Event handler for clicking the arrow.
 *
 * @returns {JSX.Element} A button styled as a left navigation arrow.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function PrevArrow(props: any) {
    const { onClick } = props;
    return (
        <button
            className="absolute bottom-[-60px] left-[30%] md:bottom-0 md:top-[100px] md:left-[-40px] lg:left-[-100px] bg-gradient-to-r from-custom-red to-custom-yellow w-[50px] h-[50px] bg-[#ffffff] rounded-full flex justify-center items-center z-40 text-white"
            onClick={onClick}
        >
            <IoIosArrowBack className="text-[24px]" fill={"#fff"} />
        </button>
    );
}

/**
 * NextArrow Component
 *
 * Custom "Next" arrow for the slider.
 *
 * @param {Object} props - Component props passed by `react-slick`.
 * @param {Function} props.onClick - Event handler for clicking the arrow.
 *
 * @returns {JSX.Element} A button styled as a right navigation arrow.
 */
function NextArrow(props: any) {
    const { onClick } = props;
    return (
        <button
            className="absolute bg-gradient-to-r md:right-[-40px] lg:right-[-100px] md:bottom-0 bottom-[-60px] right-[30%] md:top-[100px] from-custom-red to-custom-yellow w-[50px] h-[50px] rounded-full flex justify-center items-center z-30 text-white"
            onClick={onClick}
        >
            <IoIosArrowForward className="text-[24px]" fill={"#fff"} />
        </button>
    );
}
