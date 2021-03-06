const express = require('express')
const log = require('../logger')
const db = require('../db/gardens')
const { getTokenDecoder } = require('../auth')

const router = express.Router()

module.exports = router

router.get('/', (req, res) => {
  db.getGardens()
    .then((gardens) => {
      return res.json({ gardens })
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to retrieve gardens'
        }
      })
    })
})

router.get('/:id', getTokenDecoder(false), (req, res) => {
  const id = Number(req.params.id)
  const user = req.user || {}
  db.getGardenById(id)
    .then(foundGarden => {
      // Create a deep copy of the garden
      const garden = JSON.parse(JSON.stringify(foundGarden))
      if (!user.isAdmin) {
        garden.events.forEach(event => {
          event.totalVolunteers = event.volunteers.length
          event.isVolunteer = event.volunteers.some((v) => v.username === user.username)
          delete event.volunteers
        })
      } else {
        garden.events.forEach(event => {
          event.totalVolunteers = event.volunteers.length
          event.isVolunteer = event.volunteers.some((v) => v.username === user.username)
        })
      }
      return res.json(garden)
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to retrieve garden'
        }
      })
    })
})
