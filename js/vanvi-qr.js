/**
 * Standalone Client-side QRCode Generator for VanviMoments
 * Zero external dependencies. Renders directly onto Canvas or SVG.
 */
(function(root) {
  // Minimal self-contained QR Code generator
  function QR8bitByte(data) {
    this.mode = 4;
    this.data = data;
  }
  QR8bitByte.prototype = {
    getLength: function() { return this.data.length; },
    write: function(buffer) {
      for (var i = 0; i < this.data.length; i++) {
        buffer.put(this.data.charCodeAt(i), 8);
      }
    }
  };

  var QRPolynomial = {
    glog: function(n) {
      if (n < 1) throw new Error("glog(" + n + ")");
      return QRMath.LOG_TABLE[n];
    },
    gexp: function(n) {
      while (n < 0) n += 255;
      while (n >= 256) n -= 255;
      return QRMath.EXP_TABLE[n];
    }
  };

  var QRMath = {
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256)
  };
  for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
  for (var i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

  function Poly(num, shift) {
    var offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    for (var i = num.length - offset; i < this.num.length; i++) this.num[i] = 0;
  }
  Poly.prototype = {
    get: function(index) { return this.num[index]; },
    getLength: function() { return this.num.length; },
    multiply: function(e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      for (var i = 0; i < num.length; i++) num[i] = 0;
      for (var i = 0; i < this.getLength(); i++) {
        for (var j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRPolynomial.gexp(QRPolynomial.glog(this.get(i)) + QRPolynomial.glog(e.get(j)));
        }
      }
      return new Poly(num, 0);
    },
    mod: function(e) {
      if (this.getLength() - e.getLength() < 0) return this;
      var ratio = QRPolynomial.glog(this.get(0)) - QRPolynomial.glog(e.get(0));
      var num = new Array(this.getLength());
      for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (var i = 0; i < e.getLength(); i++) {
        num[i] ^= QRPolynomial.gexp(QRPolynomial.glog(e.get(i)) + ratio);
      }
      return new Poly(num, 0).mod(e);
    }
  };

  var QRRSBlock = {
    RS_BLOCK_TABLE: [
      [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
      [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
      [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
      [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
      [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
      [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
      [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
      [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
      [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16]
    ],
    getRSBlocks: function(typeNumber, errorCorrectLevel) {
      var rsBlock = this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectLevel];
      if (!rsBlock) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
      var list = [];
      for (var i = 0; i < rsBlock.length; i += 3) {
        var count = rsBlock[i];
        var totalCount = rsBlock[i + 1];
        var dataCount = rsBlock[i + 2];
        for (var j = 0; j < count; j++) list.push({ totalCount: totalCount, dataCount: dataCount });
      }
      return list;
    }
  };

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }
  QRBitBuffer.prototype = {
    get: function(index) { return ((this.buffer[Math.floor(index / 8)] >>> (7 - index % 8)) & 1) == 1; },
    put: function(num, length) {
      for (var i = 0; i < length; i++) this.putBit(((num >>> (length - i - 1)) & 1) == 1);
    },
    putBit: function(bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) this.buffer.push(0);
      if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
      this.length++;
    }
  };

  function QRCodeModel(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }
  QRCodeModel.prototype = {
    addData: function(data) { this.dataList.push(new QR8bitByte(data)); },
    isDark: function(row, col) { return this.modules[row][col]; },
    getModuleCount: function() { return this.moduleCount; },
    make: function() {
      if (this.typeNumber < 1) {
        for (var t = 1; t < 10; t++) {
          var rs = QRRSBlock.getRSBlocks(t, this.errorCorrectLevel);
          var buf = new QRBitBuffer();
          for (var i = 0; i < this.dataList.length; i++) {
            var d = this.dataList[i];
            buf.put(4, 4);
            buf.put(d.getLength(), 8);
            d.write(buf);
          }
          var totalDataCount = 0;
          for (var i = 0; i < rs.length; i++) totalDataCount += rs[i].dataCount;
          if (buf.length <= totalDataCount * 8) {
            this.typeNumber = t;
            break;
          }
        }
        if (this.typeNumber < 1) this.typeNumber = 4;
      }
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (var r = 0; r < this.moduleCount; r++) {
        this.modules[r] = new Array(this.moduleCount);
        for (var c = 0; c < this.moduleCount; c++) this.modules[r][c] = null;
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupTimingPattern();
      this.mapData(this.createData(), 0);
    },
    setupPositionProbePattern: function(row, col) {
      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if ((0 <= r && r <= 6 && (c == 0 || c == 6)) ||
              (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    setupTimingPattern: function() {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) continue;
        this.modules[r][6] = (r % 2 == 0);
      }
      for (var c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] != null) continue;
        this.modules[6][c] = (c % 2 == 0);
      }
    },
    createData: function() {
      var rsBlocks = QRRSBlock.getRSBlocks(this.typeNumber, this.errorCorrectLevel);
      var buffer = new QRBitBuffer();
      for (var i = 0; i < this.dataList.length; i++) {
        var data = this.dataList[i];
        buffer.put(4, 4);
        buffer.put(data.getLength(), 8);
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
      if (buffer.length + 4 <= totalDataCount * 8) buffer.put(0, 4);
      while (buffer.length % 8 != 0) buffer.putBit(false);
      while (true) {
        if (buffer.length >= totalDataCount * 8) break;
        buffer.put(0xec, 8);
        if (buffer.length >= totalDataCount * 8) break;
        buffer.put(0x11, 8);
      }
      return this.createBytes(buffer, rsBlocks);
    },
    createBytes: function(buffer, rsBlocks) {
      var offset = 0, maxDcCount = 0, maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
        offset += dcCount;
        var rsPoly = this.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new Poly(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i++) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var i = 0; i < maxDcCount; i++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i < dcdata[r].length) data[index++] = dcdata[r][i];
        }
      }
      for (var i = 0; i < maxEcCount; i++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i < ecdata[r].length) data[index++] = ecdata[r][i];
        }
      }
      return data;
    },
    getErrorCorrectPolynomial: function(errorCorrectLength) {
      var a = new Poly([1], 0);
      for (var i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new Poly([1, QRPolynomial.gexp(i)], 0));
      }
      return a;
    },
    mapData: function(data, maskPattern) {
      var inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0;
      for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col--;
        while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex == -1) { byteIndex++; bitIndex = 7; }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) { row -= inc; inc = -inc; break; }
        }
      }
    }
  };

  /**
   * Main QRCode drawing utility
   * @param {HTMLElement|string} target Canvas element or Container
   * @param {string} text URL or text to encode
   * @param {object} options { size: 180, dark: '#402e35', light: '#ffffff' }
   */
  function renderQRCode(target, text, options) {
    options = options || {};
    var size = options.size || 180;
    var dark = options.dark || '#402e35';
    var light = options.light || '#ffffff';

    var container = typeof target === 'string' ? document.getElementById(target) : target;
    if (!container) return;

    var qr = new QRCodeModel(0, 1); // Auto type, error level M
    qr.addData(text);
    qr.make();

    var count = qr.getModuleCount();
    var canvas;
    if (container.tagName.toLowerCase() === 'canvas') {
      canvas = container;
    } else {
      container.innerHTML = '';
      canvas = document.createElement('canvas');
      container.appendChild(canvas);
    }

    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, size, size);

    var tileW = size / count;
    var tileH = size / count;
    ctx.fillStyle = dark;

    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          var w = (Math.ceil((c + 1) * tileW) - Math.floor(c * tileW));
          var h = (Math.ceil((r + 1) * tileH) - Math.floor(r * tileH));
          ctx.fillRect(Math.round(c * tileW), Math.round(r * tileH), w, h);
        }
      }
    }
  }

  /**
   * Export QR Code directly as a PNG Data URL
   */
  function qrToDataURL(text, options) {
    options = options || {};
    var size = options.size || 240;
    var canvas = document.createElement('canvas');
    renderQRCode(canvas, text, options);
    return canvas.toDataURL('image/png');
  }

  /**
   * Render a high-resolution Luxury Branded VanviMoments QR Card
   * @param {HTMLCanvasElement|string} target Canvas element or canvas ID
   * @param {object} meta { url, recipient, sender, occasion, templateName }
   */
  function renderBrandedCard(target, meta) {
    meta = meta || {};
    var canvas = typeof target === 'string' ? document.getElementById(target) : target;
    if (!canvas) return;

    var width = 640;
    var height = 820;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '320px';
    canvas.style.height = '410px';

    var ctx = canvas.getContext('2d');

    // 1. Background gradient
    var bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#fff8fa');
    bgGrad.addColorStop(0.5, '#ffffff');
    bgGrad.addColorStop(1, '#fff5f8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Luxury Border
    ctx.strokeStyle = 'rgba(255, 120, 175, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // 3. Inner Gold Accent Frame
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // 4. Header Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff2a7a';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('VANVI MOMENTS', width / 2, 72);

    ctx.fillStyle = '#78536d';
    ctx.font = 'italic 16px "Cormorant Garamond", serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('A Dedicated Digital Celebration Keepsake', width / 2, 98);

    // 5. Recipient Ribbon
    var recName = meta.recipient || 'Someone Special';
    var occName = meta.occasion || 'Celebration';
    ctx.fillStyle = 'rgba(255, 42, 122, 0.08)';
    ctx.beginPath();
    ctx.roundRect((width - 440) / 2, 124, 440, 48, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 42, 122, 0.3)';
    ctx.stroke();

    ctx.fillStyle = '#2c1224';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Prepared for ' + recName + ' ♡', width / 2, 155);

    // 6. Draw QR Code in Center
    var qrSize = 300;
    var qrX = (width - qrSize) / 2;
    var qrY = 196;

    // White backing with shadow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 120, 175, 0.35)';
    ctx.stroke();

    // Render QR modules onto offscreen canvas
    var offCanvas = document.createElement('canvas');
    renderQRCode(offCanvas, meta.url || 'https://vanvimoments.shop', {
      size: qrSize,
      dark: '#2c1224',
      light: '#ffffff'
    });
    ctx.drawImage(offCanvas, qrX, qrY, qrSize, qrSize);

    // 7. Instructions & Call to Action
    ctx.fillStyle = '#ff2a7a';
    ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('📷 Scan with phone camera to open', width / 2, 574);

    // 8. Short URL Pill
    var displayUrl = meta.url || 'https://vanvimoments.shop';
    if (displayUrl.length > 46) {
      displayUrl = displayUrl.replace(/^https?:\/\//, '').substring(0, 44) + '...';
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.beginPath();
    ctx.roundRect((width - 480) / 2, 604, 480, 40, 20);
    ctx.fill();

    ctx.fillStyle = '#5c3552';
    ctx.font = '14px monospace';
    ctx.fillText(displayUrl, width / 2, 629);

    // 9. Template & Sender Credits
    if (meta.templateName) {
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Experience: ' + meta.templateName, width / 2, 678);
    }

    if (meta.sender) {
      ctx.fillStyle = '#78536d';
      ctx.font = 'italic 15px "Cormorant Garamond", serif';
      ctx.fillText('Created with all my love — ' + meta.sender, width / 2, 706);
    }

    // 10. Footer Security / Permanent Badge
    ctx.fillStyle = '#a68b9e';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✦ Private Experience · Zero App Download Needed · vanvimoments.shop ✦', width / 2, 770);
  }

  /**
   * Trigger download of branded QR card as high-res PNG
   */
  function downloadBrandedCard(meta, filename) {
    var canvas = document.createElement('canvas');
    renderBrandedCard(canvas, meta);
    var dataUrl = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || ('VanviMoments-QR-' + (meta.recipient || 'Moment') + '.png');
    document.body.appendChild(a);
    a.click();
    setTimeout(function() { a.remove(); }, 150);
  }

  root.VanviQR = {
    render: renderQRCode,
    toDataURL: qrToDataURL,
    renderBrandedCard: renderBrandedCard,
    downloadCard: downloadBrandedCard
  };
})(typeof window !== 'undefined' ? window : this);

