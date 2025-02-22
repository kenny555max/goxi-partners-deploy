import React from 'react';
import Link from 'next/link';

interface PartnerCardProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ title, description, buttonText, href }) => (
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
        <h3 className="text-xl font-semibold text-[#333333] mb-4">{title}</h3>
        <p className="text-[#333333] mb-6 flex-grow">{description}</p>
        <Link
            href={href}
            className="text-[#008cad] hover:text-[#007a96] font-medium inline-flex items-center transition-colors"
        >
            {buttonText} →
        </Link>
    </div>
);

const PartnerTypeSection: React.FC = () => {
    const partners: PartnerCardProps[] = [
        {
            title: "Individual / SME",
            description: "Are you an experienced and highly skilled professional? Leverage your network connections. Register and close deals to receive commission on sales.",
            buttonText: "Become a Individual Partner",
            href: "#"
        },
        {
            title: "Microfinance Institutions MFI",
            description: "We partner with Microfinance Banks, Micro Credit companies, Micro Leasing companies, and Finance Houses to develop unique Microinsurance products for your clients.",
            buttonText: "Become a MFI Partner",
            href: "#"
        },
        {
            title: "Cooperative Society",
            description: "We partner with cooperatives to distribute microinsurance products for expanding financial inclusion and providing underserved populations with essential risk protection.",
            buttonText: "Become a Cooperative Partner",
            href: "#"
        }
    ];

    return (
        <section id="partner" className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold text-[#008cad] tracking-wider uppercase mb-2">
                        MARKET AND SELL GOXI
                    </h2>
                    <h1 className="text-3xl font-bold text-[#333333]">
                        What type of Partner are you?
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partners.map((partner, index) => (
                        <PartnerCard
                            key={index}
                            title={partner.title}
                            description={partner.description}
                            buttonText={partner.buttonText}
                            href={partner.href}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnerTypeSection;