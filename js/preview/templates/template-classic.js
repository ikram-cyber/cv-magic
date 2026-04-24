import { Magic } from '../../utils/magic.js';

export const TemplateCLASSIC = {
    render(data) {
        const t = Magic.dict[data.lang || 'id'];
        const photoHTML = data.photo ? `<img src="${data.photo}" class="w-[3cm] h-[4cm] object-cover border border-slate-300">` : `<div class="w-[3cm] h-[4cm] bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-500 text-center">Pas Foto</div>`;
        const formatList = (text) => text ? text.split('\n').filter(x => x.trim() !== '').map(x => `<li>${x}</li>`).join('') : '<li>-</li>';
        const qrHTML = data.link ? `<div class="absolute top-10 right-10 text-center"><img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(data.link)}" class="w-16 h-16 border p-1 bg-white mx-auto"><p class="text-[8px] mt-1 font-bold text-slate-500 tracking-widest uppercase">Portofolio</p></div>` : '';

        const section = (title, content) => content ? `
            <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
            <h3 class="font-bold text-sm mb-2 uppercase">${title}</h3>
            <ul class="list-disc list-outside ml-5 text-sm mb-6 space-y-1">${formatList(content)}</ul>
        ` : '';

        return `
            <div class="p-10 text-slate-900 bg-white min-h-[297mm] relative">
                ${qrHTML}
                <div class="flex gap-6 mb-6">
                    <div class="shrink-0">${photoHTML}</div>
                    <div class="flex-1 pt-2">
                        <h2 class="font-bold text-sm mb-4 uppercase" style="color: ${data.color || '#000'}">${t.cv}</h2>
                        <h3 class="font-bold text-sm mb-2 uppercase">Data Pribadi</h3>
                        <table class="text-sm w-full">
                            <tr><td class="whitespace-nowrap w-[1%] pr-2 pb-2 font-bold align-top pt-0.5">${t.name}</td><td class="w-[1%] px-2 pb-2 align-top pt-0.5">:</td><td class="pb-2 align-top pt-0.5">${data.name || '-'}</td></tr>
                            <tr><td class="whitespace-nowrap w-[1%] pr-2 pb-2 font-bold align-top pt-0.5">${t.dob}</td><td class="w-[1%] px-2 pb-2 align-top pt-0.5">:</td><td class="pb-2 align-top pt-0.5">${data.dob || '-'}</td></tr>
                            <tr><td class="whitespace-nowrap w-[1%] pr-2 pb-2 font-bold align-top pt-0.5">${t.phone}</td><td class="w-[1%] px-2 pb-2 align-top pt-0.5">:</td><td class="pb-2 align-top pt-0.5">${data.phone || '-'}</td></tr>
                            <tr><td class="whitespace-nowrap w-[1%] pr-2 pb-2 font-bold align-top pt-0.5">${t.address}</td><td class="w-[1%] px-2 pb-2 align-top pt-0.5">:</td><td class="pb-2 align-top pt-0.5 leading-relaxed text-justify pr-4">${data.address || '-'}</td></tr>
                            <tr><td class="whitespace-nowrap w-[1%] pr-2 pb-2 font-bold align-top pt-0.5 text-cyan-600">Kesiapan</td><td class="w-[1%] px-2 pb-2 align-top pt-0.5 text-cyan-600">:</td><td class="pb-2 align-top pt-0.5 font-bold text-cyan-600">${data.readiness || '-'}</td></tr>
                        </table>
                    </div>
                </div>

                <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
                <h3 class="font-bold text-sm mb-2 uppercase">${t.profile}</h3>
                <p class="text-sm text-justify mb-6 leading-relaxed">${data.summary || '-'}</p>

                <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
                <h3 class="font-bold text-sm mb-2 uppercase">${t.exp}</h3>
                <div class="mb-6">${(data.experiences || []).map(exp => `<div class="mb-3 font-bold text-sm text-slate-900">${exp.company || '-'} – ${exp.date || '-'}</div><ul class="list-disc list-outside ml-5 text-sm text-slate-800 mt-1 mb-4"><li>${exp.title || '-'}</li></ul>`).join('')}</div>

                ${section("Lisensi & Sertifikasi", data.certifications)}
                ${section("Proyek & Portofolio", data.projects)}
                ${section("Keahlian Utama", data.skills)}
                ${section("Penguasaan Bahasa", data.languages)}
                ${section("Pengalaman Organisasi", data.organizations)}
                ${section("Pendidikan", data.education)}
            </div>`;
    }
};
