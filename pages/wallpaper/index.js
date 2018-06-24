import request from '../../helper/request'
import { setState, store } from '../../helper/wx'

Page({
  data: {
    items: [],
    scrollTop: 0,
  },

  setState,

  page: 1,

  loading: false,

  totalPage: 1,

  timer: null,

  onScrollBottom() {
    const { items: current } = this.data

    if (this.loading || this.totalPage === this.page) {
      return
    }

    this.loading = true
    this.page += 1

    request({ url: '/media', data: { media_type: 'image', page: this.page } })
      .then(({ data }) => this.setState({ items: current.concat(data) }))
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

    request({ url: '/media', data: { media_type: 'image' } })
      .then(({ data: items, header }) => {
        this.totalPage = Number(header['X-WP-TotalPages'])
        return this.setState({ items })
      })
      .then(({ items }) => store.set('wallpapers', items))
  },
})