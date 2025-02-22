import type { Metadata } from "next";
import Script from 'next/script';
import { Montserrat } from 'next/font/google';

// Configure Montserrat font with full set of weights and subsets
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-montserrat' // This allows using the font in Tailwind CSS
})

export const metadata: Metadata = {
    title: 'Goxi Micro Insurance | Digital Protection for Small Businesses',
    description: 'Goxi Micro Insurance provides comprehensive, fully digitalized insurance solutions for small businesses in Nigeria. Protect your business with agro loans, theft, fire, and life insurance.',
    keywords: [
        'micro insurance',
        'small business insurance',
        'digital insurance Nigeria',
        'agro loan insurance',
        'business protection',
        'life assurance',
        'micro loan insurance'
    ],
    openGraph: {
        title: 'Goxi Micro Insurance | Comprehensive Digital Business Protection',
        description: 'Fully digitalized insurance solutions tailored for small businesses. Agro loans, business theft, fire, and life insurance all in one platform.',
        url: 'https://goximicroinsurance.com/',
        siteName: 'Goxi Micro Insurance',
        images: [
            {
                url: 'https://goximicroinsurance.com/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_NG',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Goxi Micro Insurance | Digital Business Protection',
        description: 'Comprehensive, digitalized insurance for small businesses in Nigeria. Quick, easy, and tailored protection.',
        images: ['https://goximicroinsurance.com/twitter-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://goximicroinsurance.com/',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`font-sans`}
        >
            {children}
            <Script
                id="structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Goxi Micro Insurance",
                        "description": "Fully digitalized micro insurance solutions for small businesses, offering comprehensive coverage including agro loans, business protection, and life assurance.",
                        "url": "https://goximicroinsurance.com/",
                        "logo": "https://goximicroinsurance.com/icon/goxi-icon.png",
                        "sameAs": [
                            "https://www.facebook.com/goximicroinsurance",
                            "https://www.twitter.com/goximicro",
                            "https://www.linkedin.com/company/goximicroinsurance"
                        ],
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "Nigeria"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Micro Insurance Services",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Agro Loan Insurance",
                                        "description": "Specialized insurance coverage for agricultural loans and farming businesses."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Micro Loan Insurance",
                                        "description": "Insurance protection for small business micro-loans."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Business Theft Insurance",
                                        "description": "Comprehensive insurance coverage against business theft and property loss."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Fire Insurance",
                                        "description": "Protection against fire damage for small businesses."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Life Insurance and Assurance",
                                        "description": "Life insurance and assurance services for business owners and employees."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Fully Digitalized Insurance Process",
                                        "description": "Complete digital insurance solution with online application and management."
                                    }
                                }
                            ]
                        },
                        "keywords": "micro insurance, small business insurance, agro loan, business protection, digital insurance"
                    })
                }}
            />
        </div>
    );
}
