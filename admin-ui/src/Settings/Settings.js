import { Component } from 'react'
import './Settings.css'
import { Button, Dropdown, DropdownButton } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import {Client} from 'paho-mqtt'
import { json } from 'body-parser'
import AlertBox from './AlertBox'

class Settings extends Component {
    constructor(props) {
        super(props)
        this.kukaPlay = this.kukaPlay.bind(this)
        this.kukaStop = this.kukaReset.bind(this)
        this.showEnv = this.showEnv.bind(this)

        this.scoringModifier = this.scoringHandler.bind(this)
        this.changeModel = this.changeModel.bind(this)

        this.handleDropdown = this.handleDropdownItemSelected.bind(this)

        this.state = {
            kukaSelectedModel: "Select Model",
            yaskawaSelectedModel: "Select Model",
            kukaEnv: null,
            client: null,
            showAlert: false
        }
    }

    deviceCredentials = {
        yaskawa: {
            protocol: "ws",   // ws or mqtt
            clientId: "a:vrvzh6:" + Math.random().toString(16).substr(2, 8),
            broker: "vrvzh6.messaging.internetofthings.ibmcloud.com",
            subscribeScoring:
                "iot-2/type/gsc-yaskawa-gw/id/gsc-yaskawa-01/evt/scoring/fmt/json",
            subscribeImage:
                "iot-2/type/gsc-yaskawa-gw/id/gsc-yaskawa-01/evt/image/fmt/json",
            username: "a-vrvzh6-lmttnkzxht",
            password: "LRVitW+(soqXuZdJT!",
            ws: "wss://aipm-gsc-nodered.mybluemix.net/ws/aipm-gsc/yaskawa",
        },
        kuka: {
            protocol: "ws",
            clientId: "a:vrvzh6:" + Math.random().toString(16).substr(2, 8),
            broker: "vrvzh6.messaging.internetofthings.ibmcloud.com",
            subscribeScoring:
                "iot-2/type/gsc-kuka-gw/id/gsc-kuka-01/evt/scoring/fmt/json",
            subscribeImage:
                "iot-2/type/gsc-kuka-gw/id/gsc-kuka-01/evt/image/fmt/json",
            subscribeEnvironment: 
                "iot-2/type/gsc-kuka-gw/id/gsc-kuka-01/evt/respEnvironment/fmt/json",
            username: "a-vrvzh6-lmttnkzxht",
            password: "LRVitW+(soqXuZdJT!",
            ws: "wss://aipm-gsc-nodered.mybluemix.net/ws/aipm-gsc/kuka",
        },
        replay: {
            protocol: "ws",
            ws: "wss://aipm-gsc-nodered.mybluemix.net/ws/aipm-gsc",
        },
        raisinReplay: {
            protocol: "ws",
            ws: "wss://aipm-gsc-nodered.mybluemix.net/ws/aipm-gsc/raisinReplay",
        },
    };


    kukaPlay() {
        console.log("Kuka Play")
        alert("Kuka Play")

        fetch("http://aipm-gsc-nodered-vendor.mybluemix.net/kuka-play",
        {
            mode: 'cors'
        })
            .then(response => console.log(response.json))
            .then(data => console.log(data))
    }

    kukaReset() {
        console.log("Kuka Reset")
        alert("Kuka Reset")
        fetch("http://aipm-gsc-nodered-vendor.mybluemix.net/kuka-reset",
        {
            mode: 'cors',
        })
            .then(response => console.log(response.json))
            .then(data => console.log(data))
    }

    showEnv() {
        console.log("Show Environment Parameters")

        // let ws;
        // let wsUri = this.deviceCredentials["kuka"].ws
        // ws = new WebSocket(wsUri) 

        let mqtt_clientId = this.deviceCredentials["kuka"].clientId;
        let mqtt_broker = this.deviceCredentials["kuka"].broker;
        let mqtt_username = this.deviceCredentials["kuka"].username;
        let mqtt_password = this.deviceCredentials["kuka"].password;

        let client = new Client(mqtt_broker, 1883, mqtt_clientId)
        client.onConnectionLost = this.onConnectionLost;
        client.onMessageArrived = this.onMessageArrived;

        this.setState({
            client: client
        }, () => {
            client.connect({
                onSuccess: this.onConnect,
                onFailure: this.onFailure,
                userName: mqtt_username, // apikey
                password: mqtt_password,
            });
        })

        // ws.onmessage = (event) => {
        //     let msg = JSON.parse(event.data)

        //     this.setState({
        //         kukaParameters: msg
        //     })

        //     console.log("MSG: ", msg)
        // }
        // ws.onopen = () => {
        //     console.log("Connected")
        // }

        // ws.onclose = () => {
        //     console.log("Disconnected")
        // }

        fetch("http://aipm-gsc-nodered-vendor.mybluemix.net/request-kuka-env",
        {
            mode: 'cors'
        })
            // .then(response => {console.log(response)})
            // .then(data => { console.log(data)})
            // .catch(error => {console.log(error)})

    }

    onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    };

    onMessageArrived = (message) => {
        console.log("inside onMessage 2");
        let jsonMessage = JSON.parse(message.payloadString)
        console.log(jsonMessage)
        this.setState({
            kukaEnv: jsonMessage
        }, () => {
            this.setState({
                showAlert: true
            })
        })
    };

    onConnect = (props) => {
        let subscribeEnvironment = this.deviceCredentials["kuka"].subscribeEnvironment
        this.state.client.subscribe(subscribeEnvironment)
        console.log("Subscribed")
    }

    onFailure = (responseObject) => {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onFailure" + JSON.stringify(responseObject));
    };

    scoringHandler(robot, flag) {
        console.log("Scoring")
    
        switch (flag) {
            case true:
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/${robot}-start-scoring`,
                {
                    mode: 'cors'
                }
                )
                    // .then(response => {console.log(response.json))
                    // .then(data => console.log(data))
                    alert("Scoring Mode Request Sent")
                break

            case false:
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/${robot}-end-scoring`,
                {
                    mode: 'cors'
                }
                )
                    // .then(response => console.log(response.json))
                    // .then(data => console.log(data))
                    alert("Scoring Mode Request Sent")
                break

            default:
                console.log("No scoring handler call")
                break
        }
    }

    iotHandler(robot, flag) {
        console.log("iot")

        switch (flag) {
            case true:
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/${robot}-start-iot`,
                {
                    mode: 'cors'
                })
                    // .then(response => console.log(response.json))
                    // .then(data => console.log(data))
                    alert("IOT Mode Request Sent")
                break

            case false:
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/${robot}-end-iot`,
                {
                    mode: 'cors'
                })
                    // .then(response => console.log(response.json))
                    // .then(data => console.log(data))
                    alert("IOT Mode Request Sent")
                break

            default:
                console.log("No iot handler call")
                break

        }
    }

    changeModel(robot, model) {
        switch (model) {
            case "nsd":
                console.log("Nissan Steering Detection")
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/models?robotSource=${robot}&model=nissanSteeringDetection`,
                    {
                        method: 'PUT',
                        mode: 'cors'
                    }
                )
                // .then(response => console.log("Response: ", response))
                alert("Model Request Sent")
                break
            case "nsd-rz":
                console.log("Nissan Steering Detection Red-Zone")
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/models?robotSource=${robot}&model=nissanSteeringDetectionRedZone`,
                    {
                        method: 'PUT',
                        mode: 'cors'
                    }
                )
                // .then(response => console.log("Response: ", response))
                alert("Model Request Sent")
                break
            case "nsc":
                console.log("Nissan Steering Classification")
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/models?robotSource=${robot}&model=nissanSteeringClassification`,
                    {
                        method: 'PUT',
                        mode: 'cors'
                    }
                )
                // .then(response => console.log("Response: ", response))
                alert("Model Request Sent")
                break
            case "think-tires":
                console.log("Think Tires")
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/models?robotSource=${robot}&model=thinkTiresDetection`,
                    {
                        method: 'PUT',
                        mode: 'cors'
                    }
                )
                // .then(response => console.log("Response: ", response))
                alert("Model Request Sent")
                break
            case "raisins":
                fetch(`http://aipm-gsc-nodered-vendor.mybluemix.net/models?robotSource=${robot}&model=raisinBoxesClassification`,
                    {
                        method: 'PUT',
                        mode: 'cors'
                    }
                )
                // .then(response => console.log("Response: ", response))
                alert("Model Request Sent")
                console.log("Raisins")
                break
            default:
                console.log("Unknown Model Input")
                alert("Please select a model")
        }
    }

    handleDropdownItemSelected(model, robot) {
        console.log(model)
        
        if (robot == "kuka") {
            this.setState({
                kukaSelectedModel: model
            })
        } else if (robot == "yaskawa") {
            this.setState({
                yaskawaSelectedModel: model
            })
        }
    }

    createMaximoWorkOrder(assetNumber) {
        console.log("Create Maximo WO")

        var description = "Work order created via web app"

        fetch(`https://aipm-gsc-nodered.mybluemix.net/postworkordermaximo?assetNumber=${assetNumber}&description=${description}`,
            {
                method: 'GET',
                mode: 'cors'
            }
        ).then(response => console.log(response)).then(data => console.log(data))

        alert("Work Order Request Sent")
    }

    render() {
        return (
            this.state.showAlert ? <AlertBox displayAlert={() => this.setState({showAlert: !this.state.showAlert})} kukaEnv={this.state.kukaEnv}/> :
            <div className="settings-container">
                <div className="start-kuka-container">
                    <div className="kuka-start-title">Kuka Operating Mode: </div>
                    <div className="buttons">
                        <Button className="on-button" onClick={this.kukaPlay} variant="success" >Toggle Autorun</Button>
                        <Button className="off-button" onClick={this.kukaReset} variant="danger">Toggle Continuous Mode</Button>
                        <Button className="show-env-button" onClick={this.showEnv} variant="primary">Show Environment Parameters</Button>
                    </div>
                </div>
                <div className="kuka-scoring-operations-container">
                    <div className="scoring-title">Kuka Scoring Mode: </div>
                    <div className="buttons">
                        <Button className="on-button" onClick={() => this.scoringHandler("kuka", true)} variant="success">ON</Button>
                        <Button className="off-button" onClick={() => this.scoringHandler("kuka", false)} variant="danger">OFF</Button>
                    </div>
                </div>
                <div className="yaskawa-scoring-operations-container">
                    <div className="scoring-title">Yaskawa Scoring Mode: </div>
                    <div className="buttons">
                        <Button className="on-button" onClick={() => this.scoringHandler("yaskawa", true)} variant="success">ON</Button>
                        <Button className="off-button" onClick={() => this.scoringHandler("yaskawa", false)} variant="danger">OFF</Button>
                    </div>
                </div>
                <div className="kuka-iot-container">
                    <div className="iot-title">Kuka IOT Image Broadcasting: </div>
                    <div className="buttons">
                        <Button className="on-button" onClick={() => this.iotHandler("kuka", true)} variant="success">ON</Button>
                        <Button className="off-button" onClick={() => this.iotHandler("kuka", false)} variant="danger">OFF</Button>
                    </div>
                </div>
                <div className="yaskawa-iot-container">
                    <div className="iot-title">Yaskawa IOT Image Broadcasting: </div>
                    <div className="buttons">
                        <Button className="on-button" onClick={() => this.iotHandler("yaskawa", true)} variant="success">ON</Button>
                        <Button className="off-button" onClick={() => this.iotHandler("yaskawa", false)} variant="danger">OFF</Button>
                    </div>
                </div>
                <div className="kuka-model-container">
                    <div className="change-model-title">Kuka Model Configuration: </div>
                    <div className="change-model-buttons-container">
                        <DropdownButton onSelect={(e) => this.handleDropdownItemSelected(e, "kuka")} id="dropdown-basic-button" title={this.state.kukaSelectedModel}>
                            <Dropdown.Item eventKey="nsd" >Nissan Steering Detection</Dropdown.Item>
                            <Dropdown.Item eventKey="nsd-rz" >Nissan Steering Detection Red-Zone</Dropdown.Item>
                            <Dropdown.Item eventKey="nsc" >Nissan Steering Classification</Dropdown.Item>
                            <Dropdown.Item eventKey="think-tires" >Think Tires</Dropdown.Item>
                            <Dropdown.Item eventKey="raisins" >Raisins</Dropdown.Item>
                        </DropdownButton>
                        <Button className="submit-model" onClick={() => this.changeModel("kuka", this.state.kukaSelectedModel)} variant="success">Submit</Button>
                    </div>
                </div>
                <div className="yaskawa-model-container">
                <div className="change-model-title">Yaskawa Model Configuration: </div>
                    <div className="change-model-buttons-container">
                        <DropdownButton onSelect={(e) => this.handleDropdownItemSelected(e, "yaskawa")} id="dropdown-basic-button" title={this.state.yaskawaSelectedModel}>
                            <Dropdown.Item eventKey="nsd" >Nissan Steering Detection</Dropdown.Item>
                            <Dropdown.Item eventKey="nsd-rz" >Nissan Steering Detection Red-Zone</Dropdown.Item>
                            <Dropdown.Item eventKey="nsc" >Nissan Steering Classification</Dropdown.Item>
                            <Dropdown.Item eventKey="think-tires" >Think Tires</Dropdown.Item>
                            <Dropdown.Item eventKey="raisins" >Raisins</Dropdown.Item>
                        </DropdownButton>
                        <Button className="submit-model" onClick={() => this.changeModel("yaskawa", this.state.yaskawaSelectedModel)} variant="success">Submit</Button>
                    </div>
                </div>
                <div className="kuka-maximo-work-order-container">
                    <div className="maximo-work-order-title">Create Kuka Maximo Work Order:</div>
                    <Button className="on-button" variant="primary" onClick={() => this.createMaximoWorkOrder("ROBOT002")}>Create Work Order</Button>
                </div>
                <div className="yaskawa-maximo-work-order-container">
                    <div className="maximo-work-order-title">Create Yaskawa Maximo Work Order:</div>
                    <Button className="on-button" variant="primary" onClick={() => this.createMaximoWorkOrder("ROBOT003")}>Create Work Order</Button>
                </div>
            </div>
        )
    }
}

export default Settings