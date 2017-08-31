import React, {Component} from 'react'
import _ from 'lodash'
import { Icon } from '../icon'

import './dialog.scss'

const API_URL = 'https://api.github.com'

export default class Dialog extends Component {

  state = {
    loading: false,
    parent: [],
    contributors: [],
    languages: {},
    pulls: []
  }

  fetchInfo = (link) => {
    return fetch(link).then((response) => {
      return response.json();
    })
  }

  closeDialog = (e) => {
    // this.setState({parent: [], contributors: [], languages: {}, pulls: []})
    this.props.updateDialogState()
  }

  loadRepoInfo = (currentUser, name, fork) => {
    this.setState({loading: true})
    if(fork) {
      Promise.all(this.urls.map(this.fetchInfo)).then(([repoInfo, contributors, languages, pulls]) => {
        this.setState({parent: repoInfo.parent, contributors, languages, pulls, loading: false});
        this.props.updateDialogState();
      })
    }else {
      Promise.all(this.urls.map(this.fetchInfo)).then(([contributors, languages, pulls]) => {
        this.setState({parent: [], contributors, languages, pulls, loading: false});
        this.props.updateDialogState();
      })
    }
  }

  componentDidMount() {
    this.props.getDialog(this.dialogWrapper)
  }

  componentWillReceiveProps(nextProps) {

    if(this.props.activeRepository.id !== nextProps.activeRepository.id) {
      const {name, fork} = nextProps.activeRepository
      const currentUser = nextProps.currentUser
      if (fork) {
        this.urls = [
          `${API_URL}/repos/${currentUser}/${name}`,
          `${API_URL}/repos/${currentUser}/${name}/contributors?per_page=3`,
          `${API_URL}/repos/${currentUser}/${name}/languages`,
          `${API_URL}/repos/${currentUser}/${name}/pulls?state=open&sort=popularity&per_page=5`
        ]
      }else {
        this.urls = [
          `${API_URL}/repos/${currentUser}/${name}/contributors?per_page=3`,
          `${API_URL}/repos/${currentUser}/${name}/languages`,
          `${API_URL}/repos/${currentUser}/${name}/pulls?state=open&sort=popularity&per_page=5`
        ]
      }

      this.loadRepoInfo(currentUser, name, fork)
    }
  }

  render() {
    console.log('render');
    const {name, html_url} = this.props.activeRepository
    const {loading, parent, contributors, languages, pulls} = this.state
    return (
      <dialog className="dialog"
            ref={ref => this.dialogWrapper = ref}>
        {loading
          ? <div>loading...</div>
          : <div className="dialog__inner">
              <button type="button" className="dialog__close" title="Close" onClick={this.closeDialog}>
                <Icon name="close"/>
              </button>
              <div className="dialog__scroll">
                <article className="card card_extend">
                  <h1 className="card__title">
                    <a className="card__title-link" href={html_url} target="_blank">{name}</a>
                  </h1>
                  {parent.length !== 0 &&
                    <small className="card__meta-item">
                      Forked from&nbsp;
                      <a href={parent.html_url} target="_blank">{parent.full_name}</a>
                    </small>
                  }
                  {contributors &&
                    <section className="card__section">
                      <h2 className="card__title card__title_md">Contributors</h2>
                      <table className="table table_card">
                        <thead>
                          <tr>
                            <th>Login</th>
                            <th>Contributions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contributors.map(({login, html_url, contributions}, index) => {
                            return (<tr key={index}>
                              <td><a href={html_url} target="_blank">{login}</a></td>
                              <td>{contributions}</td>
                            </tr>)
                          })}
                        </tbody>
                      </table>
                    </section>
                  }
                  {languages[Object.keys(languages)[0]] >= 1024 &&
                    <section className="card__section">
                      <h2 className="card__title card__title_md">Languages</h2>
                      <table className="table table_card">
                        <thead>
                          <tr>
                            <th>Language</th>
                            <th>Size</th>
                          </tr>
                        </thead>
                        <tbody>
                          {_.map(languages, (value, key) => {
                            if (value >= 1024) {
                              return (<tr key={key}>
                                <td>{key}</td>
                                <td>{parseInt(value / 1024)}Kb</td>
                              </tr>)
                            }
                          })}
                        </tbody>
                      </table>
                    </section>
                  }
                  {pulls.length !== 0 &&
                    <section className="card__section">
                      <h2 className="card__title card__title_md">Pull requests</h2>
                      <ul className="card-list">
                        {pulls.map(({title, html_url}, index) => {
                          return (<li className="card-list__item" key={index}>
                            <a href={html_url} target="_blank">{title}</a>
                          </li>)
                        })}
                      </ul>
                    </section>
                  }
                </article>
              </div>
          </div>
        }
      </dialog>
    )
  }
}

Dialog.propTypes = {
  activeRepository: React.PropTypes.object,
  currentUser: React.PropTypes.string,
  openDialog: React.PropTypes.bool,
  getDialog: React.PropTypes.func,
  updateDialogState: React.PropTypes.func
}

Dialog.defaultProps = {
  activeRepository: {
    name: '',
    html_url: '',
    fork: false
  }
}
