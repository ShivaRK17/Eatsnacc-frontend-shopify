import { Await, useLoaderData, Link } from '@remix-run/react';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IoStarSharp } from 'react-icons/io5';
import { motion } from 'motion/react';
import { useVariantUrl } from '~/lib/variants';
import Marquee from "react-simple-marquee"

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{ title: 'Hydrogen | Home' }];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({ context }) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    // featuredCollection: collections.nodes[0],
    featuredCollection: [],
  };
}
const CustomButtonGroup = ({ next, previous }) => (
  <div className="flex justify-end m-2 mx-16">
    <button
      className="p-3  mx-2 cursor-pointer border-[#000000] border-1 bg-transparent"
      onClick={previous}
    >
      <FaAngleLeft size={20} color='#000000' />
    </button>
    <button
      className="p-3  mx-2 cursor-pointer border-[#000000] border-1 bg-transparent"
      onClick={next}
    >
      <FaAngleRight size={20} color='#000000' />
    </button>
  </div>
);
const ChipsCard = ({ product }) => {
  const variantUrl = useVariantUrl(product.handle);
  return (
    <Link to={variantUrl} className='flex flex-1 flex-col h-full relative shadow'>
      <div className='relative cursor-pointer flex-1'>
        {product.images.nodes[0] ? (
          <Image
            alt={product.images.nodes[0].alt || product.title}
            className='hover:opacity-0 transition duration-100 ease-in-out w-full h-full object-cover bg-center bg-no-repeat absolute top-0 left-0'
            data={product.images.nodes[0]}
          />
        ) : (
          <Image 
            data={product.images.nodes[0]} 
            className='hover:opacity-0 transition duration-100 ease-in-out w-full h-full object-cover bg-center bg-no-repeat absolute top-0 left-0' 
            src="/home/chips2.png" 
            alt="" 
          />
        )}
        {product.images.nodes[1] ? (
          <Image
            alt={product.images.nodes[1].alt || product.title}
            className='w-full h-full object-cover bg-center bg-no-repeat'
            data={product.images.nodes[1]}
          />
        ) : (
          <Image 
            data={product.images.nodes[1]} 
            className='w-full h-full object-cover bg-center bg-no-repeat' 
            src="/home/chips2.png" 
            alt="" 
          />
        )}
      </div>
      <div className='bg-white p-4 zigzag-bottom'>
        <div className='flex justify-between'>
          <span>{product.title}</span>
          <span className='text-sm'>₹{product.priceRange.minVariantPrice.amount}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-sm text-[#fdb716]'>puff variety pack</span>
          <span className='text-sm'>{product?.selectedOrFirstAvailableVariant?.weight}g</span>
        </div>
      </div>
      <div className='absolute top-4 left-4 bg-white text-black p-1 px-3'>18 pack</div>
      
      <style jsx>{`
        .zigzag-bottom {
          position: relative;
          margin-top: -1px; /* Remove any gap between image and text div */
        }
        .zigzag-bottom::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(-45deg, #fff 12px, transparent 0), linear-gradient(45deg, #fff 12px, transparent 0);
          background-position: left top;
          background-repeat: repeat-x;
          background-size: 24px 20px;
          transform: translateY(-100%);
        }
      `}</style>
    </Link>
  );
}
/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({ context }) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

const aboutList = [
  {
    img: "/home/abouts/image1.png",
    title: "CLEAN, REAL INGREDIENTS",
    description: "Nothing Weird Here!Our snacks are made with clean, wholesome ingredients – no artificial preservatives or funny chemicals. Just real food for real people.  "
  },
  {
    img: "/home/abouts/image2.png",
    title: "POWERED BY PROTEIN",
    description: "Fuel Your Day! Fuel your day with protein-packed goodness! Our snacks give you the energy and satisfaction you need to keep going strong. Crunch, munch, and power up!  "
  },
  {
    img: "/home/abouts/image3.png",
    title: "FLAVOR THAT SLAPS",
    description: "Zero Snackrifice! No bland bites here. Our bold flavors bring the fun back to healthy snacking, so you don’t have to choose between taste and eating better."
  },
]

const testimonials = [
  {
    "name": "Vikram",
    "said": "\"I'm hooked! I grab a bag every day to satisfy my snack cravings, and the best part? No guilt afterward! Light, crunchy, and packed with flavor—I highly recommend these!\"",
    "url": "puffs"
  },
  {
    "name": "Priya",
    "said": "\"Absolutely delicious! The perfect mix of crunch and spice, just the way I love my snacks. Once you start, you can’t stop—I could easily finish a whole bag! \"",
    "url": "makhana"
  },
  {
    "name": "Sejal",
    "said": "\"This snack is my guilt-free indulgence! Made with flavored makhana, it’s light yet so satisfying. A tasty, healthier alternative to regular munchies!\"",
    "url": "dry-fruits"
  },
]

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const carouselRef = useRef(null);
  const carouselRef2 = useRef(null);
  const carouselRef3 = useRef(null);

  const handleNext = (carouselRef) => {
    carouselRef.current.next();
  };

  const handlePrevious = (carouselRef) => {
    carouselRef.current.previous();
  };

  return (
    <div className="home">
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <div className='px-4 flex md:hidden'>
        <div className='relative'>
          <img className='w-full ' src="/home/heromobile.png" alt="" />
          <div className='absolute top-0 left-0 w-full flex flex-col items-center justify-center pt-5'>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
              }} style={{ fontFamily: 'Acumin' }} className='text-6xl font-extrabold text-[#fff2d8] drop-shadow-[5px_4.3px_0.5px_rgba(0,0,0,0.8),1px_0_1px_rgba(0,0,0),0_1px_1px_rgba(0,0,0),-1px_0_1px_rgba(0,0,0),0_-1px_1px_rgba(0,0,0)]'>HEALTHY</motion.h2>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4, delay: 0.2
              }} style={{ fontFamily: 'Acumin' }} className='text-6xl font-extrabold text-[#fff2d8] drop-shadow-[5px_4.3px_0.5px_rgba(0,0,0,0.8),1px_0_1px_rgba(0,0,0),0_1px_1px_rgba(0,0,0),-1px_0_1px_rgba(0,0,0),0_-1px_1px_rgba(0,0,0)]'>HITS</motion.h2>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4, delay: 0.4
              }} style={{ fontFamily: 'Acumin' }} className='text-6xl font-extrabold text-[#fff2d8] drop-shadow-[5px_4.3px_0.5px_rgba(0,0,0,0.8),1px_0_1px_rgba(0,0,0),0_1px_1px_rgba(0,0,0),-1px_0_1px_rgba(0,0,0),0_-1px_1px_rgba(0,0,0)]'>DIFFERENT</motion.h2>
            {/* <h2 style={{ fontFamily: 'Motel Xenia' }} className='text-7xl font-bold tracking-wide text-black'>YOUR MIND</h2> */}
            {/* <motion.p initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
              }} className='text-lg my-2 text-black'>Changing snacking one pea at a time.</motion.p> */}
            <motion.button initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4
              }} className=' bg-[#86d1d5] px-10 text-base mt-4 text-white py-3 w-fit hover:bg-transparent border-3 border-[#86d1d5] hover:text-[#86d1d5] cursor-pointer'>snacc now</motion.button>

          </div>
        </div>
      </div>
      <div className='px-14 hidden md:flex items-center justify-center'>
        <div className='relative bg-red-400'>
          <img className='h-[85vh] ' src="/home/hero1.jpeg" alt="" />
          <div className='absolute ml-15 left-0 top-0 h-full flex flex-col justify-center '>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
              }} style={{ fontFamily: 'Acumin' }} className='text-8xl font-extrabold text-[#fff2d8] drop-shadow-[5px_4.3px_0.5px_rgba(0,0,0,0.8),1px_0_1px_rgba(0,0,0),0_1px_1px_rgba(0,0,0),-1px_0_1px_rgba(0,0,0),0_-1px_1px_rgba(0,0,0)]'>HEALTHY</motion.h2>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4, delay: 0.2
              }} style={{ fontFamily: 'Acumin' }} className='text-8xl font-extrabold text-[#fff2d8] drop-shadow-[5px_4.3px_0.5px_rgba(0,0,0,0.8),1px_0_1px_rgba(0,0,0),0_1px_1px_rgba(0,0,0),-1px_0_1px_rgba(0,0,0),0_-1px_1px_rgba(0,0,0)]'>HITS</motion.h2>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4, delay: 0.4
              }} style={{ fontFamily: 'Acumin' }} className='text-8xl font-extrabold text-[#fff2d8] drop-shadow-[5px_4.3px_0.5px_rgba(0,0,0,0.8),1px_0_1px_rgba(0,0,0),0_1px_1px_rgba(0,0,0),-1px_0_1px_rgba(0,0,0),0_-1px_1px_rgba(0,0,0)]'>DIFFERENT</motion.h2>
            {/* <h2 style={{ fontFamily: 'Motel Xenia' }} className='text-9xl text-black'>YOUR MIND</h2> */}
            {/* <motion.p initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
              }} className='text-xl my-2 text-black'>Changing snacking one pea at a time.</motion.p> */}
            <motion.button initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4
              }} className=' bg-[#86d1d5] my-2 px-10 text-lg text-black py-1 w-fit hover:bg-black border-3 hover:border-black border-[#86d1d5] hover:text-[#86d1d5] cursor-pointer tracking-wide'>snacc now</motion.button>
          </div>
        </div>
      </div>
      <div className='px-4 md:px-14 my-20'>
        <div className='w-full hidden md:flex flex-wrap justify-between items-center px-5 gap-2'>
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className='h-28' src="/home/certs/1.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className='h-28' src="/home/certs/2.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className='h-28' src="/home/certs/3.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className='h-28' src="/home/certs/4.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }} className='h-28' src="/home/certs/5.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/6.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/7.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/8.png" alt="" />
        </div>
        <div className='w-full md:hidden gap-2 overflow-y-scroll md:flex-wrap flex justify-between items-center px-5' style={{ scrollbarWidth: "none" }}>
          <img className='h-28' src="/home/certs/1.png" alt="" />
          <img className='h-28' src="/home/certs/2.png" alt="" />
          <img className='h-28' src="/home/certs/3.png" alt="" />
          <img className='h-28' src="/home/certs/4.png" alt="" />
          <img className='h-28' src="/home/certs/5.png" alt="" />
          <img className='h-28' src="/home/certs/6.png" alt="" />
          <img className='h-28' src="/home/certs/7.png" alt="" />
          <img className='h-28' src="/home/certs/8.png" alt="" />
        </div>
      </div>
      <div className='px-4 md:px-14'>
        <div className='bg-[#ffc604]  py-2'>
          <div className='px-4 md:px-16'>
            <motion.h4 initial={{ opacity: 0, rotateZ: 30 }} whileInView={{ opacity: 1, rotateZ: 0 }} transition={{ duration: 0.2 }} style={{ fontFamily: "City Tour", transformOrigin: 'left' }} className='text-5xl text-[#000]'>no junk in this trunk</motion.h4>
          </div>
          <div className='w-full'>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <Await resolve={data.recommendedProducts}>
                {(response) => (
                  <>
                    {response ? (
                      <div className="relative">
                        <Carousel
                          ref={carouselRef}
                          additionalTransfrom={0}
                          arrows={false} // Disable default arrows
                          centerMode={false}
                          containerClass="mx-2 md:mx-16 my-5"
                          draggable
                          focusOnSelect={false}
                          keyBoardControl
                          minimumTouchDrag={80}
                          renderArrowsWhenDisabled={false}
                          renderButtonGroupOutside={false}
                          renderDotsOutside={false}
                          responsive={{
                            desktop: {
                              breakpoint: { max: 3000, min: 1024 },
                              items: 3.5,
                              partialVisibilityGutter: 0,
                            },
                            mobile: {
                              breakpoint: { max: 464, min: 0 },
                              items: 1,
                              partialVisibilityGutter: 30,
                            },
                            tablet: {
                              breakpoint: { max: 1024, min: 464 },
                              items: 2,
                              partialVisibilityGutter: 30,
                            },
                          }}
                          rewind={false}
                          rewindWithAnimation={false}
                          shouldResetAutoplay
                          showDots={false}
                          sliderClass=""
                          slidesToSlide={1}
                          swipeable
                        >
                          {response.products.nodes.map((e, ind) => {
                            return (
                              <motion.div key={ind} className='mx-1  overflow-hidden h-full' initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 * ind }}>
                                <ChipsCard product={e}>

                                </ChipsCard>
                              </motion.div>
                            );
                          })}
                        </Carousel>
                        <CustomButtonGroup next={() => handleNext(carouselRef)} previous={() => handlePrevious(carouselRef)} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>

      <div className='w-full my-5'>
        {/* <Marquee direction="left" speed={10} autoFill style={{ fontFamily: "Motel Xenia" }}>
        <span className='text-[#fdb716] text-[150px] text-nowrap ml-30 font-bold tracking-wide'>Better for you, Better for the earth</span>
        </Marquee> */}
        <div className="marquee-container">
          {/* First marquee */}
          {/* <div className="marquee flex">
            <div style={{ fontFamily: 'Acumin' }} className='text-[70px] font-bold ml-30 text-[#86D1D5] tracking-wider drop-shadow-[2px_0_0px_rgba(0,0,0),0_2px_0px_rgba(0,0,0),-2px_0_0px_rgba(0,0,0),0_-2px_0px_rgba(0,0,0),5px_5px_0px_rgba(0,0,0)] flex items-center'>HEALTHY HITS DIFFERENT <img className='mx-5 h-[30%]' src='/peablue.png' alt='txt' /></div>
            <div style={{ fontFamily: 'Acumin' }} className='text-[70px] font-bold ml-30 text-[#86D1D5] tracking-wider drop-shadow-[2px_0_0px_rgba(0,0,0),0_2px_0px_rgba(0,0,0),-2px_0_0px_rgba(0,0,0),0_-2px_0px_rgba(0,0,0),5px_5px_0px_rgba(0,0,0)] flex items-center'>HEALTHY HITS DIFFERENT <img className='mx-5 h-[30%]' src='/peablue.png' alt='txt' /></div>
            <div style={{ fontFamily: 'Acumin' }} className='text-[70px] font-bold ml-30 text-[#86D1D5] tracking-wider drop-shadow-[2px_0_0px_rgba(0,0,0),0_2px_0px_rgba(0,0,0),-2px_0_0px_rgba(0,0,0),0_-2px_0px_rgba(0,0,0),5px_5px_0px_rgba(0,0,0)] flex items-center'>HEALTHY HITS DIFFERENT <img className='mx-5 h-[30%]' src='/peablue.png' alt='txt' /></div>
          </div> */}
          <Marquee >
            <div className='flex text-nowrap items-center'><span style={{ fontFamily: 'Acumin' }} className='text-[70px] h-full font-bold ml-30 text-[#86D1D5] tracking-wider drop-shadow-[2px_0_0px_rgba(0,0,0),0_2px_0px_rgba(0,0,0),-2px_0_0px_rgba(0,0,0),0_-2px_0px_rgba(0,0,0),5px_5px_0px_rgba(0,0,0)]'>HEALTHY HITS DIFFERENT </span><img className='mx-5 h-10' src='/peablue.png' alt='txt' /></div>
          </Marquee>

          {/* Second marquee */}
          {/* <div className="marquee2">
            <span className='text-[#fdb716] text-[150px] text-nowrap ml-30 font-bold tracking-wide'>Better for you, Better for the earth</span>
          </div> */}
        </div>
      </div>

      <div className='px-4 md:px-14'>
        <div className='flex flex-wrap'>
          {aboutList.map((list, ind) => (
            <div key={ind} className='flex w-full md:w-1/3 p-4 flex-col  items-center text-center text-black'>
              <img className='' src={list.img} alt="" />
              <h4 style={{ fontFamily: "Acumin" }} className='text-2xl font-extrabold tracking-wide my-3'>{list.title}</h4>
              <p style={{fontFamily:"Acumin"}} className=''>{list.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center justify-center my-10'>
        <button className=' bg-[#86d1d5] px-10 text-base mt-4 text-white py-3 w-fit hover:bg-transparent border-3 border-[#86d1d5] hover:text-[#86d1d5] cursor-pointer'>more about snacc</button>
      </div>

      <div className='px-4 md:px-14 my-26 flex md:flex-row flex-col'>
        <div className='md:w-1/2 relative'>
          <img src="/home/varpack.png" className='' alt="" />
          <img className='absolute right-10 -top-10' src="/home/varpacknew.svg" alt="" />
        </div>
        <div className='md:w-1/2 flex flex-col p-4 md:px-10'>
          <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-6xl md:text-5xl text-black tracking-wide'>Build your own box</motion.h4 >
          <p className='text-black text-lg my-5'>For the Cheese lover who wants all the cheeze feels, minus the guilt. Stock up with 9 bags of Vegan White Cheddar and 9 bags of Vegan Nacho Puffs!</p>
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Await resolve={data.recommendedProducts}>
              {(response) => (
                <>
                  {response ? (
                    <div className="relative">
                      <Carousel
                        ref={carouselRef2}
                        additionalTransfrom={0}
                        arrows={false} // Disable default arrows
                        centerMode={false}
                        containerClass=""
                        draggable
                        focusOnSelect={false}
                        keyBoardControl
                        minimumTouchDrag={80}
                        renderArrowsWhenDisabled={false}
                        renderButtonGroupOutside={false}
                        renderDotsOutside={false}
                        responsive={{
                          desktop: {
                            breakpoint: { max: 3000, min: 1024 },
                            items: 1,
                            partialVisibilityGutter: 0,
                          },
                          mobile: {
                            breakpoint: { max: 464, min: 0 },
                            items: 1,
                            partialVisibilityGutter: 0,
                          },
                          tablet: {
                            breakpoint: { max: 1024, min: 464 },
                            items: 1,
                            partialVisibilityGutter: 0,
                          },
                        }}
                        rewind={false}
                        rewindWithAnimation={false}
                        shouldResetAutoplay
                        showDots={false}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                      >
                        {response.products.nodes.map((e) => {
                          return (
                            <div key={e.id} className='h-full  overflow-hidden'>
                              <ChipsCard product={e}>

                              </ChipsCard>
                            </div>
                          );
                        })}
                      </Carousel>
                      <CustomButtonGroup next={() => handleNext(carouselRef2)} previous={() => handlePrevious(carouselRef2)} />
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className='px-4 md:px-14'>
        <div className='w-full p-3 md:px-16  bg-[#fdb716]'>
          <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-5xl tracking-wide text-[#fff2d8]'>why they trust us</motion.h4>
          <div className='w-full'>
            <div className="relative">
              <Carousel
                ref={carouselRef3}
                additionalTransfrom={0}
                arrows={false} // Disable default arrows
                centerMode={false}
                containerClass="my-5"
                draggable
                focusOnSelect={false}
                keyBoardControl
                minimumTouchDrag={80}
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={{
                  desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 3,
                    partialVisibilityGutter: 20,
                  },
                  mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1,
                    partialVisibilityGutter: 30,
                  },
                  tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2,
                    partialVisibilityGutter: 30,
                  },
                }}
                rewind={false}
                rewindWithAnimation={false}
                shouldResetAutoplay
                showDots={false}
                sliderClass=""
                slidesToSlide={1}
                swipeable
              >
                {testimonials.map((e, ind) => {
                  return (
                    <div key={ind} className='m-2 relative bg-white  p-10 flex flex-col text-start text-black text-2xl'>
                      <div className='flex gap-1 '>
                        <IoStarSharp size={26} color='#000000' />
                        <IoStarSharp size={26} color='#000000' />
                        <IoStarSharp size={26} color='#000000' />
                        <IoStarSharp size={26} color='#000000' />
                        <IoStarSharp size={26} color='#000000' />
                      </div>
                      <p style={{ fontFamily: 'City Tour' }} className='mb-3 mt-2'>{e.name}</p>
                      <p className='text-lg'>{e.said}</p>
                      <div className='w-full flex justify-end underline underline-offset-10 mt-3'>
                        <Link to={`/collections/${e.url}`}>
                          shop {e.url}
                        </Link>
                      </div>
                      <img src="/home/testi.png" className='absolute right-2 -top-5 w-18' alt="" />
                    </div>
                  );
                })}
              </Carousel>
              <CustomButtonGroup next={() => handleNext(carouselRef3)} previous={() => handlePrevious(carouselRef3)} />
            </div>
          </div>
        </div>
      </div>

      {/* <div className='px-4 md:px-14 my-20'>
        <video className=' object-cover min-h-[60vh]' controls >
          <source src="/home/vid.mp4" type="video/mp4" />
        </video>
      </div> */}

      <div className='px-4 md:px-14 my-20'>
        <div className='flex justify-center flex-col md:flex-row'>
          {/* <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-5xl tracking-wide text-black'>power to the peaple</motion.h4> */}
          <a target='_blank' href='https://instagram.com/eat.snacc' className=' bg-[#000000] px-7 py-3 my-3 md:my-0 text-sm  text-white w-fit hover:bg-transparent border-3 border-[#000000] hover:text-black cursor-pointer'>follow @eat.snacc</a>
        </div>
        {/* <div>
          <Carousel
            additionalTransfrom={0}
            arrows={true} // Disable default arrows
            centerMode={false}
            containerClass="my-5"
            draggable
            focusOnSelect={false}
            keyBoardControl
            minimumTouchDrag={80}
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 5,
                partialVisibilityGutter: 20,
              },
              mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 2,
                partialVisibilityGutter: 30,
              },
              tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 3,
                partialVisibilityGutter: 30,
              },
            }}
            rewind={false}
            rewindWithAnimation={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {[...Array(10)].map((e, ind) => {
              return (
                <div key={ind} className='m-1  overflow-hidden'>
                  <img src="/home/power.png" alt="" />
                </div>
              );
            })}
          </Carousel>
        </div> */}

      </div>
    </div>
  );
}

/**
 * @param {{
        *   collection: FeaturedCollectionFragment;
 * }}
      */
function FeaturedCollection({ collection }) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
        *   products: Promise<RecommendedProductsQuery | null>;
 * }}
      */
function RecommendedProducts({ products }) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products 123</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="recommended-product"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h4>{product.title}</h4>
                    <small>
                      <Money data={product.priceRange.minVariantPrice} />
                    </small>
                  </Link>
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
      fragment FeaturedCollection on Collection {
        id
    title
      image {
        id
      url
      altText
      width
      height
    }
      handle
  }
      query FeaturedCollection($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
        collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
        nodes {
        ...FeaturedCollection
      }
    }
  }
      `;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
      fragment RecommendedProduct on Product {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
          selectedOrFirstAvailableVariant {
        weight
      }
      }
      query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
        products(first: 4, sortKey: UPDATED_AT, reverse: true) {
        nodes {
        ...RecommendedProduct
      }
    }
  }
      `;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
