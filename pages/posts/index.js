import { store, setState } from '../../helper/wx'
import request from '../../helper/request'

Page({
  data: {
    posts: [],
    scrollTop: 0,
  },

  setState,

  page: 1,

  loading: false,

  totalPage: 1,

  timer: null,

  onScrollBottom() {
    const { posts: current } = this.data

    if (this.loading || this.totalPage === this.page) {
      return
    }

    this.loading = true
    this.page += 1

    request({ url: '/posts', data: { page: this.page } })
      .then(({ data }) => this.setState({ posts: current.concat(data) }))
      .then(({ posts }) => store.set('posts', posts))
      .then(() => store.set('page', this.page))
      .then(() => store.set('totalPage', this.totalPage))
      .then(() => this.loading = false)
  },

  onScroll({ detail }) {
    clearTimeout(this.timer)
    this.timer = null
    this.timer = setTimeout(() => {
      store.set('postsScrollTop', detail.scrollTop)
    }, 300)
  },

  onShow() {
    const posts = store.get('posts')
    const page = store.get('page')
    const totalPage = store.get('totalPage')
    const postsScrollTop = store.get('postsScrollTop')

    if (posts.length) {
      this.page = page
      this.totalPage = totalPage
      this.setState({ posts })

      setTimeout(() => {
        this.setState({ scrollTop: postsScrollTop })
      }, 300)

      return
    }

    request({ url: '/posts' })
      .then(({ data: posts, header }) => {
        this.totalPage = Number(header['X-WP-TotalPages'])
        return this.setState({ posts })
      })
      .then(({ posts }) => store.set('posts', posts))
  },
})
