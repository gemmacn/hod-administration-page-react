import React, {Component} from 'react'
import CKEditor from 'react-ckeditor-component'
import {Redirect} from 'react-router-dom'

import {GetArticle, ModifyArticle} from '../../Services'
import './styles.css'

class NewArticle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submited: false,
      title: '',
      category: '',
      featured: false,
      body: '',
      image: ''
    }
    this.onChange = this.onChange.bind(this)
    this.handleChanche = this.handleChanche.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    const {id} = this.props.match.params
    GetArticle(id)
    .then(response => {
      const article = response.data
      this.setState(prevState => {
        prevState.title = article.title
        prevState.image = article.image
        prevState.category = article.category
        prevState.featured = article.featured
        prevState.body = article.body
        return prevState
      })
    })
  }

  onChange (evt) {
    var newContent = evt.editor.getData()
    this.setState(prevState => {
      prevState.body = newContent
      return prevState
    })
  }
  handleChanche (e) {
    const fieldToUpdate = e.target.name
    const newData = e.target.value
    this.setState(prevState => {
      prevState[fieldToUpdate] = newData
      return prevState
    })
  }
  handleCheckBox () {
    const featuredValue = this.refs.featured.checked
    this.setState(prevState => {
      prevState.featured = featuredValue
      return prevState
    })
  }
  handleSubmit (e) {
    e.preventDefault()
    const {id} = this.props.match.params
    ModifyArticle(id, this.state)
      .then(this.setState(prevState => {
        prevState.submited = true
        return prevState
      }))
      .catch(error => console.log(error.response))
  }

  render () {
    return (
      <div>
        <h2 className='section-title'>
          Editando el artículo {this.props.match.params.id}
        </h2>
        <form className='new-article-body' onSubmit={this.handleSubmit} >
          <div className='new-article-section title-section'>
            <input id='title' name='title' data-field='title' type='text' onChange={this.handleChanche} value={this.state.title} className='new-article-title' placeholder='Insert article title here...' required />
          </div>
          <div className='new-article-section category-section'>
            <select name='category' id='category' data-field='category' onChange={this.handleChanche} value={this.state.category} required>
              <option value='' disabled>Select a category</option>
              <option value='noticias'>News</option>
              <option value='avisos'>Advices</option>
              <option value='eventos'>Events</option>
              <option value='sorteos'>Giveaways</option>
            </select>
          </div>
          <div className='new-article-section featured-section'>
            <label htmlFor='featured'>Mark article as featured: </label>
            <input type='checkbox' ref='featured' checked={this.state.featured} name='featured' data-field='fetured' onChange={this.handleCheckBox} />
          </div>
          <div className='image-preview'>
            <input type='text' name='image' className='img-input' placeholder='Insert image url' value={this.state.image} onChange={this.handleChanche} />
            <br />
            <img src={this.state.image} alt='' height='300' />
          </div>
          <CKEditor
            activeClass='p10 article-editor'
            content={this.state.body}
            events={{
              'change': this.onChange
            }}
          />
          <button type='submit' className='btn btn-primary btn-block btn-large'>Publish article</button>
        </form>
        {this.state.submited ? <Redirect to='/administration' /> : <div />}
      </div>
    )
  }
}

export default NewArticle
