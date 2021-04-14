"use strict";

class DriftCarousel {
  /**
   * Drift constructor.
   *
   * @param {string} selector - A selector of the root element to mount Drift.
   * @param {Array} images - The list of image paths for the carousel to render.
   * @param {Object} [config] - Optional configuration object to override default configuration.
   */
  constructor(selector, images, config) {
    this.parentElement = document.querySelector(selector);

    /** Set parent element styles */
    const origPosition = this.parentElement.style.position;
    if (!origPosition || origPosition === "static") {
      // Parent element must be relaitve for image to be properly sized
      console.log(`Set ${selector} position to relative`);
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
      captions: null,
      indicators: true,
      arrows: true,
    };

    if (config) {
      // Update with user configuration
      this.config = { ...this.config, ...config };

      // If captions are specified, they must be the same length as the images array
      if (
        this.config.captions &&
        this.config.captions.length !== images.length
      ) {
        console.log("Captions length different from images length!");
        this.config.captions = null;
      }
    }

    /** DOM related objects */
    // List of images for carousel
    this.images = images;

    // List of carousel image DOM elements
    this.imageElements = this.createImages();

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

  /**
   * Creates and returns an array of image elements and prepends them to
   * Drift's parent element.
   *
   * @returns Array of image elements.
   */
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

  /**
   * Creates and returns an array of caption elements and prepends them to
   * Drift's parent element or null if captions are not configured.
   *
   * @returns Array of caption elements or null.
   */
  createCaptions() {
    if (this.config.captions) {
      // Create array of caption DOM elements
      const captionElements = this.config.captions.map((caption) => {
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

  /**
   * Creates and returns an array of indicator elements and prepends them to
   * Drift's parent element.
   *
   * @returns Array of indicator elements.
   */
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

  /**
   * Creates and returns left and right arrow elements and prepends them to
   * Drift's parent element.
   *
   * @returns Array of left and right arrow elements.
   */
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

  /**
   * Renders the image at the given index and starts a timer to render the next
   * image.
   *
   * @param {int} i - The index of the image to render.
   */
  renderCarousel(i) {
    clearTimeout(this.state.currTimeout);

    // Set current image to hidden and next image to visible
    this.renderAll(this.state.imageNum, "hidden");
    this.state.imageNum = i;
    this.renderAll(this.state.imageNum, "visible");

    const next = this.getNextImage();
    this.state.currTimeout = setTimeout(() => {
      this.renderCarousel(next);
    }, this.config.transitionTimeout);
  }

  /**
   * Gets the index of the next image to be rendered by either going left,
   * right, or random if configured.
   *
   * @param {string} [direction] - The direction to update the carousel.
   *
   * @returns The index of the next image to be rendered.
   */
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

  /**
   * Renders the image, caption, indicators, and arrows at the given index
   * based on the given visibility.
   *
   * @param {int} i - The index of the elements to render.
   * @param {string} visibility - The visibility to set the elements.
   */
  renderAll(i, visibility) {
    this.renderImages(i, visibility);
    this.renderCaptions(i, visibility);
    this.renderIndicators(i, visibility);
    this.renderArrows();
  }

  /**
   * Renders the image at the given index based on the given visibility.
   *
   * @param {int} i - The index of the image to render.
   * @param {string} visibility - The visibility to render the image.
   */
  renderImages(i, visibility) {
    const imageElement = this.imageElements[i];
    // Check if captions were changed since last render
    imageElement.style.height = this.config.captions
      ? "calc(100% - 14px)"
      : "100%";
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

  /**
   * Renders the caption at the given index based on the given visibility and
   * caption configuration.
   *
   * @param {int} i - The index of the caption to render.
   * @param {string} visibility - The visibility to render the caption.
   */
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

  /**
   * Renders the indicator at the given index based on the given visibility and
   * indicator configuration. If visibility is visible, the indicator is set to
   * the alternate color scheme. If visibility is hidden, the indicator is set
   * to the base color scheme.
   *
   * @param {int} i - The index of the indicator to render.
   * @param {string} visibility - The visibility to render the indicator.
   */
  renderIndicators(i, visibility) {
    if (this.config.indicators) {
      // Check if captions were changed since last render
      this.indicatorElements.style.bottom = this.config.captions
        ? "24px"
        : "10px";
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

  /**
   * Render the arrows based on the arrow configuration.
   */
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

  /**
   * Sets the transition timeout configuration.
   *
   * @param {int} transitionTimeout - The transition timeout.
   */
  setTransitionTimeout(transitionTimeout) {
    // Time in between images
    this.config.transitionTimeout = transitionTimeout;
  }

  /**
   * Sets the transition duration configuration.
   *
   * @param {int} transitionDuration - The transition duration.
   */
  setTransitionDuration(transitionDuration) {
    // Duration of image transition
    this.config.transitionDuration = transitionDuration;
  }

  /**
   * Sets the random ordering configuration.
   *
   * @param {boolean} toggle - Whether or not to use a random ordering.
   */
  setRandom(toggle) {
    this.config.random = toggle;
  }

  /**
   * Sets the image brightness configuration.
   *
   * @param {int} brightness - The carousel image brightness.
   */
  setBrightness(brightness) {
    this.config.brightness = brightness;
  }

  /**
   * Sets the image opacity configuration.
   *
   * @param {int} opacity - The carousel image opacity.
   */
  setOpacity(opacity) {
    this.config.opacity = opacity;
  }

  /**
   * Sets the captions to the array if specified or removes them if null is
   * passed.
   *
   * @param {array} [captions] - An array of captions or null.
   */
  setCaptions(captions) {
    if (captions.length === this.images.length) {
      this.config.captions = captions;
    } else {
      this.config.captions = null;
    }
    this.captionElements = this.createCaptions();
  }

  /**
   * Sets the indicators configuration.
   *
   * @param {boolean} toggle - Whether or not to use indicators.
   */
  setIndicators(toggle) {
    this.config.indicators = toggle;
  }

  /**
   * Sets the arrows configuration.
   *
   * @param {boolean} toggle - Whether or not to use arrows.
   */
  setArrows(toggle) {
    this.config.arrows = toggle;
  }
}
