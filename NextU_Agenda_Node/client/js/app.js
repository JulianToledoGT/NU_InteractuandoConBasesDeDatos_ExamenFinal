class EventManager {
    constructor() {
        this.urlBase = "/events"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
            this.inicializarCalendario(response)
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (evento) => {
            evento.preventDefault()
            let title = $('#titulo').val(),
                startDT = $('#start_date').val(),
                endDT = '';
            if (!$('#allDay').is(':checked')) {
                startDT += 'T' + $('#start_hour').val()
                endDT = $('#end_date').val() + 'T' + $('#end_hour').val()
            }
            let url = this.urlBase + "/new"
console.log('1.-App:   ' + startDT + '  --  ' + endDT + '  ::   ' + url)
            if (title != "" && startDT != "") {
                let evento = {
                    title: title,
                    startDT: startDT,
                    endDT: endDT
                }
                $.post(url, evento, (response) => {
                    alert(response)
                })
            //     $('.calendario').fullCalendar('renderEvent', evento)
            } else {
                alert("Hay datos requeridos pendientes de especificar. Verifique.")
            }
        })
    }

//JT-Ini
    actualizarEvento(evento) {
        let url = this.urlBase + "/update/"
        console.log(url);
        $.post(url,
            {
                id: evento.id,
                start: evento.start,
                end: evento.end
            }, (response) => {
                alert(response)
            })
    }
//JT-Fin
    eliminarEvento(evento) {
        let eventId = evento.id
        $.post('/events/delete/' + eventId, { id: eventId }, (response) => {
            alert(response)
        })
    }


    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function () {
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            } else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: 'month, agendaWeek, basicDay'
            },
            defaultDate: Date.getdate,
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            }//,
            //events: eventos,
            // eventDragStart: (event, jsEvent) => {
            //      $('.delete').find('img').attr('src', "img/trash-open.png");
            //      $('.delete').css('background-color', '#a70f19')
            // }
            //, eventDragStop: (event, jsEvent) => {
            //     var trashEl = $('.delete');
            //     var ofs = trashEl.offset();
            //     var x1 = ofs.left;
            //     var x2 = ofs.left + trashEl.outerWidth(true);
            //     var y1 = ofs.top;
            //     var y2 = ofs.top + trashEl.outerHeight(true);
            //     if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
            //         jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
            //         this.eliminarEvento(event)
            //         $('.calendario').fullCalendar('removeEvents', event.id);
            //     }
            // }
        })
    }
}

const Manager = new EventManager()
