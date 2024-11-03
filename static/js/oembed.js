document.addEventListener("DOMContentLoaded", function() {
    var embeds = document.querySelectorAll('oembed[url]');
    embeds.forEach(function(embed) {
        var url = embed.getAttribute('url');
        var videoId;

        // Kiểm tra và lấy videoId từ các loại URL khác nhau
        if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }

        if (videoId) {
            var embedUrl = 'https://www.youtube.com/embed/' + videoId;
            var iframe = document.createElement('iframe');
            
            iframe.setAttribute('src', embedUrl);
            iframe.setAttribute('id', 'youtube-player');
            iframe.setAttribute('width', '560');
            iframe.setAttribute('height', '315');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', true);

            embed.parentNode.replaceChild(iframe, embed);
        }
    });
});

function convertOembedToIframe(parentElement) {
    var embeds = parentElement.querySelectorAll('oembed[url]');
    embeds.forEach(function(embed) {
        var url = embed.getAttribute('url');
        var videoId;

        if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }

        if (videoId) {
            var embedUrl = 'https://www.youtube.com/embed/' + videoId + '?controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1';
            var videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';

            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', embedUrl);
            iframe.setAttribute('width', '560');
            iframe.setAttribute('height', '315');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', true);

            var overlay = document.createElement('div');
            overlay.className = 'video-overlay';

            overlay.innerHTML = `
                <button id="backward-button">
                    <i class="fa fa-backward"></i>
                </button>
                <button id="play-pause-button">
                    <i class="fa fa-play"></i>
                </button>
                <button id="forward-button">
                    <i class="fa fa-forward"></i>
                </button>
            `;
            var isPlaying = false;
            overlay.querySelector('#play-pause-button').addEventListener('click', function() {
                if (isPlaying) {
                    player.pauseVideo();
                    overlay.querySelector('#play-pause-button i').className = 'fa fa-play'; // Đổi sang biểu tượng play
                } else {
                    player.playVideo();
                    overlay.querySelector('#play-pause-button i').className = 'fa fa-pause'; // Đổi sang biểu tượng pause
                }
                isPlaying = !isPlaying; // Chuyển đổi trạng thái
            });
            
            overlay.querySelector('#forward-button').addEventListener('click', () => {
                const currentTime = player.getCurrentTime();
                player.seekTo(currentTime + 10, true); // Tua tới 10 giây
            });
            
            overlay.querySelector('#backward-button').addEventListener('click', () => {
                const currentTime = player.getCurrentTime();
                player.seekTo(currentTime - 10, true); // Tua lùi 10 giây
            });
            videoContainer.appendChild(iframe);
            videoContainer.appendChild(overlay);
            embed.parentNode.replaceChild(videoContainer, embed);

            // Khởi tạo YouTube Player sau khi iframe đã được thêm vào DOM
            var player = new YT.Player(iframe, {
                events: {
                    'onReady': onPlayerReady
                }
            });

 
        }
    });
}
