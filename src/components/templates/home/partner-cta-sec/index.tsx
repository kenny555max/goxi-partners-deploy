import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    src: string;
    alt: string;
}

const BrandLogo: React.FC<LogoProps> = ({ src, alt }) => (
    <div className="flex items-center justify-center">
        <Image
            src={src}
            alt={alt}
            width={200}
            height={100}
            className="w-auto h-auto"
        />
    </div>
);

const PartnerCtaSection: React.FC = () => {
    const logos: LogoProps[] = [
        {
            src: "/assets/logo-5.png",
            alt: "lapo logo"
        },
        {
            src: "/assets/logo-1.png",
            alt: "orange insurance brokers limited logo"
        },
        {
            src: "/assets/logo-2.png",
            alt: "micro investment logo"
        },
        {
            src: "/assets/logo-3.png",
            alt: "lapocoop logo"
        },
        {
            src: "/assets/logo-4.png",
            alt: "rehoboth cms logo"
        }
    ];

    return (
        <div className="py-8">
            <div className="mx-auto w-full max-w-[80%] lg:max-w-[60%]">
                {/* CTA Section */}
                <div className="flex lg:flex-row items-start flex-col gap-4 border-2 p-6 lg:items-center border-[#e6e6e6] justify-between bg-gradient-to-r from-[#008C4D] to-[#FFD700]">
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="text-white font-semibold text-xl">
                            Ready To Join Our Partner Program
                        </div>
                        <div className="text-white font-medium w-full 2xl:md:w-[700px]">
                            Help your clients scale by transforming Agency, MFI or Cooperative service into an insurance revenue generator
                        </div>
                    </div>
                    <div className="bg-white p-1 rounded-[20px]">
                        <Link href="/login">
                            <button className="px-6 py-2 font-semibold bg-gradient-to-r from-[#008C4D] to-[#FFD700] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                                Become A Partner
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Brand Logos Section */}
                <div className="mt-10 flex flex-col gap-5">
                    <h2 className="text-2xl md:text-[25px] font-bold">
                        Our growing teams of services partners
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                        {logos.map((logo, index) => (
                            <BrandLogo
                                key={index}
                                src={logo.src}
                                alt={logo.alt}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerCtaSection;