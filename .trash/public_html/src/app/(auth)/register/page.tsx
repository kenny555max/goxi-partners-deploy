
// For Signup Page

import RegistrationForm from "@/components/templates/form";

const SignupPage = () => {
    const heroProps = {
        title: "Create an account to access tailored plans for market traders.",
        imageSrc: "/assets/partner-2.jpeg",
        imageAlt: "Market produce",
        overlayOpacity: 40 // optional, defaults to 40
    };

    return <RegistrationForm heroProps={heroProps} />;
};

export default SignupPage;