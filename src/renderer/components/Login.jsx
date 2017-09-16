'use strict';

import React from "react";
import {Link, hashHistory } from "react-router";
import Errors from "./Errors.jsx";
import Loading from "./Loading.jsx";
import firebase from "firebase/firebase-browser";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import style from "./Login.css";

const BUTTON_STYLE = {
    marginBottom: 20,
    zIndex: 1,
};


export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: localStorage.userEmail || "",
            password: localStorage.userPassword || "",
            errors: [],
            loading: false
        };

        this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
        this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    handleOnChangePassword(e) {
        this.setState({ password: e.target.value });
    }

    // ログイン処理
    handleOnSubmit(e) {
        this.setState({ loading: true});
        const { email, password } = this.state;
        const errors = [];
        let isValid = true;
        e.preventDefault();

        if (!email.length) {
            isValid = false;
            errors.push("メールアドレスを入力してください")
        }

        if (!password.length) {
            isValid = false;
            errors.push("パスワードを入力してください")
        }

        if (!isValid) {
            // 必須入力チェックに該当した場合はエラーを表示する
            this.setState({ errors });
            return;
        }

        // Firebaseのログイン処理
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            // 次回ログイン簡略化のため、localStorageに値を保存
            localStorage.userEmail = email;
            localStorage.userPassword = password;
            // チャットルーム一覧画面へ遷移
            this.setState({ loading: false});
            hashHistory.push("/topPage");
        }).catch(() => {
            // Firebaseでログインエラーとなった場合
            this.setStart({ errors: ["メールアドレスかパスワードが間違っています"] });
        });
    }

    render() {
        return (

                <div className={style.base}>
                    <form className={style.login}>

                        <Errors errorMessages={this.state.errors} />
                        <div className="form-group">
                            <TextField
                                floatingLabelText="メールアドレス"
                                value={this.state.email}
                                onChange={this.handleOnChangeEmail}
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                                floatingLabelText="パスワード"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleOnChangePassword}
                            />
                        </div>

                        <div className="form-group">
                            <RaisedButton
                                label="Login"
                                primary={true}
                                fullWidth={true}
                                style={BUTTON_STYLE}
                                onClick={this.handleOnSubmit}
                            />
                            <Link to="/signup">
                                <RaisedButton label="アカウント登録" />
                            </Link>
                        </div>
                    </form>
                    <Loading isActive={this.state.loading} className={style.loading} />
                </div>
        );
    }
}
