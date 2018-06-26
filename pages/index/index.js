import request from '../../helper/request'
import { loading } from '../../helper/wx'

Page({
  data: {
    background: '',
    show: false,
  },

  onImageLoad() {
    this.setData({ show: true })
    loading(false)
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
