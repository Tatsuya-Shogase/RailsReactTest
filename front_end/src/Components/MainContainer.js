import React from 'react'
import update from 'react-addons-update'
import axios from 'axios'
import CategoriesContainer from './CategoriesContainer'
import PostsContainer from './PostsContainer'
import AdminFormContainer from './AdminFormContainer'
import 'bootstrap/dist/css/bootstrap.css';
import {Container,Row,Col,Navbar} from 'react-bootstrap'


class MainContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            posts: [],
            session_id: '',
            current_category_id: 0,
            current_category_name: '',
            admin: false,
            login_error_msg: '',
        }
    }

    componentDidMount = () => {
        this.loginStatus()
        this.init()
    }

    init = () => {
        axios.get(`${process.env.REACT_APP_API_URL}categories`)
        .then((results) => {
            this.setState({categories: results.data})
            const current_category_id = this.state.categories[0]['id']
            const current_category_name = this.state.categories[0]['name']
            this.setState({
                current_category_id: current_category_id,
                current_category_name: current_category_name,
            })
            this.showPost(current_category_id)
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    clickCategory = (category_id, category_name) => {
        this.setState({
            current_category_id: category_id,
            current_category_name: category_name,
        })
        this.showPost(category_id)
    }

    createCategory = (category) => {
        axios.post(
            `${process.env.REACT_APP_API_URL}categories`,
            {category: category},
            {withCredentials: true}
        )
        .then((response) => {
            const newData = update(this.state.categories, {$push:[response.data]})
            this.setState({categories: newData})
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    deleteCategory = (id) => {
        axios.delete(
            `${process.env.REACT_APP_API_URL}categories/${id}`,
            {withCredentials: true}
        )
        .then((response) => {
            const categoryIndex = this.state.categories.findIndex(x => x.id === id)
            const deletedCategories = update(this.state.categories, {$splice: [[categoryIndex, 1]]})
            this.setState({categories: deletedCategories})
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    updateCategory = (id, category) => {
        axios.patch(
            `${process.env.REACT_APP_API_URL}categories/${id}`,
            {category: category},
            {withCredentials: true}
        )
        .then((response) => {
            const categoryIndex = this.state.categories.findIndex(x => x.id === id)
            const categories = update(this.state.categories, {[categoryIndex]: {$set: response.data}})
            this.setState({categories: categories})
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    showPost = (category_id) => {
        axios.get(
            `${process.env.REACT_APP_API_URL}categories/${category_id}/posts/`,
            {withCredentials: true}
        )
        .then((results) => {
            this.setState({posts: results.data.posts, session_id: results.data.session_id})
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    createPost = (name, mail, subject, text) => {
        axios.post(
            `${process.env.REACT_APP_API_URL}categories/${this.state.current_category_id}/posts`,
            {
                name: name,
                mail: mail,
                subject: subject,
                text: text,
            },
            {withCredentials: true}
        )
        .then((response) => {
            const newData = update(this.state.posts, {$push:[response.data]})
            this.setState({posts: newData})
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    invisiblePost = (id) => {
        axios.patch(
            `${process.env.REACT_APP_API_URL}categories/${this.state.current_category_id}/posts/${id}`,
            {withCredentials: true}
        )
        .then((response) => {
            const postIndex = this.state.posts.findIndex(x => x.id === id)
            const posts = update(this.state.posts, {[postIndex]: {$set: response.data}})
            this.setState({posts: posts})
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    signIn = (username, password) => {
        axios.post(
            `${process.env.REACT_APP_API_URL}login`,
            {
                user:{
                    username: username,
                    password: password,
                }
            },
            {withCredentials: true}
        )
        .then((response) => {
            if(response.data.status === 401){
                this.setState({login_error_msg: response.data.message})
            }else if(response.data.user.admin){
                this.init()
                this.setState({
                    admin: response.data.user.admin,
                    login_error_msg: '',
                })
            }else{
                this.signOut()
                this.setState({
                    login_error_msg: '管理者権限があるユーザーでサインインしてください。',
                })
            }
        })
        .catch((data) =>{
            console.log(data)
        })
    }

    signOut = () => {
        axios.delete(
            `${process.env.REACT_APP_API_URL}logout`,
            {withCredentials: true}
        )
        .then((response) => {
            this.setState({admin: false})
        })
        .catch((data) => {
            console.log(data)
        })
    }

    loginStatus = () => {
        axios.get(
            'http://localhost:3001/logged_in',
            {withCredentials: true}
        )
        .then((response) => {
            if (response.data.logged_in) {
                this.setState({admin: response.data.user.admin})
            } else {
                this.setState({admin: false})
            }
        })
        .catch((data) => {
            console.log(data)
        })
    }

    render() {
        return (
            <div className='app-main mb-5'>
                <Navbar bg='light' expand='lg'>
                    <Navbar.Brand>掲示板アプリ</Navbar.Brand>
                    <AdminFormContainer
                        signIn={this.signIn}
                        signOut={this.signOut}
                        admin={this.state.admin}
                        login_error_msg={this.state.login_error_msg}
                    />
                </Navbar>
                <Container>
                    <Row className='mt-4'>
                        <Col md='4'>
                            <CategoriesContainer
                                categoryData={this.state.categories}
                                createCategory={this.createCategory}
                                deleteCategory={this.deleteCategory}
                                updateCategory={this.updateCategory}
                                clickCategory={this.clickCategory}
                                admin={this.state.admin}
                            />
                        </Col>
                        <Col>
                            <PostsContainer
                                postData={this.state.posts}
                                sessionId={this.state.session_id}
                                invisiblePost={this.invisiblePost}
                                admin={this.state.admin}
                                createPost={this.createPost}
                                current_category_name={this.state.current_category_name}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default MainContainer
