import { State } from '../core/state.js';

export const FormEditor = {
    init() {
        document.getElementById('input-photo').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    State.update('photo', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Tambahkan address, skills, dan education ke dalam array sensor
        ['name', 'role', 'email', 'phone', 'address', 'summary', 'skills', 'education'].forEach(key => {
            const el = document.getElementById(`input-${key}`);
            if(el) {
                el.addEventListener('input', (e) => State.update(key, e.target.value));
            }
        });

        this.renderExp();
    },

    renderExp() {
        const container = document.getElementById('exp-container');
        if(!container) return;
        container.innerHTML = '';
        State.data.experiences.forEach((exp, index) => {
            const div = document.createElement('div');
            div.className = "p-3 bg-slate-800 rounded border border-slate-700 relative mb-4";
            div.innerHTML = `
                <i class="fas fa-trash absolute top-3 right-3 text-rose-500 cursor-pointer" onclick="window.deleteExp(${index})"></i>
                <input type="text" class="form-input mb-2 text-xs py-1" placeholder="Deskripsi Tugas" value="${exp.title}" oninput="window.updateExp(${index}, 'title', this.value)">
                <div class="flex gap-2">
                    <input type="text" class="form-input flex-1 text-xs py-1" placeholder="Perusahaan" value="${exp.company}" oninput="window.updateExp(${index}, 'company', this.value)">
                    <input type="text" class="form-input flex-1 text-xs py-1" placeholder="Periode" value="${exp.date}" oninput="window.updateExp(${index}, 'date', this.value)">
                </div>
            `;
            container.appendChild(div);
        });

        window.updateExp = (idx, field, val) => {
            const exps = [...State.data.experiences];
            exps[idx][field] = val;
            State.update('experiences', exps);
        };
        window.deleteExp = (idx) => {
            const exps = State.data.experiences.filter((_, i) => i !== idx);
            State.update('experiences', exps);
            this.renderExp();
        };
    }
};

document.getElementById('btn-add-exp').addEventListener('click', () => {
    const exps = [...State.data.experiences, { title: "", company: "", date: "" }];
    State.update('experiences', exps);
    FormEditor.renderExp();
});
