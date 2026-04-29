class SuratBuilder {
    constructor() {
        this.data = { font: 'font-sans', theme: 'theme-sky', sig: null };
        this.init();
    }

    init() {
        this.loadLocal();
        this.bindTabs();
        this.bindInputs();
        this.bindMedia();
        this.renderPaper();
        this.updateDesignUI();
    }

    bindTabs() {
        const eBtn = document.getElementById('tab-edit'); const pBtn = document.getElementById('tab-prev');
        const ePan = document.getElementById('panel-editor'); const pPan = document.getElementById('panel-preview');

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
            b.onclick = () => { this.data.font = b.dataset.font; localStorage.setItem('surat-font', this.data.font); this.updateDesignUI(); this.renderPaper(); };
        });

        document.querySelectorAll('.surat-theme').forEach(b => {
            b.onclick = () => { this.data.theme = b.dataset.theme; localStorage.setItem('surat-theme', this.data.theme); this.updateDesignUI(); this.renderPaper(); };
        });

        const btnReset = document.getElementById('btn-reset');
        if(btnReset) {
            btnReset.onclick = () => {
                if(confirm("Yakin mau hapus data surat lamaran?")) {
                    ['surat-name','surat-title','surat-date','surat-hrd','surat-comp','surat-content'].forEach(id => localStorage.removeItem(id));
                    localStorage.removeItem('surat-sig');
                    location.reload();
                }
            };
        }

        document.getElementById('btn-export-surat').onclick = async () => {
            const btn = document.getElementById('btn-export-surat'); btn.innerHTML = 'MEMPROSES...';
            // RESOLUSI TINGGI UNTUK SURAT
            await html2pdf().set({margin: 0, filename: 'Surat_Lamaran.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 3, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }}).from(document.getElementById('surat-paper')).save();
            btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
            setTimeout(() => btn.innerHTML = '<i class="fas fa-file-pdf text-xl"></i> DOWNLOAD PDF SURAT', 2000);
        };
    }

    updateDesignUI() {
        document.querySelectorAll('.surat-font').forEach(x => {
            x.classList.toggle('border-sky-500', x.dataset.font === this.data.font);
            x.classList.toggle('border-transparent', x.dataset.font !== this.data.font);
        });
        document.querySelectorAll('.surat-theme').forEach(x => {
            x.classList.toggle('border-white', x.dataset.theme === this.data.theme);
            x.classList.toggle('ring-2', x.dataset.theme === this.data.theme);
            x.classList.toggle('ring-sky-500', x.dataset.theme === this.data.theme);
            x.classList.toggle('border-transparent', x.dataset.theme !== this.data.theme);
        });
    }

    bindInputs() {
        ['surat-name','surat-title','surat-date','surat-hrd','surat-comp','surat-content'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.oninput = () => { localStorage.setItem(id, el.value); this.renderPaper(); };
        });

        const btnTemp = document.getElementById('btn-template');
        if(btnTemp) {
            btnTemp.onclick = () => {
                const t = document.getElementById('surat-title').value || "[Posisi]";
                const c = document.getElementById('surat-content');
                c.value = `Dengan hormat,\n\nBerdasarkan informasi lowongan yang tersedia, saya bermaksud mengajukan diri untuk melamar posisi ${t} di perusahaan yang Bapak/Ibu pimpin.\n\nSaya memiliki kualifikasi yang relevan, berdedikasi tinggi, siap bekerja keras, dan mampu berkolaborasi dengan baik dalam tim. Sebagai bahan pertimbangan, saya lampirkan Curriculum Vitae (CV) beserta dokumen pendukung lainnya pada lampiran terpisah.\n\nBesar harapan saya untuk dapat mengikuti tahapan seleksi selanjutnya. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.`;
                c.dispatchEvent(new Event('input'));
            };
        }
    }

    bindMedia() {
        const canvas = document.getElementById('surat-sig-pad');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let draw = false;

        document.getElementById('btn-open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('btn-clear-sig').onclick = () => ctx.clearRect(0,0,canvas.width,canvas.height);
        document.getElementById('btn-save-sig').onclick = () => {
            this.data.sig = canvas.toDataURL(); localStorage.setItem('surat-sig', this.data.sig);
            document.getElementById('modal-sig').classList.add('hidden'); this.renderPaper();
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
        if(localStorage.getItem('surat-font')) this.data.font = localStorage.getItem('surat-font');
        if(localStorage.getItem('surat-theme')) this.data.theme = localStorage.getItem('surat-theme');
    }

    renderPaper() {
        const p = document.getElementById('surat-paper');
        if(!p) return;
        const d = {
            n: document.getElementById('surat-name').value || "NAMA ANDA", date: document.getElementById('surat-date').value || "Jakarta, 29 April 2026",
            hrd: document.getElementById('surat-hrd').value || "Yth. Pimpinan HRD", comp: document.getElementById('surat-comp').value || "Nama Perusahaan",
            cont: (document.getElementById('surat-content').value || "Ketik isi surat di panel kiri...").replace(/\n/g, '<br><br>')
        };
        p.className = `a4-sheet p-[20mm] ${this.data.font} ${this.data.theme} text-[11pt] leading-relaxed text-slate-900 bg-white`;
        p.innerHTML = `
            <div class="text-right mb-10">${d.date}</div>
            <div class="font-bold mb-10 leading-tight"><p>${d.hrd}</p><p class="text-accent">${d.comp}</p><p>Di Tempat</p></div>
            <div class="text-justify mb-16 space-y-2">${d.cont}</div>
            <div class="w-48 ml-auto text-center">
                <p class="mb-2">Hormat saya,</p>
                <div class="h-16 flex items-center justify-center">${this.data.sig ? `<img src="${this.data.sig}" class="max-h-full">` : ''}</div>
                <p class="font-bold border-t-[1.5px] border-accent mt-1 pt-1 uppercase">${d.n}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', () => { window.appSurat = new SuratBuilder(); });
