"use strict";

const exampleImages = [
  "res/example/img1.jpg",
  "res/example/img2.jpg",
  "res/example/img3.jpg",
  "res/example/img4.jpg",
  "res/example/img5.jpg",
];

const captions = [
  "Golden Gate Bridge, San Francisco, CA",
  "Horshoe Bay - Nanaimo, Vancouver, BC",
  "Summer Nights, Toronto, ON",
  "720S, Boston, MA",
  "Fort Point, Boston, MA",
];

const landscapeCarouselConfig = {
  transitionTimeout: 3000,
  transitionDuration: 2000,
  opacity: 0.5,
  captions: true,
};
const landscapeCarousel = new DriftCarousel(
  "#landscape-carousel",
  exampleImages,
  landscapeCarouselConfig,
  captions
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
  exampleImages,
  portraitCarouselLeftConfig,
  captions
);
portraitCarouselLeft.renderCarousel(0);


const portraitCarouselRightConfig = {
  transitionTimeout: 3000,
  brightness: 0.55,
  indicators: false,
};
const portraitCarouselRight = new DriftCarousel(
  "#portrait-carousel-right",
  exampleImages,
  portraitCarouselRightConfig
);
portraitCarouselRight.renderCarousel(0);
