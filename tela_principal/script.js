// 1. INICIALIZAR O MAPA
// Iniciamos com uma visão do Brasil até que o GPS responda
const map = L.map('map', {
    zoomControl: false,
    tap: false // Melhora a resposta em dispositivos móveis
}).setView([-15.78, -47.92], 4);

// Estilo de mapa minimalista cinza
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Forçar o mapa a preencher o container corretamente
setTimeout(() => { map.invalidateSize(); }, 400);

// Criar o marcador do carro (Vetor laranja)
const carIcon = L.divIcon({
    className: 'car-marker',
    html: `<div style="background-color: #ff9800; width: 18px; height: 18px; transform: rotate(45deg); border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

let marcadorUsuario = L.marker([0, 0], {icon: carIcon}).addTo(map);

// --- FUNÇÃO DE LOCALIZAÇÃO EM TEMPO REAL ---

function localizarUsuario() {
    if ("geolocation" in navigator) {
        // watchPosition monitora a mudança de posição (movimento)
        navigator.geolocation.watchPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Suaviza o movimento do mapa até o usuário
            map.flyTo([lat, lng], 16, {
                animate: true,
                duration: 1.5
            });

            // Atualiza a posição do marcador
            marcadorUsuario.setLatLng([lat, lng]);

            console.log("Posição atualizada: ", lat, lng);
        }, function(error) {
            // Se der erro de permissão ou sinal
            if(error.code == 1) {
                alert("Por favor, autorize a localização no seu navegador para usar o app.");
            }
            console.error("Erro de GPS: ", error);
        }, {
            enableHighAccuracy: true, // Usa o GPS real do celular
            maximumAge: 30000,
            timeout: 27000
        });
    } else {
        alert("Seu celular não suporta geolocalização.");
    }
}

// Executa a localização
localizarUsuario();

// --- LÓGICA DA INTERFACE ---

const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const statusBtn = document.getElementById('statusBtn');
const eyeBtn = document.getElementById('eyeBtn');
const saldoTexto = document.getElementById('saldoTexto');
const iconEye = document.getElementById('iconEye');

const pathAberto = "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Z";
const pathFechado = "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34-10t38-2q75 0 127.5 52.5T660-500q0 20-2 38t-14 34ZM734-328l-54-54q38-34 69-75t53-85q-50-101-144.5-160.5T480-720q-33 0-65 5t-61 15l-58-58q44-18 90-26t94-8q146 0 266 81.5T920-500q-26 51-62 97t-124 75Zm112 246L720-208q-58 31-119 49.5T480-140q-146 0-266-81.5T40-500q33-60 80-111t106-89l-140-140 51-51 714 714-51 51ZM248-680q-48 29-91 69t-75 91q50 101 144.5 160.5T480-300q30 0 58-5t56-15L463-451q-7-4-13-10t-11-14L248-680Zm204 204Zm48 48Z";

menuToggle.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    sideMenu.classList.toggle('open'); 
});

document.addEventListener('click', (e) => { 
    if (!sideMenu.contains(e.target) && e.target !== menuToggle) {
        sideMenu.classList.remove('open');
    }
});

statusBtn.addEventListener('click', () => {
    statusBtn.classList.toggle('indisponivel');
    statusBtn.innerText = statusBtn.classList.contains('indisponivel') ? "Indisponível" : "Disponível";
});

let visivel = true;
eyeBtn.addEventListener('click', () => {
    const path = iconEye.querySelector('path');
    if (visivel) {
        saldoTexto.innerText = "R$ •••••";
        path.setAttribute('d', pathFechado);
    } else {
        saldoTexto.innerText = "R$ 0,00";
        path.setAttribute('d', pathAberto);
    }
    visivel = !visivel;
});