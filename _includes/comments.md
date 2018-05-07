{% if site.gitment %}
	<div id="container"></div>
	<link rel="stylesheet" href="/media/gitment/style/default.css">
	<script src="/media/gitment/dist/gitment.browser.js"></script>
	<script type="text/javascript">
		var gitment = new Gitment({
		  //id: '页面 ID', // 可选。默认为 location.href
		  //id: location.href.split('/').pop().replace(/\.html/,''),
		  id: "{{ post.title }}",
		  owner: 'Valdanitooooo',
		  repo: 'Valdanitooooo.github.io',
		  oauth: {
		    client_id: 'ae8e1056fd0fdfa83dcd',
		    client_secret: '587645a41329e9870ebda97d8d1ce05b0003b714',
		  },
		})
		gitment.render('container')
	</script>
{% endif %}
