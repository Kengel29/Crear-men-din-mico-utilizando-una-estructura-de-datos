// Menú dinámico: las opciones se cargan desde menu.json (nada está escrito a mano en el HTML)

const menuEl = document.getElementById('menu');
const navEl = document.querySelector('nav');
const btnMenu = document.getElementById('btn-menu');
const contenido = document.getElementById('contenido');
const indice = {}; // id -> opción, para encontrar rápido cada sección
let primeraId = null;

// 1. Cargar los datos con fetch (consumo de un recurso JSON, igual que una API REST)
async function cargarMenu() {
  try {
    const respuesta = await fetch('menu.json');
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    const datos = await respuesta.json();

    document.getElementById('nombre-app').textContent = datos.app.nombre;
    document.getElementById('lema').textContent = datos.app.lema;
    document.title = datos.app.nombre + ' – Menú dinámico';

    indexar(datos.menu);
    primeraId = datos.menu[0].id;
    datos.menu.forEach(op => menuEl.append(crearOpcion(op)));
    mostrarSeccion();
  } catch (e) {
    contenido.innerHTML = '';
    const aviso = document.createElement('div');
    aviso.className = 'error';
    aviso.textContent = 'No se pudo cargar menu.json (' + e.message + '). ' +
      'Abre el proyecto con un servidor local: python -m http.server 8000';
    contenido.append(aviso);
  }
}

// 2. Recorrer el árbol de datos (recursivo, permite submenús)
function indexar(lista) {
  lista.forEach(op => {
    indice[op.id] = op;
    if (op.hijos) indexar(op.hijos);
  });
}

// 3. Crear el HTML de cada opción a partir de los datos
function crearOpcion(op) {
  const li = document.createElement('li');

  if (op.hijos && op.hijos.length) {
    const boton = document.createElement('button');
    boton.className = 'enlace con-sub';
    boton.textContent = op.titulo;
    boton.setAttribute('aria-expanded', 'false');

    const sub = document.createElement('ul');
    sub.className = 'submenu';
    sub.hidden = true;
    op.hijos.forEach(h => sub.append(crearOpcion(h)));

    boton.addEventListener('click', () => {
      const abrir = sub.hidden;
      cerrarSubmenus();
      sub.hidden = !abrir;
      boton.setAttribute('aria-expanded', String(abrir));
    });
    li.append(boton, sub);
  } else {
    const enlace = document.createElement('a');
    enlace.className = 'enlace';
    enlace.href = '#' + op.id;
    enlace.textContent = op.titulo;
    li.append(enlace);
  }
  return li;
}

function cerrarSubmenus() {
  menuEl.querySelectorAll('.submenu').forEach(s => (s.hidden = true));
  menuEl.querySelectorAll('.con-sub').forEach(b => b.setAttribute('aria-expanded', 'false'));
}

// 4. Mostrar el contenido de la opción seleccionada
function mostrarSeccion() {
  const id = location.hash.slice(1) || primeraId;
  const op = indice[id] || indice[primeraId];

  contenido.innerHTML = '';
  const h1 = document.createElement('h1');
  h1.textContent = op.titulo;
  contenido.append(h1);

  if (op.descripcion) {
    const p = document.createElement('p');
    p.className = 'desc';
    p.textContent = op.descripcion;
    contenido.append(p);
  }

  if (op.items) {
    const ul = document.createElement('ul');
    ul.className = 'lista';
    op.items.forEach(it => {
      const li = document.createElement('li');
      const nombre = document.createElement('span');
      nombre.textContent = it.nombre;
      const puntos = document.createElement('span');
      puntos.className = 'puntos';
      const precio = document.createElement('span');
      precio.className = 'precio';
      precio.textContent = 'RD$ ' + it.precio.toLocaleString('es-DO');
      li.append(nombre, puntos, precio);
      ul.append(li);
    });
    contenido.append(ul);
  }

  // Marcar la opción activa (y su padre, si es un submenú)
  menuEl.querySelectorAll('.activo').forEach(e => e.classList.remove('activo'));
  const activo = menuEl.querySelector('a[href="#' + op.id + '"]');
  if (activo) {
    activo.classList.add('activo');
    const padre = activo.closest('.submenu');
    if (padre) padre.previousElementSibling.classList.add('activo');
  }

  cerrarSubmenus();
  navEl.classList.remove('abierto');
  btnMenu.setAttribute('aria-expanded', 'false');
}

// Eventos
window.addEventListener('hashchange', mostrarSeccion);
btnMenu.addEventListener('click', () => {
  const abierto = navEl.classList.toggle('abierto');
  btnMenu.setAttribute('aria-expanded', String(abierto));
});
document.addEventListener('click', e => { if (!e.target.closest('nav')) cerrarSubmenus(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarSubmenus(); });

cargarMenu();
