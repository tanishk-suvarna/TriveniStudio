

let menuToggle = document.querySelector('.menuToggle');
let header = document.querySelector('header');
let section = document.querySelector('section');
// let section = document.getElementsByTagName('*');


menuToggle.onclick = function () {
    header.classList.toggle('active')
    section.classList.toggle('active')
}

// load footer fragment (footer.html) into #site-footer if present
document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        fetch('./footer.html')
            .then(res => {
                if (!res.ok) throw new Error('Footer fetch failed');
                return res.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
                // optionally load footer stylesheet
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = './css/footer.css';
                document.head.appendChild(link);
            })
            .catch(err => {
                console.warn('Could not load footer fragment:', err);
            });
    }
});

const slides = document.querySelectorAll('.slide');

// console.log(slides)

let counter = 0;
// console.log(i)



slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`

});

const goPrev = () => {
    counter--
    slideImg()
}
const goNext = () => {
    counter++ 
    slideImg()
}


const slideImg = () => {
    for (let i = 0; i < slides.length; i++) {
        if (counter >= slides.length) {
            slides.forEach(slide => {
                slide.style.transform = `translateX(-${counter * 0}%)`
            });
        } else {
            slides.forEach(slide => {
                slide.style.transform = `translateX(-${counter * 100}%)`
            });
        }
    }
}
// setInterval(goNext, 5000);

// Service data (category -> list of {name, price})
const SERVICE_DATA = {
    'Threading': [
        { name: 'Upperlips', price: '₹30' },
        { name: 'Lowerlips', price: '₹30' },
        { name: 'Chin', price: '₹40' },
        { name: 'Forehead', price: '₹40' },
        { name: 'Nose', price: '₹50' },
        { name: 'Eyebrows', price: '₹50' },
        { name: 'Sidelocks', price: '₹80' },
        { name: ' Full Face', price: '₹200' }
        
    ],
    // Waxing has multiple subtypes; each subtype has its own price list
    'Waxing': {
        'Regular Honey Wax': [
            { name: 'Upper Lip', price: '₹50' },
            { name: 'Chin', price: '₹60' },
            { name: 'Eyebrows', price: '₹80' },
            { name: 'Full Face', price: '₹250' }
        ],
        'Chocolate Wax': [
            { name: 'Half Arms', price: '₹200' },
            { name: 'Full Arms', price: '₹350' },
            { name: 'Half Legs', price: '₹300' },
            { name: 'Full Legs', price: '₹500' }
        ],
    },
    'full-body-massage': [
        { name: '30 min Massage', price: '₹800' },
        { name: '60 min Massage', price: '₹1400' }
    ],
    'stocked-cosmetic-store': [
        { name: 'Cosmetic Consultation', price: 'Free' },
        { name: 'Skin Care Kit', price: '₹1200' }
    ],
    'fully-equipped-spa': [
        { name: 'Steam & Sauna', price: '₹500' },
        { name: 'Spa Package', price: '₹2000' }
    ],
    'authorized-botox': [
        { name: 'Consultation', price: '₹300' },
        { name: 'Botox (per area)', price: '₹2500' }
    ]
};

// Modal control
function openServiceModal(category, title) {
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    modalTitle.textContent = title;
    modalBody.innerHTML = '';

    const data = SERVICE_DATA[category];
    if (!data) {
        modalBody.innerHTML = '<p>No services listed for this category.</p>';
    } else if (typeof data === 'object' && !Array.isArray(data)) {
        // category with subtypes (like Waxing)
        modalBody.innerHTML = '';
        const subtypeContainer = document.createElement('div');
        subtypeContainer.className = 'subtype-container';
        Object.keys(data).forEach((subtype, idx) => {
            const btn = document.createElement('button');
            btn.className = 'subtype-btn';
            btn.type = 'button';
            btn.textContent = subtype;
            btn.dataset.subtype = subtype;
            btn.addEventListener('click', () => renderSubtypeList(data[subtype], subtype));
            subtypeContainer.appendChild(btn);
            // auto-open first subtype
            if (idx === 0) renderSubtypeList(data[subtype], subtype);
        });
        modalBody.appendChild(subtypeContainer);
    } else if (Array.isArray(data)) {
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'service-item';
            div.innerHTML = `<div class="si-name">${item.name}</div><div class="si-price">${item.price}</div>`;
            modalBody.appendChild(div);
        });
    }

    modal.setAttribute('aria-hidden', 'false');
    // trap focus briefly: move focus to close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
}

// Render a list for a chosen subtype into the modal body (replaces existing list)
function renderSubtypeList(list, subtypeName) {
    const modalBody = document.getElementById('modal-body');
    // remove existing list (but keep subtype buttons container)
    const subtypeContainer = modalBody.querySelector('.subtype-container');
    // remove any previous list
    const prevList = modalBody.querySelector('.subtype-list');
    if (prevList) prevList.remove();

    const container = document.createElement('div');
    container.className = 'subtype-list';
    const heading = document.createElement('h3');
    heading.textContent = subtypeName;
    container.appendChild(heading);
    list.forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `<div class="si-name">${item.name}</div><div class="si-price">${item.price}</div>`;
        container.appendChild(div);
    });
    modalBody.appendChild(container);
}

document.addEventListener('click', (e) => {
    const box = e.target.closest('.ser-box .box');
    if (box && box.dataset && box.dataset.category) {
        const title = box.querySelector('.ser-name')?.textContent || 'Services';
        openServiceModal(box.dataset.category, title);
    }
    if (e.target.matches('.modal-close')) closeServiceModal();
    if (e.target.matches('.modal') && e.target.getAttribute('aria-hidden') === 'false') closeServiceModal();
});

// keyboard activation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeServiceModal();
    if (e.key === 'Enter' || e.key === ' ') {
        const active = document.activeElement;
        if (active && active.classList.contains('box') && active.dataset.category) {
            e.preventDefault();
            const title = active.querySelector('.ser-name')?.textContent || 'Services';
            openServiceModal(active.dataset.category, title);
        }
    }
});
