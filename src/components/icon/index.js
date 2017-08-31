import React from 'react'
import classNames from 'classnames'
import './icon.scss'

export const Icon = ({modif, name, className, label}) => {
  return (
    <i className={classNames('c-icon', `c-icon_${name}`, modif && `c-icon_${modif}`, className && className)}>
      <svg className="c-icon__svg" aria-label={label}>
        <use xlinkHref={`#icon${name}`}></use>
      </svg>
    </i>
  )
}
