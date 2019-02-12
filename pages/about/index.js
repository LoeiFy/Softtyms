Page({
  data: {
    src: 'https://i.loli.net/2019/02/12/5c627e10e0179.png',
  },

  onTap() {
    wx.previewImage({ current: '', urls: [this.data.src] })
  },
})
