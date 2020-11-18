import {Component} from 'react'
import './AlertBox.css'
import {Button} from 'react-bootstrap'

class AlertBox extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="alert-container">
                <div className="environment-container">
                    <div><b>ModelApi:</b> {this.props.kukaEnv.modelApi} </div>
                    <div><b>ModelQueryParam:</b> {this.props.kukaEnv.modelQueryParam}</div>
                    <div><b>ModelType:</b> {this.props.kukaEnv.modelType} </div>
                    <div><b>BatchPrefix:</b> {this.props.kukaEnv.batchPrefix}</div>
                    <div><b>BatchModel:</b> {this.props.kukaEnv.batchModel} </div>
                    <div><b>PhotoApi:</b> {this.props.kukaEnv.photoApi}</div>
                    <div><b>ViScoring:</b> {this.props.kukaEnv.viScoring.toString()} </div>
                    <div><b>SendIOTImage:</b> {this.props.kukaEnv.sendIotImage.toString()} </div>
                    <div><b>RobotSource:</b> {this.props.kukaEnv.robotSource} </div>
                    <div><b>CurrentPosition:</b> {this.props.kukaEnv.currentPosition} </div>
                    <div><b>AutoRunInProgress:</b>  {this.props.kukaEnv.autoRunInProgress.toString()}</div>
                    <div><b>ContinuousMode:</b> {this.props.kukaEnv.continuousMode.toString()} </div>
                    <div><b>SendToConversation:</b> {this.props.kukaEnv.sendToConversation.toString()} </div>
                    <div><b>LastDeployPosition:</b> {this.props.kukaEnv.lastDeployPosition} </div>
                    <div><b>Paused:</b> {this.props.kukaEnv.paused.toString()} </div>
                </div>
                <Button onClick={this.props.displayAlert} className="back-button" variant="danger">Back</Button>
            </div>
        )
    }
}

export default AlertBox