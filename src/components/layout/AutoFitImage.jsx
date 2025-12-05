import { useState } from "react";

const AutoFitImage = ({ src, alt }) => {
    const [isTall, setIsTall] = useState(false);

    const handleLoad = (e) => {
        const img = e.target;
        if (img.naturalHeight > img.naturalWidth) {
            setIsTall(true);
        } else {
            setIsTall(false);
        }
    };

    return (
        <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            className={`max-w-full max-h-full object-contain ${isTall ? "h-full" : "w-full"}`}
        />
    );
}

export default AutoFitImage;