document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGER ---
    let cvData = {
        photo: '',
        signature: '',
        experiences: [],
        educations: [],
        projects: []
    };

    // --- DOM ELEMENTS ---
    const paper = document.getElementById('cv-paper');
    const inputs = ['name', 'title', 'ttl', 'port', 'phone', 'email', 'address', 'profile', 'skills', 'cert'];
    
    // Auto-update saat ngetik
    inputs.forEach(id => {
        const el = document.getElementById(`cv-${id}`);
        if(el) el.addEventListener('input', renderCV);
    });

    // --- DYNAMIC LIST BUILDERS (Pengalaman, Pendidikan, Proyek) ---
    function createListInput(containerId, listArray, placeholders) {
        const container = document.getElementById(containerId);
        const id = Date.now();
        const obj = { id: id, title: '', subtitle: '', date: '', desc: '' };
        listArray.push(obj);

        const div = document.createElement('div');
        div.className = 'bg-slate-900 p-3 rounded border border-slate-700 relative group space-y-2';
        div.innerHTML = `
            <button class="absolute top-2 right-2 text-red-500 hidden group-hover:block text-[10px]" onclick="removeListItem('${containerId}', ${id})"><i class="fas fa-trash"></i></button>
            <input type="text" placeholder="${placeholders[0]}" class="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-700 outline-none focus:border-[#d4af37]" oninput="updateListData('${containerId}', ${id}, 'title', this.value)">
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
        document.getElementById(type).innerHTML = ''; // Re-render inputs
        
        let arr = type === 'cv-exp-list' ? cvData.experiences : type === 'cv-edu-list' ? cvData.educations : cvData.projects;
        let tempArr = [...arr]; // Copy
        arr.length = 0; // Clear
        tempArr.forEach(item => { // Rebuild
            const place = type === 'cv-exp-list' ? ['Perusahaan', 'Posisi', 'Tahun', 'Deskripsi Kerja'] : 
                          type === 'cv-edu-list' ? ['Nama Sekolah/Kampus', 'Jurusan/Gelar', 'Tahun', 'Deskripsi/Nilai'] : 
                          ['Nama Proyek', 'Peran', 'Tahun', 'Deskripsi Proyek'];
            createListInput(type, arr, place);
            // set values back (simplified for terminal script)
        });
        renderCV();
    };

    document.getElementById('btn-add-exp').onclick = () => createListInput('cv-exp-list', cvData.experiences, ['Perusahaan', 'Posisi', 'Tahun', 'Deskripsi (pisahkan dg Enter)']);
    document.getElementById('btn-add-edu').onclick = () => createListInput('cv-edu-list', cvData.educations, ['Sekolah/Kampus', 'Jurusan', 'Tahun', 'Keterangan']);
    document.getElementById('btn-add-prj').onclick = () => createListInput('cv-prj-list', cvData.projects, ['Nama Proyek', 'Peran', 'Tahun', 'Deskripsi']);

    // --- AUTO PROFILE GENERATOR ---
    document.getElementById('btn-gen-profile').onclick = () => {
        const exp = document.getElementById('cv-sel-exp').value;
        let text = '';
        if(exp === 'pro') text = "Profesional berpengalaman dengan rekam jejak yang solid dalam memimpin proyek, mengoptimalkan proses operasional, dan memberikan solusi strategis. Terbiasa bekerja di lingkungan serba cepat, memadukan keahlian teknis dengan kemampuan analitis untuk mencapai target perusahaan secara konsisten.";
        if(exp === 'fresh') text = "Lulusan baru yang sangat termotivasi, disiplin, dan memiliki semangat belajar tinggi. Memiliki fondasi akademis yang kuat dan siap untuk mengaplikasikan ilmu dalam lingkungan kerja profesional, serta mampu beradaptasi cepat dalam tim untuk memberikan kontribusi positif.";
        if(exp === 'zero') text = "Individu yang berdedikasi tinggi, tekun, dan siap bekerja keras. Memiliki kemampuan komunikasi yang baik, jujur, serta kemauan kuat untuk mempelajari keterampilan baru demi mendukung kelancaran operasional dan kesuksesan tim.";
        
        document.getElementById('cv-profile').value = text;
        renderCV();
    };

    // --- RENDER ENGINE (The Magic) ---
    function renderCV() {
        const getVal = (id) => document.getElementById(`cv-${id}`) ? document.getElementById(`cv-${id}`).value : '';
        
        // Format lists
        const formatUl = (text) => {
            if(!text) return '';
            return `<ul class="list-disc pl-4 space-y-1">` + text.split('\n').filter(t=>t.trim()).map(t => `<li>${t}</li>`).join('') + `</ul>`;
        };
        const formatTags = (text) => {
            if(!text) return '';
            return `<div class="flex flex-wrap gap-2 mt-2">` + text.split('\n').filter(t=>t.trim()).map(t => `<span class="bg-[#0f172a] text-white text-[10px] px-2 py-1 rounded">${t.replace('- ', '')}</span>`).join('') + `</div>`;
        };

        const renderItems = (items) => {
            return items.map(item => `
                <div class="relative pl-6 border-l-2 border-gray-200 mb-6">
                    <div class="absolute w-3 h-3 bg-[#d4af37] rounded-full -left-[7px] top-1.5"></div>
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="text-sm font-bold text-[#0f172a] uppercase">${item.title || 'Judul'}</h4>
                        <span class="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold">${item.date || 'Tahun'}</span>
                    </div>
                    <p class="text-xs text-gray-500 mb-2 italic font-semibold">${item.subtitle || 'Sub-Judul'}</p>
                    <div class="text-xs text-gray-600 leading-relaxed">${formatUl(item.desc)}</div>
                </div>
            `).join('');
        };

        const htmlTemplate = `
            <style>
                .cv-content { font-family: 'Montserrat', sans-serif; background: white; width: 100%; min-height: 297mm; display: flex; flex-direction: column; }
                .f-serif { font-family: 'Playfair Display', serif; }
                .t-navy { color: #0f172a; } .bg-navy { background-color: #0f172a; }
                .t-gold { color: #d4af37; } .bg-gold { background-color: #d4af37; }
                .b-gold { border-color: #d4af37; }
            </style>
            <div class="cv-content">
                <div class="bg-navy text-white px-10 py-10 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-bl-full"></div>
                    <div class="flex justify-between items-center z-10 relative">
                        <div class="flex-1">
                            <h1 class="f-serif text-5xl font-bold tracking-wide uppercase mb-2">${getVal('name') || 'NAMA LENGKAP'}</h1>
                            <h2 class="t-gold font-bold tracking-widest uppercase text-sm">${getVal('title') || 'PROFESI / GELAR'}</h2>
                        </div>
                        <div class="text-right space-y-1.5 border-l border-white/20 pl-4">
                            ${getVal('port') ? `<p class="text-xs text-gray-300"><i class="fas fa-globe t-gold w-5"></i> ${getVal('port')}</p>` : ''}
                            ${getVal('email') ? `<p class="text-xs text-gray-300"><i class="fas fa-envelope t-gold w-5"></i> ${getVal('email')}</p>` : ''}
                            ${getVal('phone') ? `<p class="text-xs text-gray-300"><i class="fab fa-whatsapp t-gold w-5"></i> ${getVal('phone')}</p>` : ''}
                            ${getVal('address') ? `<p class="text-xs text-gray-300"><i class="fas fa-map-marker-alt t-gold w-5"></i> ${getVal('address')}</p>` : ''}
                        </div>
                    </div>
                </div>

                <div class="flex-grow grid grid-cols-12">
                    
                    <div class="col-span-4 bg-slate-50 p-8 border-r border-gray-200 flex flex-col gap-6">
                        ${getVal('profile') ? `
                        <div>
                            <h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Profil</h3>
                            <p class="text-[11px] text-gray-600 leading-relaxed text-justify">${getVal('profile')}</p>
                        </div>` : ''}

                        ${getVal('cert') ? `
                        <div>
                            <h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Lisensi / Sertifikasi</h3>
                            <div class="bg-white p-3 border border-gray-200 rounded shadow-sm border-l-4 border-l-[#d4af37]">
                                <div class="text-[11px] text-gray-700 font-medium">${getVal('cert').split('\n').join('<br>')}</div>
                            </div>
                        </div>` : ''}

                        ${getVal('skills') ? `
                        <div>
                            <h3 class="f-serif t-navy text-lg font-bold border-b-2 b-gold pb-2 mb-3 uppercase">Kompetensi</h3>
                            ${formatTags(getVal('skills'))}
                        </div>` : ''}
                    </div>

                    <div class="col-span-8 p-8 flex flex-col gap-8">
                        ${cvData.experiences.length > 0 ? `
                        <div>
                            <h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center">
                                <i class="fas fa-briefcase t-gold mr-3"></i> Pengalaman Kerja
                            </h3>
                            ${renderItems(cvData.experiences)}
                        </div>` : ''}

                        ${cvData.educations.length > 0 ? `
                        <div>
                            <h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center">
                                <i class="fas fa-graduation-cap t-gold mr-3"></i> Pendidikan
                            </h3>
                            ${renderItems(cvData.educations)}
                        </div>` : ''}

                        ${cvData.projects.length > 0 ? `
                        <div>
                            <h3 class="f-serif t-navy text-2xl font-bold border-b-2 b-gold pb-2 mb-5 uppercase flex items-center">
                                <i class="fas fa-project-diagram t-gold mr-3"></i> Proyek & Portofolio
                            </h3>
                            ${renderItems(cvData.projects)}
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
        paper.innerHTML = htmlTemplate;
    }

    // --- EXPORT PDF (html2pdf) ---
    document.getElementById('btn-export-cv').addEventListener('click', () => {
        const element = document.getElementById('cv-paper');
        const opt = {
            margin:       0,
            filename:     `${document.getElementById('cv-name').value || 'CV'}_IkramCyber.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });

    // TABS MOBILE LOGIC
    const tabEdit = document.getElementById('tab-edit');
    const tabPrev = document.getElementById('tab-prev');
    const pnlEdit = document.getElementById('panel-editor');
    const pnlPrev = document.getElementById('panel-preview');

    if(tabEdit && tabPrev){
        tabEdit.onclick = () => {
            pnlEdit.classList.remove('hidden'); pnlEdit.classList.add('w-full');
            pnlPrev.classList.add('hidden'); pnlPrev.classList.remove('flex');
            tabEdit.classList.replace('bg-[#0f172a]', 'bg-[#1e293b]');
            tabPrev.classList.replace('bg-[#1e293b]', 'bg-[#0f172a]');
            tabEdit.classList.add('border-[#d4af37]/50', 'text-[#d4af37]');
            tabPrev.classList.remove('border-[#d4af37]/50', 'text-[#d4af37]');
            tabPrev.classList.add('text-slate-400', 'border-transparent');
        };
        tabPrev.onclick = () => {
            pnlPrev.classList.remove('hidden'); pnlPrev.classList.add('flex', 'w-full');
            pnlEdit.classList.add('hidden'); pnlEdit.classList.remove('w-full');
            tabPrev.classList.replace('bg-[#0f172a]', 'bg-[#1e293b]');
            tabEdit.classList.replace('bg-[#1e293b]', 'bg-[#0f172a]');
            tabPrev.classList.add('border-[#d4af37]/50', 'text-[#d4af37]');
            tabEdit.classList.remove('border-[#d4af37]/50', 'text-[#d4af37]');
            tabEdit.classList.add('text-slate-400', 'border-transparent');
        };
    }

    // Initial render
    renderCV();
});
