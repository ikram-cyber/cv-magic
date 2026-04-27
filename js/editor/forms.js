/**
 * CV-MAGIC MASTER JS v2.1
 * Logic: Single-Instance Download Engine
 */

const AppCore = {
    init() {
        this.setupDownload();
        console.log("System Ready & Stable.");
    },

    setupDownload() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const text = btn.innerText.toLowerCase();
            if (text.includes('cetak') || text.includes('download')) {
                this.executePDF(btn);
            }
        });
    },

    executePDF(btn) {
        const target = document.getElementById('preview-container');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROSES...';
        btn.disabled = true;

        const config = {
            margin: 0,
            filename: 'CV_Ikram_Final.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(config).from(target).save().then(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }).catch(err => {
            console.error(err);
            btn.innerHTML = originalText;
            btn.disabled = false;
            window.print();
        });
    }
};

// Start dengan aman
window.onload = () => AppCore.init();
