function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function seleccionarSeccion(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('seleccionada');
    });
    element.classList.add('seleccionada');
}


document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.imProyectos');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.querySelector('.titleImage');
    const modalText = document.querySelector('.textImage');
    const modalLink = document.getElementById("modalLink");
    const closeBtn = document.querySelector('.close');

    images.forEach(img => {
        img.addEventListener('click', function () {
            modalImage.src = this.src;
            modalTitle.textContent = this.getAttribute('data-title');
            modalText.textContent = this.getAttribute('data-text');
            
            modalIcon.src = this.getAttribute('data-icon') || './assets/icon-default.png';
            modalIcon2.src = this.getAttribute('data-icon2') || './assets/icon-default2.png';
            modalIcon3.src = this.getAttribute('data-icon3') || './assets/icon-default3.png';
            modalLink.href = this.getAttribute("modalLink");
            
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
