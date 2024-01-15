/* eslint-disable no-unused-vars */
import React from 'react'
import App from './App'

/* eslint-disable no-undef */
describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<App />)
  })
})