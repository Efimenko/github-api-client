import React from 'react'
import './sorting.scss'

const sortingTypes = {
  name: 'Name',
  stargazers_count: 'Stars count',
  open_issues_count: 'Open issues count',
  pushed_at: 'Updated date'
}

export const Sorting = ({orderBy, sortOrder, updateSortState}) => (
  <aside className="sorting">
    <div className="sorting__item">
      <label htmlFor="sorting-select" className="label sorting__label">Sort by</label>
      <select name="sorting"
        id="sorting-select"
        value={orderBy}
        onChange={e => updateSortState('by', e.target.value)}
        className="select select_sm select_inline sorting__select">
        {Object.keys(sortingTypes).map((item) => <option key={item} value={item}>{sortingTypes[item]}</option>)}
      </select>
    </div>
    <div className="sorting__item">
      <label htmlFor="ordering-select" className="label sorting__label">Order by</label>
      <select name="order"
              id="ordering-select"
              value={sortOrder}
              onChange={e => updateSortState('order', e.target.value)}
              className="select select_sm select_inline sorting__select">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  </aside>
)
