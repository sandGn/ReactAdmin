import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd';
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './login.less'
import logo from '../../assets/images/logo.png'
/*登录路由组件 */
class Login extends Component {
    //提交表单
    handleSubmit = (event) => {
        //阻止事件的默认行为
        event.preventDefault();
        //对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            //检验成功
            if (!err) {
                //console.log('提交登录ajax请求', values);
                //正式请求登录
                const { username, password } = values
                const result = await reqLogin(username, password)
                //console.log('请求成功！', response)
                if (result.status === 0) {// 登陆成功
                    // 提示登陆成功
                    message.success('登陆成功')

                    // 保存user
                    const user = result.data
                    memoryUtils.user = user // 保存在内存中
                    storageUtils.saveUser(user) // 保存到local中
                    // 跳转到管理界面 (不需要再回退回到登陆)
                    this.props.history.replace('/')
                } else {
                    message.error(result.msg)
                }
            } else {
                // 提示错误信息
                console.log('校验失败！')
            }
        });

        // //得到form对象
        // const form = this.props.form
        // //得到表单项的输入数据
        // const values = form.getFieldsValue();
        // console.log(values);
    }
    //密码自定义验证
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('密码不能为空')
        } else if (value.length < 4) {
            callback('密码不能小于4位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文,数字或下划线组成')//验证成功
        } else {
            callback()//验证成功
        }
        // callback()//验证成功
        // callback('xxx')//验证失败，指定提示文本
    }

    render() {
        // 如果用户已经登陆, 自动跳转到管理界面
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/' />
        }


        //得到具有强大功能form对象
        const form = this.props.form
        const { getFieldDecorator } = form
        return (
            < div className="login" >
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', { //配置对象：属性名是特定的一些名称
                                //声明式验证：直接使用别人定义好的验证规则进行验证
                                rules: [
                                    { required: true, whitespace: true, message: '用户名不能为空' },
                                    { min: 4, message: '用户名至少4位' },
                                    { max: 12, message: '用户名最多12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文,数字或下划线组成' }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{
                                    validator: this.validatePwd
                                }]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />
                            )}

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
const WrapLogin = Form.create()(Login)
export default WrapLogin



/*
高阶函数 create
    一类特别的函数
        接受函数类型的参数
        返回值是函数
    定时器 setTimeout();/setInterval();
    Promise:Promise(()=>{})then(value=>{},reason=>{})
    数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
    函数对象的bind()
    Form.create()()/getFieldDecorator()()
    高阶函数更新动态，更加具有拓展性
高阶组件
    本质是一个函数
    接受一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
    作用：拓展组件的功能
    高阶组件也是高阶函数：接受一个组件函数，返回的是一个新的组件函数
*/
/*
    包装From 组件生成新组件：Form（login）
    新组件会向Form组件传递一个强大的对象属性： from
*/
/*
async 和 await
    简化promise对象的使用：不使用then()来指定成功/失败的回调
    以同步编码方式(没有回调函数)实现异步流程
    await
        再返回promise的表达式左侧写：await：不想要promise，想要promise异步执行的成功的value数据
    async
        await所在函数(最近的)定义的左侧写async

 */