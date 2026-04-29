class SuratBuilder {
    constructor() {
        this.data = { font: 'font-sans', sig: null };
        this.init();
    }

    init() {
        this.bindTabs();
        this.bindInputs();
        this.bindMedia();
        this.loadLocal();
        this.renderPaper();
    }

    bindTabs() {
        const eBtn = document.getElementById('tab-edit');
        const pBtn = document.getElementById('tab-prev');
        const ePan = document.getElementById('panel-editor');
        const pPan = document.getElementById('panel-preview');

        if(eBtn && pBtn) {
            eBtn.onclick = () => {
                ePan.classList.remove('hidden'); pPan.classList.add('hidden', 'md:flex');
                eBtn.className = "flex-1 py-2 bg-slate-700 text-sky-400 font-bold rounded-lg text-xs border border-slate-600 shadow-md";
                pBtn.className = "flex-1 py-2 text-slate-400 font-bold text-xs";
            };
            pBtn.onclick = () => {
                pPan.classList.remove('hidden'); ePan.classList.add('hidden', 'md:block');
                pBtn.className = "flex-1 py-2 bg-slate-700 text-sky-400 font-bold rounded-lg text-xs border border-slate-600 shadow-md";
                eBtn.className = "flex-1 py-2 text-slate-400 font-bold text-xs";
            };
        }

        document.querySelectorAll('.surat-font').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('.surat-font').forEach(x => x.classList.remove('border-sky-500'));
                b.classList.add('border-sky-500');
                this.data.font = b.dataset.font;
                this.renderPaper();
            };
        });

        document.getElementById('btn-export-surat').onclick = async () => {
            const btn = document.getElementById('btn-export-surat');
            btn.innerHTML = 'MEMPROSES...';
            await html2pdf().set({margin: 0, filename: 'Surat_Lamaran.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }}).from(document.getElementById('surat-paper')).save();
            btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
            setTimeout(() => btn.innerHTML = '<i class="fas fa-file-pdf text-xl"></i> DOWNLOAD PDF SURAT', 2000);
        };
    }

    bindInputs() {
        ['surat-name','surat-title','surat-date','surat-hrd','surat-comp','surat-content'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.oninput = () => { localStorage.setItem(id, el.value); this.renderPaper(); };
        });

        document.getElementById('btn-template').onclick = () => {
            const t = document.getElementById('surat-title').value || "[Posisi]";
            const c = document.getElementById('surat-content');
            c.value = `Dengan hormat,\n\nBerdasarkan informasi lowongan yang tersedia, saya bermaksud melamar untuk posisi ${t} di perusahaan yang Bapak/Ibu pimpin.\n\nSaya memiliki kualifikasi yang relevan, berdedikasi tinggi, dan siap untuk berkontribusi secara maksimal. Sebagai bahan pertimbangan, saya lampirkan dokumen pendukung beserta Curriculum Vitae.\n\nBesar harapan saya untuk dapat diberikan kesempatan wawancara. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.`;
            c.dispatchEvent(new Event('input'));
        };
    }

    bindMedia() {
        const canvas = document.getElementById('surat-sig-pad');
        const ctx = canvas.getContext('2d');
        let draw = false;

        document.getElementById('btn-open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('btn-clear-sig').onclick = () => ctx.clearRect(0,0,canvas.width,canvas.height);
        document.getElementById('btn-save-sig').onclick = () => {
            this.data.sig = canvas.toDataURL();
            localStorage.setItem('surat-sig', this.data.sig);
            document.getElementById('modal-sig').classList.add('hidden');
            this.renderPaper();
        };

        const drawLine = (e) => {
            if(!draw) return; e.preventDefault();
            const r = canvas.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
            ctx.lineWidth = 2; ctx.strokeStyle = '#000';
            ctx.lineTo(x*(canvas.width/r.width), y*(canvas.height/r.height)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x*(canvas.width/r.width), y*(canvas.height/r.height));
        };

        canvas.onmousedown = (e) => { draw = true; drawLine(e); }; canvas.onmousemove = drawLine; canvas.onmouseup = () => { draw = false; ctx.beginPath(); };
        canvas.ontouchstart = (e) => { draw = true; drawLine(e); }; canvas.ontouchmove = drawLine; canvas.ontouchend = () => { draw = false; ctx.beginPath(); };
    }

    loadLocal() {
        ['surat-name','surat-title','surat-date','surat-hrd','surat-comp','surat-content'].forEach(id => {
            if(localStorage.getItem(id)) document.getElementById(id).value = localStorage.getItem(id);
        });
        if(localStorage.getItem('surat-sig')) this.data.sig = localStorage.getItem('surat-sig');
    }

    renderPaper() {
        const p = document.getElementById('surat-paper');
        const d = {
            n: document.getElementById('surat-name').value || "NAMA ANDA",
            date: document.getElementById('surat-date').value || "Jakarta, 29 April 2026",
            hrd: document.getElementById('surat-hrd').value || "Yth. Pimpinan HRD",
            comp: document.getElementById('surat-comp').value || "Perusahaan",
            cont: (document.getElementById('surat-content').value || "Isi surat lamaran...").replace(/\n/g, '<br>')
        };
        p.className = `a4-sheet p-[20mm] ${this.data.font} text-[11pt] leading-relaxed text-slate-900`;
        p.innerHTML = `
            <div class="text-right mb-10">${d.date}</div>
            <div class="font-bold mb-10"><p>${d.hrd}</p><p>${d.comp}</p><p>Di Tempat</p></div>
            <div class="text-justify mb-16">${d.cont}</div>
            <div class="w-56 ml-auto text-center">
                <p class="mb-2">Hormat saya,</p>
                <div class="h-16 flex items-center justify-center">${this.data.sig ? `<img src="${this.data.sig}" class="max-h-full">` : ''}</div>
                <p class="font-bold border-t-2 border-slate-900 mt-2 pt-1 uppercase">${d.n}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', () => { window.appSurat = new SuratBuilder(); });
