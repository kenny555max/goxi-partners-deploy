'use client';
import dynamic from "next/dynamic";

const ThankYouPageTemplate = dynamic(() => import("@/components/thank-you-page-comp"), {
    ssr: false,
});

export default function ThankYouPage()   {
    return(
        <div>
            <ThankYouPageTemplate />
        </div>
    );
}
