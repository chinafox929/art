// 音乐播放器
document.addEventListener('DOMContentLoaded', function() {
    const playerToggle = document.getElementById('playerToggle');
    const playerPanel = document.getElementById('playerPanel');
    const playBtn = document.getElementById('playBtn');
    const trackName = document.getElementById('trackName');
    const trackArtist = document.getElementById('trackArtist');
    const musicItems = document.querySelectorAll('.music-item');
    
    let currentAudio = null;
    let isPlaying = false;
    let currentTrack = null;
    
    // 切换播放器面板
    playerToggle.addEventListener('click', function() {
        playerPanel.classList.toggle('active');
    });
    
    // 点击外部关闭面板
    document.addEventListener('click', function(e) {
        if (!playerToggle.contains(e.target) && !playerPanel.contains(e.target)) {
            playerPanel.classList.remove('active');
        }
    });
    
    // 播放/暂停
    playBtn.addEventListener('click', function() {
        if (!currentAudio) {
            // 默认播放第一首
            const firstItem = musicItems[0];
            selectTrack(firstItem);
        } else {
            togglePlay();
        }
    });
    
    // 选择音乐
    musicItems.forEach(item => {
        item.addEventListener('click', function() {
            selectTrack(this);
        });
    });
    
    function selectTrack(item) {
        const src = item.dataset.src;
        const name = item.dataset.name;
        const artist = item.dataset.artist;
        
        // 更新UI
        musicItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        trackName.textContent = name;
        trackArtist.textContent = artist;
        
        // 停止之前的音频
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        // 创建新音频
        currentAudio = new Audio(src);
        currentTrack = { src, name, artist };
        
        currentAudio.addEventListener('ended', function() {
            isPlaying = false;
            updatePlayBtn();
        });
        
        currentAudio.play();
        isPlaying = true;
        updatePlayBtn();
    }
    
    function togglePlay() {
        if (!currentAudio) return;
        
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
        } else {
            currentAudio.play();
            isPlaying = true;
        }
        updatePlayBtn();
    }
    
    function updatePlayBtn() {
        playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
});

// 图片放大
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const artworkImage = document.getElementById('mainArtwork');
    
    if (artworkImage) {
        artworkImage.addEventListener('click', function() {
            modalImg.src = this.src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// 导航滚动
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新导航
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});

// 筛选功能
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选作品
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.4s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// 滚动动画
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section-header, .gallery-item, .exhibition-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// 显示相关作品（模拟）
function showArtwork(type) {
    const artworks = {
        'monet': {
            title: '睡莲',
            artist: '克劳德·莫奈',
            year: '1906年',
            image: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg'
        },
        'sunflowers': {
            title: '向日葵',
            artist: '文森特·梵高',
            year: '1888年',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg'
        },
        'impression': {
            title: '日出·印象',
            artist: '克劳德·莫奈',
            year: '1872年',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/800px-Monet_-_Impression%2C_Sunrise.jpg'
        }
    };
    
    const artwork = artworks[type];
    if (artwork) {
        // 这里可以实现页面跳转或模态框显示
        console.log('查看作品：', artwork.title);
    }
}
