import React from 'react'
import { Header, Icon } from 'semantic-ui-react'

const HeaderPayment = () => (
  <Header as='h1' color='green'>
    Simple Payment Channel
    <div> <i className="fab fa-ethereum"></i></div>
    <Header.Subheader>On Ethereum </Header.Subheader>
  </Header>
)

export default HeaderPayment