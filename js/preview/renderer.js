import { TemplateATS } from './templates/template-ats.js';
import { TemplatePRO } from './templates/template-pro.js';
import { TemplateTECH } from './templates/template-tech.js';

export const Renderer = {
    paper: document.getElementById('cv-paper'),
    
    draw(data) {
        let html = '';
        if(data.template === 'ats') html = TemplateATS.render(data);
        else if(data.template === 'pro') html = TemplatePRO.render(data);
        else if(data.template === 'tech') html = TemplateTECH.render(data);
        else html = TemplateATS.render(data);
        
        this.paper.innerHTML = html;
        
        // Hapus padding bawaan jika pakai tema PRO atau TECH yang desainnya full kertas
        if(data.template === 'pro' || data.template === 'tech') {
            this.paper.style.padding = '0';
        } else {
            this.paper.style.padding = '20mm';
        }
    }
};
