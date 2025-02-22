'use client';
import React from 'react';
import {FaPhone} from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import MaxWidthWrapper from "@/components/container/max-width-wrapper";

// components/top-header.js
/**
 * TopHeader Component
 *
 * Displays the top section of the header with contact information.
 *
 * No props are required for this component.
 */
const TopHeader = () => {
    return (
        <div className={"bg-[#008C4D] text-white"}>
            <MaxWidthWrapper>
                <div className="flex justify-end items-center gap-4 text-white px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                        <FaPhone fill={"#008c4d"} />
                        <span>+2349029111359</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IoChatbubbleEllipses fill={"#333333"} />
                        <span>Chat support 24/7</span>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    );
};

export default TopHeader;