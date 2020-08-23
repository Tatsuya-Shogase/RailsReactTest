import React from 'react'
import {Button} from 'react-bootstrap'


class ViewPost extends React.Component {

    handleinvisible = () => {
        this.props.oninvisible(this.props.data.id)
    }

    render() {
        if(this.props.data.visible || this.props.admin){
            return(
                <div className='mb-5'>
                    <hr></hr>
                    {this.props.admin && !(this.props.data.visible) ? (
                        <small className='text-danger'>(この投稿は非表示になっています)</small>
                    ) : (
                        null
                    )}
                    {this.props.data.subject !== ''　? (
                        <p className='lead mb-0'>
                            { this.props.data.subject }
                        </p>
                    ) : (
                        null
                    )}
                    {this.props.data.name !== '' || this.props.data.mail !== '' ? (
                        <p>
                            {this.props.data.name !== '' ? (
                                <span className='text-muted mr-3'><i>{ this.props.data.name }</i></span>
                            ) : (
                                null
                            )}
                            {this.props.data.mail !== '' ? (
                                <span className='text-muted'><i>{ this.props.data.mail }</i></span>
                            ) : (
                                null
                            )}
                        </p>
                    ) : (
                        null
                    )}
                    <div className="mb-3">
                    {this.props.data.text.split('\n').map(
                        (str, index) => (
                            <React.Fragment key={index}>{str}<br/></React.Fragment>
                        )
                    )}
                    </div>
                    {this.props.data.session_id === this.props.sessionId  && this.props.data.visible ? (
                        <div>
                            <Button variant='outline-secondary' size='sm' className='invisibleButton' onClick={this.handleinvisible}>非表示にする</Button>
                        </div>
                    ) : (
                        null
                    )}
                </div>
            )
        }else{
            return null
        }
    }
}

export default ViewPost
