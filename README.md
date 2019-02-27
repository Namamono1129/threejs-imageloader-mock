## threejs-imageloader-mock

Enables to mock/intercept image downloading with `THREE.ImageLoader` on node/mocha.

It enables to:

- mock image downloading by `THREE.ImageLoader` and its related components as `THREE.TextureLoader` etc, injecting mock class instead of image object.
- invoke error artificially on image loading.

## Motivation
Since `THREE.ImageLoader` makes use of [lazy loading](https://stackoverflow.com/questions/15999760/load-image-asynchronous) feature of `<img>` tag, in other words since it does not depend on `XMLHttpRequest`, its loading cannot be intercepted by usual tools like [nock](https://github.com/nock/nock). This module enables to intercept image downloading by overriding `document.createElementNS()`.

## Installation
Requires [node](http://nodejs.org/).
```
npm i -D threejs-imageloader-mock
```

## Usage
First require the module, then call `success()` or `fail()` method (usually in `before` clause).

```javascript
const THREE = require('three');
const imgMock = require('threejs-imageloader-mock');
const assert = require('assert');

describe('App test', () => {

  it('Can mock image loading', (done) => {
    imgMock.success();
    const onLoad = (texture) => {
      console.log(texture); // Prints Mock object
      assert.equal(texture.src, 'http://0.0.0.0/foo/bar');
      assert.equal(texture.constructor.name, 'ImageElementMock');
      done();
    };
    // Without mock, this line results timeout.
    new THREE.ImageLoader().load('http://0.0.0.0/foo/bar', onLoad);
  });

  it('Can intercept with error', (done) => {
    imgMock.fail();
    const onLoad = () => {
      assert.fail();
    };
    const onError = ( error ) => {
      console.log(error); // THREE.ImageLoader will call onError callback.
      done();
    };
    // You must specify onError callback.
    new THREE.ImageLoader().load('http://0.0.0.0/foo/bar', onLoad, null, onError);
  });

});

```

## Behaviours
After "successful" loading, `ImageElementMock` object in `THREE.Texture.map` property, replacing `<img>` element.

```
ImageElementMock {
  trigger: 'load', // please ignore this property
  crossOrigin: 'anonymous',
  src: 'http://0.0.0.0/foo/bar'
}
```

`src` and `crossOrigin` property will be added by `THREE.ImageLoader.load()` method, which can be made use of test.

## License
MIT
