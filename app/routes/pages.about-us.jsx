import { Await, Link, useLoaderData } from "@remix-run/react"
import { getPaginationVariables, Image } from "@shopify/hydrogen";
import { motion } from "motion/react"
import { Suspense, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import { PaginatedResourceSection } from "~/components/PaginatedResourceSection";
import ScrollSyncSection from "~/components/ScrollTrigger";
import { useVariantUrl } from "~/lib/variants";

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
    // Start fetching non-critical data without blocking time to first byte
    const deferredData = await loadDeferredData(args);


    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);
    const tempproducts = deferredData.products;


    return { products: tempproducts };
}
async function loadCriticalData({ context }) {
    return {};
}

async function loadDeferredData({ context, request }) {
    const { storefront } = context;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 8,
    });

    const [{ products }] = await Promise.all([
        storefront.query(CATALOG_QUERY, {
            variables: { ...paginationVariables },
        }),
        // Add other queries here, so that they are loaded in parallel
    ]);

    return { products };
}

const handleNext = (ref) => {
    ref.current.next();
};

const handlePrevious = (ref) => {
    ref.current.previous();
};

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


export default function AboutUs() {
    /** @type {LoaderReturnData} */
    const { products } = useLoaderData();
    const carouselRef = useRef(null);
    return <>
        <div className="px-4 md:px-14 py-3">
            <div className="rounded-4xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    <img src="/about-us/hero.png" alt="" />
                </div>
                <div className="md:w-1/2 bg-[#fdb716] flex flex-col items-center justify-center text-[#51282b]">
                    <div className="md:w-3/4 flex flex-col items-center justify-center text-center mx-7 md:mx-0 my-10 md:my-0">
                        <h3 style={{ fontFamily: "Motel Xenia" }} className="text-5xl md:text-6xl font-bold tracking-wide">We’re on a mission to shake things up</h3>
                        <p className="text-xl">Forget tie-dye t-shirts, dreadlocks and lava lamps…it’s the spirit of the era that lives on in us. Join the freedom fighters, snacktivists and chickpea charmers who are reinventing snacking, one pea at time!</p>
                    </div>
                </div>
            </div>
            <div className="py-5 my-10">
                <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "Motel Xenia" }} className='text-5xl md:text-6xl tracking-wide font-bold text-[#51282b]'>meet the snacc pack</motion.h4>
                <div className="flex justify-between my-2 flex-col md:flex-row">
                    <p className="text-xl md:text-2xl text-[#51282b] opacity-80">Snacks that taste good and do good for the Mind, Body & Soul.</p>
                    <Link to={'/collections/all'} className=" hover:underline text-2xl text-[#51282b] flex items-center">View all <FaAngleRight className="ml-5" size={20} /></Link>
                </div>
            </div>
            <div className='w-full'>
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <Await resolve={products}>
                        {(resolvedProducts) => (
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
                                            items: 4,
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

                                    {resolvedProducts.nodes.map((product, index) => {
                                        return <Link to={useVariantUrl(product.handle)} key={index} className={`m-1 flex flex-1 flex-col rounded-3xl overflow-hidden relative`}>
                                            <div className='relative cursor-pointer'>
                                                {product.featuredImage ? <Image
                                                    alt={product.featuredImage.altText || product.title}
                                                    className='hover:opacity-0 transition duration-100 ease-in-out absolute top-0 left-0'
                                                    aspectRatio="1/1"
                                                    data={product.featuredImage}
                                                    sizes="(min-width: 45em) 400px, 100vw"
                                                /> : <img className='hover:opacity-0 transition duration-100 ease-in-out absolute top-0 left-0' src="/home/chips2.png" alt="" />}
                                                <img className='' src="/home/chips1.png" alt="" />
                                            </div>
                                            <div className='bg-white p-4'>
                                                <div className='flex justify-between'>
                                                    <span>{product.title}</span>
                                                    <span className='text-sm'>$24.99</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-sm text-[#fdb716]'>puff variety pack</span>
                                                    <span className='text-sm'>0.8oz bags</span>
                                                </div>
                                            </div>
                                            <div className='absolute top-4 left-4 rounded-3xl bg-white text-[#51282b] p-1 px-3'>18 pack</div>
                                        </Link>
                                    })}
                                </Carousel>
                                <CustomButtonGroup next={() => handleNext(carouselRef)} previous={() => handlePrevious(carouselRef)} />
                            </div>
                        )}
                    </Await>
                </Suspense>
            </div>
            <ScrollSyncSection />
            <div className='w-full my-20'>
                <video className='rounded-4xl w-full' controls >
                    <source src="./home/vid.mp4" type="video/mp4" />
                </video>
            </div>

            <div className='my-20'>
                <div className='w-full md:flex hidden flex-wrap justify-between items-center px-5'>
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className='h-28' src="/home/certs/1.svg" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className='h-28' src="/home/certs/2.svg" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className='h-28' src="/home/certs/3.svg" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className='h-28' src="/home/certs/4.svg" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }} className='h-28' src="/home/certs/5.svg" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/6.svg" alt="" />
                    {/* <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 }} className='h-28' src="/home/certs/7.svg" alt="" /> */}
                </div>
                <div className='w-full md:hidden overflow-y-scroll md:flex-wrap flex justify-between items-center px-5' style={{ scrollbarWidth: "none" }}>
                    <img className='h-28' src="/home/certs/1.svg" alt="" />
                    <img className='h-28' src="/home/certs/2.svg" alt="" />
                    <img className='h-28' src="/home/certs/3.svg" alt="" />
                    <img className='h-28' src="/home/certs/4.svg" alt="" />
                    <img className='h-28' src="/home/certs/5.svg" alt="" />
                    <img className='h-28' src="/home/certs/6.svg" alt="" />
                    {/* <img className='h-28' src="/home/certs/7.svg" alt="" /> */}
                </div>
            </div>

        </div>
    </>
}
const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;