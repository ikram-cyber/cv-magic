import { TemplateATS } from './templates/template-ats.js';
import { TemplatePRO } from './templates/template-pro.js';
import { TemplateTECH } from './templates/template-tech.js';
import { TemplateCLASSIC } from './templates/template-classic.js';

export const Renderer = {
    paper: document.getElementById('cv-paper'),
    
    draw(data) {
        if(!this.paper) return;
        
        let html = '';
        const currentTemplate = data.template || 'classic';

        if(currentTemplate === 'pro') html = TemplatePRO.render(data);
        else if(currentTemplate === 'tech') html = TemplateTECH.render(data);
        else if(currentTemplate === 'classic') html = TemplateCLASSIC.render(data);
        else html = TemplateATS.render(data);
        
        this.paper.innerHTML = html;

        if(currentTemplate === 'pro' || currentTemplate === 'tech' || currentTemplate === 'classic') {
            this.paper.style.padding = '0';
        } else {
            this.paper.style.padding = '20mm';
        }
    }
};
