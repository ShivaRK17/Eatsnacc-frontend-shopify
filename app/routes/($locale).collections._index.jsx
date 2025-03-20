import { useLoaderData, Link } from '@remix-run/react';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import { motion } from 'motion/react';
import { FaAngleRight } from 'react-icons/fa6';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

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
async function loadCriticalData({ context, request }) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  const [{ collections }] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);  
  return { collections };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({ context }) {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const { collections } = useLoaderData();

  return (
    <div className='text-center px-14'>
      <motion.h4 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ fontFamily: "City Tour" }} className='text-6xl my-5 tracking-wide text-black'>all collections</motion.h4>
      <div className='mb-10'>
        <PaginatedResourceSection
          connection={collections}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {({ node: collection, index }) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </div>

    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({ collection, index }) {
  return (

    <Link
      className="collection-item  overflow-hidden relative"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <motion.div whileHover="animate" initial="initial" animate="initial">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) :
          <img className='brightness-70 hover:scale-105 transition-all duration-500' src="/header/bestsell.png" alt="" />
        }
        <motion.div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center'>
          <motion.h5 variants={{ initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: -10 }, }} style={{ fontFamily: "City Tour" }} className=' text-white text-4xl tracking-wide mt-3'>{collection.title}</motion.h5>
          <motion.div variants={{ initial: { opacity: 0, y: -10,display:'hidden' }, animate: { opacity: 1, y: 0,display:'visible' }, }} className='bg-white mt-2 flex  p-2 w-fit'>
            <FaAngleRight size={28} color='#000000' />
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
