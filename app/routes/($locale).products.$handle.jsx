import { Await, Link, useLoaderData } from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductImage } from '~/components/ProductImage';
import { ProductForm } from '~/components/ProductForm';
import { motion } from 'motion/react';
import ProductMediaGallery from '~/components/ProductMediaGallery';
import { Suspense, useRef, useState } from 'react';
import { FaAngleDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import Carousel from 'react-multi-carousel';
import { useVariantUrl } from '~/lib/variants';
// import ReactBeforeSliderComponent from 'react-before-after-slider-component';
// import 'react-before-after-slider-component/dist/build.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import CompareSlider from '~/components/InsidePuff';



/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({ context, params }) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.
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

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="mb-4">
      <button
        className="w-full text-left py-2 px-4 flex justify-between items-center cursor-pointer rounded-lg bg-transparent focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-xl font-medium text-black">{question}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <FaAngleDown size={24} className={`${isOpen ? "bg-[#000000] text-[#fdb716]" : "text-black bg-white"}  p-1`} />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="text-xl px-4 py-3 text-black">
          <p>{answer}</p>
        </div>
      </div>

      <div className="border-b border-[#000000] mt-4"></div>
    </div>
  );
};

const faqData = [
  {
    question: "ingredients",
    answer: "Chickpea Flour, Rice Flour, Sunflower Oil, Yellow Pea Flour, Maltodextrin, Salt, Sugar, Yeast Extract, Lactic Acid, Natural Flavoring, Turmeric Extract, Rosemary Extract"
  },
  {
    question: "nutrition",
    answer: "1 serving per bag | Serving size 21g Calories 100, Total Fat 4.5g, Saturated Fat 0g, Trans Fat 0g, Cholesterol Omg, Sodium 200mg, Total Carbohydrate 13g, Dietary Fiber 2g, Total Sugars <1g Incl. <1g Added Sugars, Protein 3g, Vitamin D Omg, Calcium 30mg, Iron 0mg, Potassium 130mg"
  },
]

export default function Product() {
  /** @type {LoaderReturnData} */
  const { product, recommendedProducts } = useLoaderData();
  const [selectedImage, setSelectedImage] = useState(null);
  const [openItems, setOpenItems] = useState({});

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });
  const handleToggle = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
  const ChipsCard = ({ product }) => {
    const variantUrl = useVariantUrl(product.handle);
    return <Link to={variantUrl} className='flex flex-1 flex-col h-full relative shadow'>
      <div className='relative cursor-pointer flex-1'>
        {product.images.nodes[0] ? <Image
          alt={product.images.nodes[0].alt || product.title}
          className='hover:opacity-0 transition duration-100 ease-in-out w-full h-full object-cover bg-center bg-no-repeat absolute top-0 left-0'
          data={product.images.nodes[0]}
        /> : <Image data={product.images.nodes[0]} className='hover:opacity-0 transition duration-100 ease-in-out w-full h-full object-cover bg-center bg-no-repeat absolute top-0 left-0' src="/home/chips2.png" alt="" />}
        {product.images.nodes[1] ? <Image
          alt={product.images.nodes[1].alt || product.title}
          className=' w-full h-full object-cover bg-center bg-no-repeat'
          data={product.images.nodes[1]}
        /> : <Image data={product.images.nodes[1]} className='w-full h-full object-cover bg-center bg-no-repeat' src="/home/chips2.png" alt="" />}
      </div>
      <div className='bg-white p-4 zigzag-bottom'>
        <div className='flex justify-between'>
          <span>{product.title}</span>
          {/* {JSON.stringify(product)} */}
          <span className='text-sm'>₹{product.priceRange.minVariantPrice.amount}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-sm text-[#fdb716]'>puff variety pack</span>
          <span className='text-sm'>{product?.selectedOrFirstAvailableVariant?.weight}g</span>
        </div>
      </div>
      <div className='absolute top-4 left-4  bg-white text-black p-1 px-3'>18 pack</div>
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
  }

  const { title, descriptionHtml } = product;
  const carouselRef = useRef(null)
  const handleNext = (carouselRef) => {
    carouselRef.current.next();
  };

  const handlePrevious = (carouselRef) => {
    carouselRef.current.previous();
  };

  return (
    <>
      {product ? <div className=' md:p-14'>
        <div className="product flex flex-col md:flex-row bg-[#99e1d8]  overflow-auto relative p-4 md:p-14">
          {/* <ProductImage image={selectedVariant?.image} /> */}
          <ProductMediaGallery
            media={product.media}
            selectedVariantImage={selectedVariant?.image}
          />
          <div className="sticky h-fit top-0 text-black mx-3 md:mx-10 flex flex-col gap-5 text-xl md:w-1/2">
            <h1 style={{ fontFamily: "City Tour" }} className='text-5xl tracking-wide'>{title}</h1>
            <ProductPrice
              className="text-xl font-bold"
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <div className='text-xl' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={!!openItems[index]}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
          {/* {JSON.stringify(product)} */}
          <Analytics.ProductView
            data={{
              products: [
                {
                  id: product.id,
                  title: product.title,
                  price: selectedVariant?.price.amount || '0',
                  vendor: product.vendor,
                  variantId: selectedVariant?.id || '',
                  variantTitle: selectedVariant?.title || '',
                  quantity: 1,
                },
              ],
            }}
          />
        </div>
        <div className='w-full hidden md:flex flex-wrap justify-between items-center px-5 my-14 gap-2'>
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className='h-28' src="/home/certs/1.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className='h-28' src="/home/certs/2.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className='h-28' src="/home/certs/3.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className='h-28' src="/home/certs/4.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }} className='h-28' src="/home/certs/5.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/6.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/7.png" alt="" />
          <motion.img initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className='h-28' src="/home/certs/8.png" alt="" />
        </div>
        <div className='w-full md:hidden overflow-y-scroll gap-2 md:flex-wrap flex justify-between items-center px-5 my-5' style={{ scrollbarWidth: "none" }}>
          <img className='h-28' src="/home/certs/1.png" alt="" />
          <img className='h-28' src="/home/certs/2.png" alt="" />
          <img className='h-28' src="/home/certs/3.png" alt="" />
          <img className='h-28' src="/home/certs/4.png" alt="" />
          <img className='h-28' src="/home/certs/5.png" alt="" />
          <img className='h-28' src="/home/certs/6.png" alt="" />
          <img className='h-28' src="/home/certs/7.png" alt="" />
          <img className='h-28' src="/home/certs/8.png" alt="" />
        </div>

        <div className='md: flex-col md:flex-row bg-[#99e1d8] p-3 py-10 md:p-14 my-10 flex'>
          <div className='md:w-1/3'>
            <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-5xl text-[#000000] tracking-wide'>inside the hippeas puff</motion.h4 >
            <p className='text-black text-xl my-5'>Our chickpea puffs are not only made with sustainably grown chickpeas, but also offer a rich source of plant-based protein, fiber and far out flavor!</p>
          </div>
          <div className='md:w-2/3 md:ml-10'>
            <CompareSlider beforeImage='/product/before.png' afterImage='/product/after.png' />
          </div>
        </div>

        <div className='bg-[#fdb716]  py-10'>
          <div className='px-16'>
            <motion.h4 initial={{ opacity: 0, rotateZ: 30 }} whileInView={{ opacity: 1, rotateZ: 0 }} transition={{ duration: 0.2 }} style={{ fontFamily: "City Tour", transformOrigin: 'left' }} className='text-5xl tracking-wide font-bold text-black'>You may also like...</motion.h4>
          </div>
          <div className='w-full'>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <Await resolve={recommendedProducts}>
                {(response) => (
                  <>
                    {response ? (
                      <div className="relative">
                        <Carousel
                          ref={carouselRef}
                          additionalTransfrom={0}
                          arrows={false} // Disable default arrows
                          centerMode={false}
                          containerClass="mx-4 md:mx-16 my-5"
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
                                <ChipsCard key={e.id} product={e}>

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
      </div> : <></>}
    </>
  );
}

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

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    media(first: 10) {
      nodes {
        ... on MediaImage {
          id
          image {
            url
            altText
            width
            height
          }
          mediaContentType
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
