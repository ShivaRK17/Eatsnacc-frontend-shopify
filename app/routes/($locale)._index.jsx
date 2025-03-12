import { Await, useLoaderData, Link } from '@remix-run/react';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IoStarSharp } from 'react-icons/io5';
import { motion } from 'motion/react';
import { useVariantUrl } from '~/lib/variants';

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
  <div className="flex justify-end m-4 mx-16">
    <button
      className="p-4 rounded-full mx-2 cursor-pointer border-[#51282b] border-1 bg-transparent"
      onClick={previous}
    >
      <FaAngleLeft size={20} color='#51282b' />
    </button>
    <button
      className="p-4 rounded-full mx-2 cursor-pointer border-[#51282b] border-1 bg-transparent"
      onClick={next}
    >
      <FaAngleRight size={20} color='#51282b' />
    </button>
  </div>
);
const ChipsCard = ({ product }) => {
  const variantUrl = useVariantUrl(product.handle);
  return <Link to={variantUrl} className='flex flex-1 flex-col rounded-3xl overflow-hidden relative shadow'>
    <div className='relative cursor-pointer'>
      {product.featuredImage ? <Image
        alt={product.featuredImage.altText || product.title}
        className='hover:opacity-0 transition duration-100 ease-in-out w-full absolute top-0 left-0'
        data={product.featuredImage}
      /> : <img className='hover:opacity-0 transition duration-100 ease-in-out w-full absolute top-0 left-0' src="/home/chips2.png" alt="" />}
      <img className='w-full' src="/home/chips1.png" alt="" />
    </div>
    <div className='bg-white p-4'>
      <div className='flex justify-between'>
        <span>{product.title}</span>
        {/* {JSON.stringify(product)} */}
        <span className='text-sm'>{product.priceRange.minVariantPrice.amount}</span>
      </div>
      <div className='flex justify-between'>
        <span className='text-sm text-[#fdb716]'>puff variety pack</span>
        <span className='text-sm'>0.8oz bags</span>
      </div>
    </div>
    <div className='absolute top-4 left-4 rounded-3xl bg-white text-[#51282b] p-1 px-3'>18 pack</div>
  </Link>
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
    title: "Made with Peas",
    description: "Our chickpeas and yellow peas support a healthy and diverse farm by naturally keeping nutrients in the soil, where they should be."
  },
  {
    img: "/home/abouts/image2.png",
    title: "Packed with Protein & Fiber",
    description: "Nothing but the good stuff here! Our snacks are packed with plant protein & fiber to keep you keepin' on. Thank you peas!"
  },
  {
    img: "/home/abouts/image3.png",
    title: "Full of Far Out Flavor",
    description: "We're all about Zero Snackrifice! No cardboard snacks here, our snacks are packed with Far Out Flavor so you don't have to choose between taste and eating better."
  },
]

const testimonials = [
  {
    "name": "Vicky",
    "said": "“This snack is my guilty pleasure (without the guilt). Made out of chickpeas, it has higher protein than other snacks and the taste is amazing.”",
    "url": "puffs"
  },
  {
    "name": "Jessica",
    "said": "\"Delicious! Watch out Cool Ranch Doritos, there’s a better chip in town! Melts in your mouth...my new favorite. Can easily eat a whole bag \"",
    "url": "chips"
  },
  {
    "name": "Anita",
    "said": "\"I’m addicted! I have one bag everyday to curb my snack cravings & the best part is not having to feel guilty about it afterwards! I personally recommend these!\"",
    "url": "straws"
  },
  {
    "name": "Lex",
    "said": "\"Super duper yummy, love these and so do my nonvegan family members! They don't leave a weird aftertaste like most of these kinds of snacks tend to do\"",
    "url": "puffs"
  },
  {
    "name": "Alicia",
    "said": "\"Everything about this snack is *chef’s kiss*! I hate chickpeas but this doesn’t taste like them at all. 4 servings in a bag… But a bag was gone by myself in a day. :)\"",
    "url": "puffs"
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
          <img className='w-full rounded-4xl' src="/home/heromobile.png" alt="" />
          <div className='absolute top-0 left-0 w-full flex flex-col items-center justify-center pt-5'>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
              }} style={{ fontFamily: 'Motel Xenia' }} className='text-7xl font-bold tracking-wide text-white'>FLAVOR</motion.h2>
            <h2 style={{ fontFamily: 'Motel Xenia' }} className='text-7xl font-bold tracking-wide text-[#51282b]'>YOUR MIND</h2>
            <motion.p initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
              }} className='text-lg my-2 text-[#51282b]'>Changing snacking one pea at a time.</motion.p>
            <motion.button initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4
              }} className='rounded-full bg-[#51282b] px-10 text-base mt-4 text-white py-3 w-fit hover:bg-transparent border-3 border-[#51282b] hover:text-[#51282b] cursor-pointer'>shop SNACC</motion.button>
          </div>
        </div>
      </div>
      <div className='px-14 hidden md:block'>
        <div className='relative'>
          <img className='w-full rounded-4xl' src="/home/hero.png" alt="" />
          <div className='absolute ml-15 left-0 top-0 h-full flex flex-col justify-center '>
            <motion.h2 initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
              }} style={{ fontFamily: 'Motel Xenia' }} className='text-9xl text-white'>FLAVOR</motion.h2>
            <h2 style={{ fontFamily: 'Motel Xenia' }} className='text-9xl text-[#51282b]'>YOUR MIND</h2>
            <motion.p initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
              }} className='text-xl my-2 text-[#51282b]'>Changing snacking one pea at a time.</motion.p>
            <motion.button initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4
              }} className='rounded-full bg-[#51282b] px-14 text-lg text-white py-4 w-fit hover:bg-transparent border-3 border-[#51282b] hover:text-[#51282b] cursor-pointer'>shop SNACC</motion.button>
          </div>
        </div>
      </div>
      <div className='px-4 md:px-14 my-20'>
        <div className='w-full hidden md:flex flex-wrap justify-between items-center px-5'>
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className='h-28' src="/home/certs/1.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className='h-28' src="/home/certs/2.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className='h-28' src="/home/certs/3.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className='h-28' src="/home/certs/4.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }} className='h-28' src="/home/certs/5.png" alt="" />
          {/* <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/6.svg" alt="" /> */}
        </div>
        <div className='w-full md:hidden overflow-y-scroll md:flex-wrap flex justify-between items-center px-5' style={{ scrollbarWidth: "none" }}>
          <img className='h-28' src="/home/certs/cert1.png" alt="" />
          <img className='h-28' src="/home/certs/cert2.png" alt="" />
          <img className='h-28' src="/home/certs/cert3.png" alt="" />
          <img className='h-28' src="/home/certs/cert4.png" alt="" />
          <img className='h-28' src="/home/certs/cert5.png" alt="" />
          <img className='h-28' src="/home/certs/cert6.png" alt="" />
          <img className='h-28' src="/home/certs/cert7.png" alt="" />
        </div>
      </div>
      <div className='px-4 md:px-14'>
        <div className='bg-[#ffc604] rounded-4xl py-10'>
          <div className='px-4 md:px-16'>
            <motion.h4 initial={{ opacity: 0, rotateZ: 30 }} whileInView={{ opacity: 1, rotateZ: 0 }} transition={{ duration: 0.2 }} style={{ fontFamily: "Motel Xenia", transformOrigin: 'left' }} className='text-6xl tracking-wide font-bold text-[#51282b]'>chips just got hip </motion.h4>
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
                              <motion.div key={ind} className='m-1' initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 * ind }}>
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
        <div className="marquee-container" style={{ fontFamily: "Motel Xenia" }}>
          {/* First marquee */}
          <div className="marquee">
            <span className='text-[#fdb716] text-[150px] text-nowrap ml-30 font-bold tracking-wide'>Better for you, Better for the earth</span>
            <span className='text-[#fdb716] text-[150px] text-nowrap ml-30 font-bold tracking-wide'>Better for you, Better for the earth</span>
            <span className='text-[#fdb716] text-[150px] text-nowrap ml-30 font-bold tracking-wide'>Better for you, Better for the earth</span>
          </div>

          {/* Second marquee */}
          {/* <div className="marquee2">
            <span className='text-[#fdb716] text-[150px] text-nowrap ml-30 font-bold tracking-wide'>Better for you, Better for the earth</span>
          </div> */}
        </div>
      </div>

      <div className='px-4 md:px-14'>
        <div className='flex flex-wrap'>
          {aboutList.map((list, ind) => (
            <div key={ind} className='flex w-full md:w-1/3 p-4 flex-col  items-center text-center text-[#51282b]'>
              <img className='h-30' src={list.img} alt="" />
              <h4 style={{ fontFamily: "Motel Xenia" }} className='text-5xl font-semibold tracking-wide my-3'>{list.title}</h4>
              <p className='text-xl'>{list.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center justify-center my-10'>
        <button className='rounded-full bg-[#51282b] px-4 md:px-14 text-lg text-white py-4 w-fit hover:bg-transparent border-3 border-[#51282b] hover:text-[#51282b] cursor-pointer'>more about SNACC</button>
      </div>

      <div className='px-4 md:px-14 my-26 flex md:flex-row flex-col'>
        <div className='md:w-1/2 relative'>
          <img src="/home/varpack.png" className='rounded-4xl' alt="" />
          <img className='absolute right-10 -top-10' src="/home/varpacknew.svg" alt="" />
        </div>
        <div className='md:w-1/2 flex flex-col p-4 md:px-10'>
          <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "Motel Xenia" }} className='text-6xl md:text-8xl text-[#41282b] font-semibold tracking-wide'>Our Cheeziest Variety Pack</motion.h4 >
          <p className='text-[#51282b] text-2xl my-5'>For the Cheese lover who wants all the cheeze feels, minus the guilt. Stock up with 9 bags of Vegan White Cheddar and 9 bags of Vegan Nacho Puffs!</p>
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
                            <div key={e.id}>
                              <ChipsCard  product={e}>

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
        <div className='w-full p-3 md:p-16 rounded-4xl bg-[#fdb716] text-center'>
          <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "Motel Xenia" }} className='text-6xl tracking-wide font-bold text-[#51282b]'>what they're saying... </motion.h4>
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
                    <div key={ind} className='m-2 relative bg-white rounded-4xl p-10 flex flex-col text-start text-[#51282b] text-2xl'>
                      <div className='flex gap-1 '>
                        <IoStarSharp size={26} color='#51282b' />
                        <IoStarSharp size={26} color='#51282b' />
                        <IoStarSharp size={26} color='#51282b' />
                        <IoStarSharp size={26} color='#51282b' />
                        <IoStarSharp size={26} color='#51282b' />
                      </div>
                      <p className='mb-3 mt-2'>{e.name}</p>
                      <p>{e.said}</p>
                      <div className='w-full flex justify-end underline underline-offset-10 mt-3'>
                        <Link to={`/shop/collections/${e.url}`}>
                          shop {e.url}
                        </Link>
                      </div>
                      <img src="/home/testi.png" className='absolute right-2 -top-2 w-20' alt="" />
                    </div>
                  );
                })}
              </Carousel>
              <CustomButtonGroup next={() => handleNext(carouselRef3)} previous={() => handlePrevious(carouselRef3)} />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 md:px-14 my-20'>
        <video className='rounded-4xl object-cover min-h-[60vh]' controls >
          <source src="/home/vid.mp4" type="video/mp4" />
        </video>
      </div>

      <div className='px-4 md:px-14 my-20'>
        <div className='flex justify-between flex-col md:flex-row'>
          <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "Motel Xenia" }} className='text-6xl tracking-wide font-bold text-[#51282b]'>power to the peaple</motion.h4>
          <button className='rounded-full bg-[#51282b] px-7 py-3 my-3 md:my-0 text-sm  text-white w-fit hover:bg-transparent border-3 border-[#51282b] hover:text-[#51282b] cursor-pointer'>follow @SNACC</button>
        </div>
        <div>
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
            {[...Array(10)].map((e,ind) => {
              return (
                <div key={ind} className='m-1 rounded-3xl overflow-hidden'>
                  <img src="/home/power.png" alt="" />
                </div>
              );
            })}
          </Carousel>
        </div>

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
      images(first: 1) {
        nodes {
        id
        url
      altText
      width
      height
      }
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
