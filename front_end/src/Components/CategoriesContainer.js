import React from 'react'
import ViewCategory from './ViewCategory'
import {Button,Card,InputGroup,FormControl} from 'react-bootstrap'


class CategoriesContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            category: '',
            message: '',
        }
    }

    onChangetext = (e) => {
        this.setState({category: e.target.value})
    }

    hundleCreate = () => {
        if(this.state.category === ''){
            this.setState({message: 'カテゴリ名は入力必須です。'})
        }else{
            this.props.createCategory(this.state.category)
            this.setState({
                category:'',
                message: ''
            })
        }
    }

    hundleAuthOpen = () => {
      this.props.authOpen()
    }

    hundleSignIn = () => {
      this.props.signIn()
    }

    hundleSignOut = () => {
      this.props.signOut()
    }

    render() {
        return(
            <Card className='text-left'>
                <Card.Header>カテゴリ</Card.Header>
                <Card.Body>
                    {this.props.admin && (
                        <div className='mb-3'>
                            <InputGroup>
                                <FormControl
                                    type='text'
                                    value={this.state.category}
                                    placeholder='新しいカテゴリ名'
                                    onChange={ e => this.onChangetext(e)}
                                />
                                <InputGroup.Append>
                                    <Button variant='info' onClick={this.hundleCreate}>追加</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    )}
                    {this.state.message && (
                        <p className='text-danger'>{this.state.message}</p>
                    )}
                    {this.props.messages.create && (
                        <p className='text-danger'>{this.props.messages.create}</p>
                    )}
                    {this.props.categoryData.map((data) => {
                        return(
                            <ViewCategory
                                data={data}
                                key={data.id}
                                deleteCategory={this.props.deleteCategory}
                                updateCategory={this.props.updateCategory}
                                clickCategory={this.props.clickCategory}
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

export default CategoriesContainer
