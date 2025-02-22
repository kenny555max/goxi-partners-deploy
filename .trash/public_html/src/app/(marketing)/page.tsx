import HeroComp from "@/components/templates/home/hero";
import PartnerProgramSection from "@/components/templates/home/partner-program";
import AboutSection from "@/components/templates/home/about";
import PartnerTypeSection from "@/components/templates/home/partner-type";
import PartnerCtaSection from "@/components/templates/home/partner-cta-sec";
import FaqSection from "@/components/templates/home/faq";
import Footer from "@/components/templates/home/footer";
import Header from "@/components/templates/home/header";
import TopHeader from "@/components/templates/home/top-header";
import BottomHeader from "@/components/templates/home/bottom-header";

export default function HomePage(){
    return(
        <div>
            <TopHeader />
            <BottomHeader />
            <HeroComp />
            <PartnerProgramSection />
            <AboutSection />
            <PartnerTypeSection />
            <PartnerCtaSection />
            <FaqSection />
            <Footer />
        </div>
    );
}