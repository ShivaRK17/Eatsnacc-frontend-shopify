import { Link } from '@remix-run/react';
import { CartForm, Money } from '@shopify/hydrogen';
import { useRef } from 'react';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({ cart, layout }) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside my-5';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div style={{ fontFamily: "Motel Xenia" }} className='flex justify-between text-4xl mt-5'>
        <h4 className='text-black font-bold tracking-wide'>Total</h4>
        <dl className="text-black font-bold tracking-wide cart-subtotal">
          <dd>
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
      </div>
      <p className='text-black opacity-60 my-3 text-sm md:text-xl'>Taxes and shipping calculated at checkout</p>
      {/* <CartDiscounts discountCodes={cart.discountCodes} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} /> */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />

    </div>
  );
}
/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({ checkoutUrl }) {
  if (!checkoutUrl) return null;

  return (
    <div className='flex gap-4 md:justify-start justify-center'>

      <Link to={'/cart'}>
        <button target="_self" className=' bg-[#000000] px-6 md:px-14 text-sm md:text-lg text-white py-4 w-fit hover:bg-transparent border-3 border-[#000000] hover:text-black cursor-pointer'>
          View Cart
        </button>
      </Link>
      <Link to={checkoutUrl}>
        <button target="_self" className=' bg-[#000000] px-6 md:px-14 text-sm md:text-lg text-white py-4 w-fit hover:bg-transparent border-3 border-[#000000] hover:text-black cursor-pointer'>
          Checkout
        </button>
      </Link>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({ discountCodes }) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({ discountCodes, children }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({ giftCardCodes }) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const codes =
    giftCardCodes?.map(({ lastCharacters }) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   removeAppliedCode?: () => void;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({ giftCardCodes, saveAppliedCode, children }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
