import request from '../../helper/request'
import { loading, store } from '../../helper/wx'

Page({
  data: {
    background: '',
    show: false,
    color: 'rgba(0, 0, 0, .2)',
  },

  onImageLoad() {
    this.setData({ show: true })
    loading(false)
  },

  onTouchStart({ target }) {
    const { num } = target.dataset

    let color = 'rgba(226, 45, 71, .5)'
    if (num === 'w') {
      color = 'rgba(70, 107, 176, .5)'
    }
    if (num === 'a') {
      color = 'rgba(61, 221, 192, .5)'
    }

    this.setData({ color })
  },

  onTouchEnd() {
    this.setData({ color: 'rgba(0, 0, 0, .2)' })
  },

  onLoad() {
    request({
      url: '/media',
      data: {
        per_page: 50,
        media_type: 'image',
      },
    })
      .then(({ data }) => {
        data = data.filter(({ post }) => post)

        const l = data.length - 1
        const num = Math.floor(Math.random() * (l + 1))
        const { source_url: background } = data[num].media_details.sizes.full

        loading()
        this.setData({ background })
      })
  },
})
