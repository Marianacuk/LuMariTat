document.addEventListener('DOMContentLoaded', function() {
    // Inicializar DataTables para la tabla de proyectos
    const proyectosTable = $('#proyectosTable').DataTable({
        responsive: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
        },
        columnDefs: [
            { orderable: false, targets: 4 } // No ordenar la columna de detalles
        ]
    });

    // Inicializar FullCalendar para el calendario de citas
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            events: [
                {
                    title: 'Disponible',
                    start: '2025-04-28T10:00:00',
                    end: '2025-04-28T12:00:00',
                    color: '#4361ee'
                },
                {
                    title: 'Disponible',
                    start: '2025-04-29T15:00:00',
                    end: '2025-04-29T17:00:00',
                    color: '#4361ee'
                },
                {
                    title: 'Disponible',
                    start: '2025-04-30T09:00:00',
                    end: '2025-04-30T11:00:00',
                    color: '#4361ee'
                },
                {
                    title: 'Disponible',
                    start: '2025-05-02T14:00:00',
                    end: '2025-05-02T16:00:00',
                    color: '#4361ee'
                },
                {
                    title: 'Reservado',
                    start: '2025-05-03T11:00:00',
                    end: '2025-05-03T13:00:00',
                    color: '#dc3545'
                }
            ],
            select: function(info) {
                const today = new Date();
                const selectedDate = new Date(info.start);
                
                if (selectedDate < today) {
                    alert('No puedes seleccionar fechas pasadas');
                    return;
                }
                
                const title = prompt('¿Deseas agendar una consultoría en esta fecha?');
                if (title) {
                    calendar.addEvent({
                        title: 'Solicitud: ' + title,
                        start: info.start,
                        end: info.end,
                        allDay: info.allDay,
                        color: '#ffc107'
                    });
                    
                    // Aquí se podría implementar el código para enviar la solicitud al backend
                    alert('Tu solicitud de consultoría ha sido registrada. Te contactaremos para confirmar.');
                }
                calendar.unselect();
            },
            eventClick: function(info) {
                if (info.event.title.startsWith('Disponible')) {
                    const decision = confirm('¿Deseas agendar una consultoría en este horario disponible?');
                    if (decision) {
                        const name = prompt('Por favor, ingresa tu nombre:');
                        if (name) {
                            info.event.setProp('title', 'Reservado por: ' + name);
                            info.event.setProp('color', '#ffc107');
                            
                            // Aquí se podría implementar el código para enviar la reserva al backend
                            alert('Tu reserva ha sido registrada. Te contactaremos para confirmar los detalles.');
                        }
                    }
                } else if (info.event.title.startsWith('Reservado')) {
                    alert('Este horario ya está reservado. Por favor, selecciona otro disponible.');
                }
            }
        });
        calendar.render();
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const empresa = document.getElementById('empresa').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Aquí se implementaría el código para enviar los datos al backend
            // Por ahora, simulamos el envío
            
            // Simulación de carga
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            
            setTimeout(function() {
                // Mostrar mensaje de éxito
                alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente. Te contactaremos a la brevedad.`);
                
                // Restablecer el formulario
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    // Navegación suave al hacer clic en los enlaces del menú
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Cerrar el menú hamburguesa si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 75, // Ajustar por la altura de la barra de navegación
                    behavior: 'smooth'
                });
            }
        });
    });

    // Botones en las tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('.card-title').textContent;
            window.location.href = `#contacto?service=${encodeURIComponent(serviceName)}`;
        });
    });

    // Añadir animaciones de entrada a los elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .section-title, .img-fluid').forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });

    // Manejar modales de proyectos
    // Crear modales dinámicamente para los proyectos 2-5 (el modal 1 ya está en el HTML)
    const proyectosData = [
        {
            id: 2,
            nombre: "LuxuryStore",
            cliente: "Premium Brands",
            descripcion: "Plataforma e-commerce de alta gama para venta de ropa de diseñador con experiencia de usuario premium. Incluye visualización 3D de productos, probador virtual y sistema de membresía exclusiva.",
            tecnologias: "Next.js, Strapi CMS, Algolia Search, Three.js, Stripe",
            resultados: "Aumento del 200% en el ticket promedio y reducción del 30% en devoluciones gracias al probador virtual."
        },
        {
            id: 3,
            nombre: "VintageVibe",
            cliente: "RetroFashion",
            descripcion: "Marketplace especializado en ropa vintage y de segunda mano con sistema de autenticación de prendas y comunidad activa de coleccionistas. Incluye sistema de subastas para prendas exclusivas.",
            tecnologias: "React, Firebase, Node.js, Socket.io, MongoDB",
            resultados: "Comunidad de más de 50,000 usuarios activos en los primeros 3 meses de lanzamiento."
        },
        {
            id: 4,
            nombre: "TrendyApp",
            cliente: "FashionNow",
            descripcion: "Aplicación móvil que combina venta de ropa con funcionalidades de red social para compartir looks y seguir tendencias. Incluye sistema de recomendación basado en IA.",
            tecnologias: "React Native, Express, PostgreSQL, TensorFlow",
            resultados: "Más de 100,000 descargas en el primer mes y tasa de retención del 65%."
        },
        {
            id: 5,
            nombre: "EcoWardrobe",
            cliente: "GreenFashion",
            descripcion: "Plataforma de intercambio y venta de ropa usada con enfoque en sostenibilidad. Incluye calculadora de impacto ambiental y sistema de puntos por reciclaje.",
            tecnologias: "Vue.js, Laravel, MySQL, AWS",
            resultados: "Impacto estimado: 15 toneladas de CO2 evitadas en el primer año de operación."
        }
    ];

    // Crear modales para proyectos 2-5
    proyectosData.forEach(proyecto => {
        const modalHtml = `
        <div class="modal fade" id="proyectoModal${proyecto.id}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${proyecto.nombre} - ${proyecto.cliente}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="/api/placeholder/500/300" alt="${proyecto.nombre}" class="img-fluid rounded mb-3">
                            </div>
                            <div class="col-md-6">
                                <h4>Descripción</h4>
                                <p>${proyecto.descripcion}</p>
                                <h4>Tecnologías</h4>
                                <p>${proyecto.tecnologias}</p>
                                <h4>Resultados</h4>
                                <p>${proyecto.resultados}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Agregar el modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    });

    // Detectar parámetros en la URL para preseleccionar servicio en el formulario
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.hash);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Verificar si hay un servicio en la URL al cargar la página o cambiar el hash
    const checkServiceParam = () => {
        const serviceParam = getUrlParameter('service');
        if (serviceParam && document.getElementById('servicio')) {
            const servicioSelect = document.getElementById('servicio');
            
            // Buscar la opción que coincide con el servicio
            for (let i = 0; i < servicioSelect.options.length; i++) {
                if (servicioSelect.options[i].text.toLowerCase().includes(serviceParam.toLowerCase())) {
                    servicioSelect.selectedIndex = i;
                    break;
                }
            }
        }
    };

    window.addEventListener('hashchange', checkServiceParam);
    checkServiceParam(); // Verificar al cargar la página

    // Verificar scroll para cambiar el estilo de la navegación
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });
});
