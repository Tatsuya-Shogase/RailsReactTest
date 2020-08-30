import React from 'react'
import {Button,FormControl,Navbar,Dropdown} from 'react-bootstrap'


class AdminFormContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
        }
    }

    onChangetext = (e) => {
        let name = e.target.name;
        this.setState({[name]: e.target.value})
    }

    hundleSignIn = () => {
      this.props.signIn(this.state.username, this.state.password)
      this.setState({username:'', password:''})
    }

    hundleSignOut = () => {
      this.props.signOut()
    }

    render(){
        return(
            <Navbar.Collapse className='justify-content-end'>
                {this.props.admin ? (
                    <Navbar.Text>
                        管理者モードで閲覧しています。<Button variant='outline-info' className='ml-3' onClick={this.hundleSignOut}>サインアウト</Button>
                    </Navbar.Text>
                ) : (
                    <Dropdown>
                        <Dropdown.Toggle variant='outline-info' id='dropdown-basic'>
                            管理機能
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu-right p-3 text-right' style={{'minWidth':'300px'}}>
                            <FormControl
                                type='text'
                                name='username'
                                value={this.state.username}
                                placeholder='username'
                                onChange={ e => this.onChangetext(e)}
                                autoComplete='name'
                                className='mb-3'
                            />
                            <FormControl
                                type='password'
                                name='password'
                                value={this.state.password}
                                placeholder='password'
                                onChange={ e => this.onChangetext(e)}
                                autoComplete='current-password'
                                className='mb-3'
                            />
                            <Button variant='outline-info' onClick={this.hundleSignIn}>サインイン</Button>
                            {this.props.message === '' ? (
                                null
                            ) : (
                                <p><small className='text-danger'>{this.props.message}</small></p>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Navbar.Collapse>
        )
    }
}

export default AdminFormContainer
