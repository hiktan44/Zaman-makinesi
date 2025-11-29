document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadStep = document.getElementById('upload-step');
    const eraStep = document.getElementById('era-step');
    const processingStep = document.getElementById('processing-step');
    const resultStep = document.getElementById('result-step');
    const eraBtns = document.querySelectorAll('.era-btn');
    const generateBtn = document.getElementById('generate-btn');
    const downloadAlbumBtn = document.getElementById('download-album-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');

    console.log("App version: 1.2 - Download All button should be visible");

    let generatedImages = []; // Store generated images for bulk download

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

        generatedImages = []; // Reset generated images
        resultsGallery.innerHTML = ''; // Clear previous results

        // Simulate API calls for each selected era
        for (const year of selectedEras) {
            loadingText.textContent = `Yapay zeka ${year} yılına uyarlıyor...`;
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            createPolaroid(year);
        }

        processingStep.classList.add('hidden');
        resultStep.classList.remove('hidden');
    });

    function getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year}_${hour}-${minute}`;
    }

    function createPolaroid(year) {
        const rotation = (Math.random() * 10 - 5).toFixed(1); // Random rotation between -5 and 5 deg
        const sepia = year < 1950 ? '0.8' : year < 1990 ? '0.3' : '0';

        // In a real app, we would send the image to Gemini here.
        // For demo, we'll use the uploaded image but apply CSS filters.

        // Store image info
        const imageId = `img-${year}-${Date.now()}`;
        generatedImages.push({
            id: imageId,
            year: year,
            src: uploadedImage, // In real app this would be the generated image URL
            filename: `zaman-makinesi-${year}-${getFormattedDate()}.jpg`
        });

        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.style.setProperty('--rotation', `${rotation}deg`);
        card.style.setProperty('--sepia-amount', sepia);

        card.innerHTML = `
            <div class="polaroid-inner">
                <img src="${uploadedImage}" class="polaroid-img" alt="${year} versiyonu">
                <div class="polaroid-caption">${year}'ler Hatırası</div>
            </div>
            <button class="btn-download-single" onclick="downloadSingle('${imageId}')">
                <i class="fa-solid fa-download"></i>
            </button>
        `;

        resultsGallery.appendChild(card);
    }

    // Expose download function to global scope for onclick
    window.downloadSingle = (id) => {
        const imgData = generatedImages.find(img => img.id === id);
        if (imgData) {
            saveAs(imgData.src, imgData.filename);
        }
    };

    // Download Album (ZIP)
    downloadAlbumBtn.addEventListener('click', async () => {
        const zip = new JSZip();
        const folder = zip.folder("zaman-makinesi-albumu");

        generatedImages.forEach(img => {
            // Remove data:image/jpeg;base64, prefix for JSZip
            const base64Data = img.src.split(',')[1];
            folder.file(img.filename, base64Data, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `zaman-makinesi-album-${getFormattedDate()}.zip`);
    });

    // Download All (Individual Files)
    downloadAllBtn.addEventListener('click', () => {
        generatedImages.forEach((img, index) => {
            setTimeout(() => {
                saveAs(img.src, img.filename);
            }, index * 500); // Stagger downloads to avoid browser blocking
        });
    });
});
