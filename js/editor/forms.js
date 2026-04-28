/**
 * DOCUMAGIC CORE ENGINE v5.0
 * Fitur: Tabs, Multi-Experience, Design Studio, Offline AI, Signature, Export.
 */

class DocuMagic {
    constructor() {
        this.state = {
            activeTab: 'editor',
            activeDoc: 'cv',
            activeFont: 'font-sans',
            activeStyle: 'classic',
            experiences: [
                { role: 'Asisten Apoteker (Intern)', company: 'Kimia Farma', period: 'Mei 2023 - Jun 2023' }
            ],
            signature: null,
            photo: null
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderExperiences();
        this.updatePreview();
        console.log("DocuMagic: System Reborn and Stable.");
    }

    bindEvents() {
        // Tab Editor vs Preview
        document.getElementById('tab-editor').onclick = () => this.switchTab('editor');
        document.getElementById('tab-preview').onclick = () => this.switchTab('preview');

        // Sub Tab CV vs Surat
        document.getElementById('sub-cv').onclick = () => this.switchDoc('cv');
        document.getElementById('sub-surat').onclick = () => this.switchDoc('surat');

        // Studio Desain
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('border-sky-500', 'bg-slate-600'));
                btn.classList.add('border-sky-500', 'bg-slate-600');
                this.state.activeFont = btn.dataset.font;
                this.updatePreview();
            };
        });

        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('border-sky-500'));
                btn.classList.add('border-sky-500');
                this.state.activeStyle = btn.dataset.style;
                this.updatePreview();
            };
        });

        // Live Inputs
        const ids = ['in-name', 'in-ttl', 'in-title', 'in-email', 'in-phone', 'in-address', 'in-portfolio', 'in-profile-text'];
        ids.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.updatePreview());
        });

        // Photo Upload
        document.getElementById('in-photo').onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.state.photo = ev.target.result;
                this.updatePreview();
            };
            reader.readAsDataURL(e.target.files[0]);
        };

        // Signature Modal
        const canvas = document.getElementById('sig-pad');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        document.getElementById('open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('clear-sig').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('save-sig').onclick = () => {
            this.state.signature = canvas.toDataURL();
            document.getElementById('modal-sig').classList.add('hidden');
            this.updatePreview();
        };

        canvas.onmousedown = () => drawing = true;
        canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
        canvas.onmousemove = (e) => {
            if(!drawing) return;
            ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        };

        // Add Experience
        document.getElementById('add-exp').onclick = () => {
            this.state.experiences.push({ role: '', company: '', period: '' });
            this.renderExperiences();
            this.updatePreview();
        };

        // Offline AI Write
        document.getElementById('btn-ai-write').onclick = () => this.generateAITemplate();

        // Export PDF
        document.getElementById('btn-export').onclick = () => this.exportPDF();
    }

    switchTab(tab) {
        this.state.activeTab = tab;
        const editor = document.getElementById('panel-editor');
        const preview = document.getElementById('panel-preview');
        const btnE = document.getElementById('tab-editor');
        const btnP = document.getElementById('tab-preview');

        if(tab === 'editor') {
            editor.classList.remove('hidden'); preview.classList.add('hidden');
            btnE.className = "flex-1 h-full font-bold text-sky-400 border-b-2 border-sky-400 flex items-center justify-center gap-2";
            btnP.className = "flex-1 h-full font-bold text-slate-400 flex items-center justify-center gap-2";
        } else {
            editor.classList.add('hidden'); preview.classList.remove('hidden');
            btnP.className = "flex-1 h-full font-bold text-sky-400 border-b-2 border-sky-400 flex items-center justify-center gap-2";
            btnE.className = "flex-1 h-full font-bold text-slate-400 flex items-center justify-center gap-2";
        }
    }

    switchDoc(doc) {
        this.state.activeDoc = doc;
        const btnC = document.getElementById('sub-cv');
        const btnS = document.getElementById('sub-surat');
        
        btnC.className = `flex-1 rounded-full py-1 text-xs font-bold ${doc === 'cv' ? 'bg-sky-500 text-white' : 'text-slate-400'}`;
        btnS.className = `flex-1 rounded-full py-1 text-xs font-bold ${doc === 'surat' ? 'bg-sky-500 text-white' : 'text-slate-400'}`;
        
        this.updatePreview();
    }

    renderExperiences() {
        const list = document.getElementById('exp-list');
        list.innerHTML = '';
        this.state.experiences.forEach((exp, i) => {
            const div = document.createElement('div');
            div.className = 'exp-item space-y-2 relative';
            div.innerHTML = `
                <button class="absolute top-2 right-2 text-red-500 text-xs" onclick="window.docu.removeExp(${i})"><i class="fas fa-trash"></i></button>
                <input type="text" placeholder="Posisi / Jabatan" value="${exp.role}" oninput="window.docu.updateExp(${i}, 'role', this.value)" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs outline-none">
                <div class="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Instansi" value="${exp.company}" oninput="window.docu.updateExp(${i}, 'company', this.value)" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs outline-none">
                    <input type="text" placeholder="Periode" value="${exp.period}" oninput="window.docu.updateExp(${i}, 'period', this.value)" class="bg-slate-900 border border-slate-700 rounded p-2 text-xs outline-none">
                </div>
            `;
            list.appendChild(div);
        });
    }

    updateExp(i, key, val) {
        this.state.experiences[i][key] = val;
        this.updatePreview();
    }

    removeExp(i) {
        this.state.experiences.splice(i, 1);
        this.renderExperiences();
        this.updatePreview();
    }

    generateAITemplate() {
        const name = document.getElementById('in-name').value || "Ikram Abdurrohman";
        const title = document.getElementById('in-title').value || "Tenaga Teknis Kefarmasian";
        
        const templates = {
            mandiri: `Individu bermotivasi tinggi yang terus mengembangkan kapasitas diri secara mandiri. Memiliki fondasi keahlian yang solid dalam bidang farmasi, adaptif, dan sangat antusias untuk mendedikasikan kemampuan di lingkungan kerja profesional.`,
            fresh: `Lulusan D3 Farmasi yang memiliki STRTTK aktif dengan pengalaman magang di apotek terkemuka. Terampil dalam manajemen obat dan pelayanan pasien, serta memiliki minat kuat dalam integrasi teknologi perangkat lunak.`,
            pro: `Profesional di bidang Farmasi dengan rekam jejak yang terbukti dalam pelayanan kefarmasian dan kepatuhan regulasi. Menggabungkan kemahiran teknis STRTTK dengan keahlian pengembangan aplikasi Python untuk efisiensi sistem kerja.`
        };

        const mode = document.getElementById('in-profile-mode').value;
        document.getElementById('in-profile-text').value = templates[mode];
        this.updatePreview();
    }

    updatePreview() {
        const out = document.getElementById('preview-content');
        const data = {
            name: document.getElementById('in-name').value || "IKRAM ABDURROHMAN",
            ttl: document.getElementById('in-ttl').value || "Sumedang, 10 September 1999",
            title: document.getElementById('in-title').value || "TENAGA TEKNIS KEFARMASIAN & DEVELOPER",
            email: document.getElementById('in-email').value || "ikram.ujrc@gmail.com",
            phone: document.getElementById('in-phone').value || "0821-2343-6383",
            address: document.getElementById('in-address').value || "Jl. Peta Utara II No.157, Kalideres, Jakarta",
            profile: document.getElementById('in-profile-text').value || "Deskripsi profil Anda...",
            experiences: this.state.experiences
        };

        out.className = `a4-sheet bg-white p-[15mm] text-slate-900 ${this.state.activeFont} relative`;

        if(this.state.activeDoc === 'cv') {
            out.innerHTML = `
                <div class="flex items-start gap-6 border-b-2 border-sky-500 pb-4 mb-6">
                    <div class="w-[30mm] h-[40mm] bg-slate-100 border rounded-lg overflow-hidden shrink-0">
                        ${this.state.photo ? `<img src="${this.state.photo}" class="w-full h-full object-cover">` : ''}
                    </div>
                    <div class="flex-1">
                        <h1 class="text-2xl font-black text-sky-600 uppercase tracking-tighter">${data.name}</h1>
                        <p class="text-[10px] font-bold text-slate-500 mb-4 tracking-[0.2em] uppercase">${data.title}</p>
                        <div class="grid grid-cols-1 gap-1 text-[9px] font-bold text-slate-600">
                            <p><i class="fas fa-map-marker-alt text-sky-500 w-4"></i> ${data.address}</p>
                            <p><i class="fas fa-phone text-sky-500 w-4"></i> ${data.phone}</p>
                            <p><i class="fas fa-envelope text-sky-500 w-4"></i> ${data.email}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <section>
                        <h4 class="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2 border-b">Profil Profesional</h4>
                        <p class="text-[10px] leading-relaxed">${data.profile}</p>
                    </section>
                    
                    <section>
                        <h4 class="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2 border-b">Pengalaman</h4>
                        <div class="space-y-3">
                            ${data.experiences.map(exp => `
                                <div>
                                    <div class="flex justify-between font-bold text-[10px]">
                                        <span>${exp.role}</span>
                                        <span class="text-slate-400">${exp.period}</span>
                                    </div>
                                    <p class="text-[9px] text-sky-600">${exp.company}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section>
                        <h4 class="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2 border-b">Lisensi & Sertifikasi</h4>
                        <ul class="text-[9px] space-y-1 list-disc list-inside">
                            <li>STRTTK (Tenaga Teknis Kefarmasian) Aktif</li>
                            <li>Sertifikat Brevet Pajak A & B</li>
                            <li>Food Safety Training Certification</li>
                        </ul>
                    </section>
                </div>

                <div class="absolute bottom-10 right-10 text-center">
                    <p class="text-[9px] mb-2 font-bold">Hormat Saya,</p>
                    <div class="h-12 flex justify-center items-center">
                        ${this.state.signature ? `<img src="${this.state.signature}" class="max-h-full">` : ''}
                    </div>
                    <p class="text-[10px] font-black border-t border-slate-900 pt-1 uppercase">${data.name}</p>
                </div>
            `;
        } else {
            // Template Surat Lamaran
            out.innerHTML = `
                <div class="text-right text-[10px] mb-10">Jakarta, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                <div class="text-[10px] mb-8">
                    <p class="font-bold">Yth. HRD Manager</p>
                    <p>Di Tempat</p>
                </div>
                <div class="text-[10px] leading-relaxed space-y-4">
                    <p>Dengan hormat,</p>
                    <p>Melalui surat ini, saya bermaksud menyampaikan ketertarikan saya untuk mengisi posisi <strong>${data.title}</strong> di perusahaan yang Bapak/Ibu pimpin.</p>
                    <p>${data.profile}</p>
                    <p>Besar harapan saya untuk dapat mendiskusikan peluang ini lebih lanjut. Atas perhatiannya, saya ucapkan terima kasih.</p>
                </div>
                <div class="mt-20 text-center w-40 ml-auto">
                    <p class="text-[10px] mb-2 font-bold">Hormat saya,</p>
                    <div class="h-12 flex justify-center items-center">
                        ${this.state.signature ? `<img src="${this.state.signature}" class="max-h-full">` : ''}
                    </div>
                    <p class="text-[10px] font-black border-t border-slate-900 pt-1 uppercase">${data.name}</p>
                </div>
            `;
        }
    }

    async exportPDF() {
        const btn = document.getElementById('btn-export');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING...';
        
        const element = document.getElementById('preview-content');
        const opt = {
            margin: 0,
            filename: `Ikram_Document_${this.state.activeDoc}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
        } catch (e) {
            btn.innerHTML = 'GAGAL';
            window.print();
        } finally {
            setTimeout(() => btn.innerHTML = '<i class="fas fa-print text-xl"></i> CETAK DOKUMEN', 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.docu = new DocuMagic();
});
