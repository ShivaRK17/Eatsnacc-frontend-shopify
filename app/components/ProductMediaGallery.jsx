import { useEffect, useState } from "react";
import { ProductImage } from "./ProductImage";
import Carousel from "react-multi-carousel";

const ProductMediaGallery = ({ media, selectedVariantImage }) => {
  const [selectedImage, setSelectedImage] = useState(selectedVariantImage?.url || '');

  useEffect(() => {
    if (selectedVariantImage?.url) {
      setSelectedImage(selectedVariantImage.url);
    }
  }, [selectedVariantImage]);

  if (!media?.nodes?.length) {
    return <ProductImage image={selectedVariantImage} />;
  }

  return (
    <>
      <div className="hidden md:flex flex-col md:w-1/2">
        <div className="mb-4  overflow-hidden">
          <img
            src={selectedImage || media.nodes[0]?.image?.url}
            alt="Selected product"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 overflow-x-auto">
          {media.nodes.map((item) => {
            if (item.mediaContentType === 'IMAGE') {
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedImage(item.image.url)}
                  className={` overflow-hidden border-4 col-span-1 cursor-pointer ${selectedImage === item.image.url ? 'border-[#000000]' : 'border-transparent'
                    }`}
                >
                  <img
                    src={item.image.url}
                    alt={item.image.altText || 'Product thumbnail'}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>
      <div className="flex md:hidden">
        <Carousel className="md:hidden block w-full  overflow-hidden z-0" responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
            partialVisibilityGutter: 0,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            partialVisibilityGutter: 0,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            partialVisibilityGutter: 30,
          },
        }}>
          {media.nodes.map((item) => {
            if (item.mediaContentType === 'IMAGE') {
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedImage(item.image.url)}
                  className={` overflow-hidden mx-1 col-span-1 cursor-pointer border-transparent'
                    }`}
                >
                  <img
                    src={item.image.url}
                    alt={item.image.altText || 'Product thumbnail'}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            }
            return null;
          })}
        </Carousel>
      </div>
    </>
  );
};

export default ProductMediaGallery;