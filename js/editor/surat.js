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
                if(confirm("Yakin mau hapus data surat lamaran? (Data CV tidak akan hilang)")) {
                    Object.keys(localStorage).forEach(key => {
                        if(key.startsWith('surat-')) localStorage.removeItem(key);
                    });
                    location.reload();
                }
            };
        }

        document.getElementById('btn-export-surat').onclick = async () => {
            const btn = document.getElementById('btn-export-surat');
            if(btn.disabled) return;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';
            
            let userName = document.getElementById('surat-name').value || 'Pelamar';
            userName = userName.replace(/[^a-zA-Z0-9]/g, '_');
            let fileName = `Surat_Lamaran_${userName}.pdf`;

            try {
                await html2pdf().set({
                    margin: 0, 
                    filename: fileName, 
                    image: { type: 'jpeg', quality: 1 }, 
                    html2canvas: { scale: 3, useCORS: true }, 
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['css', 'legacy'] }
                }).from(document.getElementById('surat-paper')).save();
                btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
            } catch(e) {
                btn.innerHTML = '<i class="fas fa-times"></i> GAGAL';
            }
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-file-pdf text-xl"></i> DOWNLOAD PDF SURAT'; btn.disabled = false; }, 2000);
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
        ['surat-name','surat-title','surat-hal','surat-lamp','surat-date','surat-hrd','surat-comp','surat-address','surat-content'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.oninput = () => { localStorage.setItem(id, el.value); this.renderPaper(); };
        });

        const btnTemp = document.getElementById('btn-template');
        if(btnTemp) {
            btnTemp.onclick = () => {
                const t = document.getElementById('surat-title').value || "[Posisi]";
                const n = document.getElementById('surat-name').value || localStorage.getItem('cv-name') || "[Nama Lengkap]";
                const ttl = localStorage.getItem('cv-ttl') || "[Tempat, Tanggal Lahir]";
                const ph = localStorage.getItem('cv-phone') || "[No WhatsApp]";
                const e = localStorage.getItem('cv-email') || "[Email]";

                document.getElementById('surat-hal').value = "Lamaran Pekerjaan";
                document.getElementById('surat-lamp').value = "1 (satu) Berkas";
                
                const c = document.getElementById('surat-content');
                c.value = `Dengan hormat,\n\nBerdasarkan informasi lowongan pekerjaan yang tersedia, saya bermaksud mengajukan diri untuk melamar posisi ${t} di perusahaan yang Bapak/Ibu pimpin. Adapun data diri singkat saya adalah sebagai berikut:\n\nNama : ${n}\nTempat, Tgl Lahir : ${ttl}\nNo. HP/WA : ${ph}\nEmail : ${e}\n\nSaya memiliki kualifikasi yang relevan, berdedikasi tinggi, siap bekerja keras, dan mampu berkolaborasi dengan baik dalam tim. Sebagai bahan pertimbangan, saya melampirkan Curriculum Vitae (CV) beserta dokumen pendukung lainnya pada lampiran terpisah.\n\nBesar harapan saya untuk dapat mengikuti tahapan seleksi selanjutnya. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.`;
                
                ['surat-hal', 'surat-lamp', 'surat-content'].forEach(id => { document.getElementById(id).dispatchEvent(new Event('input')); });
            };
        }
    }

    bindMedia() {
        const canvas = document.getElementById('surat-sig-pad');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let draw = false;

        document.getElementById('btn-open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('btn-clear-sig').onclick = () => { 
            ctx.clearRect(0,0,canvas.width,canvas.height); this.data.sig = null; localStorage.removeItem('surat-sig'); this.renderPaper(); 
        };
        document.getElementById('btn-save-sig').onclick = () => {
            this.data.sig = canvas.toDataURL(); localStorage.setItem('surat-sig', this.data.sig); document.getElementById('modal-sig').classList.add('hidden'); this.renderPaper(); 
        };

        const drawLine = (e) => {
            if(!draw) return; e.preventDefault();
            const r = canvas.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
            ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
            ctx.lineTo(x*(canvas.width/r.width), y*(canvas.height/r.height)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x*(canvas.width/r.width), y*(canvas.height/r.height));
        };

        canvas.onmousedown = (e) => { draw = true; drawLine(e); }; canvas.onmousemove = drawLine; canvas.onmouseup = () => { draw = false; ctx.beginPath(); };
        canvas.ontouchstart = (e) => { draw = true; drawLine(e); }; canvas.ontouchmove = drawLine; canvas.ontouchend = () => { draw = false; ctx.beginPath(); };
    }

    loadLocal() {
        if(!localStorage.getItem('surat-name') && localStorage.getItem('cv-name')) {
            const el = document.getElementById('surat-name');
            if(el) { el.value = localStorage.getItem('cv-name'); localStorage.setItem('surat-name', el.value); }
        }

        ['surat-name','surat-title','surat-hal','surat-lamp','surat-date','surat-hrd','surat-comp','surat-address','surat-content'].forEach(id => {
            if(localStorage.getItem(id)) { const el = document.getElementById(id); if(el) el.value = localStorage.getItem(id); }
        });
        if(localStorage.getItem('surat-sig')) this.data.sig = localStorage.getItem('surat-sig');
        if(localStorage.getItem('surat-font')) this.data.font = localStorage.getItem('surat-font');
        if(localStorage.getItem('surat-theme')) this.data.theme = localStorage.getItem('surat-theme');
    }

    renderPaper() {
        const p = document.getElementById('surat-paper');
        if(!p) return;
        
        // REVISI: TANGGAL OTOMATIS CERDAS (Nariki Nama Kota dari CV)
        let autoCity = "Jakarta";
        const savedAddr = localStorage.getItem('cv-address');
        if (savedAddr) {
            autoCity = savedAddr.split(',')[0].trim(); // Nyedot kata pertama sebelum koma, misal "Bekasi, Jawa Barat" -> "Bekasi"
        }
        const today = new Date();
        const autoDate = autoCity + ", " + today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        const n = document.getElementById('surat-name').value || "NAMA ANDA";
        const date = document.getElementById('surat-date').value || autoDate;
        
        const hal = document.getElementById('surat-hal').value;
        const lamp = document.getElementById('surat-lamp').value;
        const hrd = document.getElementById('surat-hrd').value;
        const comp = document.getElementById('surat-comp').value;
        const addr = document.getElementById('surat-address') ? document.getElementById('surat-address').value : '';
        
        const contentVal = document.getElementById('surat-content').value;
        const contHtml = contentVal ? contentVal.replace(/\n/g, '<br>') : '';

        const lampHtml = lamp ? `<tr><td class="pr-2 align-top">Lampiran</td><td class="pr-2 align-top">:</td><td>${lamp}</td></tr>` : '';
        const halHtml = hal ? `<tr><td class="pr-2 align-top">Hal</td><td class="pr-2 align-top">:</td><td><b>${hal}</b></td></tr>` : '';
        const headerTable = (lamp || hal) ? `<table class="text-[11pt] mb-8">${lampHtml}${halHtml}</table>` : '';

        const hrdHtml = hrd ? `<p>${hrd}</p>` : '';
        const compHtml = comp ? `<p class="text-accent">${comp}</p>` : '';
        const addrHtml = addr ? `<p class="font-normal text-[10pt] mt-1">${addr}</p>` : '';
        const diTempatHtml = (hrd || comp) && !addr ? `<p>Di Tempat</p>` : '';

        p.className = `a4-sheet p-[20mm] ${this.data.font} ${this.data.theme} text-[11pt] leading-relaxed text-slate-900 bg-white`;
        p.innerHTML = `
            <div class="text-right mb-8">${date}</div>
            
            ${headerTable}

            <div class="font-bold mb-8 leading-tight">
                ${hrdHtml}
                ${compHtml}
                ${addrHtml}
                ${diTempatHtml}
            </div>
            <div class="text-justify mb-16 space-y-2">${contHtml}</div>
            <div class="w-48 ml-auto text-center page-break-inside-avoid">
                <p class="mb-2">Hormat saya,</p>
                <div class="h-16 flex items-center justify-center">${this.data.sig ? `<img src="${this.data.sig}" class="max-h-full">` : ''}</div>
                <p class="font-bold border-t-[1.5px] border-accent mt-1 pt-1 uppercase">${n}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', () => { window.appSurat = new SuratBuilder(); });
