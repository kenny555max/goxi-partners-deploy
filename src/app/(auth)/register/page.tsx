'use client';
import AuthForm from "@/components/templates/form";

const LoginPage = () => {
    const heroProps = {
        title: "Manage your insurance policies anytime.",
        imageSrc: "/assets/partner-1.jpeg",
        imageAlt: "Login hero image",
        formType: 'register' // Specify that this is a login form
    };

    return <AuthForm heroProps={heroProps} />;
};

export default LoginPage;