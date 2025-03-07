'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FaqSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How can I become a partner?",
            answer: "You can become a partner by signing up on our platform and completing the necessary registration process. Once approved, you'll have access to our partnership benefits."
        },
        {
            question: "What are the benefits of being a partner?",
            answer: "As a partner, you get access to exclusive commissions, marketing support, and training resources to help you succeed in promoting our services."
        },
        {
            question: "How much money can I make as a partner?",
            answer: "Your earnings depend on the number of clients you refer and the types of policies they purchase. The more successful referrals you make, the higher your commissions."
        },
        {
            question: "Do I need any qualification to become a partner?",
            answer: "No formal qualifications are required to become a partner. However, having experience in sales or the insurance industry can be an added advantage."
        }
    ];

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="py-16 px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border border-gray-200 rounded-lg overflow-hidden`}
                    >
                        <button
                            onClick={() => toggleFaq(index)}
                            className="w-full px-6 py-4 flex justify-between items-center transition-colors duration-200"
                        >
                              <span className="font-medium text-left text-gray-800">
                                {faq.question}
                              </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                        activeIndex === index ? 'rotate-180' : ''
                                    }`}
                                />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-200 ${
                                activeIndex === index ? 'max-h-40 bg-gradient-to-r from-custom-red to-custom-yellow text-white' : 'max-h-0'
                            }`}
                        >
                            <p className="px-6 py-4">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FaqSection;