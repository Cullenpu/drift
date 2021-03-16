"use strict";

class DriftCarousel {
  constructor(selector, images) {
    this.parentElement = document.querySelector(selector);
    const origPosition = this.parentElement.style.position;
    console.log("Original parent position: ", origPosition);
    if (!origPosition || origPosition === "static") {
      // Parent element must be relaitve for image to be properly sized
      console.log("Set parent position to relaitve");
      this.parentElement.style.position = "relative";
    }

    this.parentElement.style.overflow = "hidden";
    this.transitionTimeout = 5000;
    this.transitionDuration = 1000;
    this.opacity = 1;
    this.imageNum = 0;
    this.images = images;
    this.imageElements = this.createImages();
    this.random = false;
  }

  /*-------------------------------------------------------------------------*/
  /*** DOM Functions ***/
  createImages() {
    const imageElements = this.images.map((image) => {
      const imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.style.position = "absolute";
      //   imageElement.style.objectFit = "cover";
      imageElement.style.opacity = 0;
      imageElement.style.visibility = "hidden";
      imageElement.style.zIndex = -1000;

      // Set width and height of each image to fill the entire parent element
      imageElement.style.width = "100%";
      imageElement.style.height = "100%";
      imageElement.style.objectFit = "cover";

      this.parentElement.prepend(imageElement);
      return imageElement;
    });
    return imageElements;
  }
  /*-------------------------------------------------------------------------*/

  renderCarousel(n) {
    this.setInvisible(this.imageElements[this.imageNum]);
    this.imageNum = n;
    this.setVisible(this.imageElements[this.imageNum]);
    const next = this.getNextImage(n);
    setTimeout(() => {
      console.log("switch", this.imageNum);
      this.renderCarousel(next);
    }, this.transitionTimeout);
  }
  getNextImage(n, direction) {
    let next = n;
    if (direction === "left") {
      next = n === 0 ? this.imageElements.length - 1 : n - 1;
    } else if (direction === "right" || !this.random) {
      next = n === this.imageElements.length - 1 ? 0 : n + 1;
    } else {
      while (next === n) {
        next = Math.floor(Math.random() * this.imageElements.length);
      }
    }
    return next;
  }
  setVisible(imageElement) {
    imageElement.style.visibility = "visible";
    imageElement.style.opacity = this.opacity;
    imageElement.style.transition = `opacity ${this.transitionDuration}ms`;
  }
  setInvisible(imageElement) {
    imageElement.style.visibility = "hidden";
    imageElement.style.opacity = 0;
    imageElement.style.transition = `visibility 0s ${this.transitionDuration}ms, opacity ${this.transitionDuration}ms`;
  }
  setRandom() {
    this.random = true;
  }
  setNotRandom() {
    this.random = false;
  }
  setTransitionTimeout(transitionTimeout) {
    // Time in between images
    this.transitionTimeout = transitionTimeout;
  }
  setTransitionDuration(transitionDuration) {
    // Duration of image transition
    this.transitionDuration = transitionDuration;
  }
  setOpacity(opacity) {
    this.opacity = opacity;
  }
}
