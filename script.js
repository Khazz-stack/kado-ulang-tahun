document.addEventListener("DOMContentLoaded", function() {

    // --- SELEKTOR ELEMEN ---
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    
    // Tombol Navigasi Halaman
    const startBtn = document.getElementById("startBtn");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const toPage4Btn = document.getElementById("toPage4Btn");
    const toPage5Btn = document.getElementById("toPage5Btn");
    const candle = document.getElementById("candle");
    const envelope = document.getElementById("envelope");

    // --- FUNGSI NAVIGASI HALAMAN ---
    function navigateToPage(fromPageId, toPageId) {
        const fromPage = document.getElementById(fromPageId);
        const toPage = document.getElementById(toPageId);

        fromPage.classList.remove("active-page");
        fromPage.classList.add("hidden");

        setTimeout(() => {
            toPage.classList.remove("hidden");
            toPage.classList.add("active-page");
        }, 300); // Sinkron dengan efek CSS Transisi
    }

    // --- AUDIO SYSTEM ---
    function startMusic() {
        bgMusic.play().then(() => {
            musicToggleBtn.classList.remove("hidden");
            musicToggleBtn.innerText = "⏸️";
        }).catch(err => {
            console.log("Audio diblokir oleh browser sebelum ada interaksi.");
        });
    }

    musicToggleBtn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggleBtn.innerText = "⏸️";
        } else {
            bgMusic.pause();
            musicToggleBtn.innerText = "▶️";
        }
    });

    // --- HALAMAN 1 -> HALAMAN 2 ---
    startBtn.addEventListener("click", () => {
        startMusic();
        navigateToPage("page1", "page2");
    });

    // --- HALAMAN 2: LOGIKA TOMBOL 'TIDAK' MENGHINDAR ---
    function dodgeButton() {
        const container = noBtn.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Menentukan posisi acak baru di dalam area kontainer pertanyaan
        const minX = -100;
        const maxX = containerRect.width - noBtn.offsetWidth - 50;
        const minY = -150;
        const maxY = containerRect.height + 50;

        const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
        const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

        noBtn.style.position = "absolute";
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    }

    // Menghindar di kursor desktop maupun sentuhan layar HP
    noBtn.addEventListener("mouseover", dodgeButton);
    noBtn.addEventListener("touchstart", function(e) {
        e.preventDefault();
        dodgeButton();
    });

    // --- HALAMAN 2 -> HALAMAN 3 (SAY YES!) ---
    yesBtn.addEventListener("click", () => {
        // Memicu efek sebaran bentuk Hati di Canvas
        startParticleEffect("heart");
        setTimeout(() => {
            navigateToPage("page2", "page3");
        }, 1000);
    });

    // --- HALAMAN 3 -> HALAMAN 4 ---
    toPage4Btn.addEventListener("click", () => {
        navigateToPage("page3", "page4");
    });

    // --- HALAMAN 4: TIUP LILIN INTERAKTIF ---
    candle.addEventListener("click", function() {
        if (!candle.classList.contains("extinguished")) {
            candle.classList.add("extinguished");
            // Memicu sebaran konfeti perayaan yang ceria
            startParticleEffect("confetti");
            
            // Mengaktifkan tombol menuju halaman terakhir setelah tiup lilin
            toPage5Btn.removeAttribute("disabled");
            toPage5Btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    // --- HALAMAN 4 -> HALAMAN 5 ---
    toPage5Btn.addEventListener("click", () => {
        navigateToPage("page4", "page5");
    });

    // --- HALAMAN 5: BUKA AMPLOP SURAT ---
    envelope.addEventListener("click", function() {
        envelope.classList.toggle("open");
    });

    // --- SISTEM UPLOAD FOTO SECARA INSTAN ---
    function setupPhotoUploader(inputId, imgId) {
        const uploader = document.getElementById(inputId);
        const targetImage = document.getElementById(imgId);

        if (uploader && targetImage) {
            uploader.addEventListener("change", function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        targetImage.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupPhotoUploader("uploadMain", "mainPhoto");
    setupPhotoUploader("uploadMem1", "memImg1");
    setupPhotoUploader("uploadMem2", "memImg2");

    // ================= SISTEM ANIMASI CANVAS (PARTIKEL) =================
    const canvas = document.getElementById("effectCanvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId = null;
    let effectType = "heart"; 

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.size = Math.random() * 12 + 8;
            this.speedX = Math.random() * 8 - 4;
            this.speedY = Math.random() * -10 - 4;
            this.gravity = 0.2;
            this.opacity = 1;
            this.color = type === "heart" 
                ? `hsla(${Math.random() * 20 + 340}, 100%, 70%, `  // Gradasi pink/merah
                : `hsla(${Math.random() * 360}, 90%, 65%, `;     // Gradasi warna-warni pesta
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = Math.random() * 0.1 - 0.05;
        }

        update() {
            this.x += this.speedX;
            this.speedY += this.gravity;
            this.y += this.speedY;
            this.opacity -= 0.015;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            if (this.type === "heart") {
                // Gambar bentuk Hati
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, -this.size/4, -this.size, this.size/4);
                ctx.bezierCurveTo(-this.size, this.size, 0, this.size * 1.5, 0, this.size * 1.8);
                ctx.bezierCurveTo(0, this.size * 1.5, this.size, this.size, this.size, this.size/4);
                ctx.bezierCurveTo(this.size, -this.size/4, this.size/2, -this.size/2, 0, 0);
                ctx.closePath();
                ctx.fillStyle = this.color + "1)";
                ctx.fill();
            } else {
                // Gambar Konfeti Persegi Panjang
                ctx.fillStyle = this.color + "1)";
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            }
            ctx.restore();
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        if (particles.length > 0) {
            animationFrameId = requestAnimationFrame(animateParticles);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrameId);
        }
    }

    function startParticleEffect(type) {
        effectType = type;
        particles = [];
        
        // Tentukan titik semburan dari tengah layar bawah
        const startX = canvas.width / 2;
        const startY = canvas.height * 0.7;

        for (let i = 0; i < 60; i++) {
            particles.push(new Particle(startX, startY, type));
        }

        cancelAnimationFrame(animationFrameId);
        animateParticles();
    }
});
