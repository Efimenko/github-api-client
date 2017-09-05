import React from 'react'
import './notify.scss'

export const Notify = ({error, notify}) => (
  <div className={`notify ${error ? 'notify_error' : ''}`}>
    {error}
    {notify}
  </div>
)
