import React, {Component} from 'react'
import {Dialog} from './dialog'
import {closest} from './../../util/closest'

import './dialog-wrapper.scss'

const API_URL = 'https://api.github.com'

export default class DialogContainer extends Component {

  state = {
    loading: false,
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
      return response.json();
    })
  }

  loadRepoInfo = (currentUser, name, fork) => {
    this.setState({loading: true})

    if (fork) {
      const urls = [
        `${API_URL}/repos/${currentUser}/${name}`,
        `${API_URL}/repos/${currentUser}/${name}/contributors?per_page=3`,
        `${API_URL}/repos/${currentUser}/${name}/languages`,
        `${API_URL}/repos/${currentUser}/${name}/pulls?state=open&sort=popularity&per_page=5`
      ]

      Promise.all(urls.map(this.fetchInfo)).then(([repoInfo, contributors, languages, pulls]) => {
        this.setState({parent: repoInfo.parent, contributors, languages, pulls, loading: false});
        this.dialog.showModal()
      })
    }else {
      const urls = [
        `${API_URL}/repos/${currentUser}/${name}/contributors?per_page=3`,
        `${API_URL}/repos/${currentUser}/${name}/languages`,
        `${API_URL}/repos/${currentUser}/${name}/pulls?state=open&sort=popularity&per_page=5`
      ]

      Promise.all(urls.map(this.fetchInfo)).then(([contributors, languages, pulls]) => {
        this.setState({parent: {}, contributors, languages, pulls, loading: false});
        this.dialog.showModal()
      })
    }
  }

  keyDownEvent = null

  componentDidMount() {
    this.keyDownEvent = document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        this.dialog.close()
        this.props.updateDialogState()
      }
    })

    const {name, fork} = this.props.activeRepository
    const currentUser = this.props.currentUser

    this.loadRepoInfo(currentUser, name, fork)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.activeRepository.id !== nextProps.activeRepository.id) {
      const {name, fork} = nextProps.activeRepository
      const currentUser = nextProps.currentUser

      this.loadRepoInfo(currentUser, name, fork)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownEvent)
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
