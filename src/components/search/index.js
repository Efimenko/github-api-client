import React from 'react'
import {Icon} from './../icon'
import './search.scss'

export const Search = ({getSearch, onSubmit}) => (
  <div className="form-wrapper">
    <form onSubmit={onSubmit} className="form">
      <label htmlFor="username-input" className="form__label">
        <Icon name="user" label="Username"/>
      </label>
      <input className="field form__field"
        id="username-input"
        name="username"
        type="text"
        placeholder="Type username"
        ref={(ref) => {getSearch(ref)}}
        required />
      <button className="btn form__btn" type="submit">
        Load reps
      </button>
    </form>
  </div>
)

Search.propTypes = {
  getSearch: React.PropTypes.func,
  onSubmit: React.PropTypes.func
}
