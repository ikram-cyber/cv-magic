import { State } from '../core/state.js';
import { Magic } from '../utils/magic.js';

export const FormEditor = {
    init() {
        // Upload Foto
        document.getElementById('input-photo')?.addEventListener('change', (e) => {
            if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => State.update('photo', ev.target.result); r.readAsDataURL(e.target.files[0]); }
        });
        // Upload Tanda Tangan
        document.getElementById('input-signature')?.addEventListener('change', (e) => {
            if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => State.update('signature', ev.target.result); r.readAsDataURL(e.target.files[0]); }
        });

        // Input Standar
        ['name', 'dob', 'role', 'email', 'phone', 'address', 'link', 'summary', 'skills', 'education'].forEach(key => {
            document.getElementById(`input-${key}`)?.addEventListener('input', (e) => State.update(key, e.target.value));
        });
        document.getElementById('input-color')?.addEventListener('input', (e) => State.update('color', e.target.value));

        // Font Engine
        document.getElementById('btn-font-modern')?.addEventListener('click', () => State.update('font', 'font-sans'));
        document.getElementById('btn-font-classic')?.addEventListener('click', () => State.update('font', 'font-serif'));
        document.getElementById('btn-font-tech')?.addEventListener('click', () => State.update('font', 'font-mono'));

        // Fitur Lama (AI, Lang, Mode)
        document.getElementById('btn-ai-writer')?.addEventListener('click', () => {
            const autoText = Magic.generateSummary(State.data.role, State.data.lang);
            State.update('summary', autoText); document.getElementById('input-summary').value = autoText;
        });
        document.getElementById('btn-lang-toggle')?.addEventListener('click', () => State.update('lang', State.data.lang === 'id' ? 'en' : 'id'));
        
        const btnCV = document.getElementById('btn-mode-cv'); const btnCL = document.getElementById('btn-mode-cl');
        if(btnCV && btnCL) {
            btnCV.addEventListener('click', () => { State.update('mode', 'cv'); btnCV.className = "bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded shadow"; btnCL.className = "bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded border border-slate-600"; });
            btnCL.addEventListener('click', () => { State.update('mode', 'cover-letter'); btnCL.className = "bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded shadow"; btnCV.className = "bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded border border-slate-600"; });
        }
        this.renderExp();
    },

    renderExp() {
        const container = document.getElementById('exp-container'); if(!container) return; container.innerHTML = '';
        State.data.experiences.forEach((exp, index) => {
            const div = document.createElement('div'); div.className = "p-3 bg-slate-800 rounded border border-slate-700 relative mb-4";
            div.innerHTML = `<div class="absolute top-2 right-2 flex gap-3 text-sm">${index > 0 ? `<i class="fas fa-arrow-up text-cyan-500 cursor-pointer" onclick="window.moveExp(${index}, -1)"></i>` : ''}${index < State.data.experiences.length - 1 ? `<i class="fas fa-arrow-down text-cyan-500 cursor-pointer" onclick="window.moveExp(${index}, 1)"></i>` : ''}<i class="fas fa-trash text-rose-500 cursor-pointer ml-2" onclick="window.deleteExp(${index})"></i></div><input type="text" class="form-input mb-2 text-xs py-1 mt-4" placeholder="Deskripsi Tugas" value="${exp.title}" oninput="window.updateExp(${index}, 'title', this.value)"><div class="flex gap-2"><input type="text" class="form-input flex-1 text-xs py-1" placeholder="Perusahaan" value="${exp.company}" oninput="window.updateExp(${index}, 'company', this.value)"><input type="text" class="form-input flex-1 text-xs py-1" placeholder="Periode" value="${exp.date}" oninput="window.updateExp(${index}, 'date', this.value)"></div>`;
            container.appendChild(div);
        });
        window.updateExp = (idx, field, val) => { const e = [...State.data.experiences]; e[idx][field] = val; State.update('experiences', e); };
        window.deleteExp = (idx) => { const e = State.data.experiences.filter((_, i) => i !== idx); State.update('experiences', e); this.renderExp(); };
        window.moveExp = (idx, dir) => { const e = [...State.data.experiences]; const t = e[idx]; e[idx] = e[idx+dir]; e[idx+dir] = t; State.update('experiences', e); this.renderExp(); };
    }
};
document.getElementById('btn-add-exp')?.addEventListener('click', () => { const exps = [...State.data.experiences, { title: "", company: "", date: "" }]; State.update('experiences', exps); FormEditor.renderExp(); });
