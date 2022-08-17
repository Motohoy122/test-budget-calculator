import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const [events, updateEvents] = useState([
    {id:0, title: 'event 1', start: '2022-08-20', end: '2022-08-24', backgroundColor: '#378006' },
    { id:1,title: 'event 2', date: '2022-08-24', backgroundColor: '#770020' }
  ])

  const handleEventAdd = () => {
    const newState = {
      id:3, title: 'event Added', start: '2022-08-07', end: '2022-08-11', backgroundColor: '#378006'
    }
    updateEvents(prevState => (
      [...prevState, newState]
    )
    )
  }

  const handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr)
  }

  const handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove() // will render immediately. will call handleEventRemove
    }
  }

  const handleEventChange = (changeInfo) => {
    console.log(changeInfo)
  }

  const handleEventRemove = (removeInfo) => {
    // this.props.deleteEvent(removeInfo.event.id)
    //   .catch(() => {
    //     reportNetworkError()
    //     removeInfo.revert()
    //   })
    const intInfoId = parseInt(removeInfo.event.id)
    const filteredEvents = events.filter(event => {
      // console.log(typeof removeInfo.event.id)
      if(event.id !== parseInt(intInfoId)) {
        return event
      }
    })
    updateEvents(filteredEvents)
    // console.log(filteredEvents)
    // console.log('event it in remove handler ', removeInfo.event.id)
  }

const schedule = () => {
    return (
        <div>
            <button onClick={handleEventAdd}>Add Event</button>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                editable={true}
                selectable={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventChange={handleEventChange}
                // eventRemove={handleEventRemove}
            />
        </div>
    )
}

export default schedule
