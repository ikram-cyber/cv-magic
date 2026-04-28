/**
 * GOD MODE CV MAGIC - ULTIMATE 100% SCRIPT
 * Dilengkapi: Gemini 1.5 Flash AI, Auto-Save (LocalStorage), Error Handler.
 */

class GodModeCVMagic {
    constructor() {
        this.preview = document.getElementById('cv-preview');
        this.fields = ['in-name', 'in-title', 'in-email', 'in-phone', 'in-github', 'in-location', 'in-content', 'ai-api-key', 'sel-theme', 'sel-font'];
        
        this.loadData(); // Load data lama kalau HP sempet mati
        this.initSync();
        this.initDesign();
        this.initParser();
        this.initMedia();
        this.initAI();
        this.initAutoSave();
        
        document.getElementById('btn-pdf')?.addEventListener('click', () => this.generatePDF());
        console.log("GOD MODE ENGINE: AKTIF. AI FIXED. AUTO-SAVE ON.");
    }

    // --- AUTO SAVE SYSTEM (Biar Gak Capek Ngetik Ulang) ---
    initAutoSave() {
        this.fields.forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.addEventListener('input', () => {
                    localStorage.setItem(`cv_magic_${id}`, el.value);
                });
            }
        });
    }

    loadData() {
        this.fields.forEach(id => {
            const el = document.getElementById(id);
            const saved = localStorage.getItem(`cv_magic_${id}`);
            if(el && saved) {
                el.value = saved;
                // Pancing event input biar layar kanan ikut update saat web baru dibuka
                setTimeout(() => el.dispatchEvent(new Event('input')), 50);
            }
        });
    }

    // --- SINKRONISASI TEKS ---
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

    // --- DESAIN & TEMA ---
    initDesign() {
        const selTheme = document.getElementById('sel-theme');
        const selFont = document.getElementById('sel-font');
        
        selTheme?.addEventListener('change', (e) => {
            this.preview.className = `origin-top transition-transform duration-300 ${selFont.value} ${e.target.value}`;
        });
        
        selFont?.addEventListener('change', (e) => {
            this.preview.className = `origin-top transition-transform duration-300 ${e.target.value} ${selTheme.value}`;
        });
    }

    // --- PARSER (PAGE BREAK) ---
    initParser() {
        const tArea = document.getElementById('in-content');
        const out = document.getElementById('out-content');
        
        tArea?.addEventListener('input', () => {
            let txt = tArea.value;
            txt = txt.replace(/---PAGE_BREAK---/g, '<div class="html2pdf__page-break page-divider"></div>');
            // Konversi enter ke <br> biar HTML bisa baca
            txt = txt.replace(/\n/g, '<br>');
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

    // --- MEDIA (FOTO & TTD) ---
    initMedia() {
        document.getElementById('in-photo')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = document.getElementById('out-photo');
                    img.src = ev.target.result;
                    img.classList.remove('hidden');
                    document.getElementById('photo-placeholder')?.classList.add('hidden');
                    localStorage.setItem('cv_magic_photo', ev.target.result); // Save foto
                };
                reader.readAsDataURL(file);
            }
        });

        // Load foto tersimpan
        const savedPhoto = localStorage.getItem('cv_magic_photo');
        if(savedPhoto) {
            const img = document.getElementById('out-photo');
            if(img) {
                img.src = savedPhoto;
                img.classList.remove('hidden');
                document.getElementById('photo-placeholder')?.classList.add('hidden');
            }
        }

        const canvas = document.getElementById('sig-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const outSig = document.getElementById('out-sig');
        let isDrawing = false;
        let isRotated = false;

        const start = (e) => { isDrawing = true; draw(e); };
        const stop = () => { 
            isDrawing = false; 
            ctx.beginPath(); 
            if(outSig) { 
                const dataUrl = canvas.toDataURL();
                outSig.src = dataUrl; 
                outSig.classList.remove('hidden'); 
                localStorage.setItem('cv_magic_sig', dataUrl); // Save TTD
            }
        };
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

        // Load TTD tersimpan
        const savedSig = localStorage.getItem('cv_magic_sig');
        if(savedSig && outSig) {
            outSig.src = savedSig;
            outSig.classList.remove('hidden');
        }

        document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(outSig) { outSig.src = ''; outSig.classList.add('hidden'); }
            localStorage.removeItem('cv_magic_sig');
        });
        document.getElementById('btn-rotate-sig')?.addEventListener('click', () => {
            isRotated = !isRotated;
            if(outSig) outSig.classList.toggle('rotate-90', isRotated);
        });
    }

    // --- AI ENGINE (UPGRADE KE GEMINI 1.5 FLASH) ---
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
                alert("Bos, masukkan API Key Gemini di kotak atas dulu!");
                return;
            }

            const oriText = btnAI.innerHTML;
            btnAI.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MESIN AI BEKERJA...';
            btnAI.disabled = true;

            // Prompt dipertajam biar hasilnya rapi dan murni teks (tanpa markdown HTML)
            const prompt = `Tuliskan surat lamaran kerja profesional untuk posisi ${job}. Nama pelamar adalah ${name}. Tulis HANYA isi suratnya saja tanpa ada embel-embel markdown, tanpa tag HTML, gunakan format teks biasa dengan paragraf (enter) yang jelas.`;

            try {
                // MENGGUNAKAN GEMINI 1.5 FLASH LATEST (DIJAMIN NEMBUS)
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                
                const data = await res.json();
                
                // Cek jika API error dari Google
                if(data.error) {
                    throw new Error(data.error.message);
                }
                
                if(!data.candidates || data.candidates.length === 0) {
                    throw new Error("AI tidak mengembalikan teks apa pun. Coba lagi.");
                }

                let result = data.candidates[0].content.parts[0].text;
                
                // Bersihkan sampah markdown yang kadang masih diselipin AI
                result = result.replace(/```html/g, '').replace(/```/g, '').trim();
                
                // Taruh di textarea
                inContent.value = result;
                
                // Paksa layar kanan dan localStorage update
                inContent.dispatchEvent(new Event('input')); 
                
                btnAI.innerHTML = '<i class="fas fa-check"></i> SUKSES, BOS!';
            } catch (err) {
                console.error("AI Error Response:", err);
                alert("GAGAL MENGHUBUNGI AI:\n" + err.message + "\n\nCek koneksi atau pastikan API Key benar.");
                btnAI.innerHTML = '<i class="fas fa-exclamation-triangle"></i> COBA LAGI';
            } finally {
                setTimeout(() => { btnAI.innerHTML = oriText; btnAI.disabled = false; }, 3000);
            }
        });
    }

    // --- PDF EXPORT ---
    async generatePDF() {
        const btn = document.getElementById('btn-pdf');
        const oriBtn = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> EXPORTING PDF...';

        try {
            await html2pdf().set({
                margin: 0, filename: 'CV_Magic_Sultan.pdf', image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            }).from(this.preview).save();
            btn.innerHTML = '<i class="fas fa-check"></i> PDF SIAP, BOS!';
        } catch (err) {
            console.error("PDF Error:", err);
            window.print();
        } finally {
            setTimeout(() => { btn.innerHTML = oriBtn; btn.disabled = false; }, 2000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new GodModeCVMagic());
