let nowTime = (function () {
  let now = new Date();
  return now.getTime() - now.getTimezoneOffset() * 60000;
})();

if (
  localStorage.getItem("expire") &&
  nowTime > localStorage.getItem("expire")
) {
  localStorage.removeItem("id");
  localStorage.removeItem("country");
  localStorage.removeItem("expire");
}

const expired = 86.4e6;
let flag = !localStorage.getItem("id") || !localStorage.getItem("country");
(function () {
  var r, t, n, e, i, o, a, s;
  (t = {}),
    (s = this),
    "undefined" != typeof module && null !== module && module.exports
      ? (module.exports = t)
      : (s.ipaddr = t),
    (a = function (r, t, n, e) {
      var i, o;
      if (r.length !== t.length) return;
      for (i = 0; e > 0; ) {
        if (((o = n - e) < 0 && (o = 0), r[i] >> o != t[i] >> o)) return !1;
        (e -= n), (i += 1);
      }
      return !0;
    }),
    (t.subnetMatch = function (r, t, n) {
      var e, i, o, a, s;
      null == n && (n = "unicast");
      for (o in t)
        for (
          !(a = t[o])[0] || a[0] instanceof Array || (a = [a]),
            e = 0,
            i = a.length;
          e < i;
          e++
        )
          if (((s = a[e]), r.kind() === s[0].kind() && r.match.apply(r, s)))
            return o;
      return n;
    }),
    (t.IPv4 = (function () {
      function r(r) {
        var t, n, e;
        if (4 !== r.length) return;
        for (t = 0, n = r.length; t < n; t++)
          if (!(0 <= (e = r[t]) && e <= 255)) return;
        this.octets = r;
      }
      return (
        (r.prototype.kind = function () {
          return "ipv4";
        }),
        (r.prototype.toString = function () {
          return this.octets.join(".");
        }),
        (r.prototype.toNormalizedString = function () {
          return this.toString();
        }),
        (r.prototype.toByteArray = function () {
          return this.octets.slice(0);
        }),
        (r.prototype.match = function (r, t) {
          var n;
          if (
            (void 0 === t && ((r = (n = r)[0]), (t = n[1])),
            "ipv4" !== r.kind())
          )
            return;
          return a(this.octets, r.octets, 8, t);
        }),
        (r.prototype.SpecialRanges = {
          unspecified: [[new r([0, 0, 0, 0]), 8]],
          broadcast: [[new r([255, 255, 255, 255]), 32]],
          multicast: [[new r([224, 0, 0, 0]), 4]],
          linkLocal: [[new r([169, 254, 0, 0]), 16]],
          loopback: [[new r([127, 0, 0, 0]), 8]],
          carrierGradeNat: [[new r([100, 64, 0, 0]), 10]],
          private: [
            [new r([10, 0, 0, 0]), 8],
            [new r([172, 16, 0, 0]), 12],
            [new r([192, 168, 0, 0]), 16],
          ],
          reserved: [
            [new r([192, 0, 0, 0]), 24],
            [new r([192, 0, 2, 0]), 24],
            [new r([192, 88, 99, 0]), 24],
            [new r([198, 51, 100, 0]), 24],
            [new r([203, 0, 113, 0]), 24],
            [new r([240, 0, 0, 0]), 4],
          ],
        }),
        (r.prototype.range = function () {
          return t.subnetMatch(this, this.SpecialRanges);
        }),
        (r.prototype.toIPv4MappedAddress = function () {
          return t.IPv6.parse("::ffff:" + this.toString());
        }),
        (r.prototype.prefixLengthFromSubnetMask = function () {
          var r, t, n, e, i, o, a;
          for (
            a = {
              0: 8,
              128: 7,
              192: 6,
              224: 5,
              240: 4,
              248: 3,
              252: 2,
              254: 1,
              255: 0,
            },
              r = 0,
              i = !1,
              t = n = 3;
            n >= 0;
            t = n += -1
          ) {
            if (!((e = this.octets[t]) in a)) return null;
            if (((o = a[e]), i && 0 !== o)) return null;
            8 !== o && (i = !0), (r += o);
          }
          return 32 - r;
        }),
        r
      );
    })()),
    (n = "(0?\\d+|0x[a-f0-9]+)"),
    (e = {
      fourOctet: new RegExp(
        "^" + n + "\\." + n + "\\." + n + "\\." + n + "$",
        "i"
      ),
      longValue: new RegExp("^" + n + "$", "i"),
    }),
    (t.IPv4.parser = function (r) {
      var t, n, i, o, a;
      if (
        ((n = function (r) {
          return "0" === r[0] && "x" !== r[1] ? parseInt(r, 8) : parseInt(r);
        }),
        (t = r.match(e.fourOctet)))
      )
        return (function () {
          var r, e, o, a;
          for (a = [], r = 0, e = (o = t.slice(1, 6)).length; r < e; r++)
            (i = o[r]), a.push(n(i));
          return a;
        })();
      if ((t = r.match(e.longValue))) {
        if ((a = n(t[1])) > 4294967295 || a < 0) return;
        return (function () {
          var r, t;
          for (t = [], o = r = 0; r <= 24; o = r += 8) t.push((a >> o) & 255);
          return t;
        })().reverse();
      }
      return null;
    }),
    (t.IPv6 = (function () {
      function r(r, t) {
        var n, e, i, o, a, s;
        if (16 === r.length)
          for (this.parts = [], n = e = 0; e <= 14; n = e += 2)
            this.parts.push((r[n] << 8) | r[n + 1]);
        else {
          if (8 !== r.length) return;
          this.parts = r;
        }
        for (i = 0, o = (s = this.parts).length; i < o; i++)
          if (!(0 <= (a = s[i]) && a <= 65535)) return;
        t && (this.zoneId = t);
      }
      return (
        (r.prototype.kind = function () {
          return "ipv6";
        }),
        (r.prototype.toString = function () {
          return this.toNormalizedString().replace(/((^|:)(0(:|$))+)/, "::");
        }),
        (r.prototype.toRFC5952String = function () {
          var r, t, n, e, i;
          for (
            e = /((^|:)(0(:|$)){2,})/g,
              i = this.toNormalizedString(),
              r = 0,
              t = -1;
            (n = e.exec(i));

          )
            n[0].length > t && ((r = n.index), (t = n[0].length));
          return t < 0 ? i : i.substring(0, r) + "::" + i.substring(r + t);
        }),
        (r.prototype.toByteArray = function () {
          var r, t, n, e, i;
          for (r = [], t = 0, n = (i = this.parts).length; t < n; t++)
            (e = i[t]), r.push(e >> 8), r.push(255 & e);
          return r;
        }),
        (r.prototype.toNormalizedString = function () {
          var r, t, n;
          return (
            (r = function () {
              var r, n, e, i;
              for (i = [], r = 0, n = (e = this.parts).length; r < n; r++)
                (t = e[r]), i.push(t.toString(16));
              return i;
            }
              .call(this)
              .join(":")),
            (n = ""),
            this.zoneId && (n = "%" + this.zoneId),
            r + n
          );
        }),
        (r.prototype.toFixedLengthString = function () {
          var r, t, n;
          return (
            (r = function () {
              var r, n, e, i;
              for (i = [], r = 0, n = (e = this.parts).length; r < n; r++)
                (t = e[r]), i.push(t.toString(16).padStart(4, "0"));
              return i;
            }
              .call(this)
              .join(":")),
            (n = ""),
            this.zoneId && (n = "%" + this.zoneId),
            r + n
          );
        }),
        (r.prototype.match = function (r, t) {
          var n;
          if (
            (void 0 === t && ((r = (n = r)[0]), (t = n[1])),
            "ipv6" !== r.kind())
          )
            return;
          return a(this.parts, r.parts, 16, t);
        }),
        (r.prototype.SpecialRanges = {
          unspecified: [new r([0, 0, 0, 0, 0, 0, 0, 0]), 128],
          linkLocal: [new r([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
          multicast: [new r([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
          loopback: [new r([0, 0, 0, 0, 0, 0, 0, 1]), 128],
          uniqueLocal: [new r([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
          ipv4Mapped: [new r([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
          rfc6145: [new r([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
          rfc6052: [new r([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
          "6to4": [new r([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
          teredo: [new r([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
          reserved: [[new r([8193, 3512, 0, 0, 0, 0, 0, 0]), 32]],
        }),
        (r.prototype.range = function () {
          return t.subnetMatch(this, this.SpecialRanges);
        }),
        (r.prototype.isIPv4MappedAddress = function () {
          return "ipv4Mapped" === this.range();
        }),
        (r.prototype.toIPv4Address = function () {
          var r, n, e;
          if (!this.isIPv4MappedAddress()) return;
          return (
            (e = this.parts.slice(-2)),
            (r = e[0]),
            (n = e[1]),
            new t.IPv4([r >> 8, 255 & r, n >> 8, 255 & n])
          );
        }),
        (r.prototype.prefixLengthFromSubnetMask = function () {
          var r, t, n, e, i, o, a;
          for (
            a = {
              0: 16,
              32768: 15,
              49152: 14,
              57344: 13,
              61440: 12,
              63488: 11,
              64512: 10,
              65024: 9,
              65280: 8,
              65408: 7,
              65472: 6,
              65504: 5,
              65520: 4,
              65528: 3,
              65532: 2,
              65534: 1,
              65535: 0,
            },
              r = 0,
              i = !1,
              t = n = 7;
            n >= 0;
            t = n += -1
          ) {
            if (!((e = this.parts[t]) in a)) return null;
            if (((o = a[e]), i && 0 !== o)) return null;
            16 !== o && (i = !0), (r += o);
          }
          return 128 - r;
        }),
        r
      );
    })()),
    (i = "(?:[0-9a-f]+::?)+"),
    (o = {
      zoneIndex: new RegExp("%[0-9a-z]{1,}", "i"),
      native: new RegExp(
        "^(::)?(" + i + ")?([0-9a-f]+)?(::)?(%[0-9a-z]{1,})?$",
        "i"
      ),
      transitional: new RegExp(
        "^((?:" +
          i +
          ")|(?:::)(?:" +
          i +
          ")?)" +
          n +
          "\\." +
          n +
          "\\." +
          n +
          "\\." +
          n +
          "(%[0-9a-z]{1,})?$",
        "i"
      ),
    }),
    (r = function (r, t) {
      var n, e, i, a, s, p;
      if (r.indexOf("::") !== r.lastIndexOf("::")) return null;
      for (
        (p = (r.match(o.zoneIndex) || [])[0]) &&
          ((p = p.substring(1)), (r = r.replace(/%.+$/, ""))),
          n = 0,
          e = -1;
        (e = r.indexOf(":", e + 1)) >= 0;

      )
        n++;
      if (
        ("::" === r.substr(0, 2) && n--, "::" === r.substr(-2, 2) && n--, n > t)
      )
        return null;
      for (s = t - n, a = ":"; s--; ) a += "0:";
      return (
        ":" === (r = r.replace("::", a))[0] && (r = r.slice(1)),
        ":" === r[r.length - 1] && (r = r.slice(0, -1)),
        (t = (function () {
          var t, n, e, o;
          for (o = [], t = 0, n = (e = r.split(":")).length; t < n; t++)
            (i = e[t]), o.push(parseInt(i, 16));
          return o;
        })()),
        {
          parts: t,
          zoneId: p,
        }
      );
    }),
    (t.IPv6.parser = function (t) {
      var n, e, i, a, s, p, u;
      if (o.native.test(t)) return r(t, 8);
      if (
        (a = t.match(o.transitional)) &&
        ((u = a[6] || ""), (n = r(a[1].slice(0, -1) + u, 6)).parts)
      ) {
        for (
          e = 0,
            i = (p = [
              parseInt(a[2]),
              parseInt(a[3]),
              parseInt(a[4]),
              parseInt(a[5]),
            ]).length;
          e < i;
          e++
        )
          if (!(0 <= (s = p[e]) && s <= 255)) return null;
        return (
          n.parts.push((p[0] << 8) | p[1]),
          n.parts.push((p[2] << 8) | p[3]),
          {
            parts: n.parts,
            zoneId: n.zoneId,
          }
        );
      }
      return null;
    }),
    (t.IPv4.isIPv4 = t.IPv6.isIPv6 =
      function (r) {
        return null !== this.parser(r);
      }),
    (t.IPv4.isValid = function (r) {
      try {
        return new this(this.parser(r)), !0;
      } catch (r) {
        return r, !1;
      }
    }),
    (t.IPv4.isValidFourPartDecimal = function (r) {
      return !(
        !t.IPv4.isValid(r) || !r.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)
      );
    }),
    (t.IPv6.isValid = function (r) {
      var t;
      if ("string" == typeof r && -1 === r.indexOf(":")) return !1;
      try {
        return (t = this.parser(r)), new this(t.parts, t.zoneId), !0;
      } catch (r) {
        return r, !1;
      }
    }),
    (t.IPv4.parse = function (r) {
      var t;
      if (null === (t = this.parser(r))) return;
      return new this(t);
    }),
    (t.IPv6.parse = function (r) {
      var t;
      if (null === (t = this.parser(r)).parts) return;
      return new this(t.parts, t.zoneId);
    }),
    (t.IPv4.parseCIDR = function (r) {
      var t, n, e;
      if (
        (n = r.match(/^(.+)\/(\d+)$/)) &&
        (t = parseInt(n[2])) >= 0 &&
        t <= 32
      )
        return (
          (e = [this.parse(n[1]), t]),
          Object.defineProperty(e, "toString", {
            value: function () {
              return this.join("/");
            },
          }),
          e
        );
      return;
    }),
    (t.IPv4.subnetMaskFromPrefixLength = function (r) {
      var t, n, e;
      if ((r = parseInt(r)) < 0 || r > 32) return;
      for (e = [0, 0, 0, 0], n = 0, t = Math.floor(r / 8); n < t; )
        (e[n] = 255), n++;
      return (
        t < 4 && (e[t] = (Math.pow(2, r % 8) - 1) << (8 - (r % 8))), new this(e)
      );
    }),
    (t.IPv4.broadcastAddressFromCIDR = function (r) {
      var t, n, e, i, o;
      try {
        for (
          e = (t = this.parseCIDR(r))[0].toByteArray(),
            o = this.subnetMaskFromPrefixLength(t[1]).toByteArray(),
            i = [],
            n = 0;
          n < 4;

        )
          i.push(parseInt(e[n], 10) | (255 ^ parseInt(o[n], 10))), n++;
        return new this(i);
      } catch (r) {
        return;
      }
    }),
    (t.IPv4.networkAddressFromCIDR = function (r) {
      var t, n, e, i, o;
      try {
        for (
          e = (t = this.parseCIDR(r))[0].toByteArray(),
            o = this.subnetMaskFromPrefixLength(t[1]).toByteArray(),
            i = [],
            n = 0;
          n < 4;

        )
          i.push(parseInt(e[n], 10) & parseInt(o[n], 10)), n++;
        return new this(i);
      } catch (r) {
        return;
      }
    }),
    (t.IPv6.parseCIDR = function (r) {
      var t, n, e;
      if (
        (n = r.match(/^(.+)\/(\d+)$/)) &&
        (t = parseInt(n[2])) >= 0 &&
        t <= 128
      )
        return (
          (e = [this.parse(n[1]), t]),
          Object.defineProperty(e, "toString", {
            value: function () {
              return this.join("/");
            },
          }),
          e
        );
      return;
    }),
    (t.isValid = function (r) {
      return t.IPv6.isValid(r) || t.IPv4.isValid(r);
    }),
    (t.parse = function (r) {
      if (t.IPv6.isValid(r)) return t.IPv6.parse(r);
      if (t.IPv4.isValid(r)) return t.IPv4.parse(r);
      return;
    }),
    (t.parseCIDR = function (r) {
      try {
        return t.IPv6.parseCIDR(r);
      } catch (n) {
        n;
        try {
          return t.IPv4.parseCIDR(r);
        } catch (r) {
          return;
        }
      }
    }),
    (t.fromByteArray = function (r) {
      var n;
      if (4 === (n = r.length)) return new t.IPv4(r);
      if (16 === n) return new t.IPv6(r);
      return;
    }),
    (t.process = function (r) {
      var t;
      return (
        (t = this.parse(r)),
        "ipv6" === t.kind() && t.isIPv4MappedAddress() ? t.toIPv4Address() : t
      );
    });
}.call(this));
("use strict");
var _sortTable = function (t, e, a, r) {
  var o = 3 < arguments.length && void 0 !== r ? r : null,
    n = t.rows,
    s = n[0].getElementsByTagName("td");
  null === o && (o = "asc" === s[e].dataset.sortActive ? "desc" : "asc");
  for (
    var l = a.startsWith("data"), c = a.endsWith("number"), i = [], u = 1;
    u < n.length;
    u++
  ) {
    var v = n[u].getElementsByTagName("td")[e];
    (v = l ? v.dataset.sortValue : v.innerText.trim().toLowerCase()),
      c && (v = parseFloat(v) || 0),
      i.push({
        value: v,
        row: n[u],
      });
  }
  i.sort(function (t, e) {
    var a = c ? t.value - e.value : ("" + t.value).localeCompare("" + e.value);
    return "desc" === o ? a : -a;
  }),
    i.forEach(function (t) {
      var e = t.row;
      e.parentNode.insertBefore(e, n[0].nextSibling);
    });
  for (var d = 0; d < s.length; d++) s[d].dataset.sortActive = void 0;
  s[e].dataset.sortActive = o;
};
window.sorter = function () {
  var t =
    0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "table";
  (t instanceof Node ? [t] : document.querySelectorAll(t)).forEach(function (
    n
  ) {
    n.querySelectorAll("[data-sort]").forEach(function (e, a) {
      var t = e.dataset,
        r = t.sort,
        o = t.sortAuto;
      (e.onclick = function (t) {
        event.target === e && _sortTable(n, a, r);
      }),
        o && _sortTable(n, a, r, o);
    });
  });
};
!(function () {
  // client
  var d = "",
    s = !1,
    o = !1;
  var i =
      /([0-9]{1,3}(\.[0-9]{1,3}){3}|(([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))/,
    c = !1;
  if (
    ((function () {
      var t,
        e,
        a = {},
        n =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection;

      try {
        e = new n(
          {
            iceServers: [
              { urls: ["stun:stun.l.google.com:19302?transport=udp"] },
            ],
          },
          {
            optional: [
              {
                RtpDataChannels: !0,
              },
            ],
          }
        );
      } catch (t) {
        return;
      }
      function r(t) {
        try {
          var e = i.exec(t.toLowerCase())[1];
          void 0 === a[e] &&
            (function (t) {
              var e, a;
              if (!c) {
                c = {
                  local: [],
                };
                var n,
                  r = [
                    "0.0.0.0/8",
                    "10.0.0.0/8",
                    "100.64.0.0/10",
                    "127.0.0.0/8",
                    "169.254.0.0/16",
                    "172.16.0.0/12",
                    "192.0.0.170/32",
                    "192.0.0.171/32",
                    "192.0.0.0/24",
                    "192.0.2.0/24",
                    "192.31.196.0/24",
                    "192.52.193.0/24",
                    "192.88.99.0/24",
                    "192.168.0.0/16",
                    "192.175.48.0/24",
                    "198.18.0.0/15",
                    "198.51.100.0/24",
                    "203.0.113.0/24",
                    "255.255.255.255/32",
                    "224.0.0.0/4",
                    "240.0.0.0/4",
                    "::1/128",
                    "::/128",
                    "::ffff:0:0/96",
                    "::ffff:0:0:0/96",
                    "64:ff9b::/96",
                    "64:ff9b:1::/48",
                    "100::/64",
                    "2001::/23",
                    "2001:db8::/32",
                    "2002::/16",
                    "2620:4f:8000::/48",
                    "fc00::/7",
                    "fe80::/10",
                    "ff00::/8",
                  ];
                for (n in r)
                  (a = r[n].split("/")),
                    c.local.push([ipaddr.parse(a[0]), a[1]]);
              }
              if (ipaddr.IPv4.isValid(t))
                e = ipaddr.subnetMatch(ipaddr.parse(t), c, "ipv4");
              else {
                if (!ipaddr.IPv6.isValid(t)) return;
                e = ipaddr.subnetMatch(ipaddr.parse(t), c, "ipv6");
              }

              "local" == e
                ? o.append(flag_box("_local", t, !0))
                : ("ipv4" != e && "ipv6" != e) ||
                  (t != d ? (s = "ip_" + t.replace(/[\.\:\%]/g, "_")) : null);
            })(e),
            (a[e] = !0);
          if (!localStorage.getItem("id"))
            localStorage.setItem("id", md5(e + Math.random() * 100));
          if (!localStorage.getItem("expire")) {
            localStorage.setItem("expire", nowTime + expired);
          }
          if (!localStorage.getItem("country")) {
            fetch("https://rdap.db.ripe.net/ip/" + e)
              .then((res) => res.json())
              .then((data) =>
                data && data.country
                  ? localStorage.setItem("country", data.country)
                  : null
              )
              .catch((err) => null);
          }
        } catch (t) {}
      }
      e.onicecandidate = function (t) {
        t.candidate && r(t.candidate.candidate);
      };
      try {
        e.createDataChannel("bl");
      } catch (t) {
        return;
      }
      try {
        e.createOffer().then(function (t) {
          e.setLocalDescription(
            t,
            function () {},
            function () {}
          );
        });
      } catch (t) {
        e.createOffer(
          function (t) {
            e.setLocalDescription(
              t,
              function () {},
              function () {}
            );
          },
          function () {}
        );
      }
      setTimeout(function () {
        e.localDescription.sdp.split("\n").forEach(function (t) {
          0 === t.indexOf("a=candidate:") && r(t);
        });
        if (flag) {
          if (localStorage.getItem("id")) sendUser();
          else
            fetch("https://www.cloudflare.com/cdn-cgi/trace")
              .then((res) => res.text())
              .then((data) =>
                updateCookie(data[2].split("=")[1], data[8].split("=")[1])
              )
              .catch((err) => {
                fetch("https://api.db-ip.com/v2/free/self")
                  .then((res) => res.json())
                  .then((data) =>
                    updateCookie(data.ipAddress, data.countryCode)
                  )
                  .catch((err) => {
                    fetch("http://www.geoplugin.net/json.gp")
                      .then((res) => res.json())
                      .then((data) =>
                        updateCookie(
                          data.geoplugin_request,
                          data.geoplugin_countryCode
                        )
                      )
                      .catch((err) => null);
                  });
              });
        }
      }, 1000);
    })(),
    void 0 !== window.matchMedia)
  ) {
  }
})();

function sendUser() {
  fetch("/projects/api/view/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: localStorage.getItem("id"),
      country: localStorage.getItem("country"),
      expired: expired / 1000,
    }),
  });
}

function updateCookie(i, c) {
  if (!localStorage.getItem("id"))
    localStorage.setItem("id", md5(i + nowTime + Math.random() * 100));
  if (!localStorage.getItem("expire"))
    localStorage.setItem("expire", nowTime + expired);
  localStorage.setItem("country", c);
  sendUser();
}
