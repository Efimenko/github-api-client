import React from 'react'
import { Icon } from '../../icon'

import './dialog.scss'

export const Dialog = ({
    name,
    url,
    parent,
    contributors,
    languages,
    pulls,
    getDialog,
    getDialogInner,
    getDialogCloseBtn,
    closeDialog
  }) => (
<dialog className="dialog"
        ref={ref => getDialog(ref)}
        onClick={closeDialog}>
  <div className="dialog__inner" ref={ref => getDialogInner(ref)}>
      <button type="button"
              className="dialog__close"
              title="Close"
              ref={ref => getDialogCloseBtn(ref)}>
        <Icon name="close"/>
      </button>
      <div className="dialog__scroll">
        <article className="card card_extend">
          <h1 className="card__title">
            <a className="card__title-link" href={url} target="_blank">{name}</a>
          </h1>
          {parent.length !== 0 &&
            <small className="card__meta-item">
              Forked from&nbsp;
              <a href={parent.html_url} target="_blank">{parent.full_name}</a>
            </small>
          }
          {contributors.length !== 0 &&
            <section className="card__section">
              <h2 className="card__title card__title_md">Contributors</h2>
              <table className="table table_card">
                <thead>
                  <tr>
                    <th>Login</th>
                    <th>Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.map(({login, html_url, contributions}, index) => {
                    return (<tr key={index}>
                      <td><a href={html_url} target="_blank">{login}</a></td>
                      <td>{contributions}</td>
                    </tr>)
                  })}
                </tbody>
              </table>
            </section>
          }
          {languages[Object.keys(languages)[0]] >= 1024 &&
            <section className="card__section">
              <h2 className="card__title card__title_md">Languages</h2>
              <table className="table table_card">
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(languages).map((key) => {
                      if (languages[key] >= 1024) {
                        return (<tr key={key}>
                          <td>{key}</td>
                          <td>{parseInt(languages[key] / 1024)}Kb</td>
                        </tr>)
                      }
                    })}
                </tbody>
              </table>
            </section>
          }
          {pulls.length !== 0 &&
            <section className="card__section">
              <h2 className="card__title card__title_md">Pull requests</h2>
              <ul className="card-list">
                {pulls.map(({title, html_url}, index) => {
                  return (<li className="card-list__item" key={index}>
                    <a href={html_url} target="_blank">{title}</a>
                  </li>)
                })}
              </ul>
            </section>
          }
        </article>
      </div>
  </div>
</dialog>
)

Dialog.propTypes = {
  name: React.PropTypes.string,
  url: React.PropTypes.string,
  parent: React.PropTypes.object,
  contributors: React.PropTypes.array,
  languages: React.PropTypes.object,
  pulls: React.PropTypes.array,
  getDialog: React.PropTypes.func,
  getDialogInner: React.PropTypes.func,
  getDialogCloseBtn: React.PropTypes.func,
  closeDialog: React.PropTypes.func
}
