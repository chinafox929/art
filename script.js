/**
 * 云上美术馆 - 交互脚本
 */

// ========== 全局变量 ==========
let currentGallery = '';
let currentArtworkIndex = 0;
let galleryArtworks = [];
let isPlaying = false;
let currentTrack = 0;
let audioPlayer = null;

// 音乐播放列表
const musicPlaylists = {
    impressionism: [
        { title: '月光', artist: '德彪西', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { title: '牧神午后前奏曲', artist: '德彪西', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { title: '水之嬉戏', artist: '拉威尔', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
    ],
    renaissance: [
        { title: '四季·春', artist: '维瓦尔第', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
        { title: '格里高利圣咏', artist: '传统', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
        { title: '卡农', artist: '帕赫贝尔', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
    ],
    chinese: [
        { title: '高山流水', artist: '古琴曲', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
        { title: '渔舟唱晚', artist: '古筝曲', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
        { title: '梅花三弄', artist: '古琴曲', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
    ],
    modern: [
        { title: 'Gymnopédie No.1', artist: '萨蒂', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { title: 'Clair de Lune', artist: '德彪西', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { title: '氛围音乐', artist: '现代', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
    ]
};

// 展厅作品数据
const galleryData = {
    impressionism: [
        { id: 'imp-1', title: '睡莲', artist: '克劳德·莫奈', year: '1906', image: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg' },
        { id: 'imp-2', title: '星夜', artist: '文森特·梵高', year: '1889', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg' },
        { id: 'imp-3', title: '煎饼磨坊的舞会', artist: '皮埃尔-奥古斯特·雷诺阿', year: '1876', image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bal_du_moulin_de_la_Galette.jpg' },
        { id: 'imp-4', title: '舞蹈课', artist: '埃德加·德加', year: '1874', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg' },
        { id: 'imp-5', title: '日出·印象', artist: '克劳德·莫奈', year: '1872', image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Monet_-_Impression%2C_Sunrise.jpg' },
        { id: 'imp-6', title: '向日葵', artist: '文森特·梵高', year: '1888', image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Vincent_Willem_van_Gogh_127.jpg' }
    ],
    renaissance: [
        { id: 'ren-1', title: '蒙娜丽莎', artist: '列奥纳多·达·芬奇', year: '1503-1519', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg' },
        { id: 'ren-2', title: '创造亚当', artist: '米开朗基罗', year: '1508-1512', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/%27Adam%27s_Creation_Sistine_Chapel_ceiling%27_by_Michelangelo_JBU33cut.jpg' },
        { id: 'ren-3', title: '雅典学院', artist: '拉斐尔', year: '1509-1511', image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg' },
        { id: 'ren-4', title: '最后的晚餐', artist: '列奥纳多·达·芬奇', year: '1495-1498', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg' },
        { id: 'ren-5', title: '大卫', artist: '米开朗基罗', year: '1501-1504', image: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Michelangelo_David_-_3.jpg' },
        { id: 'ren-6', title: '西斯廷圣母', artist: '拉斐尔', year: '1512-1514', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Raffaello_Sanzio_-_Madonna_Sistina_-_Google_Art_Project.jpg' }
    ],
    chinese: [
        { id: 'chn-1', title: '清明上河图', artist: '张择端', year: '北宋', image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Qingming_Festival_Detail_6.jpg' },
        { id: 'chn-2', title: '万山红遍', artist: '李可染', year: '1964', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Li_Keran_-_Red_Mountains.jpg/1280px-Li_Keran_-_Red_Mountains.jpg' },
        { id: 'chn-3', title: '虾', artist: '齐白石', year: '近现代', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Qi_Baishi_-_Shrimps.jpg/800px-Qi_Baishi_-_Shrimps.jpg' },
        { id: 'chn-4', title: '富春山居图', artist: '黄公望', year: '元代', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Huang_Gongwang_-_Dwelling_in_the_Fuchun_Mountains.jpg/1280px-Huang_Gongwang_-_Dwelling_in_the_Fuchun_Mountains.jpg' },
        { id: 'chn-5', title: '千里江山图', artist: '王希孟', year: '北宋', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Wang_Ximeng_-_A_Thousand_Li_of_Rivers_and_Mountains_-_Google_Art_Project.jpg/1280px-Wang_Ximeng_-_A_Thousand_Li_of_Rivers_and_Mountains_-_Google_Art_Project.jpg' },
        { id: 'chn-6', title: '墨葡萄图', artist: '徐渭', year: '明代', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Xu_Wei_-_Grapes.jpg/800px-Xu_Wei_-_Grapes.jpg' }
    ],
    modern: [
        { id: 'mod-1', title: '格尔尼卡', artist: '巴勃罗·毕加索', year: '1937', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Mural_del_Gernika.jpg' },
        { id: 'mod-2', title: '呐喊', artist: '爱德华·蒙克', year: '1893', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg' },
        { id: 'mod-3', title: '记忆的永恒', artist: '萨尔瓦多·达利', year: '1931', image: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg' },
        { id: 'mod-4', title: '亚维农的少女', artist: '巴勃罗·毕加索', year: '1907', image: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg' },
        { id: 'mod-5', title: '红黄蓝的构成', artist: '蒙德里安', year: '1930', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg' },
        { id: 'mod-6', title: '第一号构图', artist: '康定斯基', year: '1913', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Vassily_Kandinsky%2C_1913_-_Composition_VII.jpg/1280px-Vassily_Kandinsky%2C_1913_-_Composition_VII.jpg' }
    ]
};

// ========== DOM加载完成后初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMusicPlayer();
    initImageModal();
    initScrollAnimations();
    hidePageLoader();
    
    // 根据页面类型初始化特定功能
    const pageType = document.body.dataset.page;
    if (pageType === 'gallery') {
        initGalleryPage();
    } else if (pageType === 'artwork') {
        initArtworkPage();
    }
});

// ========== 导航功能 ==========
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========== 音乐播放器 ==========
function initMusicPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const prevBtn = document.querySelector('.music-prev');
    const nextBtn = document.querySelector('.music-next');
    const progressBar = document.querySelector('.music-progress-bar');
    const musicTitle = document.querySelector('.music-title');
    const musicArtist = document.querySelector('.music-artist');
    
    // 根据当前页面确定播放列表
    const pageType = document.body.dataset.page;
    const galleryType = document.body.dataset.gallery;
    let playlist = musicPlaylists.impressionism; // 默认
    
    if (galleryType && musicPlaylists[galleryType]) {
        playlist = musicPlaylists[galleryType];
    } else if (pageType === 'gallery' || pageType === 'artwork') {
        // 从URL推断展厅类型
        const path = window.location.pathname;
        if (path.includes('impressionism')) playlist = musicPlaylists.impressionism;
        else if (path.includes('renaissance')) playlist = musicPlaylists.renaissance;
        else if (path.includes('chinese')) playlist = musicPlaylists.chinese;
        else if (path.includes('modern')) playlist = musicPlaylists.modern;
    }
    
    // 创建音频对象
    audioPlayer = new Audio();
    audioPlayer.src = playlist[0].url;
    
    // 更新音乐信息
    function updateMusicInfo() {
        if (musicTitle) musicTitle.textContent = playlist[currentTrack].title;
        if (musicArtist) musicArtist.textContent = playlist[currentTrack].artist;
    }
    updateMusicInfo();
    
    // 播放/暂停
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            if (isPlaying) {
                audioPlayer.pause();
                playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            } else {
                audioPlayer.play();
                playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            }
            isPlaying = !isPlaying;
        });
    }
    
    // 上一首
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            audioPlayer.src = playlist[currentTrack].url;
            updateMusicInfo();
            if (isPlaying) audioPlayer.play();
        });
    }
    
    // 下一首
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTrack = (currentTrack + 1) % playlist.length;
            audioPlayer.src = playlist[currentTrack].url;
            updateMusicInfo();
            if (isPlaying) audioPlayer.play();
        });
    }
    
    // 更新进度条
    audioPlayer.addEventListener('timeupdate', function() {
        if (progressBar) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    });
    
    // 自动播放下一首
    audioPlayer.addEventListener('ended', function() {
        currentTrack = (currentTrack + 1) % playlist.length;
        audioPlayer.src = playlist[currentTrack].url;
        updateMusicInfo();
        audioPlayer.play();
    });
}

// ========== 图片放大模态框 ==========
function initImageModal() {
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.image-modal-content img');
    const modalClose = document.querySelector('.image-modal-close');
    const modalPrev = document.querySelector('.image-modal-nav.prev');
    const modalNext = document.querySelector('.image-modal-nav.next');
    
    let currentImageIndex = 0;
    let currentImages = [];
    
    // 打开模态框
    window.openImageModal = function(src, images = []) {
        currentImages = images.length > 0 ? images : [src];
        currentImageIndex = currentImages.indexOf(src);
        if (currentImageIndex === -1) currentImageIndex = 0;
        
        if (modalImg) modalImg.src = currentImages[currentImageIndex];
        if (modal) modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // 关闭模态框
    window.closeImageModal = function() {
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // 上一张
    window.prevImage = function() {
        if (currentImages.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        if (modalImg) modalImg.src = currentImages[currentImageIndex];
    };
    
    // 下一张
    window.nextImage = function() {
        if (currentImages.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        if (modalImg) modalImg.src = currentImages[currentImageIndex];
    };
    
    // 事件绑定
    if (modalClose) {
        modalClose.addEventListener('click', closeImageModal);
    }
    
    if (modalPrev) {
        modalPrev.addEventListener('click', prevImage);
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', nextImage);
    }
    
    // 点击背景关闭
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeImageModal();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

// ========== 展厅页面功能 ==========
function initGalleryPage() {
    const galleryType = document.body.dataset.gallery;
    if (!galleryType || !galleryData[galleryType]) return;
    
    galleryArtworks = galleryData[galleryType];
    currentGallery = galleryType;
    
    // 渲染作品网格
    renderWorksGrid();
}

function renderWorksGrid() {
    const grid = document.querySelector('.works-grid');
    if (!grid || !galleryArtworks.length) return;
    
    grid.innerHTML = galleryArtworks.map((artwork, index) => `
        <div class="work-card" onclick="goToArtwork('${artwork.id}')">
            <div class="work-card-image">
                <img src="${artwork.image}" alt="${artwork.title}" loading="lazy">
                <div class="work-card-overlay">
                    <span class="work-card-view">查看详情</span>
                </div>
            </div>
            <div class="work-card-info">
                <h3 class="work-card-title">${artwork.title}</h3>
                <p class="work-card-artist">${artwork.artist}</p>
                <p class="work-card-year">${artwork.year}</p>
            </div>
        </div>
    `).join('');
}

// ========== 作品详情页功能 ==========
function initArtworkPage() {
    const galleryType = document.body.dataset.gallery;
    const artworkId = document.body.dataset.artwork;
    
    if (!galleryType || !galleryData[galleryType]) return;
    
    currentGallery = galleryType;
    galleryArtworks = galleryData[galleryType];
    
    // 找到当前作品索引
    currentArtworkIndex = galleryArtworks.findIndex(a => a.id === artworkId);
    if (currentArtworkIndex === -1) currentArtworkIndex = 0;
    
    // 初始化缩略图点击
    initThumbnails();
    
    // 初始化作品导航
    initArtworkNav();
}

function initThumbnails() {
    const thumbnails = document.querySelectorAll('.artwork-thumb');
    const mainImage = document.querySelector('.artwork-main-image img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const src = this.querySelector('img').src;
            if (mainImage) mainImage.src = src;
            
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 主图点击放大
    const mainImageContainer = document.querySelector('.artwork-main-image');
    if (mainImageContainer) {
        mainImageContainer.addEventListener('click', function() {
            const images = Array.from(thumbnails).map(t => t.querySelector('img').src);
            const currentSrc = mainImage ? mainImage.src : images[0];
            openImageModal(currentSrc, images);
        });
    }
}

function initArtworkNav() {
    const prevBtn = document.querySelector('.artwork-nav-btn.prev');
    const nextBtn = document.querySelector('.artwork-nav-btn.next');
    
    updateArtworkNav();
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentArtworkIndex > 0) {
                const prevArtwork = galleryArtworks[currentArtworkIndex - 1];
                goToArtwork(prevArtwork.id);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentArtworkIndex < galleryArtworks.length - 1) {
                const nextArtwork = galleryArtworks[currentArtworkIndex + 1];
                goToArtwork(nextArtwork.id);
            }
        });
    }
}

function updateArtworkNav() {
    const prevBtn = document.querySelector('.artwork-nav-btn.prev');
    const nextBtn = document.querySelector('.artwork-nav-btn.next');
    
    if (prevBtn) {
        if (currentArtworkIndex > 0) {
            const prevArtwork = galleryArtworks[currentArtworkIndex - 1];
            prevBtn.querySelector('.artwork-nav-title').textContent = prevArtwork.title;
            prevBtn.style.visibility = 'visible';
        } else {
            prevBtn.style.visibility = 'hidden';
        }
    }
    
    if (nextBtn) {
        if (currentArtworkIndex < galleryArtworks.length - 1) {
            const nextArtwork = galleryArtworks[currentArtworkIndex + 1];
            nextBtn.querySelector('.artwork-nav-title').textContent = nextArtwork.title;
            nextBtn.style.visibility = 'visible';
        } else {
            nextBtn.style.visibility = 'hidden';
        }
    }
}

// ========== 页面跳转 ==========
function goToArtwork(artworkId) {
    const galleryType = currentGallery || document.body.dataset.gallery;
    if (galleryType) {
        window.location.href = `artwork.html?gallery=${galleryType}&id=${artworkId}`;
    }
}

// ========== 滚动动画 ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.work-card, .gallery-card, .feature-container').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ========== 页面加载器 ==========
function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

// ========== 工具函数 ==========
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 解析作品详情页URL参数
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.dataset.page === 'artwork') {
        const gallery = getQueryParam('gallery');
        const id = getQueryParam('id');
        
        if (gallery) document.body.dataset.gallery = gallery;
        if (id) document.body.dataset.artwork = id;
        
        // 加载对应作品数据
        loadArtworkData(gallery, id);
    }
});

function loadArtworkData(gallery, artworkId) {
    // 这里可以根据gallery和artworkId加载具体的作品数据
    // 实际项目中可以从API或JSON文件加载
    console.log('Loading artwork:', gallery, artworkId);
}
