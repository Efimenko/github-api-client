import React, {Component} from 'react'
import {Dialog} from './dialog'
import {closest} from './../../util/closest'

import './dialog-wrapper.scss'

const API_URL = 'https://api.github.com'

export default class DialogContainer extends Component {

  constructor() {
    super()
    this.handleClose = this.closeByKey.bind(this)
  }

  state = {
    parent: {},
    contributors: [],
    languages: {},
    pulls: []
  }

  getDialog = (node) => {
    this.dialog = node
  }

  getDialogInner = (node) => {
    this.dialogInner = node
  }

  getDialogCloseBtn = (node) => {
    this.dialogCloseBtn = node
  }

  closeDialog = (e) => {
    if (closest(e.target, this.dialogCloseBtn) || !closest(e.target, this.dialogInner)) {
      this.dialog.close()
      this.props.updateDialogState()
    }
  }

  fetchInfo = (link) => {
    return fetch(link).then((response) => {
      if (response.status === 404 || response.status === 403) {
        return Promise.reject([])
      }
      return response.json();
    })
    .catch((e) => {
      this.props.showError('Load error')
    })
  }

  loadRepoInfo = (currentUser, name, fork) => {
    this.props.updateLoading()

    if (fork) {
      const urls = [
        `${API_URL}/repos/${currentUser}/${name}`,
        `${API_URL}/repos/${currentUser}/${name}/contributors?per_page=3`,
        `${API_URL}/repos/${currentUser}/${name}/languages`,
        `${API_URL}/repos/${currentUser}/${name}/pulls?state=open&sort=popularity&per_page=5`
      ]

      Promise.all(urls.map(this.fetchInfo)).then(([repoInfo, contributors, languages, pulls]) => {
        if (contributors) {
          this.setState({parent: repoInfo.parent, contributors, languages, pulls, loading: false});
          this.props.updateLoading()
          this.dialog.showModal()
        }
      })
    }else {
      const urls = [
        `${API_URL}/repos/${currentUser}/${name}/contributors?per_page=3`,
        `${API_URL}/repos/${currentUser}/${name}/languages`,
        `${API_URL}/repos/${currentUser}/${name}/pulls?state=open&sort=popularity&per_page=5`
      ]

      Promise.all(urls.map(this.fetchInfo)).then(([contributors, languages, pulls]) => {
        if (contributors) {
          this.setState({parent: {}, contributors, languages, pulls});
          this.props.updateLoading()
          this.dialog.showModal()
        }
      })
    }
  }


  closeByKey = (e) => {
    e.preventDefault()
    if (e.key === "Escape") {
      this.dialog.close()
      this.props.updateDialogState()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleClose)

    const {name, fork} = this.props.activeRepository
    const currentUser = this.props.currentUser

    this.loadRepoInfo(currentUser, name, fork)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleClose)
  }

  render() {
    const {name, html_url} = this.props.activeRepository
    const {parent, contributors, languages, pulls} = this.state
    return (
      <div className="dialog-wrapper">
        <Dialog name={name}
                url={html_url}
                parent={parent}
                contributors={contributors}
                languages={languages}
                pulls={pulls}
                getDialog={this.getDialog}
                getDialogInner={this.getDialogInner}
                getDialogCloseBtn={this.getDialogCloseBtn}
                closeDialog={this.closeDialog} />
      </div>
    )
  }
}


DialogContainer.propTypes = {
  activeRepository: React.PropTypes.object,
  currentUser: React.PropTypes.string,
  updateDialogState: React.PropTypes.func
}
