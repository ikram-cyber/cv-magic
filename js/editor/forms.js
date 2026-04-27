/**
 * CV-MAGIC CORE ENGINE v2.0 
 * Zero Conflict - High Performance
 */

const CVApp = {
    init() {
        console.log("System 100% Online.");
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const text = btn.innerText.toLowerCase();
            
            // Logika Tunggal Cetak/Download
            if (text.includes('cetak') || text.includes('download')) {
                this.handleDownload(btn);
            }
        });
    },

    handleDownload(btn) {
        const element = document.getElementById('preview-container');
        if (!element) return;

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING PDF...';
        btn.disabled = true;

        const opt = {
            margin: 0,
            filename: 'CV_Professional_Ikram.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }).catch(err => {
            console.error("PDF Engine Error:", err);
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            window.print(); // Native Fallback
        });
    }
};

// Start Engine
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CVApp.init());
} else {
    CVApp.init();
}

/* AKTIVASI TOMBOL CETAK */
document.addEventListener('click', function(e) {
    if(e.target.closest('button') && e.target.closest('button').innerText.toLowerCase().includes('cetak')) {
        window.print();
    }
});
