import { Magic } from '../../utils/magic.js';

export const TemplateCLASSIC = {
    render(data) {
        const t = Magic.dict[data.lang || 'id'];
        const photoHTML = data.photo ? `<img src="${data.photo}" class="w-[3cm] h-[4cm] object-cover border border-slate-300">` : `<div class="w-[3cm] h-[4cm] bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-500 text-center">Pas Foto<br>3x4</div>`;
        const expsHTML = (data.experiences || []).map(exp => `<div class="mb-3"><div class="font-bold text-sm text-slate-900" style="color: ${data.color || '#000'}">${exp.company || '-'} – ${exp.date || '-'}</div><ul class="list-disc list-outside ml-5 text-sm text-slate-800 mt-1"><li>${exp.title || '-'}</li></ul></div>`).join('');
        const formatList = (text) => text ? text.split('\n').filter(x => x.trim() !== '').map(x => `<li>${x}</li>`).join('') : '<li>-</li>';

        return `
            <div class="p-10 font-sans text-slate-900 bg-white min-h-[297mm]">
                <div class="flex gap-6 mb-6">
                    <div class="shrink-0">${photoHTML}</div>
                    <div class="flex-1 pt-2">
                        <h2 class="font-bold text-sm mb-4 uppercase" style="color: ${data.color || '#000'}">${t.cv}</h2>
                        <h3 class="font-bold text-sm mb-2">DATA PRIBADI</h3>
                        <table class="text-sm w-full">
                            <tr>
                                <td class="whitespace-nowrap pr-3 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle mb-0.5" style="background-color: ${data.color || '#000'}"></span>${t.name}</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5 leading-relaxed">${data.name || '-'}</td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap pr-3 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle mb-0.5" style="background-color: ${data.color || '#000'}"></span>${t.dob}</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5 leading-relaxed">${data.dob || '-'}</td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap pr-3 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle mb-0.5" style="background-color: ${data.color || '#000'}"></span>${t.phone}</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5 leading-relaxed">${data.phone || '-'}</td>
                            </tr>
                            <tr>
                                <td class="whitespace-nowrap pr-3 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle mb-0.5" style="background-color: ${data.color || '#000'}"></span>${t.address}</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5 leading-relaxed text-justify pr-4">${data.address || '-'}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
                <h3 class="font-bold text-sm mb-2">${t.profile}</h3>
                <p class="text-sm text-justify mb-6 leading-relaxed">${data.summary || '-'}</p>
                <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
                <h3 class="font-bold text-sm mb-2">${t.exp}</h3>
                <div class="mb-6">${expsHTML}</div>
                <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
                <h3 class="font-bold text-sm mb-2">${t.skills}</h3>
                <ul class="list-disc list-outside ml-5 text-sm mb-6 space-y-1">${formatList(data.skills)}</ul>
                <hr class="border-t-2 mb-2" style="border-color: ${data.color || '#cbd5e1'}">
                <h3 class="font-bold text-sm mb-2">${t.edu}</h3>
                <ul class="list-disc list-outside ml-5 text-sm mb-6 space-y-1">${formatList(data.education)}</ul>
            </div>`;
    }
};
