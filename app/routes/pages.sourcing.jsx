import { motion } from "motion/react";
import Carousel from "react-multi-carousel";

const items = [
    {
        title: "Low water footprint",
        img: "/sourcing/sus1.png"
    },
    {
        title: "Low carbon footprint",
        img: "/sourcing/sus2.png"
    },
    {
        title: "No- till",
        img: "/sourcing/sus3.png"
    },
    {
        title: "Crop rotations",
        img: "/sourcing/sus4.png"
    },
    {
        title: "No glyphosate as a desiccant",
        img: "/sourcing/sus5.png"
    },
]

export default function Sustainability() {
    return <>
        <div className="px-4 md:px-14 py-3">
            <div className="rounded-4xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    <img src="/sourcing/hero.png" alt="" />
                </div>
                <div className="md:w-1/2 bg-[#fdb716] flex flex-col items-center justify-center text-[#51282b]">
                    <div className="md:w-3/4 flex flex-col items-center justify-center text-center mx-7 md:mx-0 my-10 md:my-0">
                        <h3 style={{ fontFamily: "City Tour" }} className="text-4xl tracking-wide">We’re on a mission to shake things up</h3>
                        <p className="text-xl my-2">At HIPPEAS, we believe sustainable farming (and snacking!) is totally the way forward.
                            <br /><br />
                            We are dedicated to growing our commitment to regenerative agriculture through farmer partnerships and responsible sourcing practices.  Regenerative agriculture focuses on rebuilding soil organic matter and restoring degraded soil biodiversity.  Join us on our journey to shake things up!</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-center my-16 px-4 md:px-14 flex-col items-center text-[#51282b]">
            <div className="md:w-2/3 text-center">
                <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-5xl md:text-5xl text-center tracking-wide text-[#51282b]'>What does sustainable farming mean to HIPPEAS?</motion.h4>
                <p className=" text-xl my-3">Our chickpeas are farmed using sustainable methods such as:</p>
            </div>
            <div className="hidden md:grid grid-cols-5 w-full my-8">
                {items.map((item) => {
                    return <div className="flex flex-col justify-center w-full text-center items-center">
                        <img className="h-24" src={item.img} alt="" />
                        <p className="my-2 text-xl">{item.title}</p>
                    </div>
                })}
            </div>
            <Carousel className="md:hidden block w-full my-8" responsive={{
                desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 4,
                    partialVisibilityGutter: 0,
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1,
                    partialVisibilityGutter: 0,
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2,
                    partialVisibilityGutter: 30,
                },
            }}>
                {items.map((item) => {
                    return <div className="flex flex-col justify-center w-full text-center items-center">
                        <img className="h-24" src={item.img} alt="" />
                        <p className="my-2 text-xl">{item.title}</p>
                    </div>
                })}
            </Carousel>
        </div>
        <div className="px-4 md:px-14">
            <div className="flex items-center justify-center flex-col rounded-4xl overflow-hidden min-h-screen bg-cover bg-gray-400 bg-center bg-[url('/sourcing/hero2.png')] bg-blend-multiply">
                <div className="flex items-center justify-center text-center md:text-start w-full md:w-1/2 flex-col">
                    <h4 style={{ fontFamily: "City Tour" }} className='text-4xl text-center tracking-wide text-white'>Our journey to support regenerative farming</h4>
                    <p className="px-4 md:px-0 text-xl my-3 text-white">The goal of regenerative farming is to improve soil health – rebuilding organic matter and restoring degraded biodiversity.  At HIPPEAS, we source regenerative yellow peas for our Veggie Straws and other snack products.  Our yellow peas are farmed using practices such as crop rotations (planting different crops each year to improve soil health and increase biodiversity) and conservation tillage (keeping a living root in the soil to reduce soil erosion)</p>
                </div>
            </div>
        </div>

        {/* <div className="flex m-14">
            <div className="w-1/2">

            </div>
            <div className="w-1/2">
                <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "Motel Xenia" }} className='text-6xl text-[#41282b] font-semibold tracking-wide'>Measuring the Impact of Regenerative Farming</motion.h4 >
                <p className='text-[#51282b] text-2xl my-5'>By sponsoring this assessment, HIPPEAS seeks to measure the impact of regenerative farming methods on soil health, biodiversity, and nutrient density. We’re all about feeding the world sustainably by spreading the PEAS & Love with these mighty superfoods of the future!</p>

            </div>
        </div> */}

        <div className='relative m-14 hidden md:block'>
            <img className='w-full rounded-4xl' src="/home/hero.png" alt="" />
            <div className='absolute ml-15 w-1/3 left-0 top-0 h-full flex flex-col justify-center text-[#51282b]'>
                <h4 style={{ fontFamily: "City Tour" }} className='text-4xl tracking-wide  '>What The Avena Pilot Program entails</h4>
                <p className=" text-2xl my-3 ">Regenerative agriculture is more than just a buzzword; it's a holistic approach to farming that aims to revitalize our ecosystems, improve soil health, and combat climate change. It goes beyond sustainable practices to actively restore and regenerate the environment.
                    <br /><br />
                    Click on the circles to learn more.</p>
            </div>
        </div>

        <div className='flex flex-col text-[#51282b] m-5 my-10 text-center md:hidden'>
            <h4 style={{ fontFamily: "City Tour" }} className='text-5xl tracking-wide '>What The Avena Pilot Program entails</h4>
            <p className=" text-2xl my-3 ">Regenerative agriculture is more than just a buzzword; it's a holistic approach to farming that aims to revitalize our ecosystems, improve soil health, and combat climate change. It goes beyond sustainable practices to actively restore and regenerate the environment</p>
            <img src="/sourcing/hero2mobile.png" className="rounded-4xl" alt="" />
        </div>

        {/* <div className='px-4 md:px-14 my-20'>
            <video className='rounded-4xl object-cover min-h-[60vh]' controls >
                <source src="/home/vid.mp4" type="video/mp4" />
            </video>
        </div> */}
    </>
}