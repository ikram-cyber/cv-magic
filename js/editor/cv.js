class CVBuilder {
    constructor() {
        this.data = { font: 'font-sans', theme: 'theme-sky', photo: null, sig: null, exps: [], edus: [], prjs: [] };
        this.init();
    }

    init() {
        this.loadLocal();
        this.bindTabs();
        this.bindInputs();
        this.bindMedia();
        this.renderLists();
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

        document.querySelectorAll('.cv-font').forEach(b => {
            b.onclick = () => { this.data.font = b.dataset.font; localStorage.setItem('cv-font', this.data.font); this.updateDesignUI(); this.renderPaper(); };
        });

        document.querySelectorAll('.cv-theme').forEach(b => {
            b.onclick = () => { this.data.theme = b.dataset.theme; localStorage.setItem('cv-theme', this.data.theme); this.updateDesignUI(); this.renderPaper(); };
        });

        const btnReset = document.getElementById('btn-reset');
        if(btnReset) {
            btnReset.onclick = () => {
                if(confirm("Yakin mau hapus semua data CV?")) {
                    Object.keys(localStorage).forEach(key => {
                        if(key.startsWith('cv-')) localStorage.removeItem(key);
                    });
                    location.reload();
                }
            };
        }

        document.getElementById('btn-export-cv').onclick = async () => {
            const btn = document.getElementById('btn-export-cv'); 
            if(btn.disabled) return;
            
            const pPan = document.getElementById('panel-preview');
            const pBtn = document.getElementById('tab-prev');
            if (pPan.classList.contains('hidden') && pBtn) {
                pBtn.click();
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';
            
            await new Promise(resolve => setTimeout(resolve, 150));
            await document.fonts.ready;
            
            let userName = document.getElementById('cv-name').value || 'Profesional';
            userName = userName.replace(/[^a-zA-Z0-9]/g, '_');
            let fileName = `CV_${userName}.pdf`;

            try {
                await html2pdf().set({
                    margin: [5, 0, 5, 0], 
                    filename: fileName, 
                    image: { type: 'jpeg', quality: 0.82 }, 
                    html2canvas: { scale: 3, useCORS: true, scrollY: 0 }, 
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['css', 'legacy'] },
                    enableLinks: true
                }).from(document.getElementById('cv-paper')).save();
                btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
            } catch(e) {
                btn.innerHTML = '<i class="fas fa-times"></i> GAGAL';
            }
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-print text-xl"></i> DOWNLOAD PDF CV'; btn.disabled = false; }, 2000);
        };
    }

    updateDesignUI() {
        document.querySelectorAll('.cv-font').forEach(x => {
            x.classList.toggle('border-sky-500', x.dataset.font === this.data.font);
            x.classList.toggle('border-transparent', x.dataset.font !== this.data.font);
        });
        document.querySelectorAll('.cv-theme').forEach(x => {
            x.classList.toggle('border-white', x.dataset.theme === this.data.theme);
            x.classList.toggle('ring-2', x.dataset.theme === this.data.theme);
            x.classList.toggle('ring-sky-500', x.dataset.theme === this.data.theme);
            x.classList.toggle('border-transparent', x.dataset.theme !== this.data.theme);
        });
    }

    bindInputs() {
        ['cv-name','cv-title','cv-ttl','cv-port','cv-phone','cv-email','cv-address','cv-profile', 'cv-skills', 'cv-cert'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.oninput = () => { localStorage.setItem(id, el.value); this.renderPaper(); };
        });

        const btnGenProf = document.getElementById('btn-gen-profile');
        if(btnGenProf) {
            btnGenProf.onclick = () => {
                const titleEl = document.getElementById('cv-title');
                const titleVal = titleEl.value.trim();
                
                const c = document.getElementById('cv-profile');
                if(c.value.trim() !== "" && !c.value.includes("Seorang ") && !c.value.includes("Lulusan baru") && !c.value.includes("Individu yang") && !c.value.includes("Profesional berpengalaman")) {
                    if(!confirm("Anda sudah mengetik profil secara manual. Yakin ingin menimpanya dengan teks otomatis dari sistem?")) return;
                }

                const expMode = document.getElementById('cv-sel-exp').value;
                let profText = "";

                // REVISI AI: Kalau gelar kosong, dia pake kalimat general. Kalau ada gelar, dia pake kalimat spesifik.
                if(expMode === 'fresh') {
                    profText = titleVal 
                        ? `Seorang ${titleVal} yang baru lulus dengan motivasi tinggi dan fondasi akademik yang kuat. Memiliki kemampuan adaptasi yang cepat, kemauan belajar yang tangguh, serta kesiapan penuh untuk memberikan dedikasi dan berkontribusi secara nyata dalam lingkungan operasional yang dinamis.`
                        : `Lulusan baru dengan motivasi tinggi dan fondasi akademik yang kuat. Memiliki kemampuan adaptasi yang cepat, kemauan belajar yang tangguh, serta kesiapan penuh untuk memberikan dedikasi dan berkontribusi secara nyata dalam lingkungan operasional yang dinamis.`;
                } else if(expMode === 'zero') {
                    profText = titleVal 
                        ? `Individu yang berdedikasi tinggi dan sangat antusias untuk membangun karir profesional sebagai ${titleVal}. Memiliki kemampuan beradaptasi dengan cepat, etos kerja keras, dan kedisiplinan tinggi. Proaktif dalam mempelajari hal baru, siap berkolaborasi dalam tim, serta berkomitmen memberikan kontribusi nyata bagi pencapaian target operasional.`
                        : `Individu yang berdedikasi tinggi dan sangat antusias untuk merintis karir profesional. Memiliki kemampuan beradaptasi dengan cepat, etos kerja keras, dan kedisiplinan tinggi. Proaktif dalam mempelajari hal baru, siap berkolaborasi dalam tim, serta berkomitmen memberikan kontribusi nyata bagi pencapaian target operasional perusahaan.`;
                } else {
                    profText = titleVal 
                        ? `Seorang ${titleVal} berpengalaman dengan rekam jejak yang terbukti dalam mengeksekusi tanggung jawab pekerjaan secara profesional dan presisi. Berorientasi pada target, mampu bekerja efektif di bawah tekanan operasional, dan memiliki kemampuan kolaborasi tim yang solid untuk mencapai efisiensi maksimal.`
                        : `Profesional berpengalaman dengan rekam jejak yang terbukti dalam mengeksekusi tanggung jawab pekerjaan secara efektif dan presisi. Berorientasi pada target, mampu bekerja dengan baik di bawah tekanan operasional, dan memiliki kemampuan kolaborasi tim yang solid untuk mencapai efisiensi maksimal.`;
                }

                c.value = profText;
                c.dispatchEvent(new Event('input'));
            };
        }

        document.getElementById('btn-add-exp').onclick = () => { this.data.exps.push({role:'', comp:'', year:'', desc:''}); this.saveLists(); this.renderLists(); this.renderPaper(); };
        document.getElementById('btn-add-edu').onclick = () => { this.data.edus.push({school:'', degree:'', year:'', score:''}); this.saveLists(); this.renderLists(); this.renderPaper(); };
        const btnPrj = document.getElementById('btn-add-prj');
        if(btnPrj) btnPrj.onclick = () => { this.data.prjs.push({name:'', inst:'', year:'', desc:''}); this.saveLists(); this.renderLists(); this.renderPaper(); };
    }

    bindMedia() {
        const bindUpload = (id, key) => {
            const el = document.getElementById(id);
            if(!el) return;
            el.onchange = (e) => {
                const f = e.target.files[0];
                if(f) { 
                    const r = new FileReader(); 
                    r.onload = (ev) => { 
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 400; const scaleSize = MAX_WIDTH / img.width;
                            canvas.width = MAX_WIDTH; canvas.height = img.height * scaleSize;
                            const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            const compData = key === 'sig' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.82); 
                            this.data[key] = compData; 
                            try { localStorage.setItem(key === 'sig' ? 'cv-sig' : 'cv-photo', compData); } catch(err) {}
                            if(key === 'sig') document.getElementById('modal-sig').classList.add('hidden');
                            this.renderPaper(); 
                        };
                        img.src = ev.target.result;
                    }; 
                    r.readAsDataURL(f); 
                }
            };
        };
        bindUpload('cv-photo', 'photo'); bindUpload('cv-sig-upload', 'sig');

        const btnRemPhoto = document.getElementById('btn-remove-photo');
        if(btnRemPhoto) btnRemPhoto.onclick = (e) => { e.stopPropagation(); this.data.photo = null; localStorage.removeItem('cv-photo'); document.getElementById('cv-photo').value = ''; this.renderPaper(); };

        const canvas = document.getElementById('cv-sig-pad');
        if(!canvas) return;
        const ctx = canvas.getContext('2d'); let draw = false;
        document.getElementById('btn-open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('btn-clear-sig').onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height); this.data.sig = null; localStorage.removeItem('cv-sig'); this.renderPaper(); };
        document.getElementById('btn-save-sig').onclick = () => { this.data.sig = canvas.toDataURL(); localStorage.setItem('cv-sig', this.data.sig); document.getElementById('modal-sig').classList.add('hidden'); this.renderPaper(); };

        const drawLine = (e) => {
            if(!draw) return; e.preventDefault();
            const r = canvas.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
            ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
            ctx.lineTo(x*(canvas.width/r.width), y*(canvas.height/r.height)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x*(canvas.width/r.width), y*(canvas.height/r.height));
        };
        canvas.onmousedown = (e) => { draw = true; drawLine(e); }; canvas.onmousemove = drawLine; canvas.onmouseup = () => { draw = false; ctx.beginPath(); };
        canvas.ontouchstart = (e) => { draw = true; drawLine(e); }; canvas.ontouchmove = drawLine; canvas.ontouchend = () => { draw = false; ctx.beginPath(); };
    }

    saveLists() {
        localStorage.setItem('cv-exps', JSON.stringify(this.data.exps));
        localStorage.setItem('cv-edus', JSON.stringify(this.data.edus));
        localStorage.setItem('cv-prjs', JSON.stringify(this.data.prjs));
    }

    moveD(list, i, dir) {
        const arr = this.data[list];
        if (i + dir < 0 || i + dir >= arr.length) return;
        const temp = arr[i]; arr[i] = arr[i + dir]; arr[i + dir] = temp;
        this.saveLists(); this.renderLists(); this.renderPaper();
    }

    upD(list, i, key, val) { this.data[list][i][key] = val; this.saveLists(); this.renderPaper(); }
    delD(list, i) { this.data[list].splice(i, 1); this.saveLists(); this.renderLists(); this.renderPaper(); }

    renderLists() {
        const elExp = document.getElementById('cv-exp-list'); elExp.innerHTML = '';
        this.data.exps.forEach((x,i) => {
            elExp.innerHTML += `
            <div class="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-start gap-3">
                <div class="flex-1 space-y-2">
                    <input class="w-full bg-transparent text-xs outline-none border-b border-slate-700 pb-1 focus:border-sky-500 font-bold" placeholder="Posisi / Jabatan (ex: Asisten Apoteker)" value="${x.role||''}" oninput="appCV.upD('exps',${i},'role',this.value)">
                    <div class="flex gap-2">
                        <input class="flex-1 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Instansi / Perusahaan" value="${x.comp||''}" oninput="appCV.upD('exps',${i},'comp',this.value)">
                        <input class="w-32 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 text-center focus:border-sky-500" placeholder="Periode (ex: Jan 2023 - Skrg)" value="${x.year||''}" oninput="appCV.upD('exps',${i},'year',this.value)">
                    </div>
                    <textarea class="w-full bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500 resize-none custom-scroll h-12 mt-1" placeholder="Deskripsi Tugas & Pencapaian (Gunakan '-' atau peluru untuk rincian)..." oninput="appCV.upD('exps',${i},'desc',this.value)">${x.desc||''}</textarea>
                </div>
                <div class="flex flex-col gap-1 mt-1 items-center">
                    ${i > 0 ? `<button onclick="appCV.moveD('exps', ${i}, -1)" class="text-slate-400 hover:text-sky-400 bg-slate-700 p-1 px-2 rounded transition"><i class="fas fa-chevron-up text-[10px]"></i></button>` : ''}
                    <button onclick="appCV.delD('exps', ${i})" class="text-red-500 bg-red-500/10 p-1.5 px-2 rounded hover:bg-red-500 hover:text-white transition"><i class="fas fa-trash text-xs"></i></button>
                    ${i < this.data.exps.length - 1 ? `<button onclick="appCV.moveD('exps', ${i}, 1)" class="text-slate-400 hover:text-sky-400 bg-slate-700 p-1 px-2 rounded transition"><i class="fas fa-chevron-down text-[10px]"></i></button>` : ''}
                </div>
            </div>`;
        });
        
        const elEdu = document.getElementById('cv-edu-list'); elEdu.innerHTML = '';
        this.data.edus.forEach((x,i) => {
            elEdu.innerHTML += `
            <div class="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-start gap-3">
                <div class="flex-1 space-y-2">
                    <input class="w-full bg-transparent text-xs outline-none border-b border-slate-700 pb-1 focus:border-sky-500 font-bold" placeholder="Nama Sekolah / Universitas" value="${x.school||''}" oninput="appCV.upD('edus',${i},'school',this.value)">
                    <div class="flex gap-2">
                        <input class="flex-1 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Jurusan / Program Studi" value="${x.degree||''}" oninput="appCV.upD('edus',${i},'degree',this.value)">
                        <input class="w-16 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 text-center focus:border-sky-500" placeholder="IPK / Nilai" value="${x.score||''}" oninput="appCV.upD('edus',${i},'score',this.value)">
                        <input class="w-28 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 text-center focus:border-sky-500" placeholder="Tahun Lulus" value="${x.year||''}" oninput="appCV.upD('edus',${i},'year',this.value)">
                    </div>
                </div>
                <div class="flex flex-col gap-1 mt-1 items-center">
                    ${i > 0 ? `<button onclick="appCV.moveD('edus', ${i}, -1)" class="text-slate-400 hover:text-sky-400 bg-slate-700 p-1 px-2 rounded transition"><i class="fas fa-chevron-up text-[10px]"></i></button>` : ''}
                    <button onclick="appCV.delD('edus', ${i})" class="text-red-500 bg-red-500/10 p-1.5 px-2 rounded hover:bg-red-500 hover:text-white transition"><i class="fas fa-trash text-xs"></i></button>
                    ${i < this.data.edus.length - 1 ? `<button onclick="appCV.moveD('edus', ${i}, 1)" class="text-slate-400 hover:text-sky-400 bg-slate-700 p-1 px-2 rounded transition"><i class="fas fa-chevron-down text-[10px]"></i></button>` : ''}
                </div>
            </div>`;
        });

        const elPrj = document.getElementById('cv-prj-list');
        if(elPrj) {
            elPrj.innerHTML = '';
            this.data.prjs.forEach((x,i) => {
                elPrj.innerHTML += `
                <div class="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-start gap-3">
                    <div class="flex-1 space-y-2">
                        <input class="w-full bg-transparent text-xs outline-none border-b border-slate-700 pb-1 focus:border-sky-500 font-bold" placeholder="Nama Proyek / Posisi Organisasi" value="${x.name||''}" oninput="appCV.upD('prjs',${i},'name',this.value)">
                        <div class="flex gap-2">
                            <input class="flex-1 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500" placeholder="Penyelenggara / Klien" value="${x.inst||''}" oninput="appCV.upD('prjs',${i},'inst',this.value)">
                            <input class="w-24 bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 text-center focus:border-sky-500" placeholder="Tahun" value="${x.year||''}" oninput="appCV.upD('prjs',${i},'year',this.value)">
                        </div>
                        <textarea class="w-full bg-transparent text-[10px] outline-none border-b border-slate-700 pb-1 focus:border-sky-500 resize-none custom-scroll h-10 mt-1" placeholder="Rincian / Teknologi yang digunakan..." oninput="appCV.upD('prjs',${i},'desc',this.value)">${x.desc||''}</textarea>
                    </div>
                    <div class="flex flex-col gap-1 mt-1 items-center">
                        ${i > 0 ? `<button onclick="appCV.moveD('prjs', ${i}, -1)" class="text-slate-400 hover:text-sky-400 bg-slate-700 p-1 px-2 rounded transition"><i class="fas fa-chevron-up text-[10px]"></i></button>` : ''}
                        <button onclick="appCV.delD('prjs', ${i})" class="text-red-500 bg-red-500/10 p-1.5 px-2 rounded hover:bg-red-500 hover:text-white transition"><i class="fas fa-trash text-xs"></i></button>
                        ${i < this.data.prjs.length - 1 ? `<button onclick="appCV.moveD('prjs', ${i}, 1)" class="text-slate-400 hover:text-sky-400 bg-slate-700 p-1 px-2 rounded transition"><i class="fas fa-chevron-down text-[10px]"></i></button>` : ''}
                    </div>
                </div>`;
            });
        }
    }

    loadLocal() {
        ['cv-name','cv-title','cv-ttl','cv-port','cv-phone','cv-email','cv-address','cv-profile', 'cv-skills', 'cv-cert'].forEach(id => {
            if(localStorage.getItem(id)) { const el = document.getElementById(id); if(el) el.value = localStorage.getItem(id); }
        });
        if(localStorage.getItem('cv-photo')) this.data.photo = localStorage.getItem('cv-photo');
        if(localStorage.getItem('cv-sig')) this.data.sig = localStorage.getItem('cv-sig');
        if(localStorage.getItem('cv-font')) this.data.font = localStorage.getItem('cv-font');
        if(localStorage.getItem('cv-theme')) this.data.theme = localStorage.getItem('cv-theme');
        
        if(localStorage.getItem('cv-exps')) this.data.exps = JSON.parse(localStorage.getItem('cv-exps'));
        if(localStorage.getItem('cv-edus')) this.data.edus = JSON.parse(localStorage.getItem('cv-edus'));
        if(localStorage.getItem('cv-prjs')) this.data.prjs = JSON.parse(localStorage.getItem('cv-prjs'));
    }

    renderPaper() {
        const p = document.getElementById('cv-paper');
        if(!p) return;

        const btnRemPhoto = document.getElementById('btn-remove-photo');
        if(btnRemPhoto) btnRemPhoto.classList.toggle('hidden', !this.data.photo);
        
        const n = document.getElementById('cv-name').value || "NAMA LENGKAP";
        const t = document.getElementById('cv-title').value || "PROFESI / POSISI";
        const ttl = document.getElementById('cv-ttl').value;
        const port = document.getElementById('cv-port').value;
        const ph = document.getElementById('cv-phone').value;
        const e = document.getElementById('cv-email').value;
        const a = document.getElementById('cv-address').value;
        const prof = document.getElementById('cv-profile').value;
        
        const skillsVal = document.getElementById('cv-skills') ? document.getElementById('cv-skills').value : '';
        const certVal = document.getElementById('cv-cert') ? document.getElementById('cv-cert').value : '';

        const skills = skillsVal ? skillsVal.replace(/\n/g, '<br>') : '';
        const cert = certVal ? certVal.replace(/\n/g, '<br>') : '';

        const ttlHtml = ttl ? `<p><i class="fas fa-calendar-alt w-4 text-accent text-center"></i> ${ttl}</p>` : '';
        const phHtml = ph ? `<p><i class="fas fa-phone w-4 text-accent text-center"></i> ${ph}</p>` : '';
        const portUrl = port ? (port.startsWith('http') ? port : 'https://' + port) : '#';
        const portHtml = port ? `<p class="break-all"><i class="fas fa-link w-4 text-accent text-center"></i> <a href="${portUrl}" target="_blank" style="text-decoration:none; color:inherit;">${port}</a></p>` : '';
        const eHtml = e ? `<p class="break-all"><i class="fas fa-envelope w-4 text-accent text-center"></i> <a href="mailto:${e}" style="text-decoration:none; color:inherit;">${e}</a></p>` : '';
        const aHtml = a ? `<p class="col-span-2 mt-1"><i class="fas fa-map-marker-alt w-4 text-accent text-center"></i> ${a}</p>` : '';

        const photoBoxHtml = this.data.photo 
            ? `<div class="w-[30mm] h-[40mm] bg-slate-100 border-2 border-accent rounded overflow-hidden flex justify-center items-center shrink-0">
                  <img src="${this.data.photo}" class="w-full h-full object-cover object-top">
               </div>` 
            : ``; 

        const profHtml = prof ? `<div class="break-inside-avoid"><h3 class="text-xs font-black uppercase border-b-2 border-slate-300 mb-1 text-slate-900">Profil Profesional</h3><p class="text-[10px] leading-relaxed text-justify">${prof}</p></div>` : '';
        const skillsHtml = skills ? `<div class="break-inside-avoid"><h3 class="text-xs font-black uppercase border-b-2 border-slate-300 mb-1 text-slate-900">Keahlian (Skills)</h3><p class="text-[10px] font-bold text-accent leading-relaxed">${skills}</p></div>` : '';
        const certHtml = cert ? `<div class="break-inside-avoid"><h3 class="text-xs font-black uppercase border-b-2 border-slate-300 mb-1 text-slate-900">Lisensi & Sertifikasi</h3><p class="text-[10px] leading-relaxed text-slate-800">${cert}</p></div>` : '';

        const validExps = this.data.exps.filter(x => (x.role && x.role.trim()!=='') || (x.comp && x.comp.trim()!=='') || (x.year && x.year.trim()!=='') || (x.desc && x.desc.trim()!==''));
        const validEdus = this.data.edus.filter(x => (x.school && x.school.trim()!=='') || (x.degree && x.degree.trim()!=='') || (x.year && x.year.trim()!==''));
        const validPrjs = this.data.prjs ? this.data.prjs.filter(x => (x.name && x.name.trim()!=='') || (x.inst && x.inst.trim()!=='') || (x.year && x.year.trim()!=='') || (x.desc && x.desc.trim()!=='')) : [];

        p.className = `a4-sheet p-[15mm] ${this.data.font} ${this.data.theme} bg-white text-slate-800 relative`;
        p.innerHTML = `
            <div class="flex gap-5 border-b-[3px] border-accent pb-4 mb-4 items-center">
                ${photoBoxHtml}
                <div class="flex-1">
                    <h1 class="text-3xl font-black uppercase leading-none text-accent break-words">${n}</h1>
                    <h2 class="text-[11px] font-bold uppercase tracking-[0.2em] mt-1 mb-3 text-slate-600">${t}</h2>
                    <div class="grid grid-cols-2 gap-y-1 text-[9px] font-bold text-slate-700">
                        ${ttlHtml} ${phHtml} ${portHtml} ${eHtml} ${aHtml}
                    </div>
                </div>
            </div>
            <div class="space-y-4">
                ${profHtml}
                ${skillsHtml}
                ${certHtml}
                
                ${validExps.length > 0 ? `<div><h3 class="text-xs font-black uppercase border-b-2 border-slate-300 mb-1 text-slate-900">Pengalaman Kerja</h3><div class="space-y-3">${validExps.map(x=>`<div class="break-inside-avoid"><div class="flex justify-between"><div class="flex-1"><p class="text-[11px] font-bold text-accent">${x.role||'Posisi'}</p><p class="text-[10px] font-bold">${x.comp||'Perusahaan'}</p></div><div class="text-[10px] font-bold text-slate-600">${x.year||'Tahun'}</div></div>${x.desc ? `<p class="text-[9.5px] mt-1 text-slate-700 leading-relaxed">${x.desc.replace(/\n/g, '<br>')}</p>` : ''}</div>`).join('')}</div></div>` : ''}
                
                ${validEdus.length > 0 ? `<div><h3 class="text-xs font-black uppercase border-b-2 border-slate-300 mb-1 text-slate-900">Pendidikan</h3><div class="space-y-2">${validEdus.map(x=>`<div class="flex justify-between break-inside-avoid mb-2"><div class="flex-1"><p class="text-[11px] font-bold text-accent">${x.school||'Sekolah/Kampus'}</p><p class="text-[10px] font-bold">${x.degree||'Jurusan'} ${x.score ? `<span class="text-slate-500 font-normal">| IPK: ${x.score}</span>` : ''}</p></div><div class="text-[10px] font-bold text-slate-600">${x.year||'Tahun'}</div></div>`).join('')}</div></div>` : ''}

                ${validPrjs.length > 0 ? `<div><h3 class="text-xs font-black uppercase border-b-2 border-slate-300 mb-1 text-slate-900">Proyek & Organisasi</h3><div class="space-y-3">${validPrjs.map(x=>`<div class="break-inside-avoid"><div class="flex justify-between"><div class="flex-1"><p class="text-[11px] font-bold text-accent">${x.name||'Proyek / Organisasi'}</p><p class="text-[10px] font-bold">${x.inst||'Institusi'}</p></div><div class="text-[10px] font-bold text-slate-600">${x.year||'Tahun'}</div></div>${x.desc ? `<p class="text-[9.5px] mt-1 text-slate-700 leading-relaxed">${x.desc.replace(/\n/g, '<br>')}</p>` : ''}</div>`).join('')}</div></div>` : ''}
            </div>
            
            <div class="mt-12 flex justify-end w-full page-break-inside-avoid">
                <div class="text-center w-48">
                    <p class="text-[10px] font-bold mb-1">Hormat Saya,</p>
                    <div class="h-14 flex items-center justify-center">${this.data.sig ? `<img src="${this.data.sig}" class="max-h-full">` : ''}</div>
                    <p class="text-[10px] font-black border-t-[1.5px] border-accent uppercase pt-1 mt-1">${n}</p>
                </div>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', () => { window.appCV = new CVBuilder(); });
