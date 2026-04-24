import { TemplateATS } from './templates/template-ats.js';
import { TemplatePRO } from './templates/template-pro.js';
import { TemplateTECH } from './templates/template-tech.js';

export const Renderer = {
    paper: document.getElementById('cv-paper'),
    
    draw(data) {
        if(!this.paper) return;
        
        let html = '';
        const currentTemplate = data.template || 'ats';

        if(currentTemplate === 'pro') html = TemplatePRO.render(data);
        else if(currentTemplate === 'tech') html = TemplateTECH.render(data);
        else html = TemplateATS.render(data);
        
        // Render ke Kertas
        this.paper.innerHTML = html;

        // Atur Padding Kertas (PRO & TECH butuh Full Page)
        if(currentTemplate === 'pro' || currentTemplate === 'tech') {
            this.paper.style.padding = '0';
        } else {
            this.paper.style.padding = '20mm';
        }
    }
};
