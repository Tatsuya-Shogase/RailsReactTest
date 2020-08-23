import React from 'react'
import {Button,ButtonGroup,FormControl,InputGroup} from 'react-bootstrap'


class ViewCategory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newCategoryName: this.props.data.name,
            visible: false,
        }
    }

    handleClickCategory = () => {
        this.props.clickCategory(this.props.data.id, this.props.data.name)
    }

    onChangetext = (e) => {
        let name = e.target.name;
        this.setState({[name]: e.target.value})
    }

    handleDelete = () => {
        this.props.deleteCategory(this.props.data.id)
        this.handleToggleVisible()
    }

    handleUpdate = () => {
        this.props.updateCategory(this.props.data.id, this.state.newCategoryName)
        this.handleToggleVisible()
    }

    handleCancel = () => {
        this.setState({newCategoryName: this.props.data.name})
        this.handleToggleVisible()
    }

    handleToggleVisible = () => {
        if(this.state.visible){
            this.setState({visible: false})
        }else{
            this.setState({visible: true})
        }
    }


    render() {
        if(this.props.admin){
            return(
                <div className='mb-3'>
                    {this.state.visible ? (
                        <div>
                            <FormControl
                                name='newCategoryName'
                                aria-label='newCategoryName'
                                aria-describedby='basic-addon1'
                                value={this.state.newCategoryName}
                                onChange={e => this.onChangetext(e)}
                            />
                            <ButtonGroup size='sm'>
                                <Button variant='outline-success' onClick={this.handleUpdate}>変更</Button>
                                <Button variant='outline-secondary' onClick={this.handleCancel}>キャンセル</Button>
                                <Button variant='outline-danger' className='deleteButton' onClick={this.handleDelete}>削除</Button>
                            </ButtonGroup>
                        </div>
                    ) : (
                        <div>
                            <InputGroup>
                                <Button variant='link' onClick={this.handleClickCategory}>
                                    { this.props.data.name }
                                    <span className='ml-1'>
                                        ({ this.props.data.posts_count })
                                    </span>
                                </Button>
                                <Button variant='outline-info' size='sm' onClick={this.handleToggleVisible}>編集</Button>
                            </InputGroup>
                        </div>
                    )}
                </div>
            )
        }else{
            return(
                <div>
                    <Button variant='link' onClick={this.handleClickCategory}>{ this.props.data.name }</Button>
                </div>
            )
        }
    }
}

export default ViewCategory
