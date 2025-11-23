document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadStep = document.getElementById('upload-step');
    const eraStep = document.getElementById('era-step');
    const processingStep = document.getElementById('processing-step');
    const resultStep = document.getElementById('result-step');
    const eraBtns = document.querySelectorAll('.era-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resultsGallery = document.getElementById('results-gallery');
    const loadingText = document.getElementById('loading-text');

    let uploadedImage = null;
    let selectedEras = [];

    // Drag & Drop Handling
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = e.target.result;
                showEraSelection();
            };
            reader.readAsDataURL(file);
        }
    }

    function showEraSelection() {
        uploadStep.classList.add('hidden');
        eraStep.classList.remove('hidden');
    }

    // Era Selection
    eraBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            const year = btn.dataset.year;

            if (selectedEras.includes(year)) {
                selectedEras = selectedEras.filter(y => y !== year);
            } else {
                selectedEras.push(year);
            }

            generateBtn.disabled = selectedEras.length === 0;
        });
    });

    // Generation Process
    generateBtn.addEventListener('click', async () => {
        eraStep.classList.add('hidden');
        processingStep.classList.remove('hidden');

        // Simulate API calls for each selected era
        for (const year of selectedEras) {
            loadingText.textContent = `Yapay zeka ${year} yılına uyarlıyor...`;
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            createPolaroid(year);
        }

        processingStep.classList.add('hidden');
        resultStep.classList.remove('hidden');
    });

    function createPolaroid(year) {
        const rotation = (Math.random() * 10 - 5).toFixed(1); // Random rotation between -5 and 5 deg
        const sepia = year < 1950 ? '0.8' : year < 1990 ? '0.3' : '0';

        // In a real app, we would send the image to Gemini here.
        // For demo, we'll use the uploaded image but apply CSS filters.

        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.style.setProperty('--rotation', `${rotation}deg`);
        card.style.setProperty('--sepia-amount', sepia);

        card.innerHTML = `
            <img src="${uploadedImage}" class="polaroid-img" alt="${year} versiyonu">
            <div class="polaroid-caption">${year}'ler Hatırası</div>
        `;

        resultsGallery.appendChild(card);
    }
});
