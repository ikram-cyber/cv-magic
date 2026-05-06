document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGER ---
    let cvData = { photo: '', signature: '', experiences: [], educations: [], projects: [] };
    let cvConfig = { theme: 'theme-navy', font: 'font-sans' };

    // --- DOM ELEMENTS ---
    const paper = document.getElementById('cv-paper');
    const inputs = ['name', 'title', 'ttl', 'port', 'phone', 'email', 'address', 'profile', 'skills', 'cert'];
    
    inputs.forEach(id => {
        const el = document.getElementById(`cv-${id}`);
        if(el) el.addEventListener('input', renderCV);
    });

    // --- THEME & FONT SWITCHER ---
    document.querySelectorAll('.cv-theme').forEach(btn => {
        btn.addEventListener('click', (e) => {
            cvConfig.theme = e.target.dataset.theme;
            renderCV();
        });
    });
    document.querySelectorAll('.cv-font').forEach(btn => {
        btn.addEventListener('click', (e) => {
            cvConfig.font = e.target.dataset.font;
            renderCV();
        });
    });

    // ==========================================
    // 📸 FITUR PAS FOTO
    // ==========================================
    const photoInput = document.getElementById('cv-photo');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');
    
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                cvData.photo = event.target.result;
                btnRemovePhoto.classList.remove('hidden');
                const container = photoInput.parentElement;
                container.style.backgroundImage = `url(${cvData.photo})`;
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center';
                container.querySelector('i').classList.add('hidden');
                container.querySelector('p').classList.add('hidden');
                renderCV();
            };
            reader.readAsDataURL(file);
        }
    });

    btnRemovePhoto.addEventListener('click', (e) => {
        e.stopPropagation(); 
        cvData.photo = '';
        photoInput.value = '';
        btnRemovePhoto.classList.add('hidden');
        const container = photoInput.parentElement;
        container.style.backgroundImage = 'none';
        container.querySelector('i').classList.remove('hidden');
        container.querySelector('p').classList.remove('hidden');
        renderCV();
    });

    // ==========================================
    // ✍️ FITUR TANDA TANGAN
    // ==========================================
    const modalSig = document.getElementById('modal-sig');
    const btnOpenSig = document.getElementById('btn-open-sig');
    const btnSaveSig = document.getElementById('btn-save-sig');
    const btnClearSig = document.getElementById('btn-clear-sig');
    const sigUpload = document.getElementById('cv-sig-upload');
    const canvas = document.getElementById('cv-sig-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    const startDraw = (e) => { isDrawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); };
    const draw = (e) => { if (!isDrawing) return; const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); };
    const endDraw = () => { isDrawing = false; ctx.closePath(); };

    canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw); canvas.addEventListener('mouseout', endDraw);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, {passive: false});
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, {passive: false});
    canvas.addEventListener('touchend', endDraw);

    btnOpenSig.addEventListener('click', () => modalSig.classList.remove('hidden'));
    btnClearSig.addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); cvData.signature = ''; });
    btnSaveSig.addEventListener('click', () => {
        cvData.signature = canvas.toDataURL('image/png');
        modalSig.classList.add('hidden');
        btnOpenSig.classList.add('border-[#d4af37]', 'text-[#d4af37]');
        btnOpenSig.querySelector('p').innerText = "TTD TERSIMPAN";
        renderCV();
    });

    sigUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // ==========================================
    // DYNAMIC LIST BUILDERS
    // ==========================================
    function createListInput(containerId, listArray, placeholders) {
        const container = document.getElementById(containerId);
        const id = Date.now();
        const obj = { id: id, title: '', subtitle: '', date: '', desc: '' };
        listArray.push(obj);

        const div = document.createElement('div');
        div.className = 'bg-slate-900 p-3 rounded border border-slate-700 relative group space-y-2';
        div.innerHTML = `
            <button class="absolute top-2 right-2 text-red-500 hidden group-hover:block text-[10px]" onclick="removeListItem('${containerId}', ${id})"><i class="fas fa-trash"></i></button>
            <input type="text" placeholder="${placeholders[0]}" class="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 outline-none focus:border-sky-500" oninput="updateListData('${containerId}', ${id}, 'title', this.value)">
            <div class="flex gap-2">
                <input type="text" placeholder="${placeholders[1]}" class="flex-1 bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 outline-none" oninput="updateListData('${containerId}', ${id}, 'subtitle', this.value)">
                <input type="text" placeholder="${placeholders[2]}" class="w-24 bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 outline-none" oninput="updateListData('${containerId}', ${id}, 'date', this.value)">
            </div>
            <textarea placeholder="${placeholders[3]}" class="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 outline-none h-16 resize-none custom-scroll" oninput="updateListData('${containerId}', ${id}, 'desc', this.value)"></textarea>
        `;
        container.appendChild(div);
        renderCV();
    }

    window.updateListData = (type, id, key, value) => {
        let arr = type === 'cv-exp-list' ? cvData.experiences : type === 'cv-edu-list' ? cvData.educations : cvData.projects;
        let item = arr.find(x => x.id === id);
        if(item) item[key] = value;
        renderCV();
    };

    window.removeListItem = (type, id) => {
        if(type === 'cv-exp-list') cvData.experiences = cvData.experiences.filter(x => x.id !== id);
        if(type === 'cv-edu-list') cvData.educations = cvData.educations.filter(x => x.id !== id);
        if(type === 'cv-prj-list') cvData.projects = cvData.projects.filter(x => x.id !== id);
        document.getElementById(type).innerHTML = ''; 
        let arr = type === 'cv-exp-list' ? cvData.experiences : type === 'cv-edu-list' ? cvData.educations : cvData.projects;
        let tempArr = [...arr]; 
        arr.length = 0; 
        tempArr.forEach(item => { 
            const place = type === 'cv-exp-list' ? ['Perusahaan', 'Posisi', 'Tahun', 'Deskripsi Kerja'] : type === 'cv-edu-list' ? ['Sekolah', 'Jurusan', 'Tahun', 'Keterangan'] : ['Proyek', 'Peran', 'Tahun', 'Deskripsi'];
            createListInput(type, arr, place);
        });
        renderCV();
    };

    document.getElementById('btn-add-exp').onclick = () => createListInput('cv-exp-list', cvData.experiences, ['Perusahaan', 'Posisi', 'Tahun', 'Deskripsi (pisahkan dg Enter)']);
    document.getElementById('btn-add-edu').onclick = () => createListInput('cv-edu-list', cvData.educations, ['Kampus/Sekolah', 'Jurusan', 'Tahun', 'Keterangan']);
    document.getElementById('btn-add-prj').onclick = () => createListInput('cv-prj-list', cvData.projects, ['Nama Proyek', 'Peran', 'Tahun', 'Deskripsi']);

    document.getElementById('btn-gen-profile').onclick = () => {
        const exp = document.getElementById('cv-sel-exp').value;
        let text = exp === 'pro' ? "Profesional berpengalaman dengan rekam jejak yang solid dalam memimpin proyek, mengoptimalkan proses operasional, dan memberikan solusi strategis. Terbiasa bekerja di lingkungan serba cepat, memadukan keahlian teknis dengan kemampuan analitis untuk mencapai target perusahaan secara konsisten." : exp === 'fresh' ? "Lulusan baru yang sangat termotivasi, disiplin, dan memiliki semangat belajar tinggi. Memiliki fondasi akademis yang kuat dan siap untuk mengaplikasikan ilmu dalam lingkungan kerja profesional." : "Individu yang berdedikasi tinggi, tekun, dan siap bekerja keras. Memiliki kemampuan komunikasi yang baik, jujur, serta kemauan kuat untuk mempelajari keterampilan baru.";
        document.getElementById('cv-profile').value = text;
        renderCV();
    };

    // --- RENDER ENGINE ---
    function renderCV() {
        const getVal = (id) => document.getElementById(`cv-${id}`) ? document.getElementById(`cv-${id}`).value : '';
        
        let cMain = '#0f172a', cAcc = '#d4af37';
        if(cvConfig.theme === 'theme-emerald') { cMain = '#064e3b'; cAcc = '#10b981'; }
        if(cvConfig.theme === 'theme-dark') { cMain = '#0f172a'; cAcc = '#38bdf8'; }
        if(cvConfig.theme === 'theme-gold') { cMain = '#3f3316'; cAcc = '#d4af37'; }

        let fMain = "'Montserrat', sans-serif";
        if(cvConfig.font === 'font-serif') fMain = "'Playfair Display', serif";
        if(cvConfig.font === 'font-mono') fMain = "monospace";

        const formatUl = (text) => text ? `<ul class="list-disc pl-4 space-y-1">` + text.split('\n').filter(t=>t.trim()).map(t => `<li>${t}</li>`).join('') + `</ul>` : '';
        const formatTags = (text) => text ? `<div class="flex flex-wrap gap-2 mt-2">` + text.split('\n').filter(t=>t.trim()).map(t => `<span class="bg-navy text-white text-[10px] px-2 py-1 rounded">${t.replace('- ', '')}</span>`).join('') + `</div>` : '';

        const renderItems = (items) => items.map(item => `
            <div class="relative pl-6 border-l-2 border-gray-200 mb-6">
                <div class="absolute w-3 h-3 bg-gold rounded-full -left-[7px] top-1.5"></div>
                <div class="flex justify-between items-start mb-1">
                    <h4 class="text-sm font-bold t-navy uppercase">${item.title || 'Judul'}</h4>
                    <span class="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold">${item.date || 'Tahun'}</span>
                </div>
                <p class="text-xs text-gray-500 mb-2 italic font-semibold">${item.subtitle || 'Sub-Judul'}</p>
                <div class="text-xs text-gray-600 leading-relaxed">${formatUl(item.desc)}</div>
            </div>
        `).join('');

        const htmlTemplate = `
            <style>
                .cv-content { font-family: ${fMain}; background: white; width: 100%; min-height: 297mm; display: flex; flex-direction: column; }
                .f-serif { font-family: 'Playfair Display', serif; }
                .t-navy { color: ${cMain}; } .bg-navy { background-color: ${cMain}; }
                .t-gold { color: ${cAcc}; } .bg-gold { background-color: ${cAcc}; }
                .b-gold { border-color: ${cAcc}; } .bl-gold { border-left-color: ${cAcc}; }
            </style>
            <div class="cv-content">
                <div class="bg-navy text-white px-10 py-10 relative overflow-hidden flex gap-8 items-center">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-bl-full"></div>
                    ${cvData.photo ? `<div class="z-10 relative shrink-0"><img src="${cvData.photo}" class="w-[100px] h-[130px] object-cover border-[3px] b-gold shadow-lg rounded"></div>` : ''}
                    <div class="flex flex-1 items-center z-10 relative">
                        <div>
                            <h1 class="f-serif text-5xl font-bold tracking-wide uppercase mb-2">${getVal('name') || 'NAMA LENGKAP'}</h1>
                            <h2 class="t-gold font-bold tracking-widest uppercase text-sm">${getVal('title') || 'PROFESI / GELAR'}</h2>
                        </div>
                    </div>
                </div>

                <div class="flex-grow grid grid-cols-12">
                    <div class="col-span-4 bg-slate-50 p-8 border-r border-gray-200 flex flex-col gap-6">
                        ${getVal('profile') ? `<div><h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Profil</h3><p class="text-[11px] text-gray-600 leading-relaxed text-justify">${getVal('profile')}</p></div>` : ''}
                        
                        <div class="pt-1">
                            <div class="space-y-2 text-[11px] text-gray-700 font-medium">
                                ${getVal('ttl') ? `<p class="flex items-start"><i class="fas fa-calendar-alt w-5 mt-0.5 t-gold"></i> <span>${getVal('ttl')}</span></p>` : ''}
                                ${getVal('phone') ? `<p class="flex items-center"><i class="fab fa-whatsapp w-5 t-gold"></i> <span>${getVal('phone')}</span></p>` : ''}
                                ${getVal('email') ? `<p class="flex items-center"><i class="fas fa-envelope w-5 t-gold"></i> <span class="break-all">${getVal('email')}</span></p>` : ''}
                                ${getVal('port') ? `<p class="flex items-center"><i class="fas fa-globe w-5 t-gold"></i> <span class="break-all">${getVal('port')}</span></p>` : ''}
                                ${getVal('address') ? `<p class="flex items-start"><i class="fas fa-map-marker-alt w-5 mt-0.5 t-gold"></i> <span>${getVal('address')}</span></p>` : ''}
                            </div>
                        </div>

                        ${getVal('cert') ? `<div><h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Lisensi / Sertifikasi</h3><div class="bg-white p-3 border border-gray-200 rounded shadow-sm border-l-4 bl-gold"><div class="text-[11px] text-gray-700 font-medium">${getVal('cert').split('\n').join('<br>')}</div></div></div>` : ''}
                        ${getVal('skills') ? `<div><h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Kompetensi</h3>${formatTags(getVal('skills'))}</div>` : ''}
                    </div>

                    <div class="col-span-8 p-8 flex flex-col justify-between">
                        <div class="flex flex-col gap-8">
                            ${cvData.experiences.length > 0 ? `<div><h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center"><i class="fas fa-briefcase t-gold mr-3"></i> Pengalaman Kerja</h3>${renderItems(cvData.experiences)}</div>` : ''}
                            ${cvData.educations.length > 0 ? `<div><h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center"><i class="fas fa-graduation-cap t-gold mr-3"></i> Pendidikan</h3>${renderItems(cvData.educations)}</div>` : ''}
                            ${cvData.projects.length > 0 ? `<div><h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center"><i class="fas fa-project-diagram t-gold mr-3"></i> Proyek & Portofolio</h3>${renderItems(cvData.projects)}</div>` : ''}
                        </div>
                        <div class="mt-12 pt-4 border-t border-gray-200 flex justify-end">
                            <div class="text-center">
                                <p class="text-[11px] text-gray-600 mb-2">Hormat saya,</p>
                                ${cvData.signature ? `<img src="${cvData.signature}" class="h-16 mx-auto mb-1" style="mix-blend-mode: multiply;">` : '<div class="h-16"></div>'}
                                <p class="text-xs t-navy font-bold border-b border-[#0f172a] inline-block pb-1 px-4">${getVal('name') || 'Nama Lengkap'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        paper.innerHTML = htmlTemplate;
    }

    document.getElementById('btn-export-cv').addEventListener('click', () => {
        const opt = { margin: 0, filename: `${document.getElementById('cv-name').value || 'CV'}_IkramCyber.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }};
        html2pdf().set(opt).from(document.getElementById('cv-paper')).save();
    });

    const tabEdit = document.getElementById('tab-edit'), tabPrev = document.getElementById('tab-prev'), pnlEdit = document.getElementById('panel-editor'), pnlPrev = document.getElementById('panel-preview');
    if(tabEdit && tabPrev){
        tabEdit.onclick = () => { pnlEdit.classList.remove('hidden'); pnlEdit.classList.add('w-full'); pnlPrev.classList.add('hidden'); pnlPrev.classList.remove('flex'); tabEdit.classList.replace('bg-[#0f172a]', 'bg-[#1e293b]'); tabPrev.classList.replace('bg-[#1e293b]', 'bg-[#0f172a]'); tabEdit.classList.add('border-[#d4af37]/50', 'text-[#d4af37]'); tabPrev.classList.remove('border-[#d4af37]/50', 'text-[#d4af37]'); tabPrev.classList.add('text-slate-400', 'border-transparent'); };
        tabPrev.onclick = () => { pnlPrev.classList.remove('hidden'); pnlPrev.classList.add('flex', 'w-full'); pnlEdit.classList.add('hidden'); pnlEdit.classList.remove('w-full'); tabPrev.classList.replace('bg-[#0f172a]', 'bg-[#1e293b]'); tabEdit.classList.replace('bg-[#1e293b]', 'bg-[#0f172a]'); tabPrev.classList.add('border-[#d4af37]/50', 'text-[#d4af37]'); tabEdit.classList.remove('border-[#d4af37]/50', 'text-[#d4af37]'); tabEdit.classList.add('text-slate-400', 'border-transparent'); };
    }
    renderCV();
});
