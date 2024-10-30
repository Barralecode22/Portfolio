function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function seleccionarSeccion(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('seleccionada');
    });
    element.classList.add('seleccionada');
}