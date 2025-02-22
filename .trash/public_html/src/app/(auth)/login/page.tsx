'use client';
// For Login Page

import RegistrationForm from "@/components/templates/form";

const LoginPage = () => {
    const heroProps = {
        title: "Manage your insurance policies anytime.",
        imageSrc: "/assets/partner-1.jpeg",
        imageAlt: "Login hero image"
    };

    return <RegistrationForm heroProps={heroProps} />;
};

export default LoginPage;