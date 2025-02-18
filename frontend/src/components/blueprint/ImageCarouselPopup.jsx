import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const ImageCarouselPopup = ({
  images,
  initialIndex = 0,
  isOpen,
  onClickCloseButton,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loadingImages, setLoadingImages] = useState(
    new Array(images.length).fill(true),
  );

  const handleImageLoad = (index) => {
    setLoadingImages((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const isAllImagesLoaded = !loadingImages.some((loading) => loading);

  return (
    <Dialog open={isOpen} onOpenChange={onClickCloseButton}>
      <DialogContent className="max-w-[70vw] h-[75vh] w-full bg-black border-black p-0 [&_button[data-svg]]:text-white [&_button]:hover:bg-[#424242] [&_button]:border-0 flex items-center">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={image.image_id}
                className="flex justify-center items-center p-4"
              >
                {loadingImages[index] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="relative w-full flex items-center justify-center">
                  <img
                    src={image.image_origin}
                    alt={`Image ${image.image_id + 1}`}
                    className={`max-w-[95%] max-h-[70vh] w-auto h-auto object-contain transition-opacity duration-300 ${
                      loadingImages[index] ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                      minWidth: '70%',
                      minHeight: '70%',
                    }}
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={`absolute left-4 text-zinc-800 cursor-pointer ${
              !isAllImagesLoaded ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isAllImagesLoaded}
          />
          <CarouselNext
            className={`absolute right-4 text-zinc-800 cursor-pointer ${
              !isAllImagesLoaded ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isAllImagesLoaded}
          />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarouselPopup;
