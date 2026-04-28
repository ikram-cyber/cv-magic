/**
 * CV MAGIC - MODULAR CONTROLLER 100%
 * No Conflicts - Pure Sync Logic
 */

class CVMaster {
    constructor() {
        this.fields = {
            'in-name': 'out-name',
            'in-title': 'out-title',
            'in-email': 'out-email',
            'in-phone': 'out-phone',
            'in-github': 'out-github',
            'in-location': 'out-location',
            'in-content': 'out-content'
        };
        
        this.btn = document.getElementById('btn-pdf');
        this.preview = document.getElementById('cv-preview');
        
        this.init();
    }

    init() {
        // Bind Sinkronisasi Otomatis
        Object.keys(this.fields).forEach(id => {
            const input = document.getElementById(id);
            const output = document.getElementById(this.fields[id]);
            
            if (input && output) {
                input.addEventListener('input', () => {
                    output.textContent = input.value || output.getAttribute('data-placeholder');
                });
            }
        });

        // Bind Tombol PDF
        if (this.btn) {
            this.btn.addEventListener('click', () => this.downloadPDF());
        }

        console.log("CV Magic Final Ready.");
    }

    async downloadPDF() {
        const originalText = this.btn.innerHTML;
        this.btn.disabled = true;
        this.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING...';

        const opt = {
            margin: 0,
            filename: 'CV_Ikram_Professional.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await html2pdf().set(opt).from(this.preview).save();
            this.btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL!';
        } catch (err) {
            console.error(err);
            window.print(); // Fallback
        } finally {
            setTimeout(() => {
                this.btn.disabled = false;
                this.btn.innerHTML = originalText;
            }, 3000);
        }
    }
}

// Jalankan
document.addEventListener('DOMContentLoaded', () => new CVMaster());
