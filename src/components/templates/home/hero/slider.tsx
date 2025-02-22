import React from "react";
import Slider, { Settings } from "react-slick";
import {FaArrowLeft} from "react-icons/fa6";
import {FaArrowRight} from "react-icons/fa";
import {SliderContentOne, SliderContentTwo, SliderContentThree} from "@/components/templates/home/hero";

/**
 * HeroSlider Component
 *
 * Renders a hero image slider using `react-slick`. The slider includes custom navigation arrows,
 * autoplay functionality, and customizable styles. The content of the slides is defined by
 * `SliderContentOne` and `SliderContentTwo`.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isActive - Determines if navigation arrows should be visible.
 * @returns {JSX.Element} The rendered HeroSlider component.
 */
export default function HeroSlider({ isActive = false }: { isActive: boolean }) {
    /**
     * Slider configuration settings for `react-slick`.
     *
     * @type {Settings}
     */
    const defaultSettings: Settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
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
        appendDots: (dots) => (
            <div>
                <ul className="custom-dots">{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <button className="custom-dot" />
        ),
    } as const;

    return (
        <Slider {...defaultSettings}>
            <SliderContentOne />
            <SliderContentTwo />
            <SliderContentThree />
        </Slider>
    );
}

/**
 * PrevArrow Component
 *
 * Custom previous arrow navigation for the slider.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onClick - Event handler for the click event to navigate to the previous slide.
 * @returns {JSX.Element} The rendered previous arrow button.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function PrevArrow(props: any) {
    const { onClick } = props;
    return (
        <button
            className="absolute lg:top-[40%] sm:top-[50%] bottom-[40px] md:top-[55%] right-[120px] sm:right-[40px] w-[60px] h-[60px] bg-[#ffffff] rounded-full flex justify-center items-center z-40 text-white"
            onClick={onClick}
        >
            <FaArrowLeft className="text-[24px]" fill={"#e31600"} />
        </button>
    );
}

/**
 * NextArrow Component
 *
 * Custom next arrow navigation for the slider.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onClick - Event handler for the click event to navigate to the next slide.
 * @returns {JSX.Element} The rendered next arrow button.
 */
function NextArrow(props: any) {
    const { onClick } = props;
    return (
        <button
            className="absolute lg:top-[53%] bg-[#ffffff] bottom-[40px] sm:top-[65%] right-[40px] w-[60px] h-[60px] rounded-full flex justify-center items-center z-30 text-white"
            onClick={onClick}
        >
            <FaArrowRight className="text-[24px]" fill={"#e31600"} />
        </button>
    );
}
