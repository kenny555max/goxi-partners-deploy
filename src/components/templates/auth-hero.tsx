// Hero Section Props
import Image from "next/image";

type HeroProps = {
    title: string;
    imageSrc: string;
    imageAlt?: string;
    overlayOpacity?: number;
};

// Hero Component
const AuthHero: React.FC<HeroProps> = ({
                                           title,
                                           imageSrc,
                                           imageAlt = "Authentication hero image",
                                           overlayOpacity = 40
                                       }) => (
    <div className="hidden h-full md:block md:w-1/2 relative overflow-hidden">
        <div
            className="absolute inset-0 bg-black z-10"
            style={{ opacity: overlayOpacity / 100 }}
        />
        <div className="absolute z-20 text-white p-12 flex flex-col justify-center h-full">
            <h2 className="text-4xl font-bold leading-tight mb-4">
                {title}
            </h2>
        </div>
        <div className="relative w-full h-full">
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
            />
        </div>
    </div>
);

export default AuthHero;