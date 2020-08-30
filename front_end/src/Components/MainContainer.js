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
            messages: {
                login: '',
                categories: {
                    create: '',
                    update: ['', ''],
                },
                posts: {
                    create: '',
                    update: ['', ''],
                },
            },
        }
    }

    componentDidMount = () => {
        this.loginStatus()
        this.init(true)
    }

    init = (posts_reload) => {
        axios.get(
            `${process.env.REACT_APP_API_URL}categories`,
            {withCredentials: true}
        )
        .then((results) => {
            this.setState({categories: results.data})
            if(this.state.current_category_id === 0){
                const current_category_id = this.state.categories[0]['id']
                const current_category_name = this.state.categories[0]['name']
                this.setState({
                    current_category_id: current_category_id,
                    current_category_name: current_category_name,
                })
            }
            if(posts_reload){
                this.showPost(this.state.current_category_id)
            }
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
        let messages = {...this.state.messages}
        axios.post(
            `${process.env.REACT_APP_API_URL}categories`,
            {category: category},
            {withCredentials: true}
        )
        .then((response) => {
            const newData = update(this.state.categories, {$push:[response.data]})
            messages.categories.create = ''
            this.setState({
                categories: newData,
                messages: messages,
            })
        })
        .catch((data) =>{
            console.log(data)
            messages.categories.create = 'サーバーエラーにより登録できませんでした。'
            this.setState({messages: messages})
        })
    }

    deleteCategory = (id) => {
        let messages = {...this.state.messages}
        axios.delete(
            `${process.env.REACT_APP_API_URL}categories/${id}`,
            {withCredentials: true}
        )
        .then((response) => {
            const categoryIndex = this.state.categories.findIndex(x => x.id === id)
            const deletedCategories = update(this.state.categories, {$splice: [[categoryIndex, 1]]})
            this.setState({categories: deletedCategories})
            messages.categories.update = ['', '']
            if(id === this.state.current_category_id){
                this.setState({
                    current_category_id: 0,
                    current_category_name: '',
                    messages: messages,
                })
                this.init(true)
            }
        })
        .catch((data) =>{
            console.log(data)
            messages.categories.update = [id, 'サーバーエラーにより削除できませんでした。']
            this.setState({messages: messages})
        })
    }

    updateCategory = (id, category) => {
        let messages = {...this.state.messages}
        axios.patch(
            `${process.env.REACT_APP_API_URL}categories/${id}`,
            {category: category},
            {withCredentials: true}
        )
        .then((response) => {
            const categoryIndex = this.state.categories.findIndex(x => x.id === id)
            const categories = update(this.state.categories, {[categoryIndex]: {$set: response.data}})
            messages.categories.update = ['', '']
            this.setState({
                categories: categories,
                messages: messages,
            })
        })
        .catch((data) =>{
            console.log(data)
            messages.categories.update = [id, 'サーバーエラーにより変更できませんでした。']
            this.setState({messages: messages})
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
        let messages = {...this.state.messages}
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
            messages.posts.create = ''
            this.setState({
                posts: newData,
                messages: messages,
            })
            if(this.state.admin){
                this.init(false)
            }
        })
        .catch((data) =>{
            console.log(data)
            messages.posts.create = 'サーバーエラーにより書き込みできませんでした。'
            this.setState({messages: messages})
        })
    }

    invisiblePost = (id) => {
        let messages = {...this.state.messages}
        axios.patch(
            `${process.env.REACT_APP_API_URL}categories/${this.state.current_category_id}/posts/${id}`,
            {withCredentials: true}
        )
        .then((response) => {
            const postIndex = this.state.posts.findIndex(x => x.id === id)
            const posts = update(this.state.posts, {[postIndex]: {$set: response.data}})
            messages.posts.update = ['', '']
            this.setState({posts: posts})
        })
        .catch((data) =>{
            console.log(data)
            messages.posts.update = [id, 'サーバーエラーにより非表示にできませんでした。']
            this.setState({messages: messages})
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
            let messages = {...this.state.messages}
            if(response.data.status === 401){
                messages.login = response.data.message
                this.setState({messages: messages})
            }else if(response.data.user.admin){
                messages.login = ''
                this.setState({
                    admin: response.data.user.admin,
                    messages: messages,
                })
                this.init(true)
            }else{
                messages.login = '管理者権限があるユーザーでサインインしてください。'
                this.signOut()
                this.setState({messages: messages})
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
            this.init(true)
        })
        .catch((data) => {
            console.log(data)
        })
    }

    loginStatus = () => {
        axios.get(
            `${process.env.REACT_APP_API_URL}logged_in`,
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
                        message={this.state.messages.login}
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
                                messages={this.state.messages.categories}
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
                                messages={this.state.messages.posts}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default MainContainer
