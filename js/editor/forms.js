/**
 * CV MAGIC - FINAL MASTER CLASS v4.0
 * Zero Conflict Architecture - Features Restored
 */

class CVMaster {
    constructor() {
        this.btn = document.getElementById('btn-pdf');
        this.preview = document.getElementById('cv-preview');
        
        // Setup Module
        this.initSync();
        this.initPhoto();
        this.initSignature();
        
        // Setup PDF Download
        if(this.btn) this.btn.addEventListener('click', () => this.downloadPDF());
        
        console.log("CV Magic Final Ready: Sync, Photo, & Signature Active.");
    }

    // 1. SINKRONISASI TEKS
    initSync() {
        const fields = {
            'in-name': ['out-name', 'out-name-sig'], // Sinkron ke 2 tempat (Header & Bawah TTD)
            'in-title': ['out-title'],
            'in-email': ['out-email'],
            'in-phone': ['out-phone'],
            'in-github': ['out-github'],
            'in-location': ['out-location'],
            'in-content': ['out-content']
        };

        Object.keys(fields).forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('input', () => {
                fields[id].forEach(outId => {
                    const output = document.getElementById(outId);
                    if(output) output.textContent = input.value;
                });
            });
        });
    }

    // 2. LOGIKA UPLOAD FOTO
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

    // 3. LOGIKA TANDA TANGAN (CANVAS)
    initSignature() {
        const canvas = document.getElementById('sig-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const btnClear = document.getElementById('btn-clear-sig');
        const outSig = document.getElementById('out-sig');
        
        if(!canvas || !ctx) return;

        let isDrawing = false;

        const startDrawing = (e) => {
            isDrawing = true;
            draw(e);
        };

        const stopDrawing = () => {
            isDrawing = false;
            ctx.beginPath();
            updateSignatureImg(); // Otomatis taruh ke A4 saat selesai gores
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault(); // Mencegah layar nyekrol

            // Handle touch vs mouse
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            // Hitung skala canvas karena di CSS mungkin ukurannya menyesuaikan
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#0f172a';

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        // Event Listeners (Mouse & Touch)
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        canvas.addEventListener('touchend', stopDrawing);

        // Update ke Kertas A4
        const updateSignatureImg = () => {
            outSig.src = canvas.toDataURL();
            outSig.classList.remove('hidden');
        };

        // Tombol Hapus TTD
        if(btnClear) {
            btnClear.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                outSig.classList.add('hidden');
                outSig.src = '';
            });
        }
    }

    // 4. MESIN DOWNLOAD PDF
    async downloadPDF() {
        const originalText = this.btn.innerHTML;
        this.btn.disabled = true;
        this.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING...';

        const opt = {
            margin: 0,
            filename: 'Dokumen_Lengkap_Ikram.pdf',
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
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new CVMaster());
