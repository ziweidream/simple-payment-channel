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


class ClaimTimeout extends Component {
    constructor(props) {
        super(props)

        this.state = {          
            errorMessage: '',
            loading: false
        }
    }


    onSubmit = async event => {
        event.preventDefault()

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts()
            await simplePayment.methods.ClaimTimeout().send({
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
                
                <Message error header="Oops!" content={this.state.errorMessage} />

                <Button loading={this.state.loading} positive > Claim Timeout (sender only) </Button>
            </Form>           
        );
    }
}

export default ClaimTimeout