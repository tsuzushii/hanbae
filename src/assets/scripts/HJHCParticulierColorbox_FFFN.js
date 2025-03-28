// ColorBox v1.3.15 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2010 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function (b, ib) {
    var t = "none", M = "LoadedContent", c = false, v = "resize.", o = "y", q = "auto", e = true, L = "nofollow", m = "x";
    function f(a, c) { a = a ? ' id="' + i + a + '"' : ""; c = c ? ' style="' + c + '"' : ""; return b("<div" + a + c + "/>") }
    function p(a, b) { b = b === m ? n.width() : n.height(); return typeof a === "string" ? Math.round(/%/.test(a) ? b / 100 * parseInt(a, 10) : parseInt(a, 10)) : a }
    function U(b) { return a.photo || /\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?$/i.test(b) }
    function cb(a) { for (var c in a) if (b.isFunction(a[c]) && c.substring(0, 2) !== "on") a[c] = a[c].call(l); a.rel = a.rel || l.rel || L; a.href = a.href || b(l).attr("href"); a.title = a.title || l.title; return a }
    function w(c, a) { a && a.call(l); b.event.trigger(c) }
    function jb() {
        var b, e = i + "Slideshow_", c = "click." + i, f, k; if (a.slideshow && h[1]) {
            f = function () {
                F.text(a.slideshowStop).unbind(c).bind(V,
 function () { if (g < h.length - 1 || a.loop) b = setTimeout(d.next, a.slideshowSpeed) }).bind(W,
 function () { clearTimeout(b) }).one(c + " " + N, k); j.removeClass(e + "off").addClass(e + "on"); b = setTimeout(d.next, a.slideshowSpeed)
            };
            k = function () { clearTimeout(b); F.text(a.slideshowStart).unbind([V, W, N, c].join(" ")).one(c, f); j.removeClass(e + "on").addClass(e + "off") }; a.slideshowAuto ? f() : k()
        }
    } function db(c) {
        if (!O) {
            l = c; a = cb(b.extend({}, b.data(l, r))); h = b(l); g = 0; if (a.rel !== L) {
                h = b("." + G).filter(
    function () { return (b.data(this, r).rel || this.rel) === a.rel }); g = h.index(l); if (g === -1) { h = h.add(l); g = h.length - 1 } 
            } if (!u) {
                u = D = e; j.show(); if (a.returnFocus) try {
                    l.blur(); b(l).one(eb,
    function () { try { this.focus() } catch (a) { } })
                } catch (f) { } x.css({ opacity: +a.opacity, cursor: a.overlayClose ? "pointer" : q }).show(); a.w = p(a.initialWidth, m); a.h = p(a.initialHeight, o); d.position(0); X && n.bind(v + P + " scroll." + P,
    function () { x.css({ width: n.width(), height: n.height(), top: n.scrollTop(), left: n.scrollLeft() }) }).trigger("scroll." + P); w(fb, a.onOpen); Y.add(H).add(I).add(F).add(Z).hide(); ab.html(a.close).show()
            } d.load(e)
        } 
    } var gb = { transition: "elastic", speed: 300, width: c, initialWidth: "600", innerWidth: c, maxWidth: c, height: c, initialHeight: "450", innerHeight: c, maxHeight: c, scalePhotos: e, scrolling: e, inline: c, html: c, iframe: c, photo: c, href: c, title: c, rel: c, opacity: .9, preloading: e, current: "image {current} of {total}", previous: "previous", next: "next", close: "close", open: c, returnFocus: e, loop: e, slideshow: c, slideshowAuto: e, slideshowSpeed: 2500, slideshowStart: "start slideshow", slideshowStop: "stop slideshow", onOpen: c, onLoad: c, onComplete: c, onCleanup: c, onClosed: c, overlayClose: e, escKey: e, arrowKey: e }, r = "colorbox", i = "cbox", fb = i + "_open", W = i + "_load", V = i + "_complete", N = i + "_cleanup", eb = i + "_closed", Q = i + "_purge", hb = i + "_loaded", E = b.browser.msie && !b.support.opacity, X = E && b.browser.version < 7, P = i + "_IE6", x, j, A, s, bb, T, R, S, h, n, k, J, K, Z, Y, F, I, H, ab, B, C, y, z, l, g, a, u, D, O = c, d, G = i + "Element"; d = b.fn[r] = b[r] =
    function (c, f) {
        var a = this, d; if (!a[0] && a.selector) return a; c = c || {}; if (f) c.onComplete = f; if (!a[0] || a.selector === undefined) { a = b("<a/>"); c.open = e } a.each(
    function () { b.data(this, r, b.extend({}, b.data(this, r) || gb, c)); b(this).addClass(G) }); d = c.open; if (b.isFunction(d)) d = d.call(a); d && db(a[0]); return a
    }; d.init = function () {
        var l = "hover", m = "clear:left"; n = b(ib); j = f().attr({ id: r, "class": E ? i + "IE" : "" }); x = f("Overlay", X ? "position:absolute" : "").hide(); A = f("Wrapper"); s = f("Content").append(k = f(M, "width:0; height:0; overflow:hidden"), K = f("LoadingOverlay").add(f("LoadingGraphic")), Z = f("Title"), Y = f("Current"), I = f("Next"), H = f("Previous"), F = f("Slideshow").bind(fb, jb), ab = f("Close")); A.append(f().append(f("TopLeft"), bb = f("TopCenter"), f("TopRight")), f(c, m).append(T = f("MiddleLeft"), s, R = f("MiddleRight")), f(c, m).append(f("BottomLeft"), S = f("BottomCenter"), f("BottomRight"))).children().children().css({ "float": "left" }); J = f(c, "position:absolute; width:9999px; visibility:hidden; display:none"); b("body").prepend(x, j.append(A, J)); s.children().hover(
    function () { b(this).addClass(l) },
    function () { b(this).removeClass(l) }).addClass(l); B = bb.height() + S.height() + s.outerHeight(e) - s.height(); C = T.width() + R.width() + s.outerWidth(e) - s.width(); y = k.outerHeight(e); z = k.outerWidth(e); j.css({ "padding-bottom": B, "padding-right": C }).hide(); I.click(d.next); H.click(d.prev); ab.click(d.close); s.children().removeClass(l); b("." + G).live("click", function (a) { if (!(a.button !== 0 && typeof a.button !== "undefined" || a.ctrlKey || a.shiftKey || a.altKey)) { a.preventDefault(); db(this) } }); x.click(function () { a.overlayClose && d.close() }); b(document).bind("keydown",
    function (b) { if (u && a.escKey && b.keyCode === 27) { b.preventDefault(); d.close() } if (u && a.arrowKey && !D && h[1]) if (b.keyCode === 37 && (g || a.loop)) { b.preventDefault(); H.click() } else if (b.keyCode === 39 && (g < h.length - 1 || a.loop)) { b.preventDefault(); I.click() } })
    }; d.remove =
    function () { j.add(x).remove(); b("." + G).die("click").removeData(r).removeClass(G) }; d.position = function (f, d) {
        function b(a) { bb[0].style.width = S[0].style.width = s[0].style.width = a.style.width; K[0].style.height = K[1].style.height = s[0].style.height = T[0].style.height = R[0].style.height = a.style.height } var e, h = Math.max(document.documentElement.clientHeight - a.h - y - B, 0) / 2 + n.scrollTop(), g = Math.max(n.width() - a.w - z - C, 0) / 2 + n.scrollLeft(); e = j.width() === a.w + z && j.height() === a.h + y ? 0 : f; A[0].style.width = A[0].style.height = "9999px"; j.dequeue().animate({ width: a.w + z, height: a.h + y, top: h, left: g }, { duration: e, complete:
    function () { b(this); D = c; A[0].style.width = a.w + z + C + "px"; A[0].style.height = a.h + y + B + "px"; d && d() }, step:
    function () { b(this) } 
        })
    }; d.resize = function (b) {
        if (u) { b = b || {}; if (b.width) a.w = p(b.width, m) - z - C; if (b.innerWidth) a.w = p(b.innerWidth, m); k.css({ width: a.w }); if (b.height) a.h = p(b.height, o) - y - B; if (b.innerHeight) a.h = p(b.innerHeight, o); if (!b.innerHeight && !b.height) { b = k.wrapInner("<div style='overflow:auto'></div>").children(); a.h = b.height(); b.replaceWith(b.children()) } k.css({ height: a.h }); d.position(a.transition === t ? 0 : a.speed) } 
    }; d.prep = function (m) {
        var c = "hidden"; function l(s) {
            var p, f, m, c, l = h.length, q = a.loop; d.position(s,
      function () {
          function s() { E && j[0].style.removeAttribute("filter") } if (u) {
              E && o && k.fadeIn(100); k.show(); w(hb); Z.show().html(a.title); if (l > 1) { typeof a.current === "string" && Y.html(a.current.replace(/\{current\}/, g + 1).replace(/\{total\}/, l)).show(); I[q || g < l - 1 ? "show" : "hide"]().html(a.next); H[q || g ? "show" : "hide"]().html(a.previous); p = g ? h[g - 1] : h[l - 1]; m = g < l - 1 ? h[g + 1] : h[0]; a.slideshow && F.show(); if (a.preloading) { c = b.data(m, r).href || m.href; f = b.data(p, r).href || p.href; c = b.isFunction(c) ? c.call(m) : c; f = b.isFunction(f) ? f.call(p) : f; if (U(c)) b("<img/>")[0].src = c; if (U(f)) b("<img/>")[0].src = f } } K.hide(); a.transition === "fade" ? j.fadeTo(e, 1,
      function () { s() }) : s(); n.bind(v + i,
      function () { d.position(0) }); w(V, a.onComplete)
          } 
      })
  } if (u) {
      var o, e = a.transition === t ? 0 : a.speed; n.unbind(v + i); k.remove(); k = f(M).html(m); k.hide().appendTo(J.show()).css({ width: 
      function () { a.w = a.w || k.width(); a.w = a.mw && a.mw < a.w ? a.mw : a.w; return a.w } (), overflow: a.scrolling ? q : c }).css({ height:
      function () { a.h = a.h || k.height(); a.h = a.mh && a.mh < a.h ? a.mh : a.h; return a.h } ()
      }).prependTo(s); J.hide(); b("#" + i + "Photo").css({ cssFloat: t, marginLeft: q, marginRight: q }); X && b("select").not(j.find("select")).filter(
      function () { return this.style.visibility !== c }).css({ visibility: c }).one(N, function () { this.style.visibility = "inherit" }); a.transition === "fade" ? j.fadeTo(e, 0,
      function () { l(0) }) : l(e)
  } 
}; d.load = function (u) {
    var n, c, s, q = d.prep; D = e; l = h[g]; u || (a = cb(b.extend({}, b.data(l, r)))); w(Q); w(W, a.onLoad); a.h = a.height ? p(a.height, o) - y - B : a.innerHeight && p(a.innerHeight, o); a.w = a.width ? p(a.width, m) - z - C : a.innerWidth && p(a.innerWidth, m); a.mw = a.w; a.mh = a.h; if (a.maxWidth) { a.mw = p(a.maxWidth, m) - z - C; a.mw = a.w && a.w < a.mw ? a.w : a.mw } if (a.maxHeight) { a.mh = p(a.maxHeight, o) - y - B; a.mh = a.h && a.h < a.mh ? a.h : a.mh } n = a.href; K.show(); if (a.inline) {
        f().hide().insertBefore(b(n)[0]).one(Q,
       function () { b(this).replaceWith(k.children()) }); q(b(n))
    } else if (a.iframe) {
        j.one(hb,
       function () {
           var c = b("<iframe frameborder='0' style='width:100%; height:100%; border:0; display:block'/>")[0]; c.name = i + +new Date; c.src = a.href; if (!a.scrolling) c.scrolling = "no"; if (E) c.allowtransparency = "true"; b(c).appendTo(k).one(Q,
       function () { c.src = "//about:blank" })
       }); q(" ")
   } else if (a.html) q(a.html); else if (U(n)) {
       c = new Image; c.onload = function () {
           var e; c.onload = null; c.id = i + "Photo"; b(c).css({ border: t, display: "block", cssFloat: "left" }); if (a.scalePhotos) {
               s =
       function () { c.height -= c.height * e; c.width -= c.width * e }; if (a.mw && c.width > a.mw) { e = (c.width - a.mw) / c.width; s() } if (a.mh && c.height > a.mh) { e = (c.height - a.mh) / c.height; s() } 
           } if (a.h) c.style.marginTop = Math.max(a.h - c.height, 0) / 2 + "px"; h[1] && (g < h.length - 1 || a.loop) && b(c).css({ cursor: "pointer" }).click(d.next); if (E) c.style.msInterpolationMode = "bicubic"; setTimeout(
       function () { q(c) }, 1)
       }; setTimeout(function () { c.src = n }, 1)
   } else n && J.load(n,
       function (d, c, a) { q(c === "error" ? "Request unsuccessful: " + a.statusText : b(this).children()) })
}; d.next = function () {

    if (!D) { g = g < h.length - 1 ? g + 1 : 0; d.load() } 
}; d.prev = function () {
    if (!D) { g = g ? g - 1 : h.length - 1; d.load() } 
}; d.close = function () {
    if (u && !O) {
        O = e; u = c; w(N, a.onCleanup); n.unbind("." + i + " ." + P); x.fadeTo("fast", 0); j.stop().fadeTo("fast", 0, 
          function () { w(Q); k.remove(); j.add(x).css({ opacity: 1, cursor: q }).hide(); setTimeout(function () { O = c; w(eb, a.onClosed) }, 1) }) } }; 
            d.element = function () { return b(l) }; d.settings = gb; b(d.init) })(jQuery, this);
