import { TemplateATS } from './templates/template-ats.js';
import { TemplatePRO } from './templates/template-pro.js';
import { TemplateTECH } from './templates/template-tech.js';
import { TemplateCLASSIC } from './templates/template-classic.js';
import { Magic } from '../utils/magic.js';

export const Renderer = {
    paper: document.getElementById('cv-paper'),
    draw(data) {
        if(!this.paper) return;
        
        // Terapkan Tipografi (Font)
        this.paper.className = `a4-paper bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${data.font || 'font-sans'}`;

        if(data.mode === 'cover-letter') {
            this.paper.innerHTML = Magic.generateCoverLetter(data);
            this.paper.style.padding = '0';
            return;
        }

        let html = '';
        const currentTemplate = data.template || 'classic';
        if(currentTemplate === 'pro') html = TemplatePRO.render(data);
        else if(currentTemplate === 'tech') html = TemplateTECH.render(data);
        else if(currentTemplate === 'classic') html = TemplateCLASSIC.render(data);
        else html = TemplateATS.render(data);
        
        this.paper.innerHTML = html;
        this.paper.style.padding = (currentTemplate === 'pro' || currentTemplate === 'tech' || currentTemplate === 'classic') ? '0' : '20mm';
    }
};
