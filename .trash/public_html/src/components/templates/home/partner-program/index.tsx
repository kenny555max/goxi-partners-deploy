import React from 'react';
import Image from 'next/image';

interface CardProps {
    icon: string;
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center bg-[#ffc200] w-14 h-14 rounded-full mx-auto items-center">
            <Image src={icon} width={30} height={30} alt="step-icon" />
        </div>
        <div className="mt-4">
            <div className="text-[#333333] text-center font-semibold text-lg">{title}</div>
            <div className="text-[#333333] text-center mt-2">{description}</div>
        </div>
    </div>
);

const PartnerProgramSection: React.FC = () => {
    const cards: CardProps[] = [
        {
            icon: "/assets/hand.png",
            title: "Services Offering",
            description: "Grow your customer base by adding to our Microinsurance services to services offered to your clients."
        },
        {
            icon: "/assets/teach.png",
            title: "Expert Training",
            description: "Get access to updated training materials from our experienced team microinsurance marketers"
        },
        {
            icon: "/assets/naira.png",
            title: "Revenue Sharing",
            description: "For each new customer you bring, get rewarded with an industry leading revenue share."
        },
        {
            icon: "/assets/call.png",
            title: "Dedicated Support",
            description: "We provide a dedicated support partner manage and a direct slack channel to stay in constant communication with our team and give the best support to your clients."
        },
        {
            icon: "/assets/network.png",
            title: "Grow Your Network",
            description: "Joining GOXI means tapping into a vast network of customers, agents, and industry professionals."
        },
        {
            icon: "/assets/model.png",
            title: "Flexible Partnership Models",
            description: "GOXI offers different partnership models to suit your needs—whether you're an individual entrepreneur, a small business, or a larger network."
        }
    ];

    return (
        <div id="why" className="py-24">
            <div className="mx-auto w-full max-w-[80%] lg:max-w-[60%]">
                <div>
                    <div className="text-[#333333] font-bold text-2xl text-center">
                        Why Join Our{' '}
                        <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              Partner Program
            </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
                        {cards.map((card, index) => (
                            <Card
                                key={index}
                                icon={card.icon}
                                title={card.title}
                                description={card.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerProgramSection;