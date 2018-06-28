const app = () => getApp()

export const store = {
  set(key, data) {
    app().data[key] = data
    return Promise.resolve()
  },
  get(key) {
    return app().data[key]
  },
}

export const toast = (title) => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 1000,
    mask: true,
  })
}

export const loading = function(show = true) {
  if (show) {
    if (this > 1) {
      wx.showNavigationBarLoading()
    } else {
      wx.showLoading({ mask: true })
    }
    return
  }
  wx.hideLoading()
  wx.hideNavigationBarLoading()
}

export const setState = function(data) {
  this.setData(data)
  return Promise.resolve(data)
}

export class Audio {
  constructor(src) {
    this.playCall = () => null
    this.canPlay = () => null
    this.ctx = wx.createInnerAudioContext()
    this.ctx.autoplay = false
    this.ctx.obeyMuteSwitch	= false
    this.ctx.src = encodeURI(src)
    this.ctx.onTimeUpdate(() => this.playCall(this.ctx.currentTime, this.ctx.duration))
    this.ctx.onPlay(() => null)
    this.ctx.onCanplay(() => this.canPlay())
  }

  set onPlay(fn) {
    this.playCall = fn
  }

  set onReady(fn) {
    this.canPlay = fn
  }

  play() {
    if (this.canPlay) {
      this.ctx.play()
    }
  }

  pause() {
    this.ctx.pause()
  }

  stop() {
    this.ctx.stop()
  }

  destroy() {
    this.ctx.destroy()
  }
}
