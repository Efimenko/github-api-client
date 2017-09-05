import React from 'react'
import classNames from 'classnames'
import './icon.scss'

const __svg__ = { path: 'img/*.svg', name: 'images/sprite-[hash].svg' };
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

export const Icon = ({modif, name, className, label}) => {
  return (
    <i className={classNames('icon', `icon_${name}`, modif && `icon_${modif}`, className && className)}>
      <svg className="icon__svg" aria-label={label}>
        <use xlinkHref={`#icon${name}`}></use>
      </svg>
    </i>
  )
}
