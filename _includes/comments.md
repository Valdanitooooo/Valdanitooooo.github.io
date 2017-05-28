{% if site.duoshuo %}
	{% if page.id %}
	<div class="ds-thread" data-thread-key="{{ page.id }}" data-url="{{ site.url }}{{ page.url }}" data-title="{{ page.title }}" />
	{% else %}
	<div class="ds-thread" data-thread-key="{{ site.url }}{{ page.url }}" />
	{% endif %}
	<script type="text/javascript">
	/* duoshuo */
	var duoshuoQuery = {short_name:"{{ site.duoshuo }}"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
	})();
	</script>
{% endif %}
