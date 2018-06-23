import { store, setState } from '../../helper/wx'
import request from '../../helper/request'

Page({
  data: {
    post: {},
  },

  setState,

  onLoad({ id }) {
    request({ url: `/posts/${id}` })
      .then(({ data: post }) => this.setState({ post }))
  },
})
