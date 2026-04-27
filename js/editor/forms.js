import { State } from '../core/state.js';
import { Magic } from '../utils/magic.js';

export const FormEditor = {
    init() {
        document.getElementById('input-photo')?.addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => State.update('photo', ev.target.result); r.readAsDataURL(e.target.files[0]); }});
        document.getElementById('input-signature')?.addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => State.update('signature', ev.target.result); r.readAsDataURL(e.target.files[0]); }});

        ['name', 'dob', 'role', 'email', 'phone', 'address', 'link', 'summary', 'skills', 'education', 'certifications', 'projects', 'languages', 'organizations', 'readiness', 'recipient', 'career-status'].forEach(key => {
            document.getElementById(`input-${key}`)?.addEventListener('input', (e) => State.update(key, e.target.value));
        });
        document.getElementById('input-color')?.addEventListener('input', (e) => State.update('color', e.target.value));

        // UI Toggles (Font & Theme & Mode)
        const updateUI = (activeId, list, activeCls, inactiveCls) => {
            list.forEach(id => { const el = document.getElementById(id); if(el) el.className = id === activeId ? activeCls : inactiveCls; });
        };

        const fonts = ['btn-font-modern', 'btn-font-classic', 'btn-font-tech'];
        const fontClsA = "flex-1 py-1.5 rounded-md bg-slate-700 text-white font-bold text-[10px] tracking-widest transition-all shadow-md";
        const fontClsI = "flex-1 py-1.5 rounded-md text-slate-500 hover:text-slate-300 font-bold text-[10px] tracking-widest transition-all";
        
        document.getElementById('btn-font-modern')?.addEventListener('click', () => { State.update('font', 'font-sans'); updateUI('btn-font-modern', fonts, fontClsA, fontClsI); });
        document.getElementById('btn-font-classic')?.addEventListener('click', () => { State.update('font', 'font-serif'); updateUI('btn-font-classic', fonts, fontClsA, fontClsI); });
        document.getElementById('btn-font-tech')?.addEventListener('click', () => { State.update('font', 'font-mono'); updateUI('btn-font-tech', fonts, fontClsA, fontClsI); });

        const themes = ['btn-theme-classic', 'btn-theme-pro', 'btn-theme-ats', 'btn-theme-tech'];
        const thmClsA = "py-2 border border-cyan-500 bg-cyan-500/10 text-cyan-400 rounded text-[10px] font-bold tracking-widest transition-all";
        const thmClsI = "py-2 border border-slate-600 bg-transparent text-slate-500 hover:text-slate-300 rounded text-[10px] font-bold tracking-widest hover:border-slate-500 transition-all";
        
        document.getElementById('btn-theme-classic')?.addEventListener('click', () => { State.update('template', 'classic'); updateUI('btn-theme-classic', themes, thmClsA, thmClsI); });
        document.getElementById('btn-theme-pro')?.addEventListener('click', () => { State.update('template', 'pro'); updateUI('btn-theme-pro', themes, thmClsA, thmClsI); });
        document.getElementById('btn-theme-ats')?.addEventListener('click', () => { State.update('template', 'ats'); updateUI('btn-theme-ats', themes, thmClsA, thmClsI); });
        document.getElementById('btn-theme-tech')?.addEventListener('click', () => { State.update('template', 'tech'); updateUI('btn-theme-tech', themes, thmClsA, thmClsI); });

        const modes = ['btn-mode-cv', 'btn-mode-cl'];
        const modClsA = "bg-cyan-500 text-slate-900 text-[11px] font-black px-5 py-2 rounded-full shadow-lg transition-all tracking-widest";
        const modClsI = "text-slate-400 hover:text-white text-[11px] font-bold px-5 py-2 rounded-full transition-all tracking-widest";

        document.getElementById('btn-mode-cv')?.addEventListener('click', () => { State.update('mode', 'cv'); updateUI('btn-mode-cv', modes, modClsA, modClsI); });
        document.getElementById('btn-mode-cl')?.addEventListener('click', () => { State.update('mode', 'cover-letter'); updateUI('btn-mode-cl', modes, modClsA, modClsI); });

        document.getElementById('btn-ai-writer')?.addEventListener('click', () => { const t = Magic.generateSummary(State.data); State.update('summary', t); document.getElementById('input-summary').value = t; });
        document.getElementById('btn-lang-toggle')?.addEventListener('click', () => State.update('lang', State.data.lang === 'id' ? 'en' : 'id'));
        
        this.renderExp();
    },

    renderExp() {
        const container = document.getElementById('exp-container'); if(!container) return; container.innerHTML = '';
        State.data.experiences.forEach((exp, index) => {
            const div = document.createElement('div'); div.className = "p-3 bg-slate-800/80 rounded-lg border border-slate-700 relative mb-4 shadow-sm";
            div.innerHTML = `
                <div class="absolute top-2 right-2 flex gap-3 text-sm bg-slate-900 px-2 py-1 rounded-md border border-slate-700">
                    ${index > 0 ? `<i class="fas fa-arrow-up text-cyan-400 cursor-pointer hover:text-cyan-300" onclick="window.moveExp(${index}, -1)"></i>` : ''}
                    ${index < State.data.experiences.length - 1 ? `<i class="fas fa-arrow-down text-cyan-400 cursor-pointer hover:text-cyan-300" onclick="window.moveExp(${index}, 1)"></i>` : ''}
                    <div class="w-px bg-slate-700"></div>
                    <i class="fas fa-trash text-rose-500 cursor-pointer hover:text-rose-400" onclick="window.deleteExp(${index})"></i>
                </div>
                <input type="text" class="form-input mb-2 text-xs py-1 mt-6 bg-slate-900/50" placeholder="Deskripsi Tugas" value="${exp.title}" oninput="window.updateExp(${index}, 'title', this.value)">
                <div class="flex gap-2">
                    <input type="text" class="form-input flex-1 text-xs py-1 bg-slate-900/50" placeholder="Perusahaan" value="${exp.company}" oninput="window.updateExp(${index}, 'company', this.value)">
                    <input type="text" class="form-input flex-1 text-xs py-1 bg-slate-900/50" placeholder="Periode" value="${exp.date}" oninput="window.updateExp(${index}, 'date', this.value)">
                </div>`;
            container.appendChild(div);
        });
        window.updateExp = (idx, field, val) => { const e = [...State.data.experiences]; e[idx][field] = val; State.update('experiences', e); };
        window.deleteExp = (idx) => { const e = State.data.experiences.filter((_, i) => i !== idx); State.update('experiences', e); FormEditor.renderExp(); };
        window.moveExp = (idx, dir) => { const e = [...State.data.experiences]; const t = e[idx]; e[idx] = e[idx+dir]; e[idx+dir] = t; State.update('experiences', e); FormEditor.renderExp(); };
    }
};
document.getElementById('btn-add-exp')?.addEventListener('click', () => { const exps = [...State.data.experiences, { title: "", company: "", date: "" }]; State.update('experiences', exps); FormEditor.renderExp(); });
