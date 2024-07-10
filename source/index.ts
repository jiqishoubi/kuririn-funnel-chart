/**
 *
 * kuririn-funnel-chart
 */

import { throttle } from 'lodash'

// 解一元二次方程
function solveQuadraticEquation(a, b, c) {
  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) {
    throw new Error('方程无实数解')
  } else if (discriminant === 0) {
    const root = -b / (2 * a)
    // return `方程有一个重根，x=${root}`;
    return [root]
  } else {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a)
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a)
    // return `方程有两个实数根，x1=${root1}，x2=${root2}`;
    return [root1, root2]
  }
}

function getCenterByPoints(points: Array<{ x: number; y: number }>) {
  const xList = points.map((p) => p.x)
  const yList = points.map((p) => p.y)
  return {
    x: (Math.max(...xList) + Math.min(...xList)) / 2,
    y: (Math.max(...yList) + Math.min(...yList)) / 2,
  }
}

// 判断一个点在不在多边形内
function isPointInPolygon(
  point: {
    x: number
    y: number
  },
  points: Array<{
    x: number
    y: number
  }>
) {
  let x = point.x
  let y = point.y
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    let xi = points[i].x
    let yi = points[i].y
    let xj = points[j].x
    let yj = points[j].y
    let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) {
      inside = !inside
    }
  }
  return inside
}

export interface IKuririnFunnelChartOptions {
  title?: {
    text: string
  }
  data: Array<{
    value: number
    name?: string
    color?: string
  }>
  style?: {
    funnelWidth?: string | number
    gap?: number
  }
}

class KuririnFunnelChart {
  dom: HTMLDivElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  domCanvasRate: number

  _option?: IKuririnFunnelChartOptions
  _hoverIndex?: number

  get hoverIndex() {
    return this._hoverIndex
  }

  set hoverIndex(val) {
    if (val !== this._hoverIndex && this._option) {
      this._hoverIndex = val
      this.setOption(this._option)
    }
  }

  ///
  constructor(dom: HTMLDivElement) {
    const result = this.initSomeDoms(dom)
    this.dom = result.dom
    this.canvas = result.canvas
    this.ctx = result.ctx
    this.domCanvasRate = result.domCanvasRate
  }

  initSomeDoms(dom) {
    dom.style.position = 'relative'

    const inDomCanvas = dom.querySelector('canvas')
    const canvasWidth = 1920 * 2
    const canvas = (() => {
      if (inDomCanvas) {
        return inDomCanvas
      } else {
        const _canvas = document.createElement('canvas')

        _canvas.width = canvasWidth
        _canvas.height = (canvasWidth * dom.clientHeight) / dom.clientWidth
        _canvas.style.width = '100%'
        _canvas.style.height = '100%'
        _canvas.style.transition = 'all 0.4s'
        _canvas.style.opacity = '0'

        return _canvas
      }
    })()
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    if (!inDomCanvas) {
      dom.appendChild(canvas)
      setTimeout(() => {
        canvas.style.opacity = '1'
      }, 12)
    }

    const domCanvasRate = canvasWidth / dom.clientWidth

    return {
      dom,
      canvas,
      ctx,
      domCanvasRate,
    }
  }

  setOption(option: IKuririnFunnelChartOptions) {
    // console.log(`🚀 ~ setOption`)
    this._option = option
    const self = this
    const { data, style } = option
    const { funnelWidth: _funnelWidth = '70%', gap = 28 } = style ?? {}

    // draw
    const funnelWidth = (() => {
      if (typeof _funnelWidth === 'string' && /%$/.test(_funnelWidth)) {
        return (this.canvas.width * parseFloat(_funnelWidth)) / 100
      } else {
        return _funnelWidth // number
      }
    })() as number
    const funnelHeight = this.canvas.height

    const leftTopPoint = {
      x: (this.canvas.width - funnelWidth) / 2,
      y: 0,
    }
    const rightTopPoint = {
      x: leftTopPoint.x + funnelWidth,
      y: 0,
    }
    const bottomPoint = {
      x: this.canvas.width / 2,
      y: funnelHeight,
    }

    // 清空
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 漏斗图
    // 计算出每个区域的 上底top 下底bottom 高h 以及四个点的坐标

    function getHalfBottom(h: number) {
      return (funnelWidth * h) / funnelHeight / 2
    }

    const totalData = data.reduce((acc, cur) => acc + cur.value, 0)
    const totalArea = (funnelWidth * funnelHeight) / 2
    const areaRate = totalArea / totalData
    const realAreaList = data.map((d) => d.value * areaRate)
    // console.log(`🚀 ~ realAreaList`, realAreaList)
    let areaResList: Array<{
      h: number // 高
      top: number // 上底
      bottom: number // 下底
      points: Array<{
        x: number
        y: number
      }>
      drawPoints?: Array<{
        x: number
        y: number
      }>
    }> = []
    for (let i = data.length - 1; i >= 0; i--) {
      const realArea = realAreaList[i]
      if (i === data.length - 1) {
        // 最下面 三角形
        const h = Math.sqrt((realArea * 2 * funnelHeight) / funnelWidth)
        const bottom = (funnelWidth * h) / funnelHeight
        const points = [
          {
            x: bottomPoint.x - bottom / 2,
            y: bottomPoint.y - h,
          },
          {
            x: bottomPoint.x + bottom / 2,
            y: bottomPoint.y - h,
          },
          bottomPoint,
        ]
        areaResList[i] = {
          h,
          top: 0,
          bottom,
          points,
        }
      } else if (i === 0) {
        // 最上面 梯形
        const top = areaResList[i + 1].bottom
        const bottom = funnelWidth
        const h = (2 * realArea) / (top + bottom)
        const _halfSmallBottom = (bottom - top) / 2
        const points = [
          leftTopPoint,
          rightTopPoint,
          {
            x: rightTopPoint.x - _halfSmallBottom,
            y: rightTopPoint.y + h,
          },
          {
            x: leftTopPoint.x + _halfSmallBottom,
            y: leftTopPoint.y + h,
          },
        ]
        areaResList[i] = {
          h,
          top,
          bottom,
          points,
        }
      } else {
        // 中间 梯形
        const pre = areaResList[i + 1]
        const top = pre.bottom

        // funnelWidth             _bottom
        // /                         /
        // funnelHeight            h

        // const _bottom = (funnelWidth * h) / funnelHeight

        // (((funnelWidth * h) / funnelHeight + top + top) * h) / 2 = realArea

        // 一元二次方程
        const a = funnelWidth / funnelHeight
        const b = 2 * top
        const c = -(2 * realArea)
        const rootArr = solveQuadraticEquation(a, b, c)
        const h = Math.max(...rootArr)
        const _bottom = (funnelWidth * h) / funnelHeight
        const bottom = top + _bottom
        const _halfSmallBottom = (bottom - top) / 2
        const points = [
          {
            x: pre.points[0].x - _halfSmallBottom,
            y: pre.points[0].y - h,
          },
          {
            x: pre.points[1].x + _halfSmallBottom,
            y: pre.points[1].y - h,
          },
          pre.points[1],
          pre.points[0],
        ]
        areaResList[i] = {
          h,
          top,
          bottom,
          points,
        }
      }
    }
    // 设置 drawPoints 加上gap的间隙
    areaResList = areaResList.map((areaRes, index) => {
      const drawPoints = areaRes.points.map((p, i) => {
        if (index === areaResList.length - 1) {
          // 最下面 三角形
          if (i === 0) {
            return {
              x: p.x + getHalfBottom(gap / 2),
              y: p.y + gap / 2,
            }
          } else if (i === 1) {
            return {
              x: p.x - getHalfBottom(gap / 2),
              y: p.y + gap / 2,
            }
          }
        } else if (index === 0) {
          // 最上面 梯形
          if (i === 2) {
            return {
              x: p.x + getHalfBottom(gap / 2),
              y: p.y - gap / 2,
            }
          } else if (i === 3) {
            return {
              x: p.x - getHalfBottom(gap / 2),
              y: p.y - gap / 2,
            }
          }
        } else {
          // 中间 梯形
          switch (i) {
            case 0:
              return {
                x: p.x + getHalfBottom(gap / 2),
                y: p.y + gap / 2,
              }
            case 1:
              return {
                x: p.x - getHalfBottom(gap / 2),
                y: p.y + gap / 2,
              }
            case 2:
              return {
                x: p.x + getHalfBottom(gap / 2),
                y: p.y - gap / 2,
              }
            case 3:
              return {
                x: p.x - getHalfBottom(gap / 2),
                y: p.y - gap / 2,
              }
          }
        }
        return p
      })
      return {
        ...areaRes,
        drawPoints,
      }
    })
    console.log(`🚀 ~ areaResList`, areaResList)

    // 画各个区域
    for (let i = 0; i < areaResList.length; i++) {
      const areaRes = areaResList[i]
      this.ctx.save()
      this.ctx.beginPath()
      for (let j = 0; j < areaRes.drawPoints!.length; j++) {
        const p = areaRes.drawPoints![j]
        if (j === 0) {
          this.ctx.moveTo(p.x, p.y)
        } else {
          this.ctx.lineTo(p.x, p.y)
        }
      }
      this.ctx.closePath()
      this.ctx.fillStyle = data[i].color ?? 'red'
      if (i === this.hoverIndex) {
        this.ctx.globalAlpha = 0.85
      }
      this.ctx.fill()
      this.ctx.restore()
    }

    // 画 name && value
    for (let i = 0; i < areaResList.length; i++) {
      const areaRes = areaResList[i]
      const center = getCenterByPoints(areaRes.points)
      this.ctx.fillStyle = '#262626'
      this.ctx.textBaseline = 'middle'

      if (data[i].name) {
        this.ctx.font = '80px Arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillText(data[i].name!, 0, center.y)
      }

      this.ctx.font = '110px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(data[i].value.toString(), center.x, center.y)
    }

    // 画转化率
    for (let i = 0; i < areaResList.length; i++) {
      if (i > 0) {
        const areaRes = areaResList[i]
        const value = ((data[i].value / data[i - 1].value) * 100).toFixed(2) + '%'
        const x = rightTopPoint.x
        const y = areaRes.points[1].y
        this.ctx.fillStyle = '#262626'
        this.ctx.font = '80px Arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillText(value, x + 100, y)
      }
    }
    // 画转化率 刻度
    ;(() => {
      this.ctx.beginPath()
      this.ctx.moveTo(rightTopPoint.x, areaResList[0].points[1].y + areaResList[0].h / 2)
      this.ctx.lineTo(rightTopPoint.x + 70, areaResList[0].points[1].y + areaResList[0].h / 2)
      this.ctx.lineTo(rightTopPoint.x + 70, bottomPoint.y - areaResList[areaResList.length - 1].h / 2)
      this.ctx.lineTo(rightTopPoint.x, bottomPoint.y - areaResList[areaResList.length - 1].h / 2)
      this.ctx.lineWidth = 10
      this.ctx.strokeStyle = '#262626'
      this.ctx.stroke()

      for (let i = 0; i < areaResList.length; i++) {
        if (i !== 0 && i !== areaResList.length - 1) {
          const areaRes = areaResList[i]
          this.ctx.beginPath()
          this.ctx.moveTo(rightTopPoint.x, areaRes.points[1].y + areaRes.h / 2)
          this.ctx.lineTo(rightTopPoint.x + 70, areaRes.points[1].y + areaRes.h / 2)
          this.ctx.lineWidth = 10
          this.ctx.strokeStyle = '#262626'
          this.ctx.stroke()
        }
      }

      // this.ctx.beginPath()
      // this.ctx.moveTo(rightTopPoint.x + 430, areaResList[0].points[1].y + areaResList[0].h / 2)
      // this.ctx.lineTo(rightTopPoint.x + 430 + 70, areaResList[0].points[1].y + areaResList[0].h / 2)
      // this.ctx.lineTo(rightTopPoint.x + 430 + 70, bottomPoint.y - areaResList[areaResList.length - 1].h / 2)
      // this.ctx.lineTo(rightTopPoint.x + 430, bottomPoint.y - areaResList[areaResList.length - 1].h / 2)
      // this.ctx.lineWidth = 10
      // this.ctx.strokeStyle = '#262626'
      // this.ctx.stroke()

      // // 最后的转化率
      // this.ctx.fillStyle = '#262626'
      // this.ctx.font = '80px Arial'
      // this.ctx.textAlign = 'left'
      // this.ctx.fillText(
      //   ((data[data.length - 1].value / data[0].value) * 100).toFixed(2) + '%', //
      //   rightTopPoint.x + 430 + 100,
      //   bottomPoint.y
      // )
    })()

    // canvas hover
    // onmousemove
    this.canvas.onmousemove = throttle((e) => {
      const point = {
        x: e.offsetX * this.domCanvasRate,
        y: e.offsetY * this.domCanvasRate,
      }
      // console.log(`🚀 ~ point`, point)
      const _padding = 4
      if (e.offsetX > _padding && e.offsetX < this.canvas.width - _padding && e.offsetY > _padding && e.offsetY < this.canvas.height - _padding) {
        for (let i = 0; i < areaResList.length; i++) {
          const areaRes = areaResList[i]
          if (isPointInPolygon(point, areaRes.points)) {
            // 鼠标经过某个区域
            this.toggleCursor(true)
            this.hoverIndex = i
            const tooltipStr = `<div>
              ${data[i].name ?? ''}: <span style="font-weight: bold;">${data[i].value}</span>
            </div>`
            this.drawTooltip(e, tooltipStr)
            break
          } else {
            this.toggleCursor(false)
            this.closeTooltip()
          }
        }
      } else {
        this.toggleCursor(false)
        this.closeTooltip()
      }
    }, 3)
  }

  drawTooltip(e: MouseEvent, tooltipStr: string) {
    let tooltipDiv = this.dom.querySelector('div.tooltip') as HTMLDivElement | null
    if (!tooltipDiv) {
      const div = document.createElement('div')
      div.className = 'tooltip'

      div.style.backgroundColor = 'rgb(255, 255, 255)'
      div.style.borderRadius = '4px'
      div.style.boxShadow = 'rgba(0, 0, 0, 0.2) 1px 2px 10px'
      div.style.color = 'rgb(88, 88, 88)'
      div.style.padding = '10px'
      div.style.pointerEvents = 'none'
      div.style.borderStyle = 'solid'
      div.style.whiteSpace = 'nowrap'
      div.style.transition = 'opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s'
      div.style.borderWidth = '0px'
      div.style.transform = 'translateZ(0)' // 3d加速
      div.style.opacity = '0.9'

      div.style.position = 'absolute'
      // div.style.width = '170px'
      // div.style.height = '100px'
      div.style.zIndex = '9999999'

      this.dom.appendChild(div)
      tooltipDiv = div
    }

    tooltipDiv.style.display = 'block'
    setTimeout(() => {
      tooltipDiv.style.left = e.offsetX + 13 + 'px'
      tooltipDiv.style.top = e.offsetY + 13 + 'px'
    }, 2)
    tooltipDiv.innerHTML = tooltipStr
  }

  closeTooltip() {
    let tooltipDiv = this.dom.querySelector('div.tooltip') as HTMLDivElement | null
    if (tooltipDiv) {
      tooltipDiv.style.display = 'none'
    }
  }

  toggleCursor(flag: boolean) {
    this.canvas.style.cursor = flag ? 'pointer' : 'default'
  }
}

function init(dom: HTMLDivElement): KuririnFunnelChart {
  return new KuririnFunnelChart(dom)
}

const kuririnFunnelChart = {
  init,
}

export default kuririnFunnelChart
