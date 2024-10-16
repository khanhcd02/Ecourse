document.addEventListener("DOMContentLoaded", function() {
    var embeds = document.querySelectorAll('oembed[url]');
    embeds.forEach(function(embed) {
        var url = embed.getAttribute('url');
        var iframe = document.createElement('iframe');

        // Tạo URL nhúng YouTube từ URL trong oembed
        var videoId = url.split('v=')[1].split('&')[0];
        var embedUrl = 'https://www.youtube.com/embed/' + videoId;
        
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', true);

        embed.parentNode.replaceChild(iframe, embed);
    });
});
