const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    res.status(200).send(task)
  } catch (err) {
    res.status(404).send('Cannot find task with that ID.')
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(item => allowedUpdates.includes(item))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update!' })
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!task) {
      return res.status(404).send({ error: 'Cannot find task to update with that ID.' })
    }
    res.status(200).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).send({ error: 'No task found to delete with that ID' })
    }
    res.status(200).send(task)
  } catch (err) {
    res.status(500).send()
  }
})

module.exports = router