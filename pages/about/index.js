Page({
  data: {
    src: 'https://isujin.com/wp-content/uploads/2018/06/1077037315.png',
  },

  onTap() {
    wx.previewImage({ current: '', urls: [this.data.src] })
  },
})
