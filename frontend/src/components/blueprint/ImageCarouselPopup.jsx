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

  return (
    <Dialog open={isOpen} onOpenChange={onClickCloseButton}>
      <DialogContent className="max-w-4xl w-full bg-black border-black p-0 [&_button[data-svg]]:text-white [&_button]:hover:bg-[#424242] [&_button]:border-0">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={image.image_id}
                className="flex justify-center items-center"
              >
                <img
                  src={image.image_origin}
                  alt={`Image ${image.image_id + 1}`}
                  className="max-w-full max-h-screen object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 text-zinc-800 cursor-pointer" />
          <CarouselNext className="absolute right-4 text-zinc-800 cursor-pointer" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarouselPopup;
