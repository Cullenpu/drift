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

const defaultCarousel = new Drift("#default-carousel", exampleImages);
defaultCarousel.renderCarousel(0);

const landscapeCarouselConfig = {
  transitionTimeout: 3000,
  transitionDuration: 2000,
  random: true,
  opacity: 0.5,
};
const landscapeCarousel = new Drift(
  "#landscape-carousel",
  exampleImages,
  landscapeCarouselConfig
);
landscapeCarousel.renderCarousel(0);


const portraitCarouselLeftConfig = {
  transitionTimeout: 3000,
  random: true,
  captions: captions,
  arrows: false,
};
const portraitCarouselLeft = new Drift(
  "#portrait-carousel-left",
  exampleImages,
  portraitCarouselLeftConfig
);
portraitCarouselLeft.renderCarousel(0);


const portraitCarouselRightConfig = {
  transitionTimeout: 3000,
  brightness: 0.55,
  indicators: false,
};
const portraitCarouselRight = new Drift(
  "#portrait-carousel-right",
  exampleImages,
  portraitCarouselRightConfig
);
portraitCarouselRight.renderCarousel(0);
