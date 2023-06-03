// requiring driverModel
const Driver = require('../models/driverModel')
// requiring npm 'mongoose'
const mongoose = require('mongoose')

// get all drivers
const getDrivers = async (req, res) => {
    const user_id = req.user.id
    const drivers = await Driver.find({ user_id }).sort({ createdAt: -1 })
    res.status(200).json(drivers)
}

// get a single driver
const getDriver = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such driver' })
    }

    const driver = await Driver.findById(id)

    if (!driver) {
        return res.status(404).json({ error: 'No such driver' })
    }

    res.status(200).json(driver)
}

// create a new driver
const createDriver = async (req, res) => {
    const { name, regNo, number, school, route } = req.body

    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!regNo) {
        emptyFields.push('regNo')
    }
    if (!number) {
        emptyFields.push('number')
    }
    if (!school) {
        emptyFields.push('school')
    }
    if (!route) {
        emptyFields.push('route')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }


    // add to the database
    try {
        const user_id = req.user._id
        const driver = await Driver.create({ name, regNo, number, school, route, user_id })
        res.status(200).json(driver)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a driver
const deleteDriver = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such driver' })
    }

    const driver = await Driver.findOneAndDelete({ _id: id })

    if (!driver) {
        return res.status(400).json({ error: 'No such driver' })
    }

    res.status(200).json(driver)
}

// update a driver
const updateDriver = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such driver' })
    }

    const driver = await Driver.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!driver) {
        return res.status(400).json({ error: 'No such driver' })
    }

    res.status(200).json(driver)
}

module.exports = {
    getDrivers,
    getDriver,
    createDriver,
    deleteDriver,
    updateDriver
}