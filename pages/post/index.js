import { store, setState, Audio } from '../../helper/wx'
import request from '../../helper/request'

const clearText = (text) => {
  const audio = /<audio[^>].*>[\s\S]+<\/audio>/g
  const img = /<img.*?src="http:\/\/guo\.lu\/wp-content\/uploads\/2014\/downloading\.png".*?\/>/g
  const script = /<!--\[if lt IE 9]>.*?<!\[endif]-->/g
  const entity = /&.*?;/g

  return text
    .replace(audio, '')
    .replace(img, '')
    .replace(script, '')
    .replace(entity, '')
}

const word = (text) => {
  const per = 400
  let total = 0
  for (let i=0; i < text.length; i += 1) {
    if (text.charCodeAt(i) > 127 || text.charCodeAt(i) === 94) {
      total += 1
    }
  }
  return { total, time: Math.floor(total / per) }
}

Page({
  data: {
    post: {},
    current: 0,
    total: 0,
  },

  setState,

  audio: null,

  initAudio() {
    const { audio: src } = this.data.post

    if (!src) {
      return
    }

    this.audio = new Audio(src)
    this.audio.onPlay = (current, total) => this.setState({ current, total })
  },

  onTap() {
    this.audio.play()
  },

  onUnload() {
    this.audio.stop()
    this.audio.destroy()
    this.audio = null
  },

  onLoad({ id }) {
    const posts = store.get('post')

    if (posts[id]) {
      this.setState({ post: posts[id] })
      this.initAudio()
      return
    }

    request({ url: `/posts/${id}` })
      .then(({ data: post }) => {
        const { rendered } = post.content
        post.content.rendered = clearText(rendered)
        post.content = { ...word(rendered), ...post.content }
        post.date = post.date.split('T')[0]
        return this.setState({ post })
      })
      .then(({ post }) => {
        this.initAudio()
        posts[id] = post
        store.set('post', posts)
      })
  },
})
