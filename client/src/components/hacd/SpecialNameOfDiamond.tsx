import React, { useState } from "react";
import { Modal } from 'react-responsive-modal';
import { Carousel } from 'react-responsive-carousel';
import {
    Card,
    CardHeader,
    CardBody,
    Typography
} from "@material-tailwind/react";

import 'react-responsive-modal/styles.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const SpecialNameOfDiamond = () => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const diamonds = [
        {
            name: "ZKKZZZ",
            image: require('../../assets/images/zkkzzz.png')
        },
        {
            name: "TIIITI",
            image: require('../../assets/images/tiiiti.png')
        },
        {
            name: "VUUUVU",
            image: require('../../assets/images/vuuuvu.png')
        },
        {
            name: "TNNNNNB",
            image: require('../../assets/images/tnnnnb.png')
        },
        {
            name: "NUUUUM",
            image: require('../../assets/images/nuuuum.png')
        },
        {
            name: "KKKKNZ",
            image: require('../../assets/images/kkkknz.png')
        },
        {
            name: "XHSSSS",
            image: require('../../assets/images/xhssss.png')
        },
        {
            name: "MMMMHT",
            image: require('../../assets/images/mmmmht.png')
        }
    ];

    const openModal = (image: string, index: number) => {
        setSelectedImage(image);
        setCurrentIndex(index);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % diamonds.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + diamonds.length) % diamonds.length);
    };

    interface CustomIndicatorProps {
        isSelected: boolean;
        index: number;
        label: string;
      }
    const renderCustomIndicator = ({isSelected, index, label} : CustomIndicatorProps) => {
        const dotStyles = {
          background: isSelected ? 'blue' : 'gray', // Replace with your desired colors
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          display: 'inline-block',
          margin: '0 4px',
          cursor: 'pointer',
        };
      
        return (
          <li
            key={index}
            style={dotStyles}
            value={index}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${label}`}
          />
        );
      };
      
    return (
        <div className="container mx-auto my-4 sm:my-10">
            <h1 className="text-center text-main font-bold text-3xl sm:text-5xl">Special Name Of Diamond</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 my-5 sm:gap-10 sm:my-10 mx-5">
                {diamonds.map((item, index) => (
                    <Card className="overflow-hidden cursor-pointer"
                        key={index} onClick={() => openModal(item.image, index)}>
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="m-0 rounded-none"
                        >
                            <img src={item.image} alt={`Image ${index + 1}`} className="w-full" />
                        </CardHeader>
                        <CardBody className="text-center py-3 sm:py-7">
                            <Typography color="blue-gray" className="mb-2 text-main font-bold text-sm sm:text-4xl">
                                {item.name}
                            </Typography>
                        </CardBody>
                    </Card>
                ))}
                <Modal open={open} onClose={closeModal} center>
                    <Carousel showThumbs={false} selectedItem={currentIndex} renderIndicator={(onClickHandler, isSelected, index, label) => renderCustomIndicator({isSelected, index, label})}>
                        {diamonds.map((item, index) => (
                            <div key={index}>
                                <img src={item.image} alt={`Image ${index + 1}`} />
                            </div>
                        ))}
                    </Carousel>
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-main text-white font-bold py-2 px-4 rounded"
                            onClick={handlePrev}
                        >
                            Previous
                        </button>
                        <button
                            className="bg-main text-white font-bold py-2 px-4 rounded"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default SpecialNameOfDiamond;