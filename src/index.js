import React, { Component } from "react";
import ReactDOM from "react-dom";
import Search from './components/search'
import CardList from './components/card-list'
import Dialog from './components/dialog'
import {ParseLink} from './util/parse-link'
import _ from 'lodash'

import "./styles/style.scss";

const __svg__ = { path: './img/*.svg', name: 'images/sprite-[hash].svg' };
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

class App extends Component {

  state ={
    currentUser: '',
    repositories: [],
    openDialog: false,
    nextPage: false,
    page: 0,
    lastPage: 0,
    needLastPage: true
  }

  saveRepos = (user, repositories, lastPage) => {
    if(lastPage) {
      this.setState({
        currentUser: user,
        repositories: this.state.repositories.concat(repositories),
        page: this.state.page + 1,
        lastPage: lastPage,
        needLastPage: false
      })
    } else {
      this.setState({
        currentUser: user,
        repositories: this.state.repositories.concat(repositories),
        page: this.state.page + 1,
      })
    }
  }

  getDialogNode = (node) => {
    this.dialogWrapper = node
  }

  openDialog = (id) => {
    this.updateDialogState()
    this.setState({activeRepository: _.find(this.state.repositories, {id: id})})
  }

  updateDialogState = () => {
    this.setState({openDialog: !this.state.openDialog})
  }

  loadRepositories = (user, page) => {
    fetch(`https://api.github.com/users/${user}/repos?page=${page+1}`)
      .then((response) => {
        return response.json();
      })
      .then((repositories) => {
        if (this.state.needLastPage) {
          fetch(`https://api.github.com/users/${user}/repos`)
            .then((response) => {
              let lastPage = 1;
              if(response.headers.get('Link') !== null) {
                // console.log(response.headers.get('Link'));
                lastPage = parseInt(ParseLink(response.headers.get('Link')).last.split('=')[1])
              }

              // console.log(ParseLink(response.headers.get('Link')))
              this.saveRepos(user, repositories, lastPage)
            })
        }else {
          this.saveRepos(user, repositories)
        }

      })
      .catch((e) => {console.log(e)});
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.openDialog !== this.state.openDialog) {
      if(nextState.openDialog) {
        setTimeout(() => this.dialogWrapper.showModal(), 100)
      } else {
        this.dialogWrapper.close()
      }
    }
  }

  render() {
    const {repositories, currentUser, activeRepository, openDialog, lastPage, page} = this.state
    return (
      <div className={openDialog && "is-croped"}>
        <Search saveRepos={this.saveRepos}
                currentUser={currentUser}
                page={page}
                loadRepositories={this.loadRepositories} />
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
