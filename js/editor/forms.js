class CVMagicPro {
    constructor() {
        this.state = {
            tab: 'editor',
            doc: 'cv',
            font: 'font-sans',
            photo: null,
            sig: null,
            exps: [{ role: '', company: '', period: '' }]
        };
        this.init();
    }

    init() {
        this.loadSaved();
        this.bindEvents();
        this.renderExp();
        this.updateUI();
    }

    bindEvents() {
        // Tab System
        document.getElementById('tab-editor').onclick = () => this.switchTab('editor');
        document.getElementById('tab-preview').onclick = () => this.switchTab('preview');
        document.getElementById('sub-cv').onclick = () => this.switchDoc('cv');
        document.getElementById('sub-surat').onclick = () => this.switchDoc('surat');

        // Design
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.onclick = () => {
                this.state.font = btn.dataset.font;
                this.updateUI();
            };
        });

        // Inputs
        const ids = ['in-name', 'in-title', 'in-email', 'in-phone', 'in-address', 'in-profile'];
        ids.forEach(id => {
            document.getElementById(id).oninput = () => {
                localStorage.setItem(`magic_${id}`, document.getElementById(id).value);
                this.updateUI();
            };
        });

        // Photo
        document.getElementById('in-photo').onchange = (e) => {
            const r = new FileReader();
            r.onload = (ev) => { this.state.photo = ev.target.result; this.updateUI(); };
            r.readAsDataURL(e.target.files[0]);
        };

        // Signature
        const canvas = document.getElementById('sig-pad');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        document.getElementById('open-sig').onclick = () => document.getElementById('modal-sig').classList.remove('hidden');
        document.getElementById('clear-sig').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('save-sig').onclick = () => {
            this.state.sig = canvas.toDataURL();
            document.getElementById('modal-sig').classList.add('hidden');
            this.updateUI();
        };

        canvas.onmousedown = () => drawing = true;
        canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
        canvas.onmousemove = (e) => {
            if(!drawing) return;
            ctx.lineWidth = 2; ctx.lineCap = 'round';
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        };

        // Exp
        document.getElementById('add-exp').onclick = () => {
            this.state.exps.push({ role: '', company: '', period: '' });
            this.renderExp();
            this.updateUI();
        };

        // Offline Template
        document.getElementById('btn-auto-write').onclick = () => {
            const role = document.getElementById('in-title').value || "Profesional";
            document.getElementById('in-profile').value = `Individu yang berdedikasi tinggi sebagai ${role} dengan keahlian teknis yang kuat. Memiliki kemampuan analisis yang baik, disiplin, dan mampu bekerja secara tim maupun mandiri untuk mencapai target perusahaan.`;
            document.getElementById('in-profile').dispatchEvent(new Event('input'));
        };

        // Export
        document.getElementById('btn-export').onclick = () => this.export();
    }

    switchTab(t) {
        this.state.tab = t;
        document.getElementById('panel-editor').classList.toggle('hidden', t === 'preview');
        document.getElementById('panel-preview').classList.toggle('hidden', t === 'editor');
        document.getElementById('tab-editor').className = `flex-1 font-bold flex items-center justify-center gap-2 ${t==='editor'?'text-sky-400 border-b-2 border-sky-400':'text-slate-400'}`;
        document.getElementById('tab-preview').className = `flex-1 font-bold flex items-center justify-center gap-2 ${t==='preview'?'text-sky-400 border-b-2 border-sky-400':'text-slate-400'}`;
    }

    switchDoc(d) {
        this.state.doc = d;
        document.getElementById('sub-cv').className = `flex-1 rounded-full py-1 text-xs font-bold ${d==='cv'?'bg-sky-500 text-white':'text-slate-400'}`;
        document.getElementById('sub-surat').className = `flex-1 rounded-full py-1 text-xs font-bold ${d==='surat'?'bg-sky-500 text-white':'text-slate-400'}`;
        this.updateUI();
    }

    renderExp() {
        const list = document.getElementById('exp-list');
        list.innerHTML = '';
        this.state.exps.forEach((ex, i) => {
            const div = document.createElement('div');
            div.className = 'exp-card space-y-2';
            div.innerHTML = `
                <input type="text" placeholder="Posisi" value="${ex.role}" oninput="window.app.updateEx(${i},'role',this.value)" class="w-full bg-slate-900 p-2 text-xs rounded border border-slate-700 outline-none">
                <input type="text" placeholder="Perusahaan" value="${ex.company}" oninput="window.app.updateEx(${i},'company',this.value)" class="w-full bg-slate-900 p-2 text-xs rounded border border-slate-700 outline-none">
                <input type="text" placeholder="Periode" value="${ex.period}" oninput="window.app.updateEx(${i},'period',this.value)" class="w-full bg-slate-900 p-2 text-xs rounded border border-slate-700 outline-none">
            `;
            list.appendChild(div);
        });
    }

    updateEx(i, k, v) { this.state.exps[i][k] = v; this.updateUI(); }

    loadSaved() {
        ['in-name','in-title','in-email','in-phone','in-address','in-profile'].forEach(id => {
            const s = localStorage.getItem(`magic_${id}`);
            if(s) document.getElementById(id).value = s;
        });
    }

    updateUI() {
        const out = document.getElementById('preview-content');
        const d = {
            name: document.getElementById('in-name').value || "NAMA LENGKAP",
            title: document.getElementById('in-title').value || "PROFESI / POSISI",
            email: document.getElementById('in-email').value || "email@anda.com",
            phone: document.getElementById('in-phone').value || "08xx-xxxx",
            address: document.getElementById('in-address').value || "Alamat Anda",
            profile: document.getElementById('in-profile').value || "Profil singkat Anda...",
        };

        out.className = `a4-sheet bg-white p-[15mm] text-slate-900 ${this.state.font}`;
        
        if(this.state.doc === 'cv') {
            out.innerHTML = `
                <div class="flex gap-6 border-b-2 border-sky-500 pb-4 mb-4">
                    <div class="w-[30mm] h-[40mm] bg-slate-100 border rounded overflow-hidden">
                        ${this.state.photo ? `<img src="${this.state.photo}" class="w-full h-full object-cover">` : ''}
                    </div>
                    <div class="flex-1">
                        <h1 class="text-2xl font-black text-sky-600 uppercase">${d.name}</h1>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">${d.title}</p>
                        <div class="text-[10px] space-y-1">
                            <p><i class="fas fa-envelope text-sky-500"></i> ${d.email}</p>
                            <p><i class="fas fa-phone text-sky-500"></i> ${d.phone}</p>
                            <p><i class="fas fa-map-marker-alt text-sky-500"></i> ${d.address}</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <section>
                        <h4 class="text-xs font-black border-b uppercase mb-1">Profil</h4>
                        <p class="text-[10px] leading-relaxed">${d.profile}</p>
                    </section>
                    <section>
                        <h4 class="text-xs font-black border-b uppercase mb-1">Pengalaman</h4>
                        <div class="space-y-2">
                            ${this.state.exps.map(ex => `
                                <div>
                                    <div class="flex justify-between text-[10px] font-bold">
                                        <span>${ex.role}</span><span>${ex.period}</span>
                                    </div>
                                    <p class="text-[9px] text-sky-600">${ex.company}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </div>
                <div class="absolute bottom-10 right-10 text-center">
                    <p class="text-[10px] mb-2 font-bold">Hormat Saya,</p>
                    <div class="h-12 flex justify-center items-center">
                        ${this.state.sig ? `<img src="${this.state.sig}" class="max-h-full">` : ''}
                    </div>
                    <p class="text-[10px] font-black border-t border-slate-900 mt-1 uppercase">${d.name}</p>
                </div>
            `;
        } else {
            out.innerHTML = `
                <div class="text-right text-xs mb-10">${new Date().toLocaleDateString('id-ID')}</div>
                <div class="text-xs mb-10 font-bold">Yth. Pimpinan HRD<br>Di Tempat</div>
                <div class="text-xs leading-relaxed space-y-4">
                    <p>Dengan hormat,</p>
                    <p>Saya yang bertanda tangan di bawah ini, <strong>${d.name}</strong>, bermaksud melamar posisi sebagai <strong>${d.title}</strong>.</p>
                    <p>${d.profile}</p>
                    <p>Demikian surat ini saya sampaikan, atas perhatian Bapak/Ibu saya ucapkan terima kasih.</p>
                </div>
                <div class="mt-20 text-center w-40 ml-auto">
                    <p class="text-xs mb-4">Hormat saya,</p>
                    <div class="h-16 flex justify-center items-center">
                        ${this.state.sig ? `<img src="${this.state.sig}" class="max-h-full">` : ''}
                    </div>
                    <p class="text-xs font-black border-t border-slate-900 pt-1 uppercase">${d.name}</p>
                </div>
            `;
        }
    }

    async export() {
        const btn = document.getElementById('btn-export');
        btn.innerHTML = 'GENERATING...';
        const opt = { margin: 0, filename: 'MagicDoc.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
        await html2pdf().set(opt).from(document.getElementById('preview-content')).save();
        btn.innerHTML = 'BERHASIL';
        setTimeout(() => btn.innerHTML = '<i class="fas fa-print"></i> CETAK PDF', 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => { window.app = new CVMagicPro(); });
