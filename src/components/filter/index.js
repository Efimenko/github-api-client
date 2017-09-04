import React from 'react'

import './filter.scss'

export const Filter = ({updateFiltersState, languages, filters}) => (<aside className="filter">
  <div>
    <input type="checkbox"
           checked={filters.hasIssues}
           name="has-issues"
           id="has-issues"
           onChange={e => updateFiltersState('hasIssues', e.target.checked)} />
    <label htmlFor="has-issues">Has open issues</label>
  </div>
  <div>
    <input type="checkbox"
           checked={filters.hasTopics}
           name="has-topics"
           id="has-topics"
           onChange={e => updateFiltersState('hasTopics', e.target.checked)} />
    <label htmlFor="has-topics">Has topics</label>
  </div>
  <div>
    <label htmlFor="stars-min">Min count of starts</label>
    <input type="number"
           name="stars-min"
           id="stars-min"
           value={filters.starsCount}
           onChange={e => updateFiltersState('starsCount', parseInt(e.target.value))}/>
  </div>
  <div>
    <label htmlFor="update-date">Update after</label>
    <input type="date"
           name="update-date"
           id="update-date"
           onChange={e => updateFiltersState('updateDate', e.target.value)}/>
  </div>
  <fieldset>
    <div>
      <label htmlFor="type-all">All</label>
      <input type="radio"
             name="type"
             value="All"
             id="type-all"
             checked={filters.type === "All"}
             onChange={e => updateFiltersState('type', e.target.value)}/>
    </div>
    <div>
      <label htmlFor="type-forks">Forks</label>
      <input type="radio"
             name="type"
             value="Forks"
             id="type-forks"
             checked={filters.type === "Forks"}
             onChange={e => updateFiltersState('type', e.target.value)}/>
    </div>
    <div>
      <label htmlFor="type-sources">Sources</label>
      <input type="radio"
             name="type"
             value="Source"
             id="type-sources"
             checked={filters.type === "Source"}
             onChange={e => updateFiltersState('type', e.target.value)}/>
    </div>
  </fieldset>
  <select name="languages"
          id="languages-select"
          value={filters.language}
          onChange={e => updateFiltersState('language', e.target.value)}>
    <option value="All">All languages</option>
    {languages.length &&
      languages.map(item => <option key={item} value={item}>{item}</option>)
    }
  </select>
</aside>
)
