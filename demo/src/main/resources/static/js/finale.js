// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Caricato - Inizializzazione sito matrimonio');

    // ========== GESTIONE NAVIGAZIONE ARTICOLI ==========
    const body = document.body;
    const main = document.getElementById('main');
    const articles = document.querySelectorAll('.article');
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    let locked = false;
    const delay = 325;

    function showArticle(id, initial = false) {
        const targetArticle = document.getElementById(id);
        if (!targetArticle) {
            console.error('Articolo non trovato:', id);
            return;
        }

        console.log('Mostro articolo:', id);

        if (locked || initial) {
            body.classList.add('is-switching');
            body.classList.add('is-article-visible');
            articles.forEach(art => art.classList.remove('active'));
            header.style.display = 'none';
            footer.style.display = 'none';
            main.style.display = 'flex';
            targetArticle.style.display = 'block';
            targetArticle.classList.add('active');
            locked = false;
            setTimeout(() => body.classList.remove('is-switching'), initial ? 1000 : 0);
            window.scrollTo(0,0);
            return;
        }

        locked = true;

        if (body.classList.contains('is-article-visible')) {
            const current = document.querySelector('.article.active');
            if (current) current.classList.remove('active');
            setTimeout(() => {
                if (current) current.style.display = 'none';
                targetArticle.style.display = 'block';
                setTimeout(() => {
                    targetArticle.classList.add('active');
                    window.scrollTo(0,0);
                    setTimeout(() => { locked = false; }, delay);
                }, 25);
            }, delay);
        } else {
            body.classList.add('is-article-visible');
            setTimeout(() => {
                header.style.display = 'none';
                footer.style.display = 'none';
                main.style.display = 'flex';
                targetArticle.style.display = 'block';
                setTimeout(() => {
                    targetArticle.classList.add('active');
                    window.scrollTo(0,0);
                    setTimeout(() => { locked = false; }, delay);
                }, 25);
            }, delay);
        }
    }

    function hideArticle(addState = false) {
        if (!body.classList.contains('is-article-visible')) return;
        if (addState && history.pushState) {
            history.pushState(null, null, '#');
        }
        const activeArticle = document.querySelector('.article.active');
        if (!activeArticle) return;

        console.log('Nascondo articolo');
        locked = true;
        activeArticle.classList.remove('active');
        setTimeout(() => {
            activeArticle.style.display = 'none';
            main.style.display = 'none';
            header.style.display = 'flex';
            footer.style.display = 'block';
            setTimeout(() => {
                body.classList.remove('is-article-visible');
                window.scrollTo(0,0);
                setTimeout(() => { locked = false; }, delay);
            }, 25);
        }, delay);
    }

    // Attach event listeners per navigazione
    const navStory = document.getElementById('nav-story');
    const navWedding = document.getElementById('nav-wedding');
    const navGallery = document.getElementById('nav-gallery');
    const navRsvp = document.getElementById('nav-rsvp');
    const navGifts = document.getElementById('nav-gifts');

    if (navStory) navStory.addEventListener('click', (e) => { e.preventDefault(); showArticle('story'); });
    if (navWedding) navWedding.addEventListener('click', (e) => { e.preventDefault(); showArticle('wedding'); });
    if (navGallery) navGallery.addEventListener('click', (e) => { e.preventDefault(); showArticle('gallery'); });
    if (navRsvp) navRsvp.addEventListener('click', (e) => { e.preventDefault(); showArticle('rsvp'); });
    if (navGifts) navGifts.addEventListener('click', (e) => { e.preventDefault(); showArticle('gifts'); });

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => hideArticle(true));
    });

    document.body.addEventListener('click', (e) => {
        if (body.classList.contains('is-article-visible') && !e.target.closest('.article') && !e.target.closest('nav a')) {
            hideArticle(true);
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape' && body.classList.contains('is-article-visible')) {
            hideArticle(true);
        }
    });

    if (window.location.hash && window.location.hash !== '#') {
        const hashId = window.location.hash.substring(1);
        if (document.getElementById(hashId)) {
            setTimeout(() => showArticle(hashId, true), 100);
        }
    }

    window.addEventListener('hashchange', () => {
        if (window.location.hash === '' || window.location.hash === '#') {
            hideArticle();
        } else {
            const id = window.location.hash.substring(1);
            if (document.getElementById(id)) showArticle(id);
        }
    });

    // ========== CONTROLLO DATE ALLOGGIO ==========
    const needAccommodationCheckbox = document.getElementById('needAccommodation');
    const accommodationDetails = document.getElementById('accommodationDetails');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const dateError = document.getElementById('dateError');

    function updateDateLimits() {
        if (!dateFrom || !dateTo) return;

        const fromValue = dateFrom.value;
        const toValue = dateTo.value;

        if (fromValue) {
            const minDeparture = new Date(fromValue);
            minDeparture.setDate(minDeparture.getDate() + 1);
            const minDepartureStr = minDeparture.toISOString().split('T')[0];
            dateTo.min = minDepartureStr;

            if (toValue && new Date(toValue) <= new Date(fromValue)) {
                dateTo.value = minDepartureStr;
            } else if (!toValue) {
                dateTo.value = minDepartureStr;
            }
        }

        if (toValue) {
            const maxArrival = new Date(toValue);
            maxArrival.setDate(maxArrival.getDate() - 1);
            const maxArrivalStr = maxArrival.toISOString().split('T')[0];
            dateFrom.max = maxArrivalStr;

            if (fromValue && new Date(fromValue) >= new Date(toValue)) {
                dateFrom.value = maxArrivalStr;
            }
        }
    }

    function validateDates() {
        if (!dateFrom || !dateTo) return true;

        const fromDate = new Date(dateFrom.value);
        const toDate = new Date(dateTo.value);
        const isValid = toDate > fromDate;

        if (!isValid && dateError) {
            dateError.classList.add('show');
        } else if (dateError) {
            dateError.classList.remove('show');
        }

        return isValid;
    }

    if (dateFrom) {
        dateFrom.addEventListener('change', function() {
            updateDateLimits();
            validateDates();
        });
    }

    if (dateTo) {
        dateTo.addEventListener('change', function() {
            updateDateLimits();
            validateDates();
        });
    }

    function initializeDateLimits() {
        updateDateLimits();
        validateDates();
    }

    if (needAccommodationCheckbox) {
        needAccommodationCheckbox.addEventListener('change', function() {
            if (accommodationDetails) {
                accommodationDetails.style.display = this.checked ? 'block' : 'none';
            }
            if (this.checked) {
                initializeDateLimits();
            }
        });
    }

    // ========== SUBMIT FORM RSVP - VERSIONE TEST SENZA BACKEND ==========
    const rsvpForm = document.getElementById('rsvpForm');

    if (rsvpForm) {
        console.log('Form RSVP trovato, attacco event listener');

        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('=== FORM SUBMIT INIZIATO ===');

            // Prendi i valori
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const needAccommodation = document.getElementById('needAccommodation').checked;
            const feedback = document.getElementById('formFeedback');

            console.log('Nome:', name);
            console.log('Email:', email);
            console.log('Necessita alloggio:', needAccommodation);

            // Validazione base
            if (!name || !email) {
                if (feedback) {
                    feedback.innerHTML = '<span style="color: #ffaaaa;"><i class="fas fa-exclamation-triangle"></i> Per favore compila nome ed email.</span>';
                    setTimeout(() => { feedback.innerHTML = ''; }, 4000);
                }
                return;
            }

            // Validazione email base
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (feedback) {
                    feedback.innerHTML = '<span style="color: #ffaaaa;"><i class="fas fa-exclamation-triangle"></i> Inserisci un indirizzo email valido.</span>';
                    setTimeout(() => { feedback.innerHTML = ''; }, 4000);
                }
                return;
            }

            // Validazione date se necessario alloggio
            if (needAccommodation) {
                const isDateValid = validateDates();
                if (!isDateValid) {
                    if (feedback) {
                        feedback.innerHTML = '<span style="color: #ffaaaa;"><i class="fas fa-exclamation-triangle"></i> La data di partenza deve essere dopo la data di arrivo (almeno una notte).</span>';
                        setTimeout(() => { feedback.innerHTML = ''; }, 4000);
                    }
                    return;
                }
            }

            // Raccogli tutti i dati
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;
            const message = document.getElementById('message').value;

            const dataToSend = {
                nomeCognome: name,
                email: email,
                nadulti: parseInt(adults) || 0,
                nbambini: parseInt(children) || 0,
                alloggio: needAccommodation,
                nalloggioadulti: needAccommodation ? (parseInt(document.getElementById('accAdults').value) || 0) : 0,
                nalloggiobambini: needAccommodation ? (parseInt(document.getElementById('accChildren').value) || 0) : 0,
                arrivo: needAccommodation ? document.getElementById('dateFrom').value : null,
                partenza: needAccommodation ? document.getElementById('dateTo').value : null,
                note: message
            };

            console.log('Dati da inviare:', dataToSend);

            // MOSTRA FEEDBACK DI CARICAMENTO
            if (feedback) {
                feedback.innerHTML = '<span style="color: #ffffff;"><i class="fas fa-spinner fa-spin"></i> Invio in corso...</span>';
            }

            // INVIO AL BACKEND
            // PER TEST: Se vuoi testare senza backend, decommenta la riga sotto e commenta il fetch
            // simulateSuccess(dataToSend, feedback);

            fetch('https://presenze-app.onrender.com/presenze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            .then(response => {
                console.log('Risposta ricevuta:', response.status);
                if (!response.ok) {
                    throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(savedPresenza => {
                console.log('Salvataggio riuscito:', savedPresenza);
                // Mostra messaggio di successo
                let total = dataToSend.nadulti + dataToSend.nbambini;
                let messageText = '<span style="color: #ffffff;"><i class="fas fa-check-circle"></i> Grazie ' + dataToSend.nomeCognome + '!<br/>';
                messageText += 'Hai confermato ' + dataToSend.nadulti + ' adulto/i e ' + dataToSend.nbambini + ' bambino/i (totale ' + total + ' persone).<br/>';

                if (dataToSend.alloggio) {
                    const accTotal = dataToSend.nalloggioadulti + dataToSend.nalloggiobambini;
                    messageText += '<i class="fas fa-bed"></i> <strong>Hai indicato bisogno di alloggio</strong><br/>';
                    messageText += '🏠 Alloggiano: ' + dataToSend.nalloggioadulti + ' adulto/i e ' + dataToSend.nalloggiobambini + ' bambino/i (totale ' + accTotal + ' persone).<br/>';

                    if (dataToSend.arrivo && dataToSend.partenza) {
                        const from = new Date(dataToSend.arrivo);
                        const to = new Date(dataToSend.partenza);
                        const formatDate = (d) => d.getDate() + '/' + (d.getMonth() + 1);
                        messageText += '📅 Periodo: dal ' + formatDate(from) + ' al ' + formatDate(to) + ' ottobre 2026.<br/>';
                    }
                } else {
                    messageText += '<i class="fas fa-home"></i> Non hai indicato bisogno di alloggio.<br/>';
                }

                if (dataToSend.note) {
                    messageText += '<i class="fas fa-comment"></i> Note: ' + dataToSend.note + '<br/>';
                }

                messageText += '<br/>✨ Ti aspettiamo per festeggiare insieme! ✨</span>';
                if (feedback) feedback.innerHTML = messageText;

                // Reset del form
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('adults').value = '0';
                document.getElementById('children').value = '0';
                document.getElementById('needAccommodation').checked = false;
                if (accommodationDetails) accommodationDetails.style.display = 'none';
                if (document.getElementById('dateFrom')) document.getElementById('dateFrom').value = '2026-10-24';
                if (document.getElementById('dateTo')) document.getElementById('dateTo').value = '2026-10-26';
                if (document.getElementById('accAdults')) document.getElementById('accAdults').value = '0';
                if (document.getElementById('accChildren')) document.getElementById('accChildren').value = '0';
                if (document.getElementById('message')) document.getElementById('message').value = '';
                if (dateError) dateError.classList.remove('show');

                setTimeout(() => { if (feedback) feedback.innerHTML = ''; }, 8000);
            })
            .catch(error => {
                console.error('Errore dettagliato:', error);
                if (feedback) {
                    feedback.innerHTML = '<span style="color: #ffaaaa;"><i class="fas fa-exclamation-triangle"></i> Si è verificato un errore durante l\'invio. Riprova più tardi.<br/><small>' + error.message + '</small></span>';
                    setTimeout(() => { feedback.innerHTML = ''; }, 5000);
                }
            });
        });
    } else {
        console.error('Form RSVP non trovato!');
    }

    // Funzione di test (usa questa se non hai backend)
    function simulateSuccess(dataToSend, feedback) {
        console.log('SIMULAZIONE: Dati inviati con successo', dataToSend);
        setTimeout(() => {
            let total = dataToSend.nadulti + dataToSend.nbambini;
            let messageText = '<span style="color: #ffffff;"><i class="fas fa-check-circle"></i> [TEST] Grazie ' + dataToSend.nomeCognome + '!<br/>';
            messageText += 'Hai confermato ' + dataToSend.nadulti + ' adulto/i e ' + dataToSend.nbambini + ' bambino/i (totale ' + total + ' persone).<br/>';
            messageText += '<br/>✨ Ti aspettiamo per festeggiare insieme! ✨</span>';
            if (feedback) feedback.innerHTML = messageText;

            // Reset del form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('adults').value = '0';
            document.getElementById('children').value = '0';
            document.getElementById('needAccommodation').checked = false;
            if (accommodationDetails) accommodationDetails.style.display = 'none';
            document.getElementById('message').value = '';

            setTimeout(() => { if (feedback) feedback.innerHTML = ''; }, 8000);
        }, 1000);
    }

    // Stato iniziale
    main.style.display = 'none';
    articles.forEach(art => art.style.display = 'none');
    header.style.display = 'flex';
    footer.style.display = 'block';

    // Rimuovi preload
    setTimeout(() => {
        body.classList.remove('is-preload');
    }, 100);

    console.log('Inizializzazione completata');
});
