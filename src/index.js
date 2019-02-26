const activate = function () {

  const originalFunc = document.createElementNS;

  document.createElementNS = function ( url, tag ) {

    if ( tag != 'img') {
      return originalFunc.bind( document, url, tag );
    }

    return new ImageElementMock();

  }

}


class ImageElementMock {

  addEventListener( type, listener ) {

    if ( type != 'load' ) {
      return;
    }

    setTimeout(() => { listener(this) }, 0)

  }

  // NOP because this class does not have ordinary event system
  removeEventListener( type, listener ) { }

}

module.exports = activate;
