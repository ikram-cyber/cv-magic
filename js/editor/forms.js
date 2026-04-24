import { State } from '../core/state.js';

export const FormEditor = {
    init() {
        // Upload Foto ke Base64
        document.getElementById('input-photo').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (event) => State.update('photo', event.target.result);
                reader.readAsDataURL(file);
            }
        });

        // Event listener standar
        ['name', 'role', 'email', 'phone', 'summary'].forEach(key => {
            document.getElementById(`input-${key}`).addEventListener('input', (e) => State.update(key, e.target.value));
        });

        // Sistem Array Pengalaman
        const renderExp = () => {
            const container = document.getElementById('exp-container');
            container.innerHTML = '';
            State.data.experiences.forEach((exp, index) => {
                const div = document.createElement('div');
                div.className = "p-3 bg-slate-800 rounded border border-slate-700 relative";
                div.innerHTML = `
                    <i class="fas fa-trash absolute top-3 right-3 text-rose-500 cursor-pointer hover:text-rose-400" onclick="window.deleteExp(${index})"></i>
                    <input type="text" class="form-input mb-2 text-xs py-1" placeholder="Jabatan" value="${exp.title}" oninput="window.updateExp(${index}, 'title', this.value)">
                    <div class="flex gap-2">
                        <input type="text" class="form-input flex-1 text-xs py-1" placeholder="Perusahaan" value="${exp.company}" oninput="window.updateExp(${index}, 'company', this.value)">
                        <input type="text" class="form-input flex-1 text-xs py-1" placeholder="Periode" value="${exp.date}" oninput="window.updateExp(${index}, 'date', this.value)">
                    </div>
                `;
                container.appendChild(div);
            });
        };

        // Fungsi Global untuk edit array
        window.updateExp = (idx, field, val) => {
            const exps = [...State.data.experiences];
            exps[idx][field] = val;
            State.update('experiences', exps);
        };
        window.deleteExp = (idx) => {
            const exps = State.data.experiences.filter((_, i) => i !== idx);
            State.update('experiences', exps);
            renderExp();
        };

        document.getElementById('btn-add-exp').addEventListener('click', () => {
            const exps = [...State.data.experiences, { title: "", company: "", date: "" }];
            State.update('experiences', exps);
            renderExp();
        });

        renderExp(); // Tampilkan pertama kali
    }
};
