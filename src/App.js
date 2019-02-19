import React, {
    Component
} from 'react';
import {
    Container,
    Card,
    Icon,
    Form,
    Label,
    Button,
    Input,
    Message
} from 'semantic-ui-react';
import web3 from './ethereum/web3'
import simplePayment from './ethereum/simplePayment'
import HeaderPayment from './components/header'
import SignMessage from './components/signMessage'
import VerifyMessage from './components/verifyMessage'
import Close from './components/close'
import ClaimTimeout from './components/claimTimeout'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sender: '',
            recipient: '',
            expiration: ''
        }
    }

    async componentDidMount() {
        const sender = await simplePayment.methods.sender().call()
        const recipient = await simplePayment.methods.recipient().call()
        const expirationTime = await simplePayment.methods.expiration().call()
        const expiration = (new Date(expirationTime * 1000)).toString();

        this.setState({
            sender,
            recipient,
            expiration,
            expirationTime,
            newExpiration: '',
            errorMessage: '',
            loading: false
        })
    }

    onSubmit = async event => {
        event.preventDefault()

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts()
            const extendTime = Number(this.state.newExpiration) + Number(this.state.expirationTime)           
            await simplePayment.methods.extend(extendTime).send({
                from: accounts[0]
            })
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <div style={{backgroundColor: '#d9d9d9'}}>
            <Container style={{ width: '68%', textAlign: 'center'}}>
                <HeaderPayment />

                <Card color='green' fluid>
                    <Card.Content>
                        <Card.Description>
                            Sender: {this.state.sender}
                        </Card.Description>
                        <Card.Description>
                            Recipient: {this.state.recipient}
                        </Card.Description>
                        <Card.Description>
                            <Icon name='hourglass half' />
                            Expiration date: {this.state.expiration}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra >
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field inline>
                                <Button basic floated='right' color='green' size='small' loading={this.state.loading} > Extend</Button>
                                <label>Extend Expiration (sender only)</label>
                                <Input
                                    value={this.state.newExpiration}
                                    onChange={
                                        event => this.setState({ newExpiration: event.target.value })
                                    }
                                />
                                <Label>seconds</Label>
                            </Form.Field>
                            <Message error header="Oops!" content={this.state.errorMessage} />
                        </Form>
                    </Card.Content>
                </Card>

                <Card.Group itemsPerRow={2}>
                    <Card color='green'>
                        <Card.Content>
                            <Card.Header>Close (recipient only)</Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            <Close />
                        </Card.Content>
                    </Card>

                    <Card color='green'>
                        <Card.Content>
                            <Card.Header>Claim Timeout (sender only)</Card.Header>
                            <Card.Description> <i className="far fa-calendar-times fa-2x"></i></Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <ClaimTimeout />
                        </Card.Content>
                    </Card>
                </Card.Group>

                <Card.Group itemsPerRow={2}>
                    <Card color="green">
                        <Card.Content>
                            <Card.Header>Sign Message</Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            <SignMessage />
                        </Card.Content>
                    </Card>

                    <Card color='green'>
                        <Card.Content>
                            <Card.Header>Verify Message</Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            <VerifyMessage />
                        </Card.Content>
                    </Card>
                </Card.Group>
            </Container>
            </div>
        );
    }
}

export default App;