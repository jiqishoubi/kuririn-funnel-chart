;(function (v, b) {
  typeof exports == 'object' && typeof module < 'u'
    ? (module.exports = b())
    : typeof define == 'function' && define.amd
    ? define(b)
    : ((v = typeof globalThis < 'u' ? globalThis : v || self), (v.kuririnFunnelChart = b()))
})(this, function () {
  'use strict'
  var ee = Object.defineProperty
  var ne = (v, b, S) => (b in v ? ee(v, b, { enumerable: !0, configurable: !0, writable: !0, value: S }) : (v[b] = S))
  var w = (v, b, S) => (ne(v, typeof b != 'symbol' ? b + '' : b, S), S)
  var v = typeof globalThis < 'u' ? globalThis : typeof window < 'u' ? window : typeof global < 'u' ? global : typeof self < 'u' ? self : {}
  function b(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, 'default') ? t.default : t
  }
  function S(t) {
    var e = typeof t
    return t != null && (e == 'object' || e == 'function')
  }
  var I = S,
    X = typeof v == 'object' && v && v.Object === Object && v,
    H = X,
    z = H,
    Y = typeof self == 'object' && self && self.Object === Object && self,
    U = z || Y || Function('return this')(),
    P = U,
    K = P,
    Q = function () {
      return K.Date.now()
    },
    Z = Q,
    J = /\s/
  function V(t) {
    for (var e = t.length; e-- && J.test(t.charAt(e)); );
    return e
  }
  var tt = V,
    et = tt,
    nt = /^\s+/
  function it(t) {
    return t && t.slice(0, et(t) + 1).replace(nt, '')
  }
  var ot = it,
    rt = P,
    st = rt.Symbol,
    A = st,
    W = A,
    M = Object.prototype,
    at = M.hasOwnProperty,
    lt = M.toString,
    $ = W ? W.toStringTag : void 0
  function ct(t) {
    var e = at.call(t, $),
      i = t[$]
    try {
      t[$] = void 0
      var s = !0
    } catch {}
    var o = lt.call(t)
    return s && (e ? (t[$] = i) : delete t[$]), o
  }
  var ft = ct,
    ht = Object.prototype,
    ut = ht.toString
  function dt(t) {
    return ut.call(t)
  }
  var yt = dt,
    L = A,
    xt = ft,
    gt = yt,
    mt = '[object Null]',
    vt = '[object Undefined]',
    F = L ? L.toStringTag : void 0
  function bt(t) {
    return t == null ? (t === void 0 ? vt : mt) : F && F in Object(t) ? xt(t) : gt(t)
  }
  var pt = bt
  function Tt(t) {
    return t != null && typeof t == 'object'
  }
  var St = Tt,
    jt = pt,
    _t = St,
    wt = '[object Symbol]'
  function $t(t) {
    return typeof t == 'symbol' || (_t(t) && jt(t) == wt)
  }
  var Ot = $t,
    Ct = ot,
    N = I,
    It = Ot,
    B = 0 / 0,
    Rt = /^[-+]0x[0-9a-f]+$/i,
    Et = /^0b[01]+$/i,
    kt = /^0o[0-7]+$/i,
    Pt = parseInt
  function At(t) {
    if (typeof t == 'number') return t
    if (It(t)) return B
    if (N(t)) {
      var e = typeof t.valueOf == 'function' ? t.valueOf() : t
      t = N(e) ? e + '' : e
    }
    if (typeof t != 'string') return t === 0 ? t : +t
    t = Ct(t)
    var i = Et.test(t)
    return i || kt.test(t) ? Pt(t.slice(2), i ? 2 : 8) : Rt.test(t) ? B : +t
  }
  var Wt = At,
    Mt = I,
    R = Z,
    D = Wt,
    Lt = 'Expected a function',
    Ft = Math.max,
    Nt = Math.min
  function Bt(t, e, i) {
    var s,
      o,
      l,
      d,
      c,
      g,
      x = 0,
      p = !1,
      m = !1,
      O = !0
    if (typeof t != 'function') throw new TypeError(Lt)
    ;(e = D(e) || 0), Mt(i) && ((p = !!i.leading), (m = 'maxWait' in i), (l = m ? Ft(D(i.maxWait) || 0, e) : l), (O = 'trailing' in i ? !!i.trailing : O))
    function C(h) {
      var T = s,
        j = o
      return (s = o = void 0), (x = h), (d = t.apply(j, T)), d
    }
    function E(h) {
      return (x = h), (c = setTimeout(n, e)), p ? C(h) : d
    }
    function k(h) {
      var T = h - g,
        j = h - x,
        _ = e - T
      return m ? Nt(_, l - j) : _
    }
    function f(h) {
      var T = h - g,
        j = h - x
      return g === void 0 || T >= e || T < 0 || (m && j >= l)
    }
    function n() {
      var h = R()
      if (f(h)) return u(h)
      c = setTimeout(n, k(h))
    }
    function u(h) {
      return (c = void 0), O && s ? C(h) : ((s = o = void 0), d)
    }
    function a() {
      c !== void 0 && clearTimeout(c), (x = 0), (s = g = o = c = void 0)
    }
    function r() {
      return c === void 0 ? d : u(R())
    }
    function y() {
      var h = R(),
        T = f(h)
      if (((s = arguments), (o = this), (g = h), T)) {
        if (c === void 0) return E(g)
        if (m) return clearTimeout(c), (c = setTimeout(n, e)), C(g)
      }
      return c === void 0 && (c = setTimeout(n, e)), d
    }
    return (y.cancel = a), (y.flush = r), y
  }
  var Dt = Bt,
    qt = Dt,
    Gt = I,
    Xt = 'Expected a function'
  function Ht(t, e, i) {
    var s = !0,
      o = !0
    if (typeof t != 'function') throw new TypeError(Xt)
    return Gt(i) && ((s = 'leading' in i ? !!i.leading : s), (o = 'trailing' in i ? !!i.trailing : o)), qt(t, e, { leading: s, maxWait: e, trailing: o })
  }
  var zt = Ht
  const Yt = b(zt)
  function Ut(t, e, i) {
    const s = e * e - 4 * t * i
    if (s < 0) throw new Error('方程无实数解')
    if (s === 0) return [-e / (2 * t)]
    {
      const o = (-e + Math.sqrt(s)) / (2 * t),
        l = (-e - Math.sqrt(s)) / (2 * t)
      return [o, l]
    }
  }
  function Kt(t) {
    const e = t.map((s) => s.x),
      i = t.map((s) => s.y)
    return { x: (Math.max(...e) + Math.min(...e)) / 2, y: (Math.max(...i) + Math.min(...i)) / 2 }
  }
  function Qt(t, e) {
    let i = t.x,
      s = t.y,
      o = !1
    for (let l = 0, d = e.length - 1; l < e.length; d = l++) {
      let c = e[l].x,
        g = e[l].y,
        x = e[d].x,
        p = e[d].y
      g > s != p > s && i < ((x - c) * (s - g)) / (p - g) + c && (o = !o)
    }
    return o
  }
  class Zt {
    constructor(e) {
      w(this, 'dom')
      w(this, 'canvas')
      w(this, 'ctx')
      w(this, 'domCanvasRate')
      w(this, '_option')
      w(this, '_hoverIndex')
      const i = this.initSomeDoms(e)
      ;(this.dom = i.dom), (this.canvas = i.canvas), (this.ctx = i.ctx), (this.domCanvasRate = i.domCanvasRate)
    }
    get hoverIndex() {
      return this._hoverIndex
    }
    set hoverIndex(e) {
      e !== this._hoverIndex && this._option && ((this._hoverIndex = e), this.setOption(this._option))
    }
    initSomeDoms(e) {
      e.style.position = 'relative'
      const i = e.querySelector('canvas'),
        s = 1920 * 2,
        o = (() => {
          if (i) return i
          {
            const c = document.createElement('canvas')
            return (
              (c.width = s),
              (c.height = (s * e.clientHeight) / e.clientWidth),
              (c.style.width = '100%'),
              (c.style.height = '100%'),
              (c.style.transition = 'all 0.4s'),
              (c.style.opacity = '0'),
              c
            )
          }
        })(),
        l = o.getContext('2d')
      i ||
        (e.appendChild(o),
        setTimeout(() => {
          o.style.opacity = '1'
        }, 12))
      const d = s / e.clientWidth
      return { dom: e, canvas: o, ctx: l, domCanvasRate: d }
    }
    setOption(e) {
      this._option = e
      const { data: i, style: s } = e,
        { funnelWidth: o = '70%', gap: l = 28 } = s ?? {},
        d = (() => (typeof o == 'string' && /%$/.test(o) ? (this.canvas.width * parseFloat(o)) / 100 : o))(),
        c = this.canvas.height,
        g = { x: (this.canvas.width - d) / 2, y: 0 },
        x = { x: g.x + d, y: 0 },
        p = { x: this.canvas.width / 2, y: c }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      function m(n) {
        return (d * n) / c / 2
      }
      const O = i.reduce((n, u) => n + u.value, 0),
        E = (d * c) / 2 / O,
        k = i.map((n) => n.value * E)
      let f = []
      for (let n = i.length - 1; n >= 0; n--) {
        const u = k[n]
        if (n === i.length - 1) {
          const a = Math.sqrt((u * 2 * c) / d),
            r = (d * a) / c,
            y = [{ x: p.x - r / 2, y: p.y - a }, { x: p.x + r / 2, y: p.y - a }, p]
          f[n] = { h: a, top: 0, bottom: r, points: y }
        } else if (n === 0) {
          const a = f[n + 1].bottom,
            r = d,
            y = (2 * u) / (a + r),
            h = (r - a) / 2,
            T = [g, x, { x: x.x - h, y: x.y + y }, { x: g.x + h, y: g.y + y }]
          f[n] = { h: y, top: a, bottom: r, points: T }
        } else {
          const a = f[n + 1],
            r = a.bottom,
            y = d / c,
            h = 2 * r,
            T = -(2 * u),
            j = Ut(y, h, T),
            _ = Math.max(...j),
            Vt = (d * _) / c,
            q = r + Vt,
            G = (q - r) / 2,
            te = [{ x: a.points[0].x - G, y: a.points[0].y - _ }, { x: a.points[1].x + G, y: a.points[1].y - _ }, a.points[1], a.points[0]]
          f[n] = { h: _, top: r, bottom: q, points: te }
        }
      }
      ;(f = f.map((n, u) => {
        const a = n.points.map((r, y) => {
          if (u === f.length - 1) {
            if (y === 0) return { x: r.x + m(l / 2), y: r.y + l / 2 }
            if (y === 1) return { x: r.x - m(l / 2), y: r.y + l / 2 }
          } else if (u === 0) {
            if (y === 2) return { x: r.x + m(l / 2), y: r.y - l / 2 }
            if (y === 3) return { x: r.x - m(l / 2), y: r.y - l / 2 }
          } else
            switch (y) {
              case 0:
                return { x: r.x + m(l / 2), y: r.y + l / 2 }
              case 1:
                return { x: r.x - m(l / 2), y: r.y + l / 2 }
              case 2:
                return { x: r.x + m(l / 2), y: r.y - l / 2 }
              case 3:
                return { x: r.x - m(l / 2), y: r.y - l / 2 }
            }
          return r
        })
        return { ...n, drawPoints: a }
      })),
        console.log('🚀 ~ areaResList', f)
      for (let n = 0; n < f.length; n++) {
        const u = f[n]
        this.ctx.save(), this.ctx.beginPath()
        for (let a = 0; a < u.drawPoints.length; a++) {
          const r = u.drawPoints[a]
          a === 0 ? this.ctx.moveTo(r.x, r.y) : this.ctx.lineTo(r.x, r.y)
        }
        this.ctx.closePath(), (this.ctx.fillStyle = i[n].color ?? 'red'), n === this.hoverIndex && (this.ctx.globalAlpha = 0.85), this.ctx.fill(), this.ctx.restore()
      }
      for (let n = 0; n < f.length; n++) {
        const u = f[n],
          a = Kt(u.points)
        ;(this.ctx.fillStyle = '#262626'),
          (this.ctx.textBaseline = 'middle'),
          i[n].name && ((this.ctx.font = '80px Arial'), (this.ctx.textAlign = 'left'), this.ctx.fillText(i[n].name, 0, a.y)),
          (this.ctx.font = '110px Arial'),
          (this.ctx.textAlign = 'center'),
          this.ctx.fillText(i[n].value.toString(), a.x, a.y)
      }
      for (let n = 0; n < f.length; n++)
        if (n > 0) {
          const u = f[n],
            a = ((i[n].value / i[n - 1].value) * 100).toFixed(2) + '%',
            r = x.x,
            y = u.points[1].y
          ;(this.ctx.fillStyle = '#262626'), (this.ctx.font = '80px Arial'), (this.ctx.textAlign = 'left'), this.ctx.fillText(a, r + 100, y)
        }
      ;(() => {
        this.ctx.beginPath(),
          this.ctx.moveTo(x.x, f[0].points[1].y + f[0].h / 2),
          this.ctx.lineTo(x.x + 70, f[0].points[1].y + f[0].h / 2),
          this.ctx.lineTo(x.x + 70, p.y - f[f.length - 1].h / 2),
          this.ctx.lineTo(x.x, p.y - f[f.length - 1].h / 2),
          (this.ctx.lineWidth = 10),
          (this.ctx.strokeStyle = '#262626'),
          this.ctx.stroke()
        for (let n = 0; n < f.length; n++)
          if (n !== 0 && n !== f.length - 1) {
            const u = f[n]
            this.ctx.beginPath(),
              this.ctx.moveTo(x.x, u.points[1].y + u.h / 2),
              this.ctx.lineTo(x.x + 70, u.points[1].y + u.h / 2),
              (this.ctx.lineWidth = 10),
              (this.ctx.strokeStyle = '#262626'),
              this.ctx.stroke()
          }
      })(),
        (this.canvas.onmousemove = Yt((n) => {
          const u = { x: n.offsetX * this.domCanvasRate, y: n.offsetY * this.domCanvasRate },
            a = 4
          if (n.offsetX > a && n.offsetX < this.canvas.width - a && n.offsetY > a && n.offsetY < this.canvas.height - a)
            for (let r = 0; r < f.length; r++) {
              const y = f[r]
              if (Qt(u, y.points)) {
                this.toggleCursor(!0), (this.hoverIndex = r)
                const h = `<div>
              ${i[r].name ?? ''}: <span style="font-weight: bold;">${i[r].value}</span>
            </div>`
                this.drawTooltip(n, h)
                break
              } else this.toggleCursor(!1), this.closeTooltip()
            }
          else this.toggleCursor(!1), this.closeTooltip()
        }, 3))
    }
    drawTooltip(e, i) {
      let s = this.dom.querySelector('div.tooltip')
      if (!s) {
        const o = document.createElement('div')
        ;(o.className = 'tooltip'),
          (o.style.backgroundColor = 'rgb(255, 255, 255)'),
          (o.style.borderRadius = '4px'),
          (o.style.boxShadow = 'rgba(0, 0, 0, 0.2) 1px 2px 10px'),
          (o.style.color = 'rgb(88, 88, 88)'),
          (o.style.padding = '10px'),
          (o.style.pointerEvents = 'none'),
          (o.style.borderStyle = 'solid'),
          (o.style.whiteSpace = 'nowrap'),
          (o.style.transition =
            'opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s'),
          (o.style.borderWidth = '0px'),
          (o.style.transform = 'translateZ(0)'),
          (o.style.opacity = '0.9'),
          (o.style.position = 'absolute'),
          (o.style.zIndex = '9999999'),
          this.dom.appendChild(o),
          (s = o)
      }
      ;(s.style.display = 'block'),
        setTimeout(() => {
          ;(s.style.left = e.offsetX + 13 + 'px'), (s.style.top = e.offsetY + 13 + 'px')
        }, 2),
        (s.innerHTML = i)
    }
    closeTooltip() {
      let e = this.dom.querySelector('div.tooltip')
      e && (e.style.display = 'none')
    }
    toggleCursor(e) {
      this.canvas.style.cursor = e ? 'pointer' : 'default'
    }
  }
  function Jt(t) {
    return new Zt(t)
  }
  return { init: Jt }
})
