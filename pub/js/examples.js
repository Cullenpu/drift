"use strict";

const images = [
  "res/img1.jpg",
  "res/img2.jpg",
  "res/img3.jpg",
  "res/img4.jpg",
  "res/img5.jpg",
];

const landing = new DriftCarousel("#landing", images);
landing.setRandom();
landing.setOpacity(0.75);
landing.renderCarousel(0);

const landscapeCarousel = new DriftCarousel("#landscape-carousel", images);
landscapeCarousel.setTransitionTimeout(3000);
landscapeCarousel.setTransitionDuration(2000);
landscapeCarousel.setOpacity(0.5);
landscapeCarousel.setRandom();
landscapeCarousel.renderCarousel(0);
