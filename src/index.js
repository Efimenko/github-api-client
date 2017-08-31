import React, { Component } from "react";
import ReactDOM from "react-dom";
import {Search} from './components/search'
import CardList from './components/card-list'
import Dialog from './components/dialog'
import {ParseLink} from './util/parse-link'
import _ from 'lodash'

import "./styles/style.scss";

const __svg__ = { path: './img/*.svg', name: 'images/sprite-[hash].svg' };
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

class App extends Component {

  state = {
    currentUser: '',
    repositories: [],
    openDialog: false,
    nextPage: false,
    page: 0,
    lastPage: 0
  }

  getSearchNode = (node) => {
    this.searchInput = node
  }

  submitForm = (e) => {
    e.preventDefault();
    const user = this.searchInput.value
    const {currentUser} = this.state
    if (user && currentUser !== user) {
      this.loadRepositories(user, 0);
    }
  }

  saveRepos = (user, repositories, lastPage, page) => {
    const repos = user !== this.state.currentUser ? repositories : this.state.repositories.concat(repositories)

    this.setState({
      currentUser: user,
      repositories: repos,
      page: page + 1,
      lastPage: lastPage,
    })
  }

  getDialogNode = (node) => {
    this.dialogWrapper = node
  }

  openDialog = (id) => {
    this.setState({activeRepository: _.find(this.state.repositories, {id: id})})
  }

  updateDialogState = () => {
    this.setState({openDialog: !this.state.openDialog})
  }

  loadRepositories = (user, page) => {
    fetch(`https://api.github.com/users/${user}/repos?page=${page+1}`)
      .then((response) => {
        const lastPage = response.headers.get('Link')
          ? parseInt(ParseLink(response.headers.get('Link')).last.split('=')[1])
          : 1

        return Promise.all([response.json(), lastPage])
      })
      .then(([repositories, lastPage]) => {
          this.saveRepos(user, repositories, lastPage, page)
      })
      .catch((e) => {console.log(e)});
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.openDialog !== this.state.openDialog) {
      if(nextState.openDialog) {
        this.dialogWrapper.showModal()
      } else {
        this.dialogWrapper.close()
      }
    }
  }

  render() {
    const {repositories, currentUser, activeRepository, openDialog, lastPage, page} = this.state
    return (
      <div className={openDialog && "is-croped"}>
        <Search getSearch={this.getSearchNode}
                onSubmit={this.submitForm} />
        {repositories.length !== 0 &&
          <CardList repos={repositories}
                    openDialog={this.openDialog} />
        }
        <Dialog activeRepository={activeRepository}
                currentUser={currentUser}
                getDialog={this.getDialogNode}
                openDialog={openDialog}
                updateDialogState={this.updateDialogState} />
                <div className="load-more">
        {lastPage !== page &&
          <button
            type="button"
            className="btn load-more__btn"
            onClick={() => this.loadRepositories(currentUser, page)}>
            Load more
          </button>
        }
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
}
