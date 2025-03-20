import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';


const ScrollSyncSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('down');
    const prevScrollY = useRef(0);


    const sections = [
        {
            id: 'section1',
            title: 'Mind, body & soil',
            topImg: '/about-us/prosetop1.png',
            description: 'Our chickpeas and yellow peas support a healthy and diverse farm by naturally keeping nutrients in the soil, where they should be.',
            image: '/about-us/prose1.png', // Replace with your actual image paths
            alt: 'First section image'
        },
        {
            id: 'section2',
            title: '10% of the water of most proteins',
            topImg: '/about-us/prosetop2.png',
            description: 'Our chickpeas and yellow peas are farmed using 10% of the water of most proteins… which means 90% less water taken from Mother Nature.',
            image: '/about-us/prose2.png',
            alt: 'Second section image'
        },
        {
            id: 'section3',
            title: 'Lowering carbon footprint',
            topImg: '/about-us/prosetop3.png',
            description: 'By pulling nitrogen from the air, our chickpeas and yellow peas  naturally use less fertilization which helps to lower our carbon footprint.',
            image: '/about-us/prose3.png',
            alt: 'Third section image'
        },
        {
            id: 'section4',
            title: 'Sustainable Farming',
            topImg: '/about-us/prosetop4.png',
            description: 'At Hippeas we believe sustainable farming (and snacking) is totally the way forward.',
            image: '/about-us/prose4.png',
            alt: 'Fourth section image'
        }
    ];

    // Create refs for each text section
    const sectionRefs = useRef([]);

    // Setup the refs array
    useEffect(() => {
        sectionRefs.current = sectionRefs.current.slice(0, sections.length);
    }, [sections.length]);

    // Effect to detect scroll direction
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > prevScrollY.current) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }

            prevScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // UseEffect to handle scroll observation for sections
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Find the index of the section that is currently in view
                        const index = sectionRefs.current.findIndex(
                            (ref) => ref === entry.target
                        );
                        if (index !== -1) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            {
                rootMargin: '-40% 0px -40% 0px', // Adjust rootMargin to control when the image changes
                threshold: 0.2, // Lower threshold means it will trigger earlier
            }
        );

        // Observe all section refs
        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            // Cleanup - stop observing when component unmounts
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    // Variants for animations based on scroll direction
    const imageVariants = {
        initial: (direction) => ({
            y: direction === 'down' ? '100%' : '-100%',
            opacity: 1
        }),
        animate: {
            y: 0,
            opacity: 1
        },
        exit: (direction) => ({
            y: direction === 'down' ? '-100%' : '100%',
            opacity: 1
        })
    };

    return (
        <>
            <div className="md:flex flex-col md:flex-row min-h-screen hidden">
                {/* Left side - Scrollable text sections */}
                <div className="w-full md:w-1/2 bg-white p-8 overflow-y-auto">
                    <div className="space-y-48 py-16"> {/* Added spacing between sections */}
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                ref={(el) => (sectionRefs.current[index] = el)}
                                className={`py-8 transition-all duration-300 ${activeIndex === index
                                    ? 'opacity-100 text-black'
                                    : 'opacity-40 text-[#00000060]'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: activeIndex === index ? 1 : 0.4, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 style={{ fontFamily: "City Tour" }} className="text-5xl tracking-wide  mb-4">{section.title}</h2>
                                <p className="text-2xl">{section.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right side - Fixed image that changes with animation from bottom or top based on scroll direction */}
                <div className="w-full md:w-1/2 hidden md:block sticky top-0 h-screen overflow-hidden">
                    <div className="relative w-full h-full">
                        <AnimatePresence custom={scrollDirection} mode="wait">
                            <motion.div
                                key={`image-${activeIndex}`}
                                className="absolute w-full h-full flex items-center"
                                custom={scrollDirection}
                                variants={imageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.5
                                }}
                            >
                                <div className="w-full h-2/3  overflow-hidden flex items-center justify-center bg-gray-100">
                                    <img
                                        src={sections[activeIndex].image}
                                        alt={sections[activeIndex].alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap w-full overflow-x-scroll md:hidden'>
                {sections.map((section, index) => (
                    <div key={section.id}
                        className={`py-8 w-full transition-all duration-300 text-black`}>
                        <img src={section.image} className='' alt={section.alt} />
                        <h2 style={{ fontFamily: "City Tour" }} className="text-5xl tracking-wide  my-4">{section.title}</h2>
                        <p className="text-2xl">{section.description}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ScrollSyncSection;