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
    const modalTitle = document.querySelector('.titleImage');
    const modalText = document.querySelector('.textImage');
    const closeBtn = document.querySelector('.close');

    images.forEach(img => {
        img.addEventListener('click', function () {
            
            modalImage.src = this.src;
            modalTitle.textContent = this.getAttribute('data-title');
            modalText.textContent = this.getAttribute('data-text');
            
            
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
