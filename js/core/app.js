import { State } from './state.js';
import { Renderer } from '../preview/renderer.js';
import { FormEditor } from '../editor/forms.js';
import { PDFEngine } from '../engine/pdf-export.js';
import { AutoSave } from '../editor/auto-save.js';

class DocuMagicApp {
    constructor() {
        AutoSave.init();
        Renderer.draw(State.data);
        
        State.subscribe((newData) => {
            Renderer.draw(newData);
            this.syncForms(newData);
        });

        FormEditor.init();
        PDFEngine.init();
        this.setupMobileTabs();

        document.getElementById('btn-theme-ats').onclick = () => State.update('template', 'ats');
        document.getElementById('btn-theme-pro').onclick = () => State.update('template', 'pro');
        document.getElementById('btn-theme-tech').onclick = () => State.update('template', 'tech');
    }

    syncForms(data) {
        ['name', 'role', 'email', 'phone', 'summary'].forEach(key => {
            const el = document.getElementById(`input-${key}`);
            if(el && document.activeElement !== el) el.value = data[key] || '';
        });
    }

    setupMobileTabs() {
        const tabEdit = document.getElementById('tab-edit');
        const tabView = document.getElementById('tab-view');
        const panelEdit = document.getElementById('panel-edit');
        const panelView = document.getElementById('panel-view');

        tabEdit.addEventListener('click', () => {
            panelEdit.classList.remove('hidden'); panelView.classList.add('hidden');
            tabEdit.classList.add('text-cyan-400', 'border-cyan-400'); tabEdit.classList.remove('text-slate-500', 'border-transparent');
            tabView.classList.remove('text-cyan-400', 'border-cyan-400'); tabView.classList.add('text-slate-500', 'border-transparent');
        });

        tabView.addEventListener('click', () => {
            panelEdit.classList.add('hidden'); panelView.classList.remove('hidden'); panelView.classList.add('flex');
            tabView.classList.add('text-cyan-400', 'border-cyan-400'); tabView.classList.remove('text-slate-500', 'border-transparent');
            tabEdit.classList.remove('text-cyan-400', 'border-cyan-400'); tabEdit.classList.add('text-slate-500', 'border-transparent');
        });
    }
}
new DocuMagicApp();
