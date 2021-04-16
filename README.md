[![Drift](pub/res/logo/drift-black.svg)](https://driftjs.herokuapp.com)

Drift is a lightweight, dependency-free, JavaScript carousel which can be used standalone or as a background.

Learn more about Drift [here](https://driftjs.herokuapp.com).

## Documentation

The full documentation can be found [here](https://driftjs.herokuapp.com/api.html).

## Examples

Drift needs to be mounted on an HTML element. First, set up a `<div>` where Drift will be mounted.

```html
<div id="my-id">
  <h1>Hello World</h1>
  <!-- More stuff here -->
</div>
```

Next, make an array containg paths to the desired images and create and render a new Drift.

```js
const myImages = ["img1", "img2", "img3"];

const drift = new Drift("#my-id", myImages);
drift.renderCarousel(0);
```

Custom configurations can also be specified when creating a new Drift, including captions.

```js
const myImages = ["img1", "img2", "img3"];
const myCaptions = ["Caption 1", "Caption 2", "Caption 3"];

const myConfig = {
  transitionTimeout: 3000,
  random: true,
  brightness: 0.55,
  captions: myCaptions,
  indicators: false,
  arrows: false,
};
const drift = new Drift("#my-id", myImages, myConfig);
drift.renderCarousel(0);
```
