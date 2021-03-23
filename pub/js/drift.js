"use strict";

class DriftCarousel {
  constructor(selector, images, config) {
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
    this.state = {
      currTimeout: null,
      imageNum: 0,
    };

    // Styles for indicators and arrows
    this.gray = "#D1D1D1";
    this.grayOpacity = "60%";
    this.altGray = "#F5F5F5";
    this.altGrayOpacity = "90%";

    /** Carousel configuration */
    this.config = {
      transitionTimeout: 5000,
      transitionDuration: 1000,
      random: false,
      brightness: 1,
      opacity: 1,
      indicators: true,
      arrows: true,
    };

    if (config) {
      // Update with user configuration
      this.config = { ...this.config, ...config };
    }

    /** DOM related objects */
    // List of images for carousel
    this.images = images;

    // List of carousel image DOM elements
    this.imageElements = this.createImages();

    // Div containing indicators used in carousel
    this.indicatorElements = this.createIndicators();

    // Left and right arrows for switching carousel images
    const arrows = this.createArrows();
    this.leftArrow = arrows[0];
    this.rightArrow = arrows[1];
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
      indicatorElement.style.background = this.gray;
      indicatorElement.style.opacity = this.grayOpacity;
      indicatorElement.style.margin = "0 5px";
      indicatorElement.style.borderRadius = "50%";
      indicatorElement.style.cursor = "pointer";
      indicatorElement.style.transition = `background-color ${this.config.transitionDuration}ms ease, opacity ${this.config.transitionDuration}ms ease`;
      indicatorElement.addEventListener("click", () => this.renderCarousel(i));

      indicatorElements.appendChild(indicatorElement);
    });

    this.parentElement.prepend(indicatorElements);
    return indicatorElements;
  }
  createArrows() {
    const arrows = [
      document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    ];

    const arrowPaths = [
      "M20,4 l-4,-4 -12,12 12,12 4,-4 -8-8z",
      "M4,4 l4,-4 12,12 -12,12 -4,-4 8-8z",
    ];

    arrows.forEach((arrow, i) => {
      arrow.setAttribute("viewbox", "0 0 24 24");
      arrow.setAttribute("width", "24px");
      arrow.setAttribute("height", "24px");
      arrow.style.position = "absolute";
      arrow.style.top = "50%";
      arrow.style.transform = "translate(0, -50%)";
      arrow.style.cursor = "pointer";

      const arrowPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      arrowPath.setAttribute("d", arrowPaths[i]);
      arrowPath.style.fill = this.gray;
      arrowPath.style.opacity = this.grayOpacity;
      arrowPath.style.transition = "fill 200ms ease, opacity 200ms ease";
      arrow.appendChild(arrowPath);

      arrow.onmouseover = () => {
        arrow.firstElementChild.style.fill = this.altGray;
        arrow.firstElementChild.style.opacity = this.altGrayOpacity;
      };
      arrow.onmouseleave = () => {
        arrow.firstElementChild.style.fill = this.gray;
        arrow.firstElementChild.style.opacity = this.grayOpacity;
      };
    });

    arrows[0].style.left = "10px";
    arrows[0].onclick = () => {
      this.renderCarousel(this.getNextImage("left"));
    };
    arrows[1].style.right = "10px";
    arrows[1].onclick = () => {
      this.renderCarousel(this.getNextImage("right"));
    };

    this.parentElement.prepend(arrows[0]);
    this.parentElement.prepend(arrows[1]);
    return arrows;
  }

  /*-------------------------------------------------------------------------*/
  /** Rendering Functions ***/
  renderCarousel(i) {
    clearTimeout(this.state.currTimeout);

    this.setInvisible(this.state.imageNum);
    this.state.imageNum = i;
    this.setVisible(this.state.imageNum);

    const next = this.getNextImage();
    this.state.currTimeout = setTimeout(() => {
      // console.log("switch", this.imageNum);
      this.renderCarousel(next);
    }, this.config.transitionTimeout);
  }
  getNextImage(direction) {
    let next = this.state.imageNum;
    if (direction === "left") {
      next =
        this.state.imageNum === 0
          ? this.imageElements.length - 1
          : this.state.imageNum - 1;
    } else if (direction === "right" || !this.config.random) {
      next =
        this.state.imageNum === this.imageElements.length - 1
          ? 0
          : this.state.imageNum + 1;
    } else {
      while (next === this.state.imageNum) {
        next = Math.floor(Math.random() * this.imageElements.length);
      }
    }
    return next;
  }
  setVisible(i) {
    this.renderIndicators();
    const indicatorElement = this.indicatorElements.children[i];
    indicatorElement.style.background = this.altGray;
    indicatorElement.style.opacity = this.altGrayOpacity;
    this.renderArrows();

    const imageElement = this.imageElements[i];
    imageElement.style.visibility = "visible";
    imageElement.style.filter = `brightness(${this.config.brightness * 100}%)`;
    imageElement.style.opacity = this.config.opacity;
    imageElement.style.transition = `opacity ${this.config.transitionDuration}ms`;
  }
  setInvisible(i) {
    this.renderIndicators();
    const indicatorElement = this.indicatorElements.children[i];
    indicatorElement.style.background = this.gray;
    indicatorElement.style.opacity = this.grayOpacity;
    this.renderArrows();

    const imageElement = this.imageElements[i];
    imageElement.style.visibility = "hidden";
    imageElement.style.opacity = 0;
    imageElement.style.transition = `visibility 0s ${this.config.transitionDuration}ms, opacity ${this.config.transitionDuration}ms`;
  }
  renderIndicators() {
    if (this.config.indicators) {
      this.indicatorElements.style.visibility = "visible";
    } else {
      this.indicatorElements.style.visibility = "hidden";
    }
  }
  renderArrows() {
    if (this.config.arrows) {
      this.leftArrow.style.visibility = "visible";
      this.rightArrow.style.visibility = "visible";
    } else {
      this.leftArrow.style.visibility = "hidden";
      this.rightArrow.style.visibility = "hidden";
    }
  }

  /*-------------------------------------------------------------------------*/
  /** Configuration Functions ***/
  setTransitionTimeout(transitionTimeout) {
    // Time in between images
    this.config.transitionTimeout = transitionTimeout;
  }
  setTransitionDuration(transitionDuration) {
    // Duration of image transition
    this.config.transitionDuration = transitionDuration;
  }
  setRandom(toggle) {
    this.config.random = toggle;
  }
  setBrightness(brightness) {
    this.config.brightness = brightness;
  }
  setOpacity(opacity) {
    this.config.opacity = opacity;
  }
  setIndicators(toggle) {
    this.config.indicators = toggle;
  }
  setArrows(toggle) {
    this.config.arrows = toggle;
  }
}
