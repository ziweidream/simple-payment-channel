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

//const util = require('ethereumjs-util')
const abi = require('ethereumjs-abi')

let sig;

class SignMessage extends Component {
    constructor(props) {
        super(props)

        this.state = {            
            amount: '',
            contractAddress: '',
            result: '',    
            errorMessage: ''    
        }
    }

    constructPaymentMessage = (contractAddress, amount) => {
        return abi.soliditySHA3(
            ["address", "uint256"],
            [contractAddress, amount]
        );
    }

    signMessage = (message, callback) => {
        web3.eth.personal.sign(
            "0x" + message.toString("hex"),
            '0x12241e7E6595A796b058dc01f291f9B50df8C9B2',
            function (err, result) {                
                console.log(err, result)
                window.alert('Signature: \n' + result)                     
            }
        );
    }

    // contractAddress is used to prevent cross-contract replay attacks.
    // amount, in wei, specifies how much Ether should be sent.
    signPayment = (contractAddress, amount) => {
        var message = this.constructPaymentMessage(contractAddress, amount);
        this.signMessage(message);
    }

    onSubmit = (event) => {
        event.preventDefault();

        this.setState({
            loading: true,
            errorMessage: ''
        });

        try {
            this.signPayment(this.state.contractAddress, this.state.amount)
        } catch (err) {
            this.setState({
                errorMessage: err.message
            });
        }

        this.setState({
            loading: false
        });

    }    
    
    render() {      
        return (
            <div>
                <Form 
                  onSubmit={this.onSubmit}
                  error={!!this.state.errorMessage}>
                
                    <Form.Field>
                        <label> Contract address </label>
                        <Input                         
                            value={
                                this.state.contractAddress
                            }
                            onChange={
                                event => this.setState({ contractAddress: event.target.value })
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label> Amount (in ether) </label>
                        <Input
                            
                            value={this.state.amount}
                            onChange={event => this.setState({ amount: event.target.value })}
                        />
                    </Form.Field>    
                    <Message error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />    
                    <Button loading={this.state.loading} positive > Sign and send! </Button>
                  
                </Form>                              
            </div>
        );
    }
}

export default SignMessage;