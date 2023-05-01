import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";

export default function App() {

    const [swiper, setSwiper] = React.useState(0);
    const slideTo = (index) => swiper.slideTo(index);
  return (
    <>
      <Swiper
      onSwiper={setSwiper}
      touchMoveStopPropagation={false}
      allowTouchMove={false}
      autoHeight={true}
      slidesPerView={1}
      slidesPerGroup={1}>
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
      </Swiper>
    </>
  );
}
