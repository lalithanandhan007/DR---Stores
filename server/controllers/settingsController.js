import asyncHandler from 'express-async-handler'
import Settings from '../models/Settings.js'

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne()

  if (!settings) {
    settings = await Settings.create({
      storeName: 'D.R.STORES',
      storeTagline: 'Farm Fresh • Trusted • Local',
      ownerName: '',
      gstNumber: '',
      phone: '',
      email: '',
      address: {
        street: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      },
    })
  }

  res.json(settings)
})

const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne()

  if (!settings) {
    settings = new Settings(req.body)
  } else {
    Object.assign(settings, req.body)
  }

  const updatedSettings = await settings.save()

  res.json(updatedSettings)
})

export { getSettings, updateSettings }