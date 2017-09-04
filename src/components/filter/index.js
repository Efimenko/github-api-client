import React from 'react'

import './filter.scss'

export const Filter = ({updateFiltersState, languages, filters}) => (
  <aside className="content__aside">
    <div className="content__aside-inner">
      <div className="filters">
        <div className="filters__item">
          <input type="checkbox"
                 checked={filters.hasIssues}
                 name="has-issues"
                 id="has-issues"
                 onChange={e => updateFiltersState('hasIssues', e.target.checked)} />
          <label htmlFor="has-issues" className="label label_offset-left">Has open issues</label>
        </div>
        <div className="filters__item">
          <input type="checkbox"
                 checked={filters.hasTopics}
                 name="has-topics"
                 id="has-topics"
                 onChange={e => updateFiltersState('hasTopics', e.target.checked)} />
          <label htmlFor="has-topics" className="label label_offset-left">Has topics</label>
        </div>
        <div className="filters__item">
          <label htmlFor="stars-min" className="label label_offset-bottom">Min count of starts</label>
          <input type="number"
                 name="stars-min"
                 id="stars-min"
                 className="field field_sm"
                 value={filters.starsCount}
                 placeholder="Type stars count"
                 onChange={e => updateFiltersState('starsCount', parseInt(e.target.value))}/>
        </div>
        <div className="filters__item">
          <label htmlFor="update-date" className="label label_offset-bottom">Update after</label>
          <input type="date"
                 name="update-date"
                 id="update-date"
                 className="field field_sm field_date"
                 onChange={e => updateFiltersState('updateDate', e.target.value)}/>
        </div>
        <fieldset className="fieldset">
          <legend className="fieldset__legend">Type</legend>
          <div className="filters__item">
            <label htmlFor="type-all" className="label">All</label>
            <input type="radio"
                   name="type"
                   value="All"
                   id="type-all"
                   checked={filters.type === "All"}
                   onChange={e => updateFiltersState('type', e.target.value)}/>
          </div>
          <div className="filters__item">
            <label htmlFor="type-forks" className="label">Forks</label>
            <input type="radio"
                   name="type"
                   value="Forks"
                   id="type-forks"
                   checked={filters.type === "Forks"}
                   onChange={e => updateFiltersState('type', e.target.value)}/>
          </div>
          <div className="filters__item">
            <label htmlFor="type-sources" className="label">Sources</label>
            <input type="radio"
                   name="type"
                   value="Source"
                   id="type-sources"
                   checked={filters.type === "Source"}
                   onChange={e => updateFiltersState('type', e.target.value)}/>
          </div>
        </fieldset>
        <div className="filter__item">
          <label htmlFor="languages-select" className="label label_offset-bottom">Languages</label>
          <select name="languages"
                  id="languages-select"
                  value={filters.language}
                  className="select select_sm"
                  onChange={e => updateFiltersState('language', e.target.value)}>
            <option value="All">All languages</option>
            {languages.length &&
              languages.map(item => <option key={item} value={item}>{item}</option>)
            }
          </select>
        </div>
      </div>
    </div>
  </aside>
)
