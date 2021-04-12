"use strict";

class DriftCarousel {
  constructor(selector, images, config, captions) {
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
      captions: false,
      indicators: true,
      arrows: true,
    };

    if (config) {
      // Update with user configuration
      // TODO: validate captions array length
      this.config = { ...this.config, ...config };
    }

    /** DOM related objects */
    // List of images for carousel
    this.images = images;

    // List of carousel image DOM elements
    this.imageElements = this.createImages();

    // Optional list of image captions
    this.captions = captions;

    // List of caption DOM elements
    this.captionElements = this.createCaptions();

    // Div containing indicators used in carousel
    this.indicatorElements = this.createIndicators();

    // Left and right arrows for switching carousel images
    const arrows = this.createArrows();
    this.leftArrow = arrows[0];
    this.rightArrow = arrows[1];
  }

  /** DOM Functions **********************************************************/
  createImages() {
    // Create array of image DOM elements
    const imageElements = this.images.map((image) => {
      const imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.style.position = "absolute";
      imageElement.style.opacity = 0;
      imageElement.style.visibility = "hidden";
      imageElement.style.zIndex = -1000;

      // Set width and height of each image to fill the entire parent element
      // or leave space for captions if captions are configured
      imageElement.style.width = "100%";
      imageElement.style.height = this.config.captions
        ? "calc(100% - 14px)"
        : "100%";
      imageElement.style.objectFit = "cover";

      this.parentElement.prepend(imageElement);
      return imageElement;
    });
    return imageElements;
  }
  createCaptions() {
    if (this.config.captions) {
      // Create array of caption DOM elements
      const captionElements = this.captions.map((caption) => {
        const captionElement = document.createElement("p");
        captionElement.style.margin = "2px";
        captionElement.style.position = "absolute";
        captionElement.style.bottom = "0";
        captionElement.style.opacity = 0;
        captionElement.style.visibility = "hidden";
        captionElement.style.fontSize = "10px";
        captionElement.innerHTML = caption;

        this.parentElement.prepend(captionElement);
        return captionElement;
      });
      return captionElements;
    } else {
      return null;
    }
  }
  createIndicators() {
    const indicatorElements = document.createElement("div");
    indicatorElements.style.position = "absolute";
    indicatorElements.style.bottom = this.config.captions ? "24px" : "10px";
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

  /** Rendering Functions ****************************************************/
  renderCarousel(i) {
    clearTimeout(this.state.currTimeout);

    // Set current image to hidden and next image to visible
    this.setVisibility(this.state.imageNum, "hidden");
    this.state.imageNum = i;
    this.setVisibility(this.state.imageNum, "visible");

    const next = this.getNextImage();
    this.state.currTimeout = setTimeout(() => {
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
  setVisibility(i, visibility) {
    this.renderImages(i, visibility);
    this.renderCaptions(i, visibility);
    this.renderArrows();
    this.renderIndicators(i, visibility);
  }
  renderImages(i, visibility) {
    const imageElement = this.imageElements[i];
    if (visibility === "visible") {
      imageElement.style.visibility = "visible";
      imageElement.style.filter = `brightness(${
        this.config.brightness * 100
      }%)`;
      imageElement.style.opacity = this.config.opacity;
      imageElement.style.transition = `opacity ${this.config.transitionDuration}ms`;
    } else if (visibility === "hidden") {
      imageElement.style.visibility = "hidden";
      imageElement.style.opacity = 0;
      imageElement.style.transition = `visibility 0s ${this.config.transitionDuration}ms, opacity ${this.config.transitionDuration}ms`;
    }
  }
  renderCaptions(i, visibility) {
    if (this.config.captions) {
      const captionElement = this.captionElements[i];
      if (visibility === "visible") {
        captionElement.style.visibility = "visible";
        captionElement.style.opacity = 1;
        captionElement.style.transition = `opacity ${this.config.transitionDuration}ms`;
      } else if (visibility === "hidden") {
        captionElement.style.visibility = "hidden";
        captionElement.style.opacity = 0;
        captionElement.style.transition = `visibility 0s ${this.config.transitionDuration}ms, opacity ${this.config.transitionDuration}ms`;
      }
    }
  }
  renderIndicators(i, visibility) {
    if (this.config.indicators) {
      this.indicatorElements.style.visibility = "visible";
      const indicatorElement = this.indicatorElements.children[i];
      if (visibility === "visible") {
        // This is the currently shown image so set indicator with the alternate color scheme
        indicatorElement.style.background = this.altGray;
        indicatorElement.style.opacity = this.altGrayOpacity;
      } else {
        // This is not the currently shown image so set indicator with regular color scheme
        indicatorElement.style.background = this.gray;
        indicatorElement.style.opacity = this.grayOpacity;
      }
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

  /** Configuration Functions ************************************************/
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
