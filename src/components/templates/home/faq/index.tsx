'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FaqSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Why do I need to secure my business?",
            answer: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
        },
        {
            question: "Which insurance products does GOXI provide for individuals?",
            answer: "GOXI offers a range of products for individuals, including health, life, and property insurance."
        },
        {
            question: "How do I buy insurance from GOXI?",
            answer: "You can easily buy insurance by visiting our website or contacting one of our agents."
        },
        {
            question: "How long do I need to wait to file a claim?",
            answer: "Claims can be filed immediately after your insurance policy becomes active."
        },
        {
            question: "Can I upgrade my plan later?",
            answer: "Yes, you can upgrade your plan at any time by contacting our support team."
        },
        {
            question: "I already have microinsurance, can I migrate to GOXI?",
            answer: "Yes, we provide a seamless migration process for customers moving from other insurance providers."
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