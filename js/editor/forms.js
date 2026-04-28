class CleanCVMagic {
    constructor() {
        this.preview = document.getElementById('cv-preview');
        this.initSync();
        this.initPhoto();
        this.initCanvas();
        document.getElementById('btn-pdf')?.addEventListener('click', () => this.generatePDF());
    }

    initSync() {
        const fields = {
            'in-name': ['out-name', 'out-name-sig'], 'in-title': ['out-title'],
            'in-email': ['out-email'], 'in-phone': ['out-phone'],
            'in-github': ['out-github'], 'in-location': ['out-location'],
            'in-content': ['out-content']
        };
        for (const [inId, outIds] of Object.entries(fields)) {
            document.getElementById(inId)?.addEventListener('input', (e) => {
                outIds.forEach(id => {
                    const out = document.getElementById(id);
                    if(out) out.textContent = e.target.value;
                });
            });
        }
    }

    initPhoto() {
        document.getElementById('in-photo')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('out-photo').src = ev.target.result;
                    document.getElementById('out-photo').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    initCanvas() {
        const canvas = document.getElementById('sig-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const outSig = document.getElementById('out-sig');
        let isDrawing = false;

        const start = (e) => { isDrawing = true; draw(e); };
        const stop = () => { isDrawing = false; ctx.beginPath(); if(outSig){ outSig.src = canvas.toDataURL(); outSig.classList.remove('hidden'); }};
        const draw = (e) => {
            if(!isDrawing) return; e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
            ctx.lineTo((cx - rect.left) * (canvas.width / rect.width), (cy - rect.top) * (canvas.height / rect.height));
            ctx.stroke(); ctx.beginPath(); ctx.moveTo((cx - rect.left) * (canvas.width / rect.width), (cy - rect.top) * (canvas.height / rect.height));
        };

        canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop); canvas.addEventListener('mouseout', stop);
        canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', draw, {passive:false}); canvas.addEventListener('touchend', stop);

        document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(outSig) { outSig.src = ''; outSig.classList.add('hidden'); }
        });
    }

    async generatePDF() {
        const btn = document.getElementById('btn-pdf');
        btn.innerHTML = 'MEMPROSES...';
        html2pdf().set({
            margin: 0, filename: 'Dokumen.pdf', image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(this.preview).save().then(() => btn.innerHTML = 'DOWNLOAD PDF');
    }
}
document.addEventListener('DOMContentLoaded', () => new CleanCVMagic());
