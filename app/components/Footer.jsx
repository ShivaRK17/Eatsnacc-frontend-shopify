import { Suspense } from 'react';
import { Await, Link, NavLink } from '@remix-run/react';
import { FaArrowRight, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa6';

/**
 * @param {FooterProps}
 */

const navItems = [
  {
    title: "shop",
    columns: [
      {
        title: "shop all",
        url: "collections/shop-all"
      },
      {
        title: "dry fruits",
        url: "collections/dry-fruits"
      },
      {
        title: "puffs",
        url: "collections/puffs"
      },
      {
        title: "makhana",
        url: "collections/makhana"
      }
    ],
    rows: {
      title: "best sellers",
      items: [
        {
          img: "/header/bestsell.png",
          title: "chickpea tortilla chips",
          variety: "nacho vibes"
        },
        {
          img: "/header/bestsell.png",
          title: "chickpea puffs",
          variety: "vegan white cheddar"
        },
        {
          img: "/header/bestsell.png",
          title: "chickpea puffs",
          variety: "variety pack"
        },
      ]
    }
  },
  {
    title: "learn",
    columns: [
      {
        title: "about us",
        url: "pages/about-us"
      },
      {
        title: "FAQs",
        url: "pages/faq"
      },
      {
        title: "sustainability",
        url: "pages/sourcing"
      },
    ],
    rows: {
      title: "let's be social",
      items: [
        {
          img: "/home/varpack.png",
          title: "instagram",
          variety: ""
        },
        {
          img: "/home/varpack.png",
          title: "tiktok",
          variety: ""
        },
      ]
    }
  },

]
export function Footer({ footer: footerPromise, header, publicStoreDomain }) {
  return (
    // <Suspense>
    //   <Await resolve={footerPromise}>
    //     {(footer) => (
    //       <footer className="footer">
    //         {footer?.menu && header.shop.primaryDomain?.url && (
    //           <FooterMenu
    //             menu={footer.menu}
    //             primaryDomainUrl={header.shop.primaryDomain.url}
    //             publicStoreDomain={publicStoreDomain}
    //           />
    //         )}
    //       </footer>
    //     )}
    //   </Await>
    // </Suspense>
    <>
      <div className='bg-[#86d1d5] md:p-14 p-5 py-14'>
        <div className=' grid grid-cols-1 md:grid-cols-4 justify-between'>
          <div className='col-span-1'>
            <div className='flex flex-col items-center md:items-start'>
              <img className='w-3/4' src="/footer/footer.png" alt="" />
              <div className='flex my-10 gap-10 justify-center md:justify-start'>
                <Link><FaFacebook size={28} className="" color='white' /></Link>
                <Link><FaTwitter size={28} className="" color='white' /></Link>
                <Link><FaInstagram size={28} className="" color='white' /></Link>
              </div>
            </div>
          </div>
          <div className='md:mx-16 text-white flex col-span-2 justify-between md:justify-evenly'>
            {navItems.map((item, ind) => {
              return <ul className='flex flex-col gap-4 text-lg'>
                <p className='mb-2 text-xl opacity-60'>{item.title}</p>
                {item.columns.map((subItem, ind1) => {
                  return <li><Link to={subItem.url}>{subItem.title}</Link></li>
                })}
                <li><Link to={'refund-policy'}>Refund Policy</Link></li>
              </ul>
            })}
          </div>
          <div className='col-span-1 md:mx-4 my-10 md:my-0'>
            <h5 style={{ fontFamily: "City Tour" }} className='text-4xl tracking-wide  text-white'>Subscribe for 10% off your first order</h5>
            <div className='bg-transparent  border-2 flex my-2 border-white p-5'>
              <input type="email" placeholder='E-mail' className='outline-none flex-1 text-white font-sans' />
              <div className=' bg-white h-6 w-6 flex items-center justify-center'>
                <FaArrowRight color='#000000' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-between mt-10 text-sm text-white flex-col md:flex-row md:items-start items-center'>
          <span>snacc® All Rights Reservered. © 2025 snacc, Inc.</span>
          <span>Site by ShivaRK17</span>
        </div>
      </div>
    </>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({ menu, primaryDomainUrl, publicStoreDomain }) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({ isActive, isPending }) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
