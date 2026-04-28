class UltimateCVMagic {
    constructor() {
        this.preview = document.getElementById('cv-preview');
        this.fields = ['in-name', 'in-title', 'in-email', 'in-phone', 'in-github', 'in-location', 'in-content', 'sel-theme', 'sel-font'];
        
        this.loadData();
        this.initSync();
        this.initDesign();
        this.initParser();
        this.initMedia();
        this.initTemplate();
        this.initAutoSave();
        
        document.getElementById('btn-pdf')?.addEventListener('click', () => this.generatePDF());
    }

    initAutoSave() {
        this.fields.forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => localStorage.setItem(`cv_${id}`, document.getElementById(id).value));
        });
    }

    loadData() {
        this.fields.forEach(id => {
            const saved = localStorage.getItem(`cv_${id}`);
            if(saved && document.getElementById(id)) {
                document.getElementById(id).value = saved;
                setTimeout(() => document.getElementById(id).dispatchEvent(new Event('input')), 50);
            }
        });
    }

    initSync() {
        const map = {
            'in-name': ['out-name', 'out-name-sig'], 'in-title': ['out-title'], 
            'in-email': ['out-email'], 'in-phone': ['out-phone'], 
            'in-github': ['out-github'], 'in-location': ['out-location']
        };
        for (const [inId, outIds] of Object.entries(map)) {
            document.getElementById(inId)?.addEventListener('input', (e) => {
                outIds.forEach(id => { if(document.getElementById(id)) document.getElementById(id).textContent = e.target.value; });
            });
        }
    }

    initDesign() {
        const selT = document.getElementById('sel-theme');
        const selF = document.getElementById('sel-font');
        const update = () => this.preview.className = `origin-top transition-transform duration-300 ${selF.value} ${selT.value}`;
        selT?.addEventListener('change', update);
        selF?.addEventListener('change', update);
    }

    initParser() {
        const tArea = document.getElementById('in-content');
        const out = document.getElementById('out-content');
        tArea?.addEventListener('input', () => {
            let txt = tArea.value.replace(/---PAGE_BREAK---/g, '<div class="html2pdf__page-break page-divider"></div>');
            txt = txt.replace(/\n/g, '<br>');
            out.innerHTML = txt;
        });
        document.getElementById('btn-pagebreak')?.addEventListener('click', () => {
            const start = tArea.selectionStart;
            tArea.value = tArea.value.substring(0, start) + "\n\n---PAGE_BREAK---\n\n" + tArea.value.substring(start);
            tArea.dispatchEvent(new Event('input'));
        });
    }

    initMedia() {
        document.getElementById('in-photo')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('out-photo').src = ev.target.result;
                    document.getElementById('out-photo').classList.remove('hidden');
                    document.getElementById('photo-placeholder').classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        const canvas = document.getElementById('sig-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const outSig = document.getElementById('out-sig');
        let isDrawing = false, isRotated = false;

        const start = (e) => { isDrawing = true; draw(e); };
        const stop = () => { isDrawing = false; ctx.beginPath(); outSig.src = canvas.toDataURL(); outSig.classList.remove('hidden'); };
        const draw = (e) => {
            if(!isDrawing) return; e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
            ctx.lineTo((cx - rect.left) * (canvas.width/rect.width), (cy - rect.top) * (canvas.height/rect.height));
            ctx.stroke(); ctx.beginPath(); ctx.moveTo((cx - rect.left) * (canvas.width/rect.width), (cy - rect.top) * (canvas.height/rect.height));
        };
        canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop); canvas.addEventListener('touchstart', start, {passive:false});
        canvas.addEventListener('touchmove', draw, {passive:false}); canvas.addEventListener('touchend', stop);

        document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
            ctx.clearRect(0,0,canvas.width,canvas.height); outSig.src = ''; outSig.classList.add('hidden');
        });
        document.getElementById('btn-rotate-sig')?.addEventListener('click', () => {
            isRotated = !isRotated; outSig.classList.toggle('rotate-90', isRotated);
        });
    }

    initTemplate() {
        document.getElementById('btn-template')?.addEventListener('click', () => {
            const name = document.getElementById('in-name').value || "[Nama]";
            const job = document.getElementById('in-title').value || "[Posisi]";
            const txt = `Hal: Lamaran Pekerjaan\n\nYth. HRD Manager\nDi Tempat\n\nDengan hormat,\nSaya yang bertanda tangan di bawah ini, ${name}, bermaksud melamar sebagai ${job}. Saya memiliki kualifikasi yang relevan dan siap berkontribusi.\n\nTerima kasih.\n\n---PAGE_BREAK---\n\nCURRICULUM VITAE\n\nDetail riwayat hidup...`;
            document.getElementById('in-content').value = txt;
            document.getElementById('in-content').dispatchEvent(new Event('input'));
        });
    }

    async generatePDF() {
        const btn = document.getElementById('btn-pdf');
        btn.innerHTML = 'MEMPROSES...';
        html2pdf().set({
            margin: 0, filename: 'CV_Magic_Final.pdf', image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        }).from(this.preview).save().then(() => btn.innerHTML = 'DOWNLOAD BERHASIL');
    }
}
document.addEventListener('DOMContentLoaded', () => new UltimateCVMagic());
