/**
 * Razorpay Standard Checkout hides UPI Intent in Android WebView.
 * Chrome shows it. Make this WebView look like Chrome before checkout.js runs.
 */
(function (w, d) {
  'use strict';

  function inAppWebView() {
    var ua = navigator.userAgent || '';
    var q = w.location.search || '';
    if (/DilSeCraft/i.test(ua)) return true;
    if (/(?:^|[?&])(?:app=1|from=android|from=ios)(?:&|$)/.test(q)) return true;
    try {
      if (d.documentElement && d.documentElement.classList.contains('dsc-app')) return true;
    } catch (e) {}
    if (/Android/i.test(ua) && (/Version\/4\.0/.test(ua) || /; wv\)/.test(ua))) return true;
    return false;
  }

  if (!inAppWebView()) return;

  var ua = navigator.userAgent || '';
  ua = ua.replace(/; wv\)/g, ')').replace(/; wv/g, '');
  ua = ua.replace(' Version/4.0 Chrome/', ' Chrome/');
  ua = ua.replace(' Version/4.0 Mobile Safari/', ' Mobile Safari/');

  var chromeVer = '124';
  var m = ua.match(/Chrome\/(\d+)/);
  if (m) chromeVer = m[1];

  try {
    Object.defineProperty(navigator, 'userAgent', {
      get: function () { return ua; },
      configurable: true
    });
  } catch (e) {}

  try {
    if (!w.chrome) {
      w.chrome = { runtime: {}, loadTimes: function () {}, csi: function () {} };
    }
  } catch (e2) {}

  try {
    if (navigator.userAgentData) {
      var hints = {
        brands: [
          { brand: 'Google Chrome', version: chromeVer },
          { brand: 'Chromium', version: chromeVer },
          { brand: 'Not-A.Brand', version: '24' }
        ],
        mobile: true,
        platform: /Android/i.test(ua) ? 'Android' : (navigator.userAgentData.platform || 'Android'),
        getHighEntropyValues: function () {
          return Promise.resolve({
            brands: this.brands,
            mobile: true,
            platform: this.platform,
            platformVersion: '16.0.0',
            model: '',
            uaFullVersion: chromeVer + '.0.0.0',
            fullVersionList: this.brands
          });
        },
        toJSON: function () {
          return { brands: this.brands, mobile: this.mobile, platform: this.platform };
        }
      };
      Object.defineProperty(navigator, 'userAgentData', {
        get: function () { return hints; },
        configurable: true
      });
    }
  } catch (e3) {}
})(window, document);
