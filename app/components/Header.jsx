import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Await, Link, NavLink, useAsyncValue } from '@remix-run/react';
import { useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';
import { IoBasketOutline, IoCartOutline, IoMenuOutline } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { FaAngleDown, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaFacebook } from 'react-icons/fa6';
/**
 * @param {HeaderProps}
*/
function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);
  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  }, [scrollDirection]);

  return scrollDirection;
};
const navItems = [
  {
    title: "shop",
    columns: [
      {
        title: "staff-picks",
        url: "collections/staff-picks"
      },
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
export function Header({ header, isLoggedIn, cart, publicStoreDomain }) {
  const { shop, menu } = header;
  const scrollDirection = useScrollDirection();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    setActiveDropdown(null);
  };


  return (
    // <header className="header">
    //   <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
    //     <strong>{shop.name}</strong>
    //   </NavLink>
    //   <HeaderMenu
    //     menu={menu}
    //     viewport="desktop"
    //     primaryDomainUrl={header.shop.primaryDomain.url}
    //     publicStoreDomain={publicStoreDomain}
    //   />
    //   <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    // </header>
    <header className={`sticky ${scrollDirection === "down" ? "-top-24" : "top-0"} relative z-10 w-full bg-white py-5 px-3 md:px-14 flex items-center justify-between border-b border-gray-100 transition-all duration-500 ease-in-out`}>
      <div className="flex flex-1 items-center gap-24">
        <HeaderMenuMobileToggle />
        {navItems.map((item, index) => (
          <NavLink onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave} key={index} prefetch="intent" to="/" className="hidden md:flex items-center">
            <span style={{fontFamily:"City Tour"}} className="uppercase text-xl text-[#fdb716] tracking-wider hover:opacity-80">{item.title}</span>
            <FaAngleDown className='mt-1 ml-2 font-bold' color='#fdb716' />
            {activeDropdown === index && (
              <div
                className='absolute top-full left-0 w-full max-h-[calc(100vh-4rem)] bg-white shadow-md z-50 overflow-y-scroll'
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className='flex p-8 px-20 justify-between'>

                  <div className='flex flex-col gap-6 text-[#51282b] mr-16'>
                    <p className='opacity-60'>{item.title}</p>
                    {item.columns.map((column, colIndex) => (
                      <>
                        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * colIndex }} key={colIndex} className='flex flex-col'>
                          <Link className='text-nowrap text-4xl hover:underline underline-offset-8' to={column.url}>{column.title}</Link>
                        </motion.div>
                      </>
                    ))}
                  </div>
                  <div>
                    <p className='text-4xl text-[#51282b]'>{item.rows.title}</p>
                    <div className='flex gap-3 my-5'>
                      {item.rows.items.map((row, rowIndex) => (
                        <div key={rowIndex}>
                          <div className='h-72 w-72 rounded-4xl overflow-hidden bg-orange-400'>
                            <img src={row.img} className='w-full h-full' alt="" />
                          </div>
                          <p className='text-[#51282b] text-2xl mt-2'>{row.title}</p>
                          <p className='text-yellow-300 text-xl'>{row.variety}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>)}
          </NavLink>
        ))}
        {/* <NavLink prefetch="intent" to="/learn" className="hidden md:flex items-center">
          <span className="font-extrabold text-lg text-[#51282b] hover:opacity-80">learn</span>
          <FaAngleDown className='mt-1 ml-2 font-bold' color='#51282b' />
        </NavLink> */}
        {/* <NavLink prefetch="intent" to="/subscribe" className="hidden md:block">
          <span className="font-extrabold text-lg text-[#51282b] hover:opacity-80">subscribe</span>
        </NavLink> */}
      </div>

      <NavLink prefetch="intent" to="/" className="shrink-0" >
        {/* Alternatively, use an image: */}
        <img src="/logo.png" alt={shop.name} className="h-8 md:h-10" />
      </NavLink>

      <div className="flex flex-1 items-center gap-20 justify-end">
        {/* <NavLink prefetch="intent" to="/store" className="mr-8 hidden md:block">
          <span className="text-lg text-[#51282b] hover:opacity-80">find a store</span>
        </NavLink> */}
        <AccountLink isLoggedIn={isLoggedIn} />
        <CartToggle cart={cart} />
      </div>

      {/* <MobileMenu
        menu={menu}
        isLoggedIn={isLoggedIn}
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      /> */}
    </header>
  );
}

function AccountLink({ isLoggedIn }) {
  return (
    <NavLink
      prefetch="intent"
      to="/account"
      className="mr-4 hidden md:block"
    >
      <span style={{fontFamily:"City Tour"}} className="font-bold text-xl tracking-wider text-[#fdb716] hover:opacity-80">account</span>
    </NavLink>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const { close } = useAside();

  return (
    <nav className={className} role="navigation">
      <div className='flex flex-col mt-5 gap-5'>
        {/* <NavLink prefetch="intent" to="/shop">
          <span className="font-extrabold text-2xl text-[#51282b] hover:opacity-80">shop</span>
        </NavLink>
        <NavLink prefetch="intent" to="/shop">
          <span className="font-extrabold text-xl ml-5 opacity-90 text-[#51282b] hover:opacity-80">shop</span>
        </NavLink>
        <NavLink prefetch="intent" to="/learn">
          <span className="font-extrabold text-2xl text-[#51282b] hover:opacity-80">learn</span>
        </NavLink> */}
        {navItems.map((item,ind) => {
          return <div key={ind} className='flex flex-col gap-3'>
            <NavLink prefetch="intent">
              <span className="font-extrabold text-3xl text-[#51282b] hover:opacity-80">{item.title}</span>
            </NavLink>
            {item.columns.map((col,ind) => {
              return <NavLink key={ind} prefetch="intent" to={col.url} onClick={close}>
                <span className="ml-5 opacity-90 font-extrabold text-2xl text-[#51282b] hover:opacity-70">{col.title}</span>
              </NavLink>
            })}
          </div>
        })}
      </div>
      <div className='flex my-10 gap-10 justify-center md:justify-start'>
        <Link><FaFacebook size={28} className="" color='#51282b' /></Link>
        <Link><FaTwitter size={28} className="" color='#51282b' /></Link>
        <Link><FaInstagram size={28} className="" color='#51282b' /></Link>
      </div>

      {/* {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )} */}
      {/* {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })} */}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <IoMenuOutline size={30} />
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({ count }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      href="/cart"
      className='flex relative'
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <IoBasketOutline size={27} color='#51282b' />
      {count === 0 ? '' : <div style={{ fontSize: '10px' }} className='absolute top-0 -right-1 bg-[#51282b] rounded-full text-white w-4 h-4 flex items-center justify-center'><span>{count}</span></div>}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
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
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
