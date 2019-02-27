const originalFunc = document.createElementNS;

const activate = function ( trigger ) {

  document.createElementNS = function ( url, tag ) {

    if ( tag != 'img') {
      return originalFunc.bind( document, url, tag );
    }

    return new ImageElementMock( trigger );

  }

}


class ImageElementMock {

  constructor( trigger ) {
    this.trigger = trigger;
  }

  addEventListener( type, listener ) {

    if ( type != this.trigger ) {
      return;
    }

    // Func calls need little timeout in order to ensure load() function to return value
    if ( type == 'load' ) {
      setTimeout(() => {
        listener.call(this);
      }, 0);
    } else if ( type == 'error' ){
      setTimeout(() => {
        listener(new Error("An error occurred on loading image."));
      }, 0);
    } else {
      throw new Error("Program Error: this may be a bug on threejs-imageloader-mock.");
    }

  }

  // NOP because this class does not have ordinary event system
  removeEventListener( type, listener ) { }

}

module.exports = {
  success: function() {
    activate('load');
  },
  fail: function() {
    activate('error');
  }
}
