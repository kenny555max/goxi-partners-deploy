'use client';
import HeroComp from "@/components/templates/home/hero";
import PartnerProgramSection from "@/components/templates/home/partner-program";
import AboutSection from "@/components/templates/home/about";
import PartnerTypeSection from "@/components/templates/home/partner-type";
import PartnerCtaSection from "@/components/templates/home/partner-cta-sec";
import FaqSection from "@/components/templates/home/faq";
import Footer from "@/components/templates/home/footer";
import TopHeader from "@/components/templates/home/top-header";
import BottomHeader from "@/components/templates/home/bottom-header";
import Testimonials from "@/components/templates/home/testimonials/testimonials";
import PartnerProgramForm from "@/components/templates/home/partner-program-form";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export default function HomePage(){
    return(
        <div>
            <TawkMessengerReact
                onVisitorNameChanged={() => console.log("visitor name changed")}
                onChatMinimized={() => console.log("chat minimized")}
                onUnreadCountChanged={() => console.log("unread")}
                onChatMessageVisitor={() => console.log("on chat message")}
                onChatStarted={() => console.log("started")}
                onStatusChange={() => console.log("status change")}
                onBeforeLoad={() => console.log("before load")}
                onLoad={() => console.log("on load")}
                onChatMaximized={() => console.log("chat maximized message")}
                propertyId="6761679aaf5bfec1dbdd6d42"
                widgetId="1ifa7pd29"
            />
            <TopHeader />
            <BottomHeader />
            <HeroComp />
            <PartnerProgramSection />
            <Testimonials />
            <AboutSection />
            <PartnerTypeSection />
            <PartnerCtaSection />
            <FaqSection />
            <PartnerProgramForm />
            <Footer />
        </div>
    );
}