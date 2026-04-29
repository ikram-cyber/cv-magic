class CVBuilder {
    constructor() {
        this.data = { font: 'font-sans', theme: 'theme-sky', photo: null, sig: null, exps: [], edus: [] };
        this.init();
    }

    init() {
        this.bindTabs();
        this.bindInputs();
        this.bindMedia();
        this.loadLocal();
        this.renderLists();
        this.renderPaper();
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

        document.querySelectorAll('.cv-font').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('.cv-font').forEach(x => x.classList.remove('border-sky-500'));
                b.classList.add('border-sky-500'); this.data.font = b.dataset.font; this.renderPaper();
            };
        });

        document.getElementById('btn-export-cv').onclick = async () => {
            const btn = document.getElementById('btn-export-cv'); btn.innerHTML = 'MEMPROSES...';
            await html2pdf().set({margin: 0, filename: 'CV_Profesional.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }}).from(document.getElementById('cv-paper')).save();
            btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
            setTimeout(() => btn.innerHTML = '<i class="fas fa-print text-xl"></i> DOWNLOAD PDF CV', 2000);
        };
    }

    bindInputs() {
        ['cv-name','cv-title','cv-phone','cv-email','cv-address','cv-profile'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.oninput = () => { localStorage.setItem(id, el.value); this.renderPaper(); };
        });

        document.getElementById('btn-add-exp').onclick = () => { this.data.exps.push({role:'', comp:'', year:''}); this.renderLists(); this.renderPaper(); };
        document.getElementById('btn-add-edu').onclick = () => { this.data.edus.push({school:'', degree:'', year:''}); this.renderLists(); this.renderPaper(); };
    }

    bindMedia() {
        document.getElementById('cv-photo').onchange = (e) => {
            const f = e.target.files[0];
            if(f) { const r = new FileReader(); r.onload = (ev) => { this.data.photo = ev.target.result; localStorage.setItem('cv-photo', ev.target.result); this.renderPaper(); }; r.readAsDataURL(f); }
        };

        const canvas = document.getElementById('cv-sig-pad');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let draw = false;

        document.getElementById('btn-open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('btn-clear-sig').onclick = () => ctx.clearRect(0,0,canvas.width,canvas.height);
        document.getElementById('btn-save-sig').onclick = () => {
            this.data.sig = canvas.toDataURL(); localStorage.setItem('cv-sig', this.data.sig);
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

    // --- REVISI: Fungsi Hapus & Tampilan List yang Lebih Rapi ---
    renderLists() {
        const elExp = document.getElementById('cv-exp-list'); elExp.innerHTML = '';
        this.data.exps.forEach((x,i) => {
            elExp.innerHTML += `
            <div class="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
                <div class="flex-1 space-y-2">
                    <input class="w-full bg-transparent text-xs outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Posisi / Jabatan" value="${x.role}" oninput="appCV.upD('exps',${i},'role',this.value)">
                    <div class="flex gap-2">
                        <input class="flex-1 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Perusahaan" value="${x.comp}" oninput="appCV.upD('exps',${i},'comp',this.value)">
                        <input class="w-16 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 text-center focus:border-sky-500" placeholder="Tahun" value="${x.year}" oninput="appCV.upD('exps',${i},'year',this.value)">
                    </div>
                </div>
                <button onclick="appCV.delD('exps', ${i})" class="text-red-500 bg-red-500/10 p-2 rounded hover:bg-red-500 hover:text-white transition"><i class="fas fa-trash"></i></button>
            </div>`;
        });
        
        const elEdu = document.getElementById('cv-edu-list'); elEdu.innerHTML = '';
        this.data.edus.forEach((x,i) => {
            elEdu.innerHTML += `
            <div class="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
                <div class="flex-1 space-y-2">
                    <input class="w-full bg-transparent text-xs outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Sekolah / Kampus" value="${x.school}" oninput="appCV.upD('edus',${i},'school',this.value)">
                    <div class="flex gap-2">
                        <input class="flex-1 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Jurusan" value="${x.degree}" oninput="appCV.upD('edus',${i},'degree',this.value)">
                        <input class="w-16 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 text-center focus:border-sky-500" placeholder="Tahun" value="${x.year}" oninput="appCV.upD('edus',${i},'year',this.value)">
                    </div>
                </div>
                <button onclick="appCV.delD('edus', ${i})" class="text-red-500 bg-red-500/10 p-2 rounded hover:bg-red-500 hover:text-white transition"><i class="fas fa-trash"></i></button>
            </div>`;
        });
    }

    upD(list, i, key, val) { this.data[list][i][key] = val; this.renderPaper(); }
    delD(list, i) { this.data[list].splice(i, 1); this.renderLists(); this.renderPaper(); }

    loadLocal() {
        ['cv-name','cv-title','cv-phone','cv-email','cv-address','cv-profile'].forEach(id => {
            if(localStorage.getItem(id)) document.getElementById(id).value = localStorage.getItem(id);
        });
        if(localStorage.getItem('cv-photo')) this.data.photo = localStorage.getItem('cv-photo');
        if(localStorage.getItem('cv-sig')) this.data.sig = localStorage.getItem('cv-sig');
    }

    renderPaper() {
        const p = document.getElementById('cv-paper');
        if(!p) return;
        const d = {
            n: document.getElementById('cv-name').value || "NAMA LENGKAP", t: document.getElementById('cv-title').value || "PROFESI / POSISI",
            p: document.getElementById('cv-phone').value || "08xx-xxxx", e: document.getElementById('cv-email').value || "email@anda.com",
            a: document.getElementById('cv-address').value || "Alamat Anda", prof: document.getElementById('cv-profile').value || "Profil singkat Anda"
        };
        // Set margin & font
        p.className = `a4-sheet p-[15mm] ${this.data.font} bg-white text-slate-900`;
        p.innerHTML = `
            <div class="flex gap-5 border-b-2 border-sky-600 pb-4 mb-4">
                <div class="w-[30mm] h-[40mm] bg-slate-100 border-2 border-slate-900 rounded overflow-hidden flex justify-center items-center shrink-0">
                    ${this.data.photo ? `<img src="${this.data.photo}" class="w-full h-full object-cover">` : '<i class="fas fa-user text-3xl text-slate-300"></i>'}
                </div>
                <div class="flex-1">
                    <h1 class="text-3xl font-black uppercase text-slate-900 leading-none">${d.n}</h1>
                    <h2 class="text-[11px] font-bold text-sky-600 uppercase tracking-widest mt-1 mb-3">${d.t}</h2>
                    <div class="text-[10px] space-y-1 font-bold text-slate-600">
                        <p><i class="fas fa-phone text-sky-500 w-4"></i> ${d.p}</p>
                        <p><i class="fas fa-envelope text-sky-500 w-4"></i> ${d.e}</p>
                        <p><i class="fas fa-map-marker-alt text-sky-500 w-4"></i> ${d.a}</p>
                    </div>
                </div>
            </div>
            <div class="space-y-4">
                <div><h3 class="text-xs font-black uppercase border-b-2 border-slate-200 mb-1">Profil Profesional</h3><p class="text-[10px] leading-relaxed text-justify">${d.prof}</p></div>
                
                ${this.data.exps.length > 0 ? `<div><h3 class="text-xs font-black uppercase border-b-2 border-slate-200 mb-1">Pengalaman Kerja</h3><div class="space-y-2">${this.data.exps.map(x=>`<div class="flex justify-between"><div class="flex-1"><p class="text-[11px] font-bold">${x.role||'Posisi'}</p><p class="text-[10px] text-sky-600 font-bold">${x.comp||'Perusahaan'}</p></div><div class="text-[10px] font-bold text-slate-500">${x.year||'Tahun'}</div></div>`).join('')}</div></div>` : ''}
                
                ${this.data.edus.length > 0 ? `<div><h3 class="text-xs font-black uppercase border-b-2 border-slate-200 mb-1">Pendidikan</h3><div class="space-y-2">${this.data.edus.map(x=>`<div class="flex justify-between"><div class="flex-1"><p class="text-[11px] font-bold">${x.school||'Sekolah/Kampus'}</p><p class="text-[10px] text-sky-600 font-bold">${x.degree||'Jurusan'}</p></div><div class="text-[10px] font-bold text-slate-500">${x.year||'Tahun'}</div></div>`).join('')}</div></div>` : ''}
            </div>
            <div class="absolute bottom-10 right-10 text-center w-32">
                <p class="text-[10px] font-bold mb-1">Hormat Saya,</p>
                <div class="h-14 flex items-center justify-center">${this.data.sig ? `<img src="${this.data.sig}" class="max-h-full">` : ''}</div>
                <p class="text-[10px] font-black border-t border-slate-900 uppercase pt-1 mt-1">${d.n}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', () => { window.appCV = new CVBuilder(); });
