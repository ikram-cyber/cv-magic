/**
 * CV MAGIC PRO - ULTIMATE LOGIC
 * Semua fitur aktif, zero conflict.
 */

class CVMagicPro {
    constructor() {
        this.btnPdf = document.getElementById('btn-pdf');
        this.preview = document.getElementById('cv-preview');
        
        this.initTextSync();
        this.initContentParser();
        this.initPhotoUpload();
        this.initSignaturePad();
        
        if (this.btnPdf) {
            this.btnPdf.addEventListener('click', () => this.generatePDF());
        }
        
        console.log("CV Magic Pro: Semua Fitur Siap Tempur!");
    }

    // 1. SINKRONISASI TEKS SINGKAT (Identitas & Kontak)
    initTextSync() {
        const fields = {
            'in-name': ['out-name', 'out-name-sig'],
            'in-title': ['out-title'],
            'in-email': ['out-email'],
            'in-phone': ['out-phone'],
            'in-github': ['out-github'],
            'in-location': ['out-location']
        };

        Object.keys(fields).forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('input', () => {
                fields[id].forEach(outId => {
                    const output = document.getElementById(outId);
                    if (output) output.textContent = input.value;
                });
            });
        });
    }

    // 2. PARSER KONTEN (Teks Panjang + Page Break)
    initContentParser() {
        const inputContent = document.getElementById('in-content');
        const outputContent = document.getElementById('out-content');
        const btnBreak = document.getElementById('btn-pagebreak');

        if (inputContent && outputContent) {
            // Live update text
            inputContent.addEventListener('input', () => {
                let text = inputContent.value;
                // Ubah tanda unik jadi elemen potong kertas
                text = text.replace(/---PAGE_BREAK---/g, '<div class="html2pdf__page-break page-divider"></div>');
                // Ubah enter jadi baris baru di HTML
                text = text.replace(/\n/g, '<br>');
                outputContent.innerHTML = text || 'Isi dokumen Anda akan muncul di sini...';
            });
        }

        // Tombol Suntik Kode Page Break
        if (btnBreak && inputContent) {
            btnBreak.addEventListener('click', () => {
                const start = inputContent.selectionStart;
                const text = inputContent.value;
                // Selipkan kode di tempat kursor berada
                inputContent.value = text.substring(0, start) + "\n\n---PAGE_BREAK---\n\n" + text.substring(start);
                // Paksa trigger update ke layar kanan
                inputContent.dispatchEvent(new Event('input'));
                inputContent.focus();
            });
        }
    }

    // 3. UPLOAD FOTO PROFIL
    initPhotoUpload() {
        const inputPhoto = document.getElementById('in-photo');
        const outPhoto = document.getElementById('out-photo');
        const placeholder = document.getElementById('photo-placeholder');

        if (inputPhoto && outPhoto) {
            inputPhoto.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        outPhoto.src = event.target.result;
                        outPhoto.classList.remove('hidden');
                        if (placeholder) placeholder.classList.add('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // 4. KANVAS TANDA TANGAN (Touch, Mouse, Putar, Hapus)
    initSignaturePad() {
        const canvas = document.getElementById('sig-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const outSig = document.getElementById('out-sig');
        let isDrawing = false;
        let isRotated = false;

        const startDraw = (e) => { isDrawing = true; draw(e); };
        const stopDraw = () => { 
            isDrawing = false; 
            ctx.beginPath(); 
            // Langsung lempar ke kertas A4 tiap beres gores
            if (outSig) {
                outSig.src = canvas.toDataURL();
                outSig.classList.remove('hidden');
            }
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault(); // Biar layar HP gak kegeser

            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = (clientX - rect.left) * (canvas.width / rect.width);
            const y = (clientY - rect.top) * (canvas.height / rect.height);

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#0f172a'; // Warna tinta gelap
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        // Event Mouse
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseout', stopDraw);

        // Event Touch (HP)
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDraw);

        // Tombol Hapus
        const btnClear = document.getElementById('btn-clear-sig');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (outSig) {
                    outSig.src = '';
                    outSig.classList.add('hidden');
                }
            });
        }

        // Tombol Putar
        const btnRotate = document.getElementById('btn-rotate-sig');
        if (btnRotate) {
            btnRotate.addEventListener('click', () => {
                isRotated = !isRotated;
                if (outSig) {
                    if (isRotated) outSig.classList.add('rotate-90');
                    else outSig.classList.remove('rotate-90');
                }
            });
        }
    }

    // 5. EKSEKUSI CETAK PDF
    async generatePDF() {
        const originalBtnHTML = this.btnPdf.innerHTML;
        this.btnPdf.disabled = true;
        this.btnPdf.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> MEMPROSES PDF...';

        const opt = {
            margin: 0,
            filename: 'Berkas_Lamaran_Ikram.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            // Ini kunci biar page break jalan!
            pagebreak: { mode: ['css', 'legacy'] } 
        };

        try {
            await html2pdf().set(opt).from(this.preview).save();
            this.btnPdf.innerHTML = '<i class="fas fa-check"></i> BERHASIL DIUNDUH';
        } catch (error) {
            console.error("PDF Gagal:", error);
            alert("Sistem PDF utama sibuk. Membuka mode cetak bawaan HP...");
            window.print();
        } finally {
            setTimeout(() => {
                this.btnPdf.disabled = false;
                this.btnPdf.innerHTML = originalBtnHTML;
            }, 3000);
        }
    }
}

// Nyalakan Mesin Saat Layar Siap
document.addEventListener('DOMContentLoaded', () => new CVMagicPro());
