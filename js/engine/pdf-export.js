import { State } from '../core/state.js';

export const PDFEngine = {
    init() {
        document.getElementById('btn-export').addEventListener('click', () => {
            const element = document.getElementById('cv-paper');
            const opt = {
                margin:       0,
                filename:     `CV_${State.data.name.replace(/\s+/g, '_')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Mengubah tombol menjadi loading
            const btn = document.getElementById('btn-export');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> GENERATING PDF...';
            btn.disabled = true;

            html2pdf().set(opt).from(element).save().then(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });
    }
};
