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
            
            // REVISI FATAL: Auto-Switch Tab ke Preview biar PDF Surat gak BLANK di HP
            const pPan = document.getElementById('panel-preview');
            const pBtn = document.getElementById('tab-prev');
            if (pPan.classList.contains('hidden') && pBtn) {
                pBtn.click();
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';
            
            await new Promise(resolve => setTimeout(resolve, 300));

            let userName = document.getElementById('surat-name').value || 'Pelamar';
            userName = userName.replace(/[^a-zA-Z0-9]/g, '_');
            let fileName = `Surat_Lamaran_${userName}.pdf`;

            try {
                await html2pdf().set({
                    margin: [5, 0, 5, 0], // Margin aman atas-bawah
                    filename: fileName, 
                    image: { type: 'jpeg', quality: 0.82 }, 
                    // REVISI FATAL: scrollY: 0 biar kop surat gak kepotong di HP
                    html2canvas: { scale: 3, useCORS: true, scrollY: 0 }, 
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['css', 'legacy'] },
                    enableLinks: true
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
        ['surat-name','surat-title','surat-hal','surat-lamp','surat-date','surat-hrd','surat-comp','surat-address','surat-content', 'sel-exp', 'sel-ind'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.oninput = () => { localStorage.setItem(id, el.value); this.renderPaper(); };
        });

        const btnTemp = document.getElementById('btn-template');
        if(btnTemp) {
            btnTemp.onclick = () => {
                const c = document.getElementById('surat-content');
                if(c.value.trim() !== "" && !c.value.includes("Dengan hormat,")) {
                    if(!confirm("Anda sudah mengetik isi surat secara manual. Yakin ingin menimpanya dengan teks otomatis?")) return;
                }

                const t = document.getElementById('surat-title').value || "[Posisi yang Dilamar]";
                const n = document.getElementById('surat-name').value || localStorage.getItem('cv-name') || "[Nama Lengkap]";
                const ttl = localStorage.getItem('cv-ttl') || "[Tempat, Tanggal Lahir]";
                const ph = localStorage.getItem('cv-phone') || "[No WhatsApp]";
                const e = localStorage.getItem('cv-email') || "[Email]";
                
                const cName = document.getElementById('surat-comp').value || "";

                const expMode = document.getElementById('sel-exp').value;
                const indMode = document.getElementById('sel-ind').value;

                let indText = "perusahaan";
                let hrdText = "Yth. HRD Manager / Pimpinan Perusahaan";

                if(indMode === 'pabrik') {
                    indText = "perusahaan manufaktur";
                    hrdText = "Yth. HRD Manager / Pimpinan Plant Manufaktur";
                } else if(indMode === 'apotek') {
                    indText = "apotek";
                    hrdText = "Yth. Apoteker Pengelola Apotek (APA) / Pimpinan Apotek";
                } else if(indMode === 'rs') {
                    indText = "rumah sakit / instansi kesehatan";
                    hrdText = "Yth. Direktur / Kepala Bagian HRD Rumah Sakit";
                } else if(indMode === 'bandara') {
                    indText = "perusahaan aviasi / otoritas bandara";
                    hrdText = "Yth. HRD Manager / Pimpinan Otoritas Bandara";
                } else if(indMode === 'logistik') {
                    indText = "perusahaan logistik dan rantai pasok";
                    hrdText = "Yth. Kepala Cabang / HRD Manager Logistik";
                }

                const targetCompany = cName !== "" ? cName : `${indText} yang Bapak/Ibu pimpin`;

                let expText = "";
                if(expMode === 'fresh') {
                    expText = `Sebagai fresh graduate yang energik dan memiliki fondasi akademik yang kuat, saya siap terjun langsung ke dunia kerja. Saya terbiasa beradaptasi dengan cepat, memiliki integritas, dan berkomitmen penuh untuk berkontribusi maksimal pada operasional ${targetCompany}.`;
                } else if(expMode === 'zero') {
                    expText = `Meskipun saat ini saya belum memiliki pengalaman kerja formal, saya adalah individu pekerja keras yang pantang menyerah dan memiliki kemauan kuat untuk mempelajari hal-hal baru. Saya siap dilatih, disiplin, dan memiliki motivasi tinggi untuk memberikan kinerja terbaik bagi ${targetCompany}.`;
                } else {
                    expText = `Berbekal pengalaman kerja yang relevan sebelumnya, saya terbukti mampu menangani tanggung jawab secara profesional, terbiasa bekerja dengan target, dan mampu berkolaborasi secara solid dalam tim. Saya yakin kompetensi dan rekam jejak saya dapat memberikan nilai tambah nyata bagi kelancaran operasional ${targetCompany}.`;
                }

                document.getElementById('surat-hal').value = "Lamaran Pekerjaan";
                document.getElementById('surat-lamp').value = "1 (satu) Berkas";
                document.getElementById('surat-hrd').value = hrdText;
                
                c.value = `Dengan hormat,\n\nBerdasarkan informasi lowongan pekerjaan yang tersedia, saya bermaksud mengajukan diri untuk melamar posisi ${t} di ${targetCompany}. Adapun data diri singkat saya adalah sebagai berikut:\n\nNama : ${n}\nTempat, Tgl Lahir : ${ttl}\nNo. HP/WA : ${ph}\nEmail : ${e}\n\n${expText}\n\nSebagai bahan pertimbangan, saya melampirkan Curriculum Vitae (CV) beserta dokumen pendukung lainnya pada lampiran terpisah.\n\nBesar harapan saya untuk dapat mengikuti tahapan seleksi selanjutnya. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.`;
                
                ['surat-hal', 'surat-lamp', 'surat-hrd', 'surat-content'].forEach(id => { document.getElementById(id).dispatchEvent(new Event('input')); });
            };
        }
    }

    bindMedia() {
        const sigUpload = document.getElementById('surat-sig-upload');
        if(sigUpload) {
            sigUpload.onchange = (e) => {
                const f = e.target.files[0];
                if(f) {
                    const r = new FileReader();
                    r.onload = (ev) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 400; 
                            const scaleSize = MAX_WIDTH / img.width;
                            canvas.width = MAX_WIDTH;
                            canvas.height = img.height * scaleSize;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            const compData = canvas.toDataURL('image/png'); 
                            
                            this.data.sig = compData;
                            try { localStorage.setItem('surat-sig', compData); } catch(err) {}
                            document.getElementById('modal-sig').classList.add('hidden');
                            this.renderPaper();
                        };
                        img.src = ev.target.result;
                    };
                    r.readAsDataURL(f);
                }
            };
        }

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
        
        let autoCity = "Jakarta";
        const savedAddr = localStorage.getItem('cv-address');
        if (savedAddr) {
            const parts = savedAddr.split(',');
            if(parts.length > 1) {
                autoCity = parts[parts.length > 2 ? parts.length - 2 : parts.length - 1].trim();
            } else {
                autoCity = parts[0].trim();
            }
        }
        const today = new Date();
        const autoDate = autoCity + ", " + today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        const n = document.getElementById('surat-name').value || "NAMA ANDA";
        const date = document.getElementById('surat-date').value || autoDate;
        
        const hal = document.getElementById('surat-hal').value;
        const lamp = document.getElementById('surat-lamp').value;
        const hrd = document.getElementById('surat-hrd').value;
        const comp = document.getElementById('surat-comp').value;
        const addrVal = document.getElementById('surat-address') ? document.getElementById('surat-address').value : '';
        
        const contentVal = document.getElementById('surat-content').value;
        const contHtml = contentVal ? contentVal.replace(/\n/g, '<br>') : '';

        const myName = localStorage.getItem('cv-name') || n;
        const myPhone = localStorage.getItem('cv-phone') || "";
        const myEmail = localStorage.getItem('cv-email') || "";
        const myPort = localStorage.getItem('cv-port') || "";

        let senderHeaderHtml = `<div class="mb-8 border-b-2 border-slate-300 pb-3">
            <h1 class="text-2xl font-black text-accent uppercase tracking-wide">${myName}</h1>
            <div class="text-[9px] font-bold text-slate-600 flex gap-4 mt-2">
                ${myPhone ? `<span><i class="fas fa-phone text-accent"></i> ${myPhone}</span>` : ''}
                ${myEmail ? `<span><i class="fas fa-envelope text-accent"></i> ${myEmail}</span>` : ''}
                ${myPort ? `<span><i class="fas fa-link text-accent"></i> ${myPort}</span>` : ''}
            </div>
        </div>`;

        const lampHtml = lamp ? `<tr><td class="pr-2 align-top">Lampiran</td><td class="pr-2 align-top">:</td><td>${lamp}</td></tr>` : '';
        const halHtml = hal ? `<tr><td class="pr-2 align-top">Hal</td><td class="pr-2 align-top">:</td><td><b>${hal}</b></td></tr>` : '';
        const headerTable = (lamp || hal) ? `<table class="text-[11pt] mb-8">${lampHtml}${halHtml}</table>` : '';

        const hrdHtml = hrd ? `<p>${hrd}</p>` : '';
        const compHtml = comp ? `<p class="text-accent">${comp}</p>` : '';
        const addrHtml = addrVal ? `<p class="font-normal text-[10pt] mt-1">${addrVal.replace(/\n/g, '<br>')}</p>` : '';
        const diTempatHtml = (hrd || comp) && !addrVal ? `<p>Di Tempat</p>` : '';

        p.className = `a4-sheet p-[20mm] ${this.data.font} ${this.data.theme} text-[11pt] leading-relaxed text-slate-900 bg-white`;
        p.innerHTML = `
            ${senderHeaderHtml}
            <div class="text-right mb-8">${date}</div>
            
            ${headerTable}

            <div class="font-bold mb-8 leading-tight">
                ${hrdHtml}
                ${compHtml}
                ${addrHtml}
                ${diTempatHtml}
            </div>
            <div class="text-justify mb-16 space-y-2">${contHtml}</div>
            <div class="w-48 ml-auto text-center break-inside-avoid">
                <p class="mb-2">Hormat saya,</p>
                <div class="h-16 flex items-center justify-center">${this.data.sig ? `<img src="${this.data.sig}" class="max-h-full">` : ''}</div>
                <p class="font-bold border-t-[1.5px] border-accent mt-1 pt-1 uppercase">${n}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', () => { window.appSurat = new SuratBuilder(); });
