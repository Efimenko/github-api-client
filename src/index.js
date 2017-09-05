import React, { Component } from "react";
import ReactDOM from "react-dom";
import {Search} from './components/search'
import {CardList} from './components/card-list'
import DialogContainer from './components/dialog-container'
import {Filter} from './components/filter'
import {Sorting} from './components/sorting'
import {parseLink} from './util/parse-link'
import {pickBy} from './util/pick-by'

import "./styles/style.scss";

const __svg__ = { path: './img/*.svg', name: 'images/sprite-[hash].svg' };
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

class App extends Component {

  state = {
    currentUser: '',
    loading: false,
    repositories: [],
    openDialog: false,
    nextPage: false,
    page: 0,
    lastPage: 0,
    openingFilter: false,
    filters: {
      hasIssues: false,
      hasTopics: false,
      starsCount: '',
      updateDate: '',
      type: 'All',
      language: 'All'
    },
    sort: {
      by: 'name',
      order: 'asc'
    }
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

  openDialog = (id) => {
    if (!this.state.activeRepository || id !== this.state.activeRepository.id) {
      this.setState({activeRepository: this.state.repositories.find(item => item.id === id )})
    }
    this.updateDialogState()
  }

  updateDialogState = () => {
    this.setState({openDialog: !this.state.openDialog})
  }

  loadRepositories = (user, page) => {
    this.setState({loading: true})
    fetch(`https://api.github.com/users/${user}/repos?page=${page+1}&per_page=100`, {
        headers: new Headers({
          Accept: 'application/vnd.github.mercy-preview+json'
        })
      })
      .then((response) => {
        const links = response.headers.get('Link')
        let lastPage = this.state.lastPage
        if (links !== null) {
          if (parseLink(links).last) {
            lastPage = parseInt(parseLink(links).last.split('=')[1].split('&')[0])
          }
        }else {
          lastPage = 1
        }
        return Promise.all([response.json(), lastPage])
      })
      .then(([repositories, lastPage]) => {
          const repos = user !== this.state.currentUser
            ? repositories
            : this.state.repositories.concat(repositories)

          this.setState({
            currentUser: user,
            loading: false,
            repositories: repos,
            page: page + 1,
            lastPage: lastPage,
          })
      })
      .catch((e) => {console.log(e)});
  }

  updateFiltersState = (key, value) => {
    this.setState({filters: {...this.state.filters, [key]: value}})
  }

  updateSortState = (key, value) => {
    this.setState({sort: {...this.state.sort, [key]: value}})
  }

  updateLoadingState = () => {
    this.setState({loading: !this.state.loading})
  }

  languages = []

  getFilterLanguages = (repositories) => {
    if (repositories.length) {
      repositories.map(item => {
        if (item.language && !this.languages.includes(item.language)) {
          this.languages.push(item.language)
        }
      })
    }
  }

  filterRepositories = ({open_issues_count, topics, stargazers_count, pushed_at, fork, language}) => {
    const actions = {
      hasIssues: () => open_issues_count,
      hasTopics: () => topics.length,
      starsCount: value => stargazers_count >= value,
      updateDate: value => new Date(pushed_at) >= new Date(value),
      type: value => value === 'All' ? true : value === 'Forks' ? fork : !fork,
      language: value => value === 'All' ? true : language === value
    }

    return Object.keys(pickBy(this.state.filters, value => value)).every(action =>
      actions[action](this.state.filters[action])
    )
  }

  openFilter = () => {
    this.setState({openingFilter: !this.state.openingFilter})
  }

  sortRepositories = (prev, next) => {
    const {by} = this.state.sort
    if (by === 'name') {
      if(prev[by].toUpperCase() < next[by].toUpperCase()) return -1
      if(prev[by].toUpperCase() > next[by].toUpperCase()) return 1
      return 0
    }else {
      if(prev[by] < next[by]) return -1
      if(prev[by] > next[by]) return 1
      return 0
    }
  }

  componentDidMount() {
    this.setState({firstLoading: false})
  }

  componentDidUpdate() {
    if (this.main) {
      this.main.addEventListener('touchmove', e => {
        if ((this.main.offsetHeight + this.main.scrollTop) >= this.cardsWrapper.offsetHeight) {
          if (!this.state.loading && this.state.lastPage !== this.state.page) {
            this.loadRepositories(this.state.currentUser, this.state.page)
          }
        }
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.getFilterLanguages(nextState.repositories)
  }

  render() {
    const {repositories, currentUser, activeRepository, openDialog, lastPage, page, filters, sort, loading, openingFilter} = this.state
    const filteredRepositories = repositories.filter(this.filterRepositories).sort(this.sortRepositories)
    if (sort.order === 'desc') {
      filteredRepositories.reverse()
    }
    return (
      <div className="wrapper">
        <header className="header">
          <Search getSearch={this.getSearchNode}
                  onSubmit={this.submitForm} />
          <button className="btn btn_sm btn_full header__btn"
                  type="button"
                  onClick={this.openFilter}>
                  Open filters
          </button>
        </header>
        <section className="content">
          <div className="content__inner">
            {loading &&
              <div className="spinner-wrapper">
                <div className="spinner" aria-busy="true" aria-live="polite" aria-label="Don't refresh the page"/>
              </div>
            }
            {filteredRepositories.length !== 0 &&
              <Sorting sortBy={sort.by}
                       sortOrder={sort.order}
                       updateSortState={this.updateSortState}/>
            }
            {filteredRepositories.length !== 0 &&
              <main className="main" ref={ref => this.main = ref}>
                <section className="cards" ref={ref => this.cardsWrapper = ref}>
                  <CardList repos={filteredRepositories}
                            openDialog={this.openDialog} />
                </section>
              </main>
            }
          </div>
          <Filter filters={filters}
                  languages={this.languages}
                  updateFiltersState={this.updateFiltersState}
                  openFilter={this.openFilter}
                  openingFilter={openingFilter}/>
          {openDialog &&
            <DialogContainer activeRepository={activeRepository}
                             currentUser={currentUser}
                             updateDialogState={this.updateDialogState}
                             updateLoading={this.updateLoadingState}/>
          }
        </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
}
