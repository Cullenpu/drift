"use strict";

class DriftCarousel {
  constructor(selector, images) {
    this.parentElement = document.querySelector(selector);

    /** Set parent element styles */
    const origPosition = this.parentElement.style.position;
    console.log("Original parent position: ", origPosition);
    if (!origPosition || origPosition === "static") {
      // Parent element must be relaitve for image to be properly sized
      console.log("Set parent position to relaitve");
      this.parentElement.style.position = "relative";
    }
    this.parentElement.style.overflow = "hidden";

    /** Carousel state */
    this.currTimeout;
    this.imageNum = 0;

    /** Carousel configuration */
    this.transitionTimeout = 5000;
    this.transitionDuration = 1000;
    this.opacity = 1;
    this.indicators = true;
    this.random = false;
    this.dark = false;

    /** DOM related objects */
    // List of images for carousel
    this.images = images;

    // List of carousel image DOM elements
    this.imageElements = this.createImages();

    // Div containing indicators used in carousel
    this.indicatorElements = this.createIndicators();
  }

  /*-------------------------------------------------------------------------*/
  /** DOM Functions ***/
  createImages() {
    const imageElements = this.images.map((image) => {
      const imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.style.position = "absolute";
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
  createIndicators() {
    const indicatorElements = document.createElement("div");
    indicatorElements.style.position = "absolute";
    indicatorElements.style.bottom = "10px";
    indicatorElements.style.left = "50%";
    indicatorElements.style.transform = "translate(-50%, 0)";
    indicatorElements.style.textAlign = "center";

    // Add indicators to the div
    this.images.forEach((image, i) => {
      const indicatorElement = document.createElement("span");
      indicatorElement.style.display = "inline-block";
      indicatorElement.style.width = "6px";
      indicatorElement.style.height = "6px";
      indicatorElement.style.background = "#AFAFAF";
      indicatorElement.style.margin = "0 5px";
      indicatorElement.style.borderRadius = "50%";
      indicatorElement.style.cursor = "pointer";
      indicatorElement.addEventListener("click", () => this.renderCarousel(i));

      indicatorElements.appendChild(indicatorElement);
    });

    this.parentElement.insertBefore(
      indicatorElements,
      this.parentElement.children[this.images.length - 1].nextSibling
    );
    return indicatorElements;
  }

  /*-------------------------------------------------------------------------*/
  /** Rendering Functions ***/
  renderCarousel(i) {
    clearTimeout(this.currTimeout);

    this.setInvisible(this.imageNum);
    this.imageNum = i;
    this.setVisible(this.imageNum);

    const next = this.getNextImage(i);
    this.currTimeout = setTimeout(() => {
      // console.log("switch", this.imageNum);
      this.renderCarousel(next);
    }, this.transitionTimeout);
  }
  getNextImage(i, direction) {
    let next = i;
    if (direction === "left") {
      next = i === 0 ? this.imageElements.length - 1 : i - 1;
    } else if (direction === "right" || !this.random) {
      next = i === this.imageElements.length - 1 ? 0 : i + 1;
    } else {
      while (next === i) {
        next = Math.floor(Math.random() * this.imageElements.length);
      }
    }
    return next;
  }
  setVisible(i) {
    if (this.indicators) {
      this.indicatorElements.style.visibility = "visible";
      const indicatorElement = this.indicatorElements.children[i];
      indicatorElement.style.background = "#D3D3D3";
      indicatorElement.style.transition = `background-color ${this.transitionDuration}ms ease`;
    } else {
      this.indicatorElements.style.visibility = "hidden";
    }

    const imageElement = this.imageElements[i];
    imageElement.style.visibility = "visible";
    if (this.dark) {
      imageElement.style.filter = "brightness(55%)";
    }
    imageElement.style.opacity = this.opacity;
    imageElement.style.transition = `opacity ${this.transitionDuration}ms`;
  }
  setInvisible(i) {
    if (this.indicators) {
      this.indicatorElements.style.visibility = "visible";
      const indicatorElement = this.indicatorElements.children[i];
      indicatorElement.style.background = "#AFAFAF";
    } else {
      this.indicatorElements.style.visibility = "hidden";
    }

    const imageElement = this.imageElements[i];
    imageElement.style.visibility = "hidden";
    imageElement.style.opacity = 0;
    imageElement.style.transition = `visibility 0s ${this.transitionDuration}ms, opacity ${this.transitionDuration}ms`;
  }

  /*-------------------------------------------------------------------------*/
  /** Configuration Functions ***/
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
  setIndicators() {
    this.indicators = true;
  }
  setNotIndicators() {
    this.indicators = false;
  }
  setRandom() {
    this.random = true;
  }
  setNotRandom() {
    this.random = false;
  }
  setDark() {
    // Darken the carousel
    this.dark = true;
  }
  setNotDark() {
    this.dark = false;
  }
}
