import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

const UpcomingEventsSection = () => {
  // Placeholder data for demonstration
  const upcomingEvents = [
    { title: 'Class 1', type: 'class', date: '2023-12-01', time: '10:00 AM' },
    { title: 'Quiz 1', type: 'quiz', date: '2023-12-03', time: '02:30 PM' },
    { title: 'Assignment 1', type: 'assignment', date: '2023-12-04', time: '03:00 PM' },
    { title: 'Class 2', type: 'class', date: '2023-12-05', time: '11:00 AM' }
  ]

  // Function to get the next 7 days
  const getNext7Days = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date()
      currentDate.setDate(currentDate.getDate() + i)
      days.push({
        date: currentDate.toISOString().split('T')[0],
        day: currentDate.toLocaleDateString(undefined, { weekday: 'long' })
      })
    }
    return days
  }

  const [next7Days, setNext7Days] = useState(getNext7Days())

  useEffect(() => {
    // Update the next 7 days when the component mounts
    setNext7Days(getNext7Days())
  }, [])

  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, margin: '16px' }}>
      <Card variant='outlined' sx={{ backgroundColor: '#f5f5f5', boxShadow: 3, borderRadius: '8px' }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Upcoming Events
          </Typography>
          {next7Days.map((day, dayIndex) => (
            <div key={dayIndex}>
              <Typography variant='subtitle1' style={{ marginBottom: '8px', color: '#555' }}>
                {`${day.day}, ${day.date}`}
              </Typography>
              {upcomingEvents
                .filter(event => event.date === day.date)
                .map((event, eventIndex) => (
                  <div key={eventIndex}>
                    <Typography>{`${event.title} (${event.type}) at ${event.time}`}</Typography>
                  </div>
                ))}
              {upcomingEvents.filter(event => event.date === day.date).length === 0 && (
                <div>
                  <Typography style={{ marginLeft: '15px', marginBottom: '8px', color: '#777' }}>
                    No Events today
                  </Typography>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default UpcomingEventsSection
