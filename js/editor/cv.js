document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGER ---
    let cvData = { photo: '', signature: '', experiences: [], educations: [], projects: [] };
    let cvConfig = { theme: 'theme-navy', font: 'font-sans', showQR: true };

    const paper = document.getElementById('cv-paper');
    const inputs = ['name', 'title', 'ttl', 'port', 'phone', 'email', 'address', 'profile', 'skills', 'cert'];
    
    const getVal = (id) => {
        const el = document.getElementById(`cv-${id}`);
        return el ? el.value : '';
    };

    // --- INJEKSI UI TOGGLE QR ---
    const injectQRUI = () => {
        if(document.getElementById('toggle-qr')) return;
        const configPanel = document.querySelector('.cv-theme')?.parentElement?.parentElement?.parentElement;
        if (configPanel) {
            const qrDiv = document.createElement('div');
            qrDiv.className = 'mt-4 pt-4 border-t border-slate-700 flex justify-between items-center';
            qrDiv.innerHTML = `
                <span class="text-[#d4af37] text-[10px] font-black uppercase tracking-widest"><i class="fas fa-qrcode mr-2"></i> Tampilkan QR</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="toggle-qr" class="sr-only peer" ${cvConfig.showQR ? 'checked' : ''}>
                  <div class="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#d4af37] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
            `;
            configPanel.appendChild(qrDiv);
            document.getElementById('toggle-qr').addEventListener('change', (e) => {
                cvConfig.showQR = e.target.checked;
                renderCV(); saveToLocal();
            });
        }
    };

    // --- LOCAL STORAGE ---
    const saveToLocal = () => {
        let textData = {};
        inputs.forEach(id => textData[id] = getVal(id));
        localStorage.setItem('cv_magic_storage', JSON.stringify({ textData, cvData, cvConfig }));
    };

    const loadFromLocal = () => {
        const saved = localStorage.getItem('cv_magic_storage');
        if (saved) {
            const parsed = JSON.parse(saved);
            cvData = parsed.cvData || cvData;
            cvConfig = parsed.cvConfig || cvConfig;
            if(parsed.textData) {
                inputs.forEach(id => {
                    const el = document.getElementById(`cv-${id}`);
                    if(el && parsed.textData[id]) el.value = parsed.textData[id];
                });
            }
            if (cvData.photo) {
                const container = document.getElementById('cv-photo').parentElement;
                container.style.backgroundImage = `url(${cvData.photo})`;
                container.style.backgroundSize = 'cover';
                container.querySelector('i').classList.add('hidden');
                container.querySelector('p').classList.add('hidden');
                document.getElementById('btn-remove-photo').classList.remove('hidden');
            }
            if (cvData.signature) {
                const btn = document.getElementById('btn-open-sig');
                btn.classList.add('border-[#d4af37]', 'text-[#d4af37]');
                btn.querySelector('p').innerText = "TTD TERSIMPAN";
            }
            cvData.experiences.forEach(i => rebuildList('cv-exp-list', i));
            cvData.educations.forEach(i => rebuildList('cv-edu-list', i));
            cvData.projects.forEach(i => rebuildList('cv-prj-list', i));
        }
        injectQRUI();
        updateActiveUI();
    };

    function rebuildList(containerId, data) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'bg-slate-900 p-3 rounded border border-slate-700 relative group space-y-2 mb-2';
        const placeholders = containerId === 'cv-exp-list' ? ['Perusahaan', 'Posisi', 'Tahun'] : ['Sekolah', 'Jurusan', 'Tahun'];
        div.innerHTML = `
            <button class="absolute top-2 right-2 text-red-500 hidden group-hover:block" onclick="removeListItem('${containerId}', ${data.id})"><i class="fas fa-trash"></i></button>
            <input type="text" value="${data.title}" placeholder="${placeholders[0]}" class="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 outline-none focus:border-[#d4af37]" oninput="updateListData('${containerId}', ${data.id}, 'title', this.value)">
            <div class="flex gap-2">
                <input type="text" value="${data.subtitle}" placeholder="${placeholders[1]}" class="flex-1 bg-slate-800 text-white text-xs p-2 rounded border border-slate-700" oninput="updateListData('${containerId}', ${data.id}, 'subtitle', this.value)">
                <input type="text" value="${data.date}" placeholder="${placeholders[2]}" class="w-24 bg-slate-800 text-white text-xs p-2 rounded border border-slate-700" oninput="updateListData('${containerId}', ${data.id}, 'date', this.value)">
            </div>
            <textarea placeholder="Deskripsi..." class="w-full bg-slate-800 text-white text-xs p-2 rounded h-16 outline-none" oninput="updateListData('${containerId}', ${data.id}, 'desc', this.value)">${data.desc}</textarea>
        `;
        container.appendChild(div);
    }

    const updateActiveUI = () => {
        document.querySelectorAll('.cv-theme').forEach(btn => {
            btn.classList.remove('border-white', 'border-2', 'shadow-lg');
            if (btn.dataset.theme === cvConfig.theme) btn.classList.add('border-white', 'border-2', 'shadow-lg');
        });
        document.querySelectorAll('.cv-font').forEach(btn => {
            btn.classList.remove('bg-[#d4af37]', 'text-black');
            btn.classList.add('bg-[#1e293b]', 'text-slate-300');
            if (btn.dataset.font === cvConfig.font) { btn.classList.remove('bg-[#1e293b]', 'text-slate-300'); btn.classList.add('bg-[#d4af37]', 'text-black'); }
        });
    };

    inputs.forEach(id => {
        const el = document.getElementById(`cv-${id}`);
        if(el) el.addEventListener('input', () => { renderCV(); saveToLocal(); });
    });

    document.querySelectorAll('.cv-theme').forEach(btn => btn.addEventListener('click', (e) => { cvConfig.theme = e.target.dataset.theme; updateActiveUI(); renderCV(); saveToLocal(); }));
    document.querySelectorAll('.cv-font').forEach(btn => btn.addEventListener('click', (e) => { cvConfig.font = e.target.dataset.font; updateActiveUI(); renderCV(); saveToLocal(); }));

    // Pas Foto
    const photoInput = document.getElementById('cv-photo');
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                cvData.photo = ev.target.result;
                const container = photoInput.parentElement;
                container.style.backgroundImage = `url(${cvData.photo})`;
                container.style.backgroundSize = 'cover';
                container.querySelector('i').classList.add('hidden');
                container.querySelector('p').classList.add('hidden');
                document.getElementById('btn-remove-photo').classList.remove('hidden');
                renderCV(); saveToLocal();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('btn-remove-photo').onclick = (e) => {
        cvData.photo = ''; photoInput.value = '';
        e.target.closest('button').classList.add('hidden');
        const container = photoInput.parentElement;
        container.style.backgroundImage = 'none';
        container.querySelector('i').classList.remove('hidden');
        container.querySelector('p').classList.remove('hidden');
        renderCV(); saveToLocal();
    };

    // Tanda Tangan
    const canvas = document.getElementById('cv-sig-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
    };

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); });
    canvas.addEventListener('mousemove', (e) => { if(!isDrawing) return; const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); }, {passive:false});
    canvas.addEventListener('touchmove', (e) => { if(!isDrawing) return; e.preventDefault(); const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }, {passive:false});
    canvas.addEventListener('touchend', () => isDrawing = false);

    document.getElementById('btn-open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
    document.getElementById('btn-clear-sig').onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height); cvData.signature = ''; renderCV(); saveToLocal(); };
    document.getElementById('btn-save-sig').onclick = () => {
        cvData.signature = canvas.toDataURL('image/png');
        document.getElementById('modal-sig').classList.add('hidden');
        const btn = document.getElementById('btn-open-sig');
        btn.classList.add('border-[#d4af37]', 'text-[#d4af37]');
        btn.querySelector('p').innerText = "TTD TERSIMPAN";
        renderCV(); saveToLocal();
    };

    window.updateListData = (type, id, key, value) => {
        let arr = type === 'cv-exp-list' ? cvData.experiences : type === 'cv-edu-list' ? cvData.educations : cvData.projects;
        let item = arr.find(x => x.id === id);
        if(item) item[key] = value;
        renderCV(); saveToLocal();
    };

    window.removeListItem = (type, id) => {
        if(type === 'cv-exp-list') cvData.experiences = cvData.experiences.filter(x => x.id !== id);
        if(type === 'cv-edu-list') cvData.educations = cvData.educations.filter(x => x.id !== id);
        if(type === 'cv-prj-list') cvData.projects = cvData.projects.filter(x => x.id !== id);
        document.getElementById(type).innerHTML = '';
        const arr = type === 'cv-exp-list' ? cvData.experiences : type === 'cv-edu-list' ? cvData.educations : cvData.projects;
        arr.forEach(i => rebuildList(type, i));
        renderCV(); saveToLocal();
    };

    document.getElementById('btn-add-exp').onclick = () => { const d = {id:Date.now(),title:'',subtitle:'',date:'',desc:''}; cvData.experiences.push(d); rebuildList('cv-exp-list',d); renderCV(); saveToLocal(); };
    document.getElementById('btn-add-edu').onclick = () => { const d = {id:Date.now(),title:'',subtitle:'',date:'',desc:''}; cvData.educations.push(d); rebuildList('cv-edu-list',d); renderCV(); saveToLocal(); };
    document.getElementById('btn-add-prj').onclick = () => { const d = {id:Date.now(),title:'',subtitle:'',date:'',desc:''}; cvData.projects.push(d); rebuildList('cv-prj-list',d); renderCV(); saveToLocal(); };

    document.getElementById('btn-reset').onclick = () => { if(confirm('Reset semua data?')) { localStorage.removeItem('cv_magic_storage'); location.reload(); } };

    document.getElementById('btn-gen-profile').onclick = () => {
        const exp = document.getElementById('cv-sel-exp').value;
        document.getElementById('cv-profile').value = exp === 'pro' ? "Profesional dengan rekam jejak komprehensif dalam memadukan standarisasi operasional dan efisiensi teknologi. Terbukti mampu mengelola ekosistem data yang kompleks dan merancang solusi digital inovatif." : "Lulusan diploma berdedikasi tinggi dengan fondasi kompetensi klinis yang solid dan penguasaan regulasi yang ketat. Memiliki ketelitian tingkat lanjut dan kemampuan analisis data yang tajam.";
        renderCV(); saveToLocal();
    };

    const tabEdit = document.getElementById('tab-edit'), tabPrev = document.getElementById('tab-prev'), pnlEdit = document.getElementById('panel-editor'), pnlPrev = document.getElementById('panel-preview');
    if(tabEdit && tabPrev){
        tabEdit.onclick = () => { pnlEdit.classList.remove('hidden'); pnlEdit.classList.add('w-full'); pnlPrev.classList.add('hidden'); tabEdit.classList.add('text-[#d4af37]'); tabPrev.classList.remove('text-[#d4af37]'); };
        tabPrev.onclick = () => { pnlPrev.classList.remove('hidden'); pnlPrev.classList.add('flex', 'w-full'); pnlEdit.classList.add('hidden'); tabPrev.classList.add('text-[#d4af37]'); tabEdit.classList.remove('text-[#d4af37]'); };
    }

    function renderCV() {
        let cMain = '#0f172a', cAcc = '#d4af37';
        if(cvConfig.theme === 'theme-emerald') { cMain = '#064e3b'; cAcc = '#10b981'; }
        if(cvConfig.theme === 'theme-dark') { cMain = '#0f172a'; cAcc = '#38bdf8'; }
        if(cvConfig.theme === 'theme-gold') { cMain = '#3f3316'; cAcc = '#d4af37'; }

        const fMain = cvConfig.font === 'font-serif' ? "'Playfair Display', serif" : cvConfig.font === 'font-mono' ? "monospace" : "'Montserrat', sans-serif";
        const formatUl = (t) => t ? `<ul class="list-disc pl-4 space-y-1">` + t.split('\n').filter(x=>x.trim()).map(x => `<li>${x}</li>`).join('') + `</ul>` : '';
        const formatTags = (t) => t ? `<div class="flex flex-wrap gap-2 mt-2">` + t.split('\n').filter(x=>x.trim()).map(x => `<span class="bg-navy text-white text-[10px] px-2 py-1 rounded">${x.replace('- ','')}</span>`).join('') + `</div>` : '';
        const renderItems = (items) => items.map(i => `
            <div class="relative pl-6 border-l-2 border-gray-200 mb-6">
                <div class="absolute w-3 h-3 bg-gold rounded-full -left-[7px] top-1.5"></div>
                <div class="flex justify-between items-start mb-1">
                    <h4 class="text-sm font-bold t-navy uppercase">${i.title || 'Judul'}</h4>
                    <span class="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold">${i.date || 'Tahun'}</span>
                </div>
                <p class="text-xs text-gray-500 mb-2 italic font-semibold">${i.subtitle || 'Sub-Judul'}</p>
                <div class="text-xs text-gray-600 leading-relaxed">${formatUl(i.desc)}</div>
            </div>`).join('');

        const qrData = getVal('port') || 'https://ikram-cyber.web.id';
        const qrColor = cMain.replace('#', '');

        paper.innerHTML = `
            <style>
                .cv-content { font-family: ${fMain}; background: white; width: 100%; min-height: 297mm; display: flex; flex-direction: column; }
                .f-serif { font-family: 'Playfair Display', serif; }
                .t-navy { color: ${cMain}; } .bg-navy { background-color: ${cMain}; }
                .t-gold { color: ${cAcc}; } .bg-gold { background-color: ${cAcc}; }
                .b-gold { border-color: ${cAcc}; } .bl-gold { border-left-color: ${cAcc}; }
            </style>
            <div class="cv-content">
                <div class="bg-navy text-white px-10 py-10 relative flex gap-8 items-center">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-bl-full"></div>
                    ${cvData.photo ? `<div class="z-10 shrink-0"><img src="${cvData.photo}" class="w-[100px] h-[130px] object-cover border-[3px] b-gold rounded shadow-lg"></div>` : ''}
                    <div class="flex-1 z-10">
                        <h1 class="f-serif text-5xl font-bold uppercase mb-2">${getVal('name') || 'NAMA LENGKAP'}</h1>
                        <h2 class="t-gold font-bold tracking-widest uppercase text-sm">${getVal('title') || 'PROFESI / GELAR'}</h2>
                    </div>
                </div>
                <div class="flex-grow grid grid-cols-12">
                    <div class="col-span-4 bg-slate-50 p-8 border-r border-gray-200 flex flex-col gap-6">
                        ${getVal('profile') ? `<div><h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Profil</h3><p class="text-[11px] text-gray-600 leading-relaxed text-justify">${getVal('profile')}</p></div>` : ''}
                        <div class="space-y-2 text-[11px] text-gray-700 font-medium">
                            ${getVal('ttl') ? `<p class="flex items-start"><i class="fas fa-calendar-alt w-5 mt-0.5 t-gold"></i> <span>${getVal('ttl')}</span></p>` : ''}
                            ${getVal('phone') ? `<p class="flex items-center"><i class="fab fa-whatsapp w-5 t-gold"></i> <span>${getVal('phone')}</span></p>` : ''}
                            ${getVal('email') ? `<p class="flex items-center"><i class="fas fa-envelope w-5 t-gold"></i> <span class="break-all">${getVal('email')}</span></p>` : ''}
                            ${getVal('port') ? `<p class="flex items-center"><i class="fas fa-globe w-5 t-gold"></i> <span class="break-all">${getVal('port')}</span></p>` : ''}
                            ${getVal('address') ? `<p class="flex items-start"><i class="fas fa-map-marker-alt w-5 mt-0.5 t-gold"></i> <span>${getVal('address')}</span></p>` : ''}
                        </div>
                        ${getVal('cert') ? `<div><h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Sertifikasi</h3><div class="bg-white p-3 border border-gray-200 rounded border-l-4 bl-gold text-[11px]">${getVal('cert').split('\n').join('<br>')}</div></div>` : ''}
                        ${getVal('skills') ? `<div><h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Kompetensi</h3>${formatTags(getVal('skills'))}</div>` : ''}
                    </div>
                    <div class="col-span-8 p-8 flex flex-col justify-between">
                        <div class="flex flex-col gap-8">
                            ${cvData.experiences.length > 0 ? `<div><h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center"><i class="fas fa-briefcase t-gold mr-3"></i> Pengalaman</h3>${renderItems(cvData.experiences)}</div>` : ''}
                            ${cvData.educations.length > 0 ? `<div><h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center"><i class="fas fa-graduation-cap t-gold mr-3"></i> Pendidikan</h3>${renderItems(cvData.educations)}</div>` : ''}
                            ${cvData.projects.length > 0 ? `<div><h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center"><i class="fas fa-project-diagram t-gold mr-3"></i> Proyek</h3>${renderItems(cvData.projects)}</div>` : ''}
                        </div>
                        <div class="mt-12 pt-4 border-t border-gray-200 flex justify-between items-end">
                            <div class="text-left">
                                ${cvConfig.showQR ? `
                                <div class="flex items-center gap-3">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=${qrColor}&bgcolor=ffffff" crossorigin="anonymous" class="w-14 h-14 border border-gray-300 p-1 bg-white rounded shadow-sm">
                                    <div><p class="text-[8px] text-gray-500 font-bold uppercase mb-0.5">Verifikasi Profil</p><p class="text-[9px] t-navy font-bold">${qrData.replace(/^https?:\/\//, '')}</p></div>
                                </div>` : ''}
                            </div>
                            <div class="text-center w-32">
                                ${cvData.signature ? `
                                <p class="text-[11px] text-gray-600 mb-2">Hormat saya,</p>
                                <img src="${cvData.signature}" class="h-16 mx-auto mb-1" style="mix-blend-mode: multiply;">
                                <p class="text-xs t-navy font-bold border-b border-[#0f172a] inline-block pb-1 px-4">${getVal('name') || 'Nama Lengkap'}</p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    document.getElementById('btn-export-cv').onclick = () => {
        html2pdf().set({ margin:0, filename:`${getVal('name') || 'CV'}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} }).from(paper).save();
    };

    loadFromLocal();
    renderCV();
});
