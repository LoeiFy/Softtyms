import request from '../../helper/request'
import { setState, store } from '../../helper/wx'

Page({
  data: {
    items: [],
    scrollTop: 0,
  },

  items: [],

  setState,

  page: 1,

  loading: false,

  totalPage: 0,

  timer: null,

  getRow(data) {
    const items = data.filter(({ post }) => post)
    const left = []
    const right = []
    let leftHeight = 0
    let rightHeight = 0

    items.forEach((item) => {
      const { height } = item.media_details.sizes.thumbnail
      if (leftHeight >= rightHeight) {
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
      .then(({ items }) => store.set('wallpapers', items))
      .then(() => store.set('wp_page', this.page))
      .then(() => store.set('wp_total', this.totalPage))
      .then(() => this.loading = false)
  },

  onScroll({ detail }) {
    clearTimeout(this.timer)
    this.timer = null
    this.timer = setTimeout(() => {
      store.set('wpScrollTop', detail.scrollTop)
    }, 300)
  },

  onShow() {
    const items = store.get('wallpapers')
    const page = store.get('wp_page')
    const totalPage = store.get('wp_total')
    const wpScrollTop = store.get('wpScrollTop')

    if (items.length) {
      this.page = page
      this.totalPage = totalPage
      this.setState({ items })

      setTimeout(() => {
        this.setState({ scrollTop: wpScrollTop })
      }, 300)

      return
    }

    request({ url: '/media', data: { media_type: 'image', per_page: 20 } })
      .then(({ data: items, header }) => {
        this.totalPage = Number(header['X-WP-TotalPages'])
        this.items = items
        return this.setState({ items: this.getRow(items) })
      })
      .then(({ items }) => store.set('wallpapers', items))
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
