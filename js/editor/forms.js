class GodModeCVMagic {
    constructor() {
        this.preview = document.getElementById('cv-preview');
        this.fields = ['in-name', 'in-title', 'in-email', 'in-phone', 'in-github', 'in-location', 'in-content', 'sel-theme', 'sel-font'];
        
        this.loadData();
        this.initSync();
        this.initDesign();
        this.initParser();
        this.initMedia();
        this.initTemplateOffline(); // Pengganti AI
        this.initAutoSave();
        
        document.getElementById('btn-pdf')?.addEventListener('click', () => this.generatePDF());
    }

    initAutoSave() {
        this.fields.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.addEventListener('input', () => localStorage.setItem(`cv_magic_${id}`, el.value));
        });
    }

    loadData() {
        this.fields.forEach(id => {
            const el = document.getElementById(id);
            const saved = localStorage.getItem(`cv_magic_${id}`);
            if(el && saved) {
                el.value = saved;
                setTimeout(() => el.dispatchEvent(new Event('input')), 50);
            }
        });
    }

    initSync() {
        const map = {
            'in-name': ['out-name', 'out-name-sig'], 'in-title': ['out-title'], 
            'in-email': ['out-email'], 'in-phone': ['out-phone'], 
            'in-github': ['out-github'], 'in-location': ['out-location']
        };
        for (const [inId, outIds] of Object.entries(map)) {
            const input = document.getElementById(inId);
            input?.addEventListener('input', () => {
                outIds.forEach(id => {
                    const out = document.getElementById(id);
                    if(out) out.textContent = input.value;
                });
            });
        }
    }

    initDesign() {
        const selTheme = document.getElementById('sel-theme');
        const selFont = document.getElementById('sel-font');
        selTheme?.addEventListener('change', (e) => this.preview.className = `origin-top transition-transform duration-300 ${selFont.value} ${e.target.value}`);
        selFont?.addEventListener('change', (e) => this.preview.className = `origin-top transition-transform duration-300 ${e.target.value} ${selTheme.value}`);
    }

    initParser() {
        const tArea = document.getElementById('in-content');
        const out = document.getElementById('out-content');
        tArea?.addEventListener('input', () => {
            let txt = tArea.value.replace(/---PAGE_BREAK---/g, '<div class="html2pdf__page-break page-divider"></div>');
            txt = txt.replace(/\n/g, '<br>');
            out.innerHTML = txt || 'Dokumen kosong...';
        });

        document.getElementById('btn-pagebreak')?.addEventListener('click', () => {
            if(!tArea) return;
            const start = tArea.selectionStart;
            tArea.value = tArea.value.substring(0, start) + "\n\n---PAGE_BREAK---\n\n" + tArea.value.substring(start);
            tArea.dispatchEvent(new Event('input'));
            tArea.focus();
        });
    }

    initMedia() {
        document.getElementById('in-photo')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = document.getElementById('out-photo');
                    img.src = ev.target.result; img.classList.remove('hidden');
                    document.getElementById('photo-placeholder')?.classList.add('hidden');
                    localStorage.setItem('cv_magic_photo', ev.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        const savedPhoto = localStorage.getItem('cv_magic_photo');
        if(savedPhoto) {
            const img = document.getElementById('out-photo');
            if(img) { img.src = savedPhoto; img.classList.remove('hidden'); document.getElementById('photo-placeholder')?.classList.add('hidden'); }
        }

        const canvas = document.getElementById('sig-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const outSig = document.getElementById('out-sig');
        let isDrawing = false, isRotated = false;

        const start = (e) => { isDrawing = true; draw(e); };
        const stop = () => { 
            isDrawing = false; ctx.beginPath(); 
            if(outSig) { 
                const dataUrl = canvas.toDataURL();
                outSig.src = dataUrl; outSig.classList.remove('hidden'); 
                localStorage.setItem('cv_magic_sig', dataUrl); 
            }
        };
        const draw = (e) => {
            if(!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
            ctx.lineTo((cx - rect.left) * (canvas.width / rect.width), (cy - rect.top) * (canvas.height / rect.height));
            ctx.stroke(); ctx.beginPath(); ctx.moveTo((cx - rect.left) * (canvas.width / rect.width), (cy - rect.top) * (canvas.height / rect.height));
        };

        canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop); canvas.addEventListener('mouseout', stop);
        canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', draw, {passive:false});
        canvas.addEventListener('touchend', stop);

        const savedSig = localStorage.getItem('cv_magic_sig');
        if(savedSig && outSig) { outSig.src = savedSig; outSig.classList.remove('hidden'); }

        document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(outSig) { outSig.src = ''; outSig.classList.add('hidden'); }
            localStorage.removeItem('cv_magic_sig');
        });
        document.getElementById('btn-rotate-sig')?.addEventListener('click', () => {
            isRotated = !isRotated;
            if(outSig) outSig.classList.toggle('rotate-90', isRotated);
        });
    }

    // --- FITUR BARU: TEMPLATE SULTAN OFFLINE (GAK PAKE GOOGLE AI) ---
    initTemplateOffline() {
        const btnTemplate = document.getElementById('btn-ai-generate');
        const inPrompt = document.getElementById('ai-prompt');
        const inContent = document.getElementById('in-content');

        btnTemplate?.addEventListener('click', () => {
            const job = inPrompt.value.trim() || "Posisi yang Tersedia";
            const name = document.getElementById('in-name').value || "[Nama Anda]";
            const phone = document.getElementById('in-phone').value || "[No HP]";
            const email = document.getElementById('in-email').value || "[Email]";

            // Template langsung ditanam di sini, 0% gagal.
            const template = `Hal: Lamaran Pekerjaan - ${job}\n\nYth. HRD Manager / Pimpinan Perusahaan\nDi Tempat\n\nDengan hormat,\n\nBerdasarkan informasi lowongan pekerjaan yang tersedia, saya yang bertanda tangan di bawah ini:\n\nNama: ${name}\nNomor HP: ${phone}\nEmail: ${email}\n\nBermaksud mengajukan diri untuk mengisi posisi sebagai **${job}** di instansi/perusahaan yang Bapak/Ibu pimpin. Saya memiliki latar belakang pendidikan yang relevan, dedikasi tinggi, siap bekerja keras, serta mampu bekerja sama dalam tim maupun individu.\n\nSebagai bahan pertimbangan, bersama surat ini turut saya lampirkan Curriculum Vitae (CV) pada halaman berikutnya.\n\nBesar harapan saya untuk dapat diberikan kesempatan wawancara agar dapat menjelaskan lebih detail mengenai kualifikasi dan potensi yang saya miliki.\n\nAtas perhatian dan waktu yang Bapak/Ibu berikan, saya ucapkan terima kasih.\n\n---PAGE_BREAK---\n\n**CURRICULUM VITAE (CV)**\n\n*Silakan hapus teks ini dan isi detail riwayat pendidikan serta pengalaman kerja Anda di sini...*`;

            const oriBtn = btnTemplate.innerHTML;
            btnTemplate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMUAT TEMPLATE...';
            
            setTimeout(() => {
                inContent.value = template;
                inContent.dispatchEvent(new Event('input')); // Tembak langsung ke kertas
                
                btnTemplate.innerHTML = '<i class="fas fa-check"></i> TEMPLATE BERHASIL DIMUAT!';
                setTimeout(() => btnTemplate.innerHTML = oriBtn, 2000);
            }, 500); // Simulasi loading 0.5 detik biar kerasa smooth
        });
    }

    async generatePDF() {
        const btn = document.getElementById('btn-pdf');
        const oriBtn = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> EXPORTING PDF...';

        try {
            await html2pdf().set({
                margin: 0, filename: 'CV_Magic_Sultan.pdf', image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            }).from(this.preview).save();
            btn.innerHTML = '<i class="fas fa-check"></i> PDF SIAP, BOS!';
        } catch (err) {
            window.print();
        } finally {
            setTimeout(() => { btn.innerHTML = oriBtn; btn.disabled = false; }, 2000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new GodModeCVMagic());
