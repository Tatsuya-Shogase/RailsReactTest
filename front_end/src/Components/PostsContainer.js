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
            messages: {
                name: '',
                mail: '',
                subject: '',
                text: '',
            }
        }
    }

    onChangetext = (e) => {
        let name = e.target.name;
        this.setState({[name]: e.target.value})
    }

    hundlePost = () => {
        let error_check = true
        let messages = {...this.state.messages}
        const regex = /[\w\-._]+@[\w\-._]+\.[A-Za-z]+/

        if(this.state.text === ''){
            messages.text = '※本文は入力必須です。'
            error_check = false
        }else{
            messages.text = ''
        }
        if (this.state.mail !== '' && !regex.test(this.state.mail)){
            messages.mail = '※正しい形式でメールアドレスを入力してください'
            error_check = false
        }else{
            messages.mail = ''
        }
        if(error_check){
            this.props.createPost(this.state.name, this.state.mail, this.state.subject, this.state.text)
            this.setState({subject:'', text:'', })
        }
        this.setState({messages: messages})
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
                    {this.state.messages.mail && (
                        <p className='text-danger'>{this.state.messages.mail}</p>
                    )}
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
                    {this.state.messages.text && (
                        <p className='text-danger'>{this.state.messages.text}</p>
                    )}
                    <Button className='my-3' onClick={this.hundlePost}>書き込む</Button>
                    {this.props.messages.create && (
                        <p className='text-danger'>{this.props.messages.create}</p>
                    )}
                    {this.props.postData.map((data) => {
                        return(
                            <ViewPost
                                data={data}
                                key={data.id}
                                sessionId={this.props.sessionId}
                                oninvisible={this.props.invisiblePost}
                                admin={this.props.admin}
                                message={this.props.messages.update[0] === data.id && (
                                    this.props.messages.update[1]
                                )}
                            />
                        )
                    })}
                </Card.Body>
            </Card>
        )
    }
}

export default PostsContainer
