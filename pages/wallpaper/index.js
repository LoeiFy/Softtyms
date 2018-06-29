import request from '../../helper/request'
import { setState, store } from '../../helper/wx'

Page({
  data: {
    items: [],
  },

  items: [],

  setState,

  page: 1,

  totalPage: 0,

  loading: false,

  getRow(data) {
    const items = data.filter(({ post }) => post)
    const left = []
    const right = []
    let leftHeight = 0
    let rightHeight = 0

    items.forEach((item) => {
      const { height } = item.media_details.sizes.thumbnail
      if (leftHeight > rightHeight) {
        right.push(item)
        rightHeight += height
      } else {
        left.push(item)
        leftHeight += height
      }
    })

    return [left, right]
  },

  onScrollBottom() {
    if (this.loading || this.totalPage === this.page) {
      return
    }

    this.loading = true
    this.page += 1

    request({ url: '/media', data: {
      media_type: 'image',
      page: this.page,
      per_page: 20,
    }})
      .then(({ data }) => {
        this.items = this.items.concat(data)
        return Promise.resolve(this.items)
      })
      .then((items) => this.setState({ items: this.getRow(items) }))
      .then(() => this.loading = false)
  },

  onLoad() {
    request({ url: '/media', data: { media_type: 'image', per_page: 20 } })
      .then(({ data: items, header }) => {
        this.totalPage = Number(header['X-WP-TotalPages'])
        this.items = items
        this.setState({ items: this.getRow(items) })
      })
  },

  onTap({ target }) {
    const { src } = target.dataset
    wx.previewImage({
      current: src,
      urls: this.items
        .filter(({ post }) => post)
        .map(({ media_details }) => media_details.sizes.full.source_url)
    })
  },
})
