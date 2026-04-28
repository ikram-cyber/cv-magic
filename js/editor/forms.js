/**
 * CV MAGIC CORE ENGINE v3.0
 * Pure JS - Isolated Logic
 */

class CVMagic {
    constructor() {
        this.input = document.getElementById('main-input');
        this.output = document.getElementById('output-content');
        this.btnDownload = document.getElementById('btn-download');
        this.preview = document.getElementById('capture-area');

        this.init();
    }

    init() {
        // Live Sync
        if (this.input && this.output) {
            this.input.addEventListener('input', (e) => {
                this.output.textContent = e.target.value;
            });
        }

        // PDF Trigger
        if (this.btnDownload) {
            this.btnDownload.addEventListener('click', () => this.generatePDF());
        }

        console.log("System Initialized: 100%");
    }

    async generatePDF() {
        const originalText = this.btnDownload.innerHTML;
        
        // Status Loading
        this.btnDownload.disabled = true;
        this.btnDownload.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> MEMPROSES PDF...';

        const opt = {
            margin: 0,
            filename: 'Dokumen_Ikram_Final.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await html2pdf().set(opt).from(this.preview).save();
            this.btnDownload.innerHTML = '<i class="fas fa-check"></i> BERHASIL DIUNDUH';
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan. Mengalihkan ke mode cetak sistem.");
            window.print();
        } finally {
            setTimeout(() => {
                this.btnDownload.disabled = false;
                this.btnDownload.innerHTML = originalText;
            }, 3000);
        }
    }
}

// Start Engine
document.addEventListener('DOMContentLoaded', () => new CVMagic());
