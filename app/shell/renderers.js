window.PYQ_REBUILD_RENDERERS = {
  api() {
    return {
      title: "\u0041\u0050\u0049",
      html:
        "<p>\u72ec\u7acb API \u914d\u7f6e\u9762\u677f\u5c06\u5728\u8fd9\u91cc\u7ee7\u7eed\u6e90\u7801\u5316\u3002</p>" +
        '<div class="pyq-rebuild-note"><strong>\u5f53\u524d\u72b6\u6001\uff1a</strong> \u5df2\u5b8c\u6210\u58f3\u5c42\u5165\u53e3\uff0c\u4e0b\u4e00\u6b65\u4f1a\u8865\u57fa\u7840\u8868\u5355\u3001\u914d\u7f6e\u8bfb\u53d6\u548c\u4fdd\u5b58\u3002</div>'
    };
  },
  prompt() {
    return {
      title: "\u63d0\u793a\u8bcd",
      html:
        "<p>\u63d0\u793a\u8bcd\u914d\u7f6e\u6a21\u5757\u5df2\u9884\u7559\u5165\u53e3\uff0c\u540e\u7eed\u4f1a\u62c6\u51fa\u9759\u6001\u63d0\u793a\u8bcd\u3001\u52a8\u6001\u63d0\u793a\u8bcd\u548c\u968f\u673a\u63d0\u793a\u8bcd\u914d\u7f6e\u3002</p>"
    };
  },
  chat() {
    return {
      title: "\u804a\u5929",
      html:
        "<p>\u804a\u5929\u4e0a\u4e0b\u6587\u914d\u7f6e\u6a21\u5757\u5c06\u627f\u63a5\u89d2\u8272\u3001\u804a\u5929\u8bb0\u5f55\u548c\u6ce8\u5165\u884c\u4e3a\u7684\u6e90\u7801\u5316\u8fc1\u79fb\u3002</p>"
    };
  },
  worldbook() {
    return window.PYQ_REBUILD_PANELS.worldbook();
  },
  gen() {
    return window.PYQ_REBUILD_PANELS.gen();
  },
  "prompt-sequence"() {
    return window.PYQ_REBUILD_PANELS["prompt-sequence"]();
  },
  "float-ball"() {
    return window.PYQ_REBUILD_PANELS["float-ball"]();
  },
  favorites() {
    return window.PYQ_REBUILD_PANELS.favorites();
  },
  log() {
    return {
      title: "\u65e5\u5fd7",
      html:
        "<p>\u65e5\u5fd7\u6a21\u5757\u540e\u7eed\u4f1a\u63a5\u5165\u751f\u6210\u65e5\u5fd7\u3001\u8c03\u8bd5\u65e5\u5fd7\u548c\u590d\u5236\u80fd\u529b\u3002</p>"
    };
  },
  style() {
    return window.PYQ_REBUILD_PANELS.style();
  },
  data() {
    return window.PYQ_REBUILD_PANELS.data();
  }
};
