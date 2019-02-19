import React, {
    Component
} from 'react';
import {
    Form,
    Button,  
    Message
} from 'semantic-ui-react';

const util = require('ethereumjs-util')
const abi = require('ethereumjs-abi')

class VerifyMessage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: '',
            contractAddress: '',
            signature: '',
            expectedSigner: '',
            errorMessage: ''
        }
    }

    prefixed = (hash) => {
        return abi.soliditySHA3(
            ["string", "bytes32"],
            ["\x19Ethereum Signed Message:\n32", hash]
        );
    }

    constructPaymentMessage = (contractAddress, amount) => {
        return abi.soliditySHA3(
            ["address", "uint256"],
            [contractAddress, amount]
        );
    }

    recoverSigner = (message, signature) => {
        var split = util.fromRpcSig(signature);
        var publicKey = util.ecrecover(message, split.v, split.r, split.s);
        var signer = util.pubToAddress(publicKey).toString("hex");
        return signer;
    }

    isValidSignature = (contractAddress, amount, signature, expectedSigner) => {
        var message = this.prefixed(this.constructPaymentMessage(contractAddress, amount));
        var signer = this.recoverSigner(message, signature);
        return signer.toLowerCase() ==
            util.stripHexPrefix(expectedSigner).toLowerCase();
    }


    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            loading: true,
            errorMessage: ''
        });

        try {
            if (this.isValidSignature(this.state.contractAddress, this.state.amount, this.state.signature, this.state.expectedSigner)) {
                window.alert('Message Verified!  \n' + 'Amount: ' + this.state.amount + ' ether')
            }
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
            <div className="App">
                <Form
                    onSubmit={this.onSubmit}
                    error={
                        !!this.state.errorMessage
                    }
                >
                    <Form.Group widths='equal'>
                        <Form.Input fluid
                            label='Contract Address'
                            value={
                                this.state.contractAddress
                            }
                            onChange={
                                event => this.setState({ contractAddress: event.target.value })
                            }
                        />
                        <Form.Input fluid
                            label='Amount (in ether)'
                            value={this.state.amount}
                            onChange={event => this.setState({ amount: event.target.value })}
                        />
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Input fluid
                            label='Signature'
                            value={this.state.signature}
                            onChange={event => this.setState({ signature: event.target.value })}
                        />
                        <Form.Input fluid
                            label='Expected Signer'
                            value={this.state.expectedSigner}
                            onChange={event => this.setState({ expectedSigner: event.target.value })}
                        />
                    </Form.Group>

                    <Message error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />
                    <Button loading={this.state.loading} positive > Verify Message! </Button>
                </Form>
            </div>
        );
    }
}

export default VerifyMessage;