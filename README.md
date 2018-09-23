# Softtyms

Softtyms 是一个基于 WordPress [REST API](https://developer.wordpress.org/rest-api/) 的微信小程序

![gh_7107a625fda9_344](https://user-images.githubusercontent.com/2193211/42122301-3b0b4ba4-7c72-11e8-80a0-f7b62ae03f9b.jpg)

### 开发相关

修改 `host.sample.js` 为 `host.js`，填入你的 WordPress 网站地址

```js
export default 'http://127.0.0.1:8000'
```

需要修改图片地址

```html
<!-- posts/index.wxml -->
<!-- 将 src 值换为 {{item.thumbnail}} -->
<image mode="widthFix" src="https://isujin.com/wp-content/themes/Diaspora/timthumb/timthumb.php?src={{item.thumbnail}}" />
```

```html
<!-- post/index.wxml -->
<!-- 将 src 值换为 {{post.thumbnail}} -->
<image mode="widthFix" class="cover" src="https://isujin.com/wp-content/themes/Diaspora/timthumb/timthumb.php?src={{post.thumbnail}}" />
```

添加项目到微信小程序开发工具即可运行

### WordPress 设置

需要用到的 API 接口

- /wp/v2/posts
- /wp/v2/posts/(?P<id>[\d]+)
- /wp/v2/media

在主题 `function.php` 添加以下代码（php 我不大会）

```php
function dw_rest_prepare_post( $data, $post, $request ) {

	$_data = $data->data;

	$params = $request->get_params();

	if ( isset( $params['id'] ) ) {
		unset( $_data['excerpt'] );
	}

	if ( ! isset( $params['id'] ) ) {
		unset( $_data['content'] );
	}

	$thumbnail_id = get_post_thumbnail_id( $post->ID );
	$thumbnail = wp_get_attachment_image_src( $thumbnail_id, 'full' );
   	$_data['thumbnail'] = $thumbnail[0];

	if ( isset( $params['id'] ) ) {
		$media = get_attached_media( 'audio', $post->ID );
		$keys = array_keys( $media );
		$audio = wp_get_attachment_url( $keys[0] );
		$_data['audio'] = $audio;
	}

	unset( $_data['date_gmt'] );
	unset( $_data['featured_media'] );
	unset( $_data['ping_status'] );
	unset( $_data['comment_status'] );
	unset( $_data['sticky'] );
	unset( $_data['template'] );
	unset( $_data['link'] );
	unset( $_data['guid'] );
	unset( $_data['modified_gmt'] );
	unset( $_data['meta'] );
	unset( $_data['modified'] );
	unset( $_data['slug'] );
	unset( $_data['type'] );
	unset( $_data['author'] );
  unset( $_data['categories'] );
	unset( $_data['tags'] );
	unset( $_data['status'] );

  $data->remove_link( 'collection' );
  $data->remove_link( 'self' );
  $data->remove_link( 'about' );
  $data->remove_link( 'author' );
  $data->remove_link( 'replies' );
  $data->remove_link( 'version-history' );
  $data->remove_link( 'https://api.w.org/featuredmedia' );
  $data->remove_link( 'https://api.w.org/attachment' );
  $data->remove_link( 'https://api.w.org/term' );
  $data->remove_link( 'curies' );

	$data->data = $_data;

	return $data;

}

function dw_rest_prepare_attachment( $data, $post, $request ) {

	$_data = $data->data;

  $data->remove_link( 'collection' );
  $data->remove_link( 'self' );
  $data->remove_link( 'about' );
  $data->remove_link( 'author' );
  $data->remove_link( 'replies' );

	unset( $_data['date'] );
	unset( $_data['date_gmt'] );
	unset( $_data['guid'] );
	unset( $_data['modified'] );
	unset( $_data['modified_gmt'] );
	unset( $_data['slug'] );
	unset( $_data['status'] );
	unset( $_data['type'] );
	unset( $_data['link'] );
	unset( $_data['title'] );
	unset( $_data['source_url'] );
	unset( $_data['caption'] );
	unset( $_data['description'] );
	unset( $_data['author'] );
	unset( $_data['comment_status'] );
	unset( $_data['ping_status'] );
	unset( $_data['meta'] );
	unset( $_data['template'] );
	unset( $_data['alt_text'] );
	unset( $_data['media_type'] );
	unset( $_data['mime_type'] );

	$data->data = $_data;

	return $data;

}

add_filter( 'rest_prepare_post', 'dw_rest_prepare_post', 10, 3 );
add_filter( 'rest_prepare_attachment', 'dw_rest_prepare_attachment', 10, 3 );
```

### 第三方插件

https://github.com/skyFi/html2wxml


### License

MIT
