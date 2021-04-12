"use strict";

const images = [
  "res/img1.jpg",
  "res/img2.jpg",
  "res/img3.jpg",
  "res/img4.jpg",
  "res/img5.jpg",
];

const captions = [
  "Caption 1",
  "Caption 2",
  "Caption 3",
  "Caption 4",
  "Caption 5",
];


const landingConfig = {
  brightness: 0.5,
  opacity: 0.6,
  indicators: false,
  arrows: false,
};
const landing = new DriftCarousel("#landing", images, landingConfig);
landing.renderCarousel(0);


const landscapeCarouselConfig = {
  transitionTimeout: 3000,
  transitionDuration: 2000,
  opacity: 0.5,
};
const landscapeCarousel = new DriftCarousel(
  "#landscape-carousel",
  images,
  landscapeCarouselConfig
);
landscapeCarousel.renderCarousel(0);


const portraitCarouselLeftConfig = {
  transitionTimeout: 3000,
  random: true,
  captions: true,
  arrows: false,
};
const portraitCarouselLeft = new DriftCarousel(
  "#portrait-carousel-left",
  images,
  portraitCarouselLeftConfig,
  captions
);
portraitCarouselLeft.renderCarousel(0);


const portraitCarouselRightConfig = {
  transitionTimeout: 3000,
  brightness: 0.55,
  opacity: 0.7,
  indicators: false,
};
const portraitCarouselRight = new DriftCarousel(
  "#portrait-carousel-right",
  images,
  portraitCarouselRightConfig
);
portraitCarouselRight.renderCarousel(0);
