import { State } from '../core/state.js';

export const FormEditor = {
    init() {
        // Isi form dengan data default saat pertama kali buka
        document.getElementById('input-name').value = State.data.name;
        document.getElementById('input-role').value = State.data.role;
        document.getElementById('input-email').value = State.data.email;
        document.getElementById('input-phone').value = State.data.phone;
        document.getElementById('input-summary').value = State.data.summary;
        document.getElementById('input-job-title').value = State.data.jobTitle;
        document.getElementById('input-job-company').value = State.data.jobCompany;
        document.getElementById('input-job-date').value = State.data.jobDate;

        // Pasang sensor pendeteksi ketikan di semua form
        const inputs = [
            { id: 'input-name', key: 'name' },
            { id: 'input-role', key: 'role' },
            { id: 'input-email', key: 'email' },
            { id: 'input-phone', key: 'phone' },
            { id: 'input-summary', key: 'summary' },
            { id: 'input-job-title', key: 'jobTitle' },
            { id: 'input-job-company', key: 'jobCompany' },
            { id: 'input-job-date', key: 'jobDate' }
        ];

        inputs.forEach(item => {
            const el = document.getElementById(item.id);
            el.addEventListener('input', (e) => {
                State.update(item.key, e.target.value);
            });
        });
    }
};
