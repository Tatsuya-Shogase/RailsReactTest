import React from 'react'
import ViewPost from './ViewPost'
import {Button,Card,FormControl} from 'react-bootstrap'


class PostsContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            mail: '',
            subject: '',
            text: '',
            error_msg: '',
        }
    }

    onChangetext = (e) => {
        let name = e.target.name;
        this.setState({[name]: e.target.value})
    }

    hundlePost = () => {
        if(this.state.text === ''){
            this.setState({error_msg:'※本文は入力必須です。'})
        }else{
            this.setState({error_msg:''})
            this.props.createPost(this.state.name, this.state.mail, this.state.subject, this.state.text)
            this.setState({subject:'', text:'', })
        }
    }


    render() {
        return(
            <Card className='text-left'>
                <Card.Header>投稿（{this.props.current_category_name}）</Card.Header>
                <Card.Body>
                    <FormControl
                        name='name'
                        type='text'
                        value={this.state.name}
                        placeholder='名前（省略可）'
                        onChange={ e => this.onChangetext(e)}
                        className='mb-3'
                    />
                    <FormControl
                        name='mail'
                        type='text'
                        value={this.state.mail}
                        placeholder='メールアドレス（省略可）'
                        onChange={ e => this.onChangetext(e)}
                        className='mb-3'
                    />
                    <FormControl
                        name='subject'
                        type='text'
                        value={this.state.subject}
                        placeholder='件名（省略可）'
                        onChange={ e => this.onChangetext(e)}
                        className='mb-3'
                    />
                    <FormControl
                        name='text'
                        as='textarea'
                        rows='5'
                        value={this.state.text}
                        placeholder='本文'
                        onChange={ e => this.onChangetext(e)}
                    />
                    {this.state.error_msg === '' ? (
                        null
                    ) : (
                        <p className='text-danger'>{this.state.error_msg}</p>
                    )}
                    <Button className='my-3' onClick={this.hundlePost}>書き込む</Button>
                    {this.props.postData.map((data) => {
                        return(
                            <ViewPost
                                data={data}
                                key={data.id}
                                sessionId={this.props.sessionId}
                                oninvisible={this.props.invisiblePost}
                                admin={this.props.admin}
                            />
                        )
                    })}
                </Card.Body>
            </Card>
        )
    }
}

export default PostsContainer
