import React from 'react'

const sortingTypes = {
  name: 'Name',
  stargazers_count: 'Stars count',
  open_issues_count: 'Open issues count',
  pushed_at: 'Updated date'
}

export const Sorting = ({orderBy, sortOrder, updateSortState}) => (
  <aside className="sorting" >
    <select name="sorting" value={orderBy} onChange={e => updateSortState('by', e.target.value)}>
      {Object.keys(sortingTypes).map((item) => <option key={item} value={item}>{sortingTypes[item]}</option>)}
    </select>
    <select name="order" value={sortOrder} onChange={e => updateSortState('order', e.target.value)}>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </aside>
)
