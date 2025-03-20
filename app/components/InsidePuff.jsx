import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const CompareSlider = ({ beforeImage = "/product/before.png", afterImage = "/product/after.png" }) => {
    const [sliderPosition, setSliderPosition] = useState(50); // Initial slider position at 50%
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            // Force re-render on window resize to update dimensions
            setSliderPosition(prev => prev);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseDown = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (!isDragging || !sliderRef.current) return;

        const sliderRect = sliderRef.current.getBoundingClientRect();
        const offsetX =
            "touches" in event
                ? event.touches[0].clientX - sliderRect.left
                : event.clientX - sliderRect.left;
        const width = sliderRect.width;
        const newSliderPosition = (offsetX / width) * 100;

        // Clamp value between 0 and 100
        setSliderPosition(Math.min(100, Math.max(0, newSliderPosition)));
    };

    // Register global mouse/touch events for smooth dragging
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        const handleGlobalMouseMove = (event) => {
            if (isDragging) {
                handleMouseMove(event);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('touchend', handleGlobalMouseUp);
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('touchmove', handleGlobalMouseMove);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('touchend', handleGlobalMouseUp);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('touchmove', handleGlobalMouseMove);
        };
    }, [isDragging]);

    return (
        <div
            className="relative w-full h-full"
            ref={sliderRef}
        >
            <div 
                ref={containerRef} 
                className="relative w-full h-fit  overflow-hidden"
                style={{ cursor: isDragging ? 'col-resize' : 'default' }}
            >
                {/* Before Image - Initial Image */}
                <img
                    src={beforeImage}
                    alt="Before Image"
                    className="w-full h-full object-contain"
                />

                {/* After Image - Will be revealed */}
                <div
                    className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <div className="h-full" style={{ width: sliderRef.current?.getBoundingClientRect().width }}>
                        <img
                            src={afterImage}
                            alt="After Image"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 h-full bg-[#000000] pointer-events-none"
                    style={{ left: `${sliderPosition}%`, width: "4px" }}
                />

                {/* Slider Handle */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#000000]  flex items-center justify-center cursor-grab z-10"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    <div className="flex flex-col justify-center items-center">
                        <GiHamburgerMenu className="hidden md:flex rotate-90 text-white my-5 mx-2" size={30}/>
                        <GiHamburgerMenu className="flex md:hidden rotate-90 text-white my-5 mx-2" size={20}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareSlider;