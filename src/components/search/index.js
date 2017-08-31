import React, {Component} from 'react'
import {Icon} from './../icon'
import './search.scss'

export default class Search extends Component {

  submitForm = (e) => {
    e.preventDefault();
    const user = this.user.value
    if (user && this.props.currentUser !== user) {
      this.props.loadRepositories(user, this.props.page);
    }
  }

  render() {
    return (
      <div className="form-wrapper">
        <form onSubmit={this.submitForm} className="form">
          <label htmlFor="username-input" className="form__label">
            <Icon name="user" label="Username"/>
          </label>
          <input className="field form__field"
            id="username-input"
            name="username"
            type="text"
            placeholder="Type username"
            ref={(ref) => {this.user = ref}}
            required />
          <button className="btn form__btn" type="submit">
            Load reps
          </button>
        </form>
      </div>
    )
  }
}
