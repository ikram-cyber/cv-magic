/**
 * MEGA CV MAGIC PRO - ROOT LEVEL LOGIC
 * Semua Modul Terisolasi: Sinkronisasi, Media, Desain, AI, & Cetak.
 */

class MegaCVMagic {
    constructor() {
        this.preview = document.getElementById('cv-preview');
        
        this.initSync();
        this.initDesign();
        this.initParser();
        this.initMedia();
        this.initAI();
        
        document.getElementById('btn-pdf')?.addEventListener('click', () => this.generatePDF());
        console.log("MEGA ENGINE ONLINE. ZERO MANDOR MODE.");
    }

    // 1. SYNC TEXTS
    initSync() {
        const map = {
            'in-name': ['out-name', 'out-name-sig'],
            'in-title': ['out-title'], 'in-email': ['out-email'],
            'in-phone': ['out-phone'], 'in-github': ['out-github'],
            'in-location': ['out-location']
        };
        for (const [inId, outIds] of Object.entries(map)) {
            const input = document.getElementById(inId);
            input?.addEventListener('input', () => {
                outIds.forEach(id => {
                    const out = document.getElementById(id);
                    if(out) out.textContent = input.value;
                });
            });
        }
    }

    // 2. THEMES & FONTS
    initDesign() {
        const selTheme = document.getElementById('sel-theme');
        const selFont = document.getElementById('sel-font');
        
        selTheme?.addEventListener('change', (e) => {
            this.preview.classList.remove('theme-sky', 'theme-emerald', 'theme-crimson', 'theme-royal');
            this.preview.classList.add(e.target.value);
        });
        
        selFont?.addEventListener('change', (e) => {
            this.preview.classList.remove('font-modern', 'font-classic', 'font-mono');
            this.preview.classList.add(e.target.value);
        });
    }

    // 3. PARSER & PAGE BREAK
    initParser() {
        const tArea = document.getElementById('in-content');
        const out = document.getElementById('out-content');
        
        tArea?.addEventListener('input', () => {
            let txt = tArea.value;
            txt = txt.replace(/---PAGE_BREAK---/g, '<div class="html2pdf__page-break page-divider"></div>');
            out.innerHTML = txt || 'Dokumen kosong...';
        });

        document.getElementById('btn-pagebreak')?.addEventListener('click', () => {
            if(!tArea) return;
            const start = tArea.selectionStart;
            tArea.value = tArea.value.substring(0, start) + "\n\n---PAGE_BREAK---\n\n" + tArea.value.substring(start);
            tArea.dispatchEvent(new Event('input'));
            tArea.focus();
        });
    }

    // 4. MEDIA (FOTO & TTD)
    initMedia() {
        // Foto
        document.getElementById('in-photo')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('out-photo').src = ev.target.result;
                    document.getElementById('out-photo').classList.remove('hidden');
                    document.getElementById('photo-placeholder').classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Tanda Tangan Canvas
        const canvas = document.getElementById('sig-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const outSig = document.getElementById('out-sig');
        let isDrawing = false;
        let isRotated = false;

        const start = (e) => { isDrawing = true; draw(e); };
        const stop = () => { isDrawing = false; ctx.beginPath(); if(outSig) { outSig.src = canvas.toDataURL(); outSig.classList.remove('hidden'); }};
        const draw = (e) => {
            if(!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
            ctx.lineTo((cx - rect.left) * (canvas.width / rect.width), (cy - rect.top) * (canvas.height / rect.height));
            ctx.stroke(); ctx.beginPath(); ctx.moveTo((cx - rect.left) * (canvas.width / rect.width), (cy - rect.top) * (canvas.height / rect.height));
        };

        canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop); canvas.addEventListener('mouseout', stop);
        canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', draw, {passive:false});
        canvas.addEventListener('touchend', stop);

        document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(outSig) { outSig.src = ''; outSig.classList.add('hidden'); }
        });
        document.getElementById('btn-rotate-sig')?.addEventListener('click', () => {
            isRotated = !isRotated;
            if(outSig) outSig.classList.toggle('rotate-90', isRotated);
        });
    }

    // 5. AI GENERATOR ENGINE
    initAI() {
        const btnAI = document.getElementById('btn-ai-generate');
        const inKey = document.getElementById('ai-api-key');
        const inPrompt = document.getElementById('ai-prompt');
        const inContent = document.getElementById('in-content');

        btnAI?.addEventListener('click', async () => {
            const key = inKey.value.trim();
            const job = inPrompt.value.trim() || "Pekerjaan Umum";
            const name = document.getElementById('in-name').value || "Pelamar";
            
            if(!key) {
                alert("Masukkan API Key Gemini untuk memakai fitur ini, Bos!");
                return;
            }

            const oriText = btnAI.innerHTML;
            btnAI.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI SEDANG BERPIKIR...';
            btnAI.disabled = true;

            const prompt = `Tuliskan surat lamaran kerja profesional dalam bahasa Indonesia untuk posisi ${job}. Nama pelamar adalah ${name}. Surat harus sopan, rapi, dan menggunakan format HTML dasar seperti <b> atau <br> untuk paragraf. Jangan berikan teks pembuka/penutup, cukup isi suratnya saja.`;

            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                
                const data = await res.json();
                if(data.error) throw new Error(data.error.message);
                
                let result = data.candidates[0].content.parts[0].text;
                // Bersihkan markdown html jika ada
                result = result.replace(/```html/g, '').replace(/```/g, '');
                
                inContent.value = result;
                inContent.dispatchEvent(new Event('input')); // Trigger render ke kertas
                
            } catch (err) {
                console.error(err);
                alert("AI Gagal memproses: " + err.message);
            } finally {
                btnAI.innerHTML = '<i class="fas fa-check"></i> SELESAI';
                setTimeout(() => { btnAI.innerHTML = oriText; btnAI.disabled = false; }, 2000);
            }
        });
    }

    // 6. PDF EXPORT
    async generatePDF() {
        const btn = document.getElementById('btn-pdf');
        const oriBtn = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> EXPORTING...';

        try {
            await html2pdf().set({
                margin: 0, filename: 'CV_Magic_Ultimate.pdf', image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            }).from(this.preview).save();
            btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
        } catch (err) {
            window.print();
        } finally {
            setTimeout(() => { btn.innerHTML = oriBtn; btn.disabled = false; }, 2000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new MegaCVMagic());
