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
      title: '加载中...',
      mask: true,
    })
  }
  return wx.hideLoading()
}

export const setState = function(data) {
  this.setData(data)
  return Promise.resolve(data)
}
