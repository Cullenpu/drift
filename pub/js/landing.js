const landingImages = [
  "res/landing/img1.jpg",
  "res/landing/img2.jpg",
  "res/landing/img3.jpg",
  "res/landing/img4.jpg"
];

const landingConfig = {
  brightness: 0.75,
  random: true,
  indicators: false,
  arrows: false,
};

const landing = new Drift("#landing", landingImages, landingConfig);
landing.renderCarousel(0);
