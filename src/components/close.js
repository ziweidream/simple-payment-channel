import React, {
    Component
} from 'react';
import {
    Form,
    Button,
    Input,
    Message
} from 'semantic-ui-react';
import web3 from '../ethereum/web3'
import simplePayment from '../ethereum/simplePayment'


class Close extends Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: '',
            signature: '',
            errorMessage: '',
            loading: false
        }
    }

    onSubmit = async event => {
        event.preventDefault()

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts()
            await simplePayment.methods.close(this.state.amount, this.state.signature).send({
                from: accounts[0]
            })
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
        this.setState({ loading: false })
    }

    render() {

        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Group widths='equal'>
                    <Form.Input fluid
                        label='Amount (in ether)'
                        value={
                            this.state.amount
                        }
                        onChange={
                            event => this.setState({ amount: event.target.value })
                        }
                    />
                    <Form.Input fluid
                        label='Signature'
                        value={this.state.signature}
                        onChange={event => this.setState({ signature: event.target.value })}
                    />
                </Form.Group>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} positive > Close (recipient only) </Button>
            </Form>
        );
    }
}

export default Close