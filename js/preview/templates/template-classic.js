import { Magic } from '../../utils/magic.js';

export const TemplateCLASSIC = {
    render(data) {
        const t = Magic.dict[data.lang || 'id'];
        
        const photoHTML = data.photo ? `<div class="shrink-0"><img src="${data.photo}" class="w-[3cm] h-[4cm] object-cover border border-slate-300"></div>` : '';
        const qrHTML = data.link ? `<div class="absolute top-10 right-10 text-center"><img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(data.link)}" class="w-16 h-16 border p-1 bg-white mx-auto"><p class="text-[8px] mt-1 font-bold text-slate-500 tracking-widest uppercase">Portofolio</p></div>` : '';

        // Format standar titik hitam (bullet)
        const formatList = (text) => text ? text.split('\n').filter(x => x.trim() !== '').map(x => `<li>${x}</li>`).join('') : '';
        
        // Format khusus KESIAPAN KERJA (Pakai Centang / Checkmark)
        const formatCheckList = (text) => text ? text.split('\n').filter(x => x.trim() !== '').map(x => `<li class="flex items-start"><i class="fas fa-check mt-1 mr-2" style="color: ${data.color || '#000'}"></i> <span>${x}</span></li>`).join('') : '';

        const buildRow = (label, value) => {
            if (!value || value.trim() === '') return '';
            return `<tr><td class="whitespace-nowrap w-[1%] pr-2 pb-2 font-bold align-top pt-0.5">${label}</td><td class="w-[1%] px-2 pb-2 align-top pt-0.5">:</td><td class="pb-2 align-top pt-0.5 leading-relaxed text-justify pr-4">${value}</td></tr>`;
        };

        const buildSection = (title, content, isList = true) => {
            if (!content || content.trim() === '') return '';
            const bodyHTML = isList ? `<ul class="list-disc list-outside ml-5 text-sm mb-6 space-y-1">${formatList(content)}</ul>` : `<p class="text-sm text-justify mb-6 leading-relaxed">${content}</p>`;
            return `<hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}"><h3 class="font-bold text-sm mb-2 uppercase">${title}</h3>${bodyHTML}`;
        };

        const buildCheckSection = (title, content) => {
            if (!content || content.trim() === '') return '';
            return `<hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}"><h3 class="font-bold text-sm mb-2 uppercase">${title}</h3><ul class="list-none ml-1 text-sm mb-6 space-y-1 font-medium">${formatCheckList(content)}</ul>`;
        };

        const buildExperiences = () => {
            if (!data.experiences || data.experiences.length === 0) return '';
            const validExps = data.experiences.filter(exp => exp.title || exp.company);
            if (validExps.length === 0) return '';
            const expsHTML = validExps.map(exp => `<div class="mb-3 font-bold text-sm text-slate-900">${exp.company || ''} ${exp.date ? '– ' + exp.date : ''}</div><ul class="list-disc list-outside ml-5 text-sm text-slate-800 mt-1 mb-4"><li>${exp.title || ''}</li></ul>`).join('');
            return `<hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}"><h3 class="font-bold text-sm mb-2 uppercase">${t.exp}</h3><div class="mb-6">${expsHTML}</div>`;
        };

        return `
            <div class="p-10 text-slate-900 bg-white min-h-[297mm] relative">
                ${qrHTML}
                <div class="flex gap-6 mb-6">
                    ${photoHTML}
                    <div class="flex-1 pt-2">
                        <h2 class="font-bold text-sm mb-4 uppercase" style="color: ${data.color || '#000'}">${t.cv}</h2>
                        <h3 class="font-bold text-sm mb-2 uppercase">Data Pribadi</h3>
                        <table class="text-sm w-full">
                            ${buildRow(t.name, data.name)}
                            ${buildRow(t.dob, data.dob)}
                            ${buildRow(t.phone, data.phone)}
                            ${buildRow('Email', data.email)}
                            ${buildRow(t.address, data.address)}
                        </table>
                    </div>
                </div>

                ${buildSection(t.profile, data.summary, false)}
                ${buildExperiences()}
                ${buildSection("Lisensi & Sertifikasi", data.certifications)}
                ${buildSection("Proyek & Portofolio", data.projects)}
                ${buildSection(t.skills, data.skills)}
                ${buildSection("Penguasaan Bahasa", data.languages)}
                ${buildSection("Pengalaman Organisasi", data.organizations)}
                ${buildSection(t.edu, data.education)}
                
                ${buildCheckSection("Kesiapan Kerja", data.readiness)}
            </div>`;
    }
};
