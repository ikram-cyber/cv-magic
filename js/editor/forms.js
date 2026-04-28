/**
 * CV MAGIC - ULTIMATE MASTER CLASS v5.0
 * Zero Conflict - Full Features Included
 */

class CVMaster {
    constructor() {
        this.btn = document.getElementById('btn-pdf');
        this.preview = document.getElementById('cv-preview');
        
        this.initSync();
        this.initPhoto();
        this.initSignature();
        this.initToolbar();
        
        if(this.btn) this.btn.addEventListener('click', () => this.downloadPDF());
        console.log("Ultimate Engine Online.");
    }

    // 1. SINKRONISASI TEKS (Dengan Smart Parser)
    initSync() {
        const fields = {
            'in-name': ['out-name', 'out-name-sig'],
            'in-title': ['out-title'],
            'in-email': ['out-email'],
            'in-phone': ['out-phone'],
            'in-github': ['out-github'],
            'in-location': ['out-location']
        };

        // Sync Data Singkat
        Object.keys(fields).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    fields[id].forEach(outId => {
                        const output = document.getElementById(outId);
                        if(output) output.textContent = input.value;
                    });
                });
            }
        });

        // Sync Area Teks Besar (Parsing Enter & Page Break)
        const inContent = document.getElementById('in-content');
        const outContent = document.getElementById('out-content');
        if (inContent && outContent) {
            inContent.addEventListener('input', () => {
                let text = inContent.value;
                
                // Ubah tanda unik menjadi elemen pemisah halaman
                text = text.replace(/---PAGE_BREAK---/g, '<div class="html2pdf__page-break page-divider"></div>');
                
                // Ubah enter menjadi br (karena kita pakai innerHTML sekarang)
                text = text.replace(/\n/g, '<br>');
                
                outContent.innerHTML = text || 'Isi dokumen Anda akan muncul di sini...';
            });
        }
    }

    // 2. TOOLBAR EDITOR (Pemisah Halaman)
    initToolbar() {
        const btnBreak = document.getElementById('btn-pagebreak');
        const inContent = document.getElementById('in-content');

        if (btnBreak && inContent) {
            btnBreak.addEventListener('click', () => {
                // Suntikkan kode pemisah di posisi kursor
                const start = inContent.selectionStart;
                const end = inContent.selectionEnd;
                const text = inContent.value;
                const before = text.substring(0, start);
                const after  = text.substring(end, text.length);
                
                inContent.value = before + "\n---PAGE_BREAK---\n" + after;
                
                // Trigger event input agar layar kanan update
                inContent.dispatchEvent(new Event('input'));
                inContent.focus();
            });
        }
    }

    // 3. LOGIKA FOTO
    initPhoto() {
        const inputPhoto = document.getElementById('in-photo');
        const outPhoto = document.getElementById('out-photo');
        const placeholder = document.getElementById('photo-placeholder');

        if(inputPhoto && outPhoto) {
            inputPhoto.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if(file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        outPhoto.src = e.target.result;
                        outPhoto.classList.remove('hidden');
                        placeholder.classList.add('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // 4. LOGIKA TTD (Draw, Hapus, Putar)
    initSignature() {
        const canvas = document.getElementById('sig-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const outSig = document.getElementById('out-sig');
        
        if(!canvas || !ctx) return;

        let isDrawing = false;
        let isRotated = false;

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = (clientX - rect.left) * (canvas.width / rect.width);
            const y = (clientY - rect.top) * (canvas.height / rect.height);

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#0f172a';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => { isDrawing = false; ctx.beginPath(); outSig.src = canvas.toDataURL(); outSig.classList.remove('hidden'); });
        
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; draw(e); }, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        canvas.addEventListener('touchend', () => { isDrawing = false; ctx.beginPath(); outSig.src = canvas.toDataURL(); outSig.classList.remove('hidden'); });

        // Tombol Hapus
        document.getElementById('btn-clear-sig').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            outSig.classList.add('hidden');
            outSig.src = '';
        });

        // Tombol Putar (Biar Landscape/Portrait aman)
        document.getElementById('btn-rotate-sig').addEventListener('click', () => {
            isRotated = !isRotated;
            if(isRotated) {
                outSig.classList.add('rotate-90');
            } else {
                outSig.classList.remove('rotate-90');
            }
        });
    }

    // 5. PDF ENGINE
    async downloadPDF() {
        const originalText = this.btn.innerHTML;
        this.btn.disabled = true;
        this.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROSES SULTAN...';

        const opt = {
            margin: 0,
            filename: 'CV_CoverLetter_Ikram.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(this.preview).save();
            this.btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
        } catch (err) {
            console.error(err);
            window.print();
        } finally {
            setTimeout(() => {
                this.btn.disabled = false;
                this.btn.innerHTML = originalText;
            }, 2000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new CVMaster());
