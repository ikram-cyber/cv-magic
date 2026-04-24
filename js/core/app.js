import { State } from './state.js';
import { Renderer } from '../preview/renderer.js';
import { FormEditor } from '../editor/forms.js';
import { PDFEngine } from '../engine/pdf-export.js';
import { AutoSave } from '../editor/auto-save.js';

class DocuMagicApp {
    constructor() {
        // Set default theme
        if(!State.data.template) State.update('template', 'ats');

        // 1. Aktifkan AutoSave (Ambil data lama jika ada)
        AutoSave.init();

        // 2. Render Pertama & Sinkronisasi
        Renderer.draw(State.data);
        State.subscribe((newData) => {
            Renderer.draw(newData);
            this.syncForms(newData);
        });

        // 3. Aktifkan Fitur Form & PDF
        FormEditor.init();
        PDFEngine.init();

        // 4. Pasang Logika Tombol Tema
        document.getElementById('btn-theme-ats').onclick = () => State.update('template', 'ats');
        document.getElementById('btn-theme-pro').onclick = () => State.update('template', 'pro');
        document.getElementById('btn-theme-tech').onclick = () => State.update('template', 'tech');
    }

    syncForms(data) {
        document.getElementById('input-name').value = data.name || '';
        document.getElementById('input-role').value = data.role || '';
        document.getElementById('input-email').value = data.email || '';
        document.getElementById('input-phone').value = data.phone || '';
        document.getElementById('input-summary').value = data.summary || '';
        document.getElementById('input-job-title').value = data.jobTitle || '';
        document.getElementById('input-job-company').value = data.jobCompany || '';
        document.getElementById('input-job-date').value = data.jobDate || '';
    }
}
new DocuMagicApp();
