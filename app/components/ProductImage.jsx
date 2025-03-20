import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  return (
    <div className="product-image w-1/2">
      {image ? <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        className=''
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      /> : <img src='/header/bestsell.png' className=''></img>}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
