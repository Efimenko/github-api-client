import React from 'react'
import {Card} from './card'
import LangColors from './colors.js'
import {calcDate} from './../../util/calc-date'

import './card-list.scss'

export const CardList = ({repos, openDialog}) => (
  <div className="cards__inner">
    {repos.map(({id, name, description, language, stargazers_count, pushed_at, fork}) => {
      return (
        <Card
          id={id}
          key={id}
          name={name}
          desc={description}
          language={language}
          stars={stargazers_count}
          update={calcDate(pushed_at)}
          fork={fork}
          langColor={LangColors[language]}
          openDialog={openDialog}
        />
      )
    })}
  </div>
)

CardList.propTypes = {
  repos: React.PropTypes.array,
  openDialog: React.PropTypes.func
}
