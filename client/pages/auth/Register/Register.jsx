import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { registerUser } from './registerHelper'

export default function Register () {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    gardenId: null,
    email: ''
  })
  const history = useHistory()

  function handleChange (e) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  function handleClick (e) {
    e.preventDefault()
    registerUser(form, history.push)
  }

  return (
    <>
      <form className='column'>
        <div className="field">
          <label htmlFor='firstName' className='label'>First Name</label>
          <input
            className='input'
            id='firstName'
            name='firstName'
            value={form.firstName}
            placeholder='First Name'
            onChange={handleChange}
          ></input>
        </div>
        <div className="field">
          <label htmlFor='lastName' className='label'>Last Name</label>
          <input
            className='input'
            id='lastName'
            name='lastName'
            value={form.lastName}
            placeholder='Last Name'
            onChange={handleChange}
          ></input>
        </div>
        <div className="field">
          <label htmlFor='username' className='label'>Username</label>
          <input
            className='input'
            id='username'
            name='username'
            value={form.username}
            placeholder='Username'
            onChange={handleChange}
          ></input>
        </div>
        <div className="field">
          <label htmlFor='password' className='label'>Password</label>
          <input
            className='input'
            id='password'
            type='password'
            name='password'
            value={form.password}
            placeholder='Password'
            onChange={handleChange}
          ></input>
        </div>
        <div className="field">
          <label htmlFor='email' className='label'>Email</label>
          <input
            className='input'
            id='email'
            type='email'
            name='email'
            value={form.email}
            placeholder='Email'
            onChange={handleChange}
          ></input>
        </div>
        <div className="field">
          <label htmlFor='garden' className='label'>My Garden</label>
          <select
            onChange={handleChange}
            className='select'
            name='gardenId'
            id='garden'
          >
            <option hidden>Select from this list</option>
            <option value={1}>Kelmarna Gardens</option>
            <option value={2}>Kingsland Community Orchard</option>
            <option value={3}>Devonport Community Garden</option>
          </select>
        </div>
        <button
          type='button'
          className='button'
          onClick={handleClick}
          data-testid='submitButton'
        >
          Register
        </button>
      </form>
      <div className='column'>
        <img src='./images/comGardenPlant.png' alt='Person gardening with trowel' />
      </div>
    </>
  )
}
