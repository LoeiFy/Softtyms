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

export const loading = (show = true) => {
  if (show) {
    return wx.showLoading({
      title: '',
      mask: true,
    })
  }
  return wx.hideLoading()
}

export const setState = function(data) {
  this.setData(data)
  return Promise.resolve(data)
}

export class Audio {
  constructor(src) {
    this.playCall = () => null
    this.ctx = wx.createInnerAudioContext()
    this.ctx.autoplay = false
    this.ctx.src = src
    this.ctx.onTimeUpdate(() => this.playCall(this.ctx.currentTime, this.ctx.duration))
    this.ctx.onPlay(() => null)
  }

  set onPlay(fn) {
    this.playCall = fn
  }

  play() {
    this.ctx.play()
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
