const express = require('express')

const log = require('../logger')
const db = require('../db/event')
const { getTokenDecoder } = require('../auth')
const { sendEventNotifications } = require('../notifications/notificationHelper')

const router = express.Router()

module.exports = router

router.post('/', getTokenDecoder(), (req, res) => {
  const { title, date, volunteersNeeded, description, gardenId } = req.body
  const event = { title, date, volunteersNeeded, description, gardenId }
  let createdEvent = null
  db.addEvent(event)
    .then((event) => {
      createdEvent = event
      return sendEventNotifications(event)
    })
    .then(() => {
      res.status(201).json(createdEvent)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to add event'
        }
      })
    })
})

router.patch('/:id', getTokenDecoder(), (req, res) => {
  const { title, date, volunteersNeeded, description, id } = req.body
  const updatedEvent = { title, date, volunteersNeeded, description, id }
  db.updateEvent(updatedEvent)
    .then((event) => {
      res.status(200).json(event)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to update event'
        }
      })
    })
})

router.get('/:id', getTokenDecoder(false), (req, res) => {
  const id = Number(req.params.id)
  db.getEventById(id)
    .then((event) => {
      const { id, gardenId, gardenName, gardenAddress, volunteersNeeded, title, date, description, volunteers } = event
      const eventResponse = { id, gardenId, gardenName, gardenAddress, volunteersNeeded, title, date, description }

      if (req.user) {
        if (req.user.isAdmin) {
          eventResponse.volunteers = volunteers
        } else {
          eventResponse.isVolunteer = volunteers.some((v) => v.userId === req.user.id)
        }
      }

      res.json(eventResponse)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to retrieve event'
        }
      })
    })
})
