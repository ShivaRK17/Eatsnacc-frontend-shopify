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
            className="p-4  mx-2 cursor-pointer border-[#000000] border-1 bg-transparent"
            onClick={previous}
        >
            <FaAngleLeft size={20} color='#000000' />
        </button>
        <button
            className="p-4  mx-2 cursor-pointer border-[#000000] border-1 bg-transparent"
            onClick={next}
        >
            <FaAngleRight size={20} color='#000000' />
        </button>
    </div>
);


export default function AboutUs() {
    /** @type {LoaderReturnData} */
    const { products } = useLoaderData();
    const carouselRef = useRef(null);
    return <>
        <div className="px-4 md:px-14 py-3">
            <div className=" overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    <img src="/about-us/hero.png" alt="" />
                </div>
                <div className="md:w-1/2 bg-[#fdb716] flex flex-col items-center justify-center text-black">
                    <div className="md:w-3/4 flex flex-col items-center justify-center text-center mx-7 md:mx-0 my-10 md:my-0">
                        <h3 style={{ fontFamily: "City Tour" }} className="text-4xl md:text-4xl tracking-wide">We’re on a mission to shake things up</h3>
                        <p className="text-xl">Forget tie-dye t-shirts, dreadlocks and lava lamps…it’s the spirit of the era that lives on in us. Join the freedom fighters, snacktivists and chickpea charmers who are reinventing snacking, one pea at time!</p>
                    </div>
                </div>
            </div>
            <div className="py-5 my-10">
                <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-5xl md:text-6xl tracking-wide font-bold text-black'>meet the snacc pack</motion.h4>
                <div className="flex justify-between my-2 flex-col md:flex-row">
                    <p className="text-xl md:text-2xl text-black opacity-80">Snacks that taste good and do good for the Mind, Body & Soul.</p>
                    <Link to={'/collections/all'} className=" hover:underline text-2xl text-black flex items-center">View all <FaAngleRight className="ml-5" size={20} /></Link>
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
                                    containerClass="mx-2 my-5"
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
                                        return <Link to={useVariantUrl(product.handle)} key={index} className={`m-1 flex flex-1 flex-col  overflow-hidden relative`}>
                                            <div className='relative cursor-pointer'>
                                                {/* {product.featuredImage ? <Image
                                                    alt={product.featuredImage.altText || product.title}
                                                    className='hover:opacity-0 transition duration-100 ease-in-out absolute top-0 left-0'
                                                    aspectRatio="1/1"
                                                    data={product.featuredImage}
                                                    sizes="(min-width: 45em) 400px, 100vw"
                                                /> : <img className='hover:opacity-0 transition duration-100 ease-in-out absolute top-0 left-0' src="/home/chips2.png" alt="" />}
                                                <img className='' src="/home/chips1.png" alt="" /> */}
                                                {product.images.nodes[0] ? <Image
                                                    alt={product.images.nodes[0].alt || product.title}
                                                    className='hover:opacity-0 transition duration-100 ease-in-out h-full object-cover w-full absolute top-0 left-0'
                                                    data={product.images.nodes[0]}
                                                /> : <Image data={product.images.nodes[0]} className='hover:opacity-0 transition duration-100 ease-in-out w-full h-full object-cover absolute top-0 left-0' src="/home/chips2.png" alt="" />}
                                                {product.images.nodes[1] ? <Image
                                                    alt={product.images.nodes[1].alt || product.title}
                                                    className='h-full object-cover w-full'
                                                    data={product.images.nodes[1]}
                                                /> : <Image data={product.images.nodes[1]} className='h-full object-cover w-full' src="/home/chips1.png" alt="" />}
                                            </div>
                                            <div className='bg-white p-4'>
                                                <div className='flex justify-between'>
                                                    <span>{product.title}</span>
                                                    <span className='text-sm'>₹{product.priceRange.minVariantPrice.amount}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-sm text-[#fdb716]'>puff variety pack</span>
                                                    <span className='text-sm'>{product?.selectedOrFirstAvailableVariant?.weight}g</span>
                                                </div>
                                            </div>
                                            <div className='absolute top-4 left-4  bg-white text-black p-1 px-3'>18 pack</div>
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
                <video className=' w-full' controls >
                    <source src="./home/vid.mp4" type="video/mp4" />
                </video>
            </div>

            <div className='my-20'>
                <div className='w-full md:flex hidden flex-wrap justify-between gap-2 items-center px-5'>
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className='h-28' src="/home/certs/1.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className='h-28' src="/home/certs/2.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className='h-28' src="/home/certs/3.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className='h-28' src="/home/certs/4.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }} className='h-28' src="/home/certs/5.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/6.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 }} className='h-28' src="/home/certs/7.png" alt="" />
                    <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 }} className='h-28' src="/home/certs/8.png" alt="" />
                </div>
                <div className='w-full md:hidden overflow-y-scroll md:flex-wrap flex gap-2 justify-between items-center px-5' style={{ scrollbarWidth: "none" }}>
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
      selectedOrFirstAvailableVariant {
        weight
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