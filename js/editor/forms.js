/**
 * MASTER CORE LOGIC v2.0
 * Pure Functionality - Zero Conflict
 */

const initCore = () => {
    console.log("Core System Active.");

    // 1. PDF GENERATOR ENGINE (STABLE)
    const setupDownloader = () => {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            const label = btn.innerText.toLowerCase();
            if (label.includes('cetak') || label.includes('download')) {
                e.preventDefault();
                const element = document.getElementById('preview-container');
                
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> GENERATING...';
                
                const opt = {
                    margin: 0,
                    filename: `CV_Ikram_Professional.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                };

                html2pdf().set(opt).from(element).save().then(() => {
                    btn.innerHTML = originalContent;
                }).catch(err => {
                    console.error("PDF Fail:", err);
                    btn.innerHTML = originalContent;
                    window.print(); // Native fallback
                });
            }
        });
    };

    // 2. INITIALIZE
    setupDownloader();
};

// Run when DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCore);
} else {
    initCore();
}
