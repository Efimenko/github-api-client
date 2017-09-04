import React, {Component} from 'react'
import { Icon } from '../../icon'

import './card.scss'

export const Card = ({id, name, fork, desc, language, langColor, stars, update, openDialog}) => {
  return (
    <div className="card-wrapper">
      <article className="card" onClick={() => openDialog(id)}>
        <div className="card__content">
          <h1 className="card__title">{name}</h1>
          {fork && <small className="card__meta-item">Forked</small>}
          <div className="card__desc">
            <p>{desc}</p>
          </div>
        </div>
        <footer className="card__footer">
          {language &&
            <small className="card__meta-item">
              <i className="card__lang-icon" style={{backgroundColor: langColor}}></i>
              {language}
            </small>
          }
          {stars !== 0 &&
            <small className="card__meta-item">
              <div className="card__meta-icon">
                <Icon name="star" label="Star"/>
              </div>
              {stars}
            </small>
          }
          <small className="card__meta-item">
            Updated {update}
          </small>
        </footer>
      </article>
    </div>
  )
}

Card.propTypes = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  desc: React.PropTypes.string,
  language: React.PropTypes.string,
  langColor: React.PropTypes.string,
  stars: React.PropTypes.number,
  update: React.PropTypes.string,
  openDialog: React.PropTypes.func,
  fork: React.PropTypes.bool
}
