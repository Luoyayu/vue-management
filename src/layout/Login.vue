<template>
    <v-app id="login-page">
        <v-parallax
                height="800px"
                src="https://i.loli.net/2019/07/08/5d22c077130ea29230.jpg"
                id="Login-parallax"
        >

            <div style="text-align: center">
                <h1>企业员工考勤 管理端</h1>
                <img alt="Vue logo" src="../assets/logo.png">
            </div>


            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                    <v-card id="card">
                        <v-card-title primary-title>
                            <div class="headline">请登录</div>
                        </v-card-title>

                        <v-card-text id="card-text">
                            <form>
                                <v-text-field
                                        v-model="userID"
                                        label="管理员账号*"
                                        :error-messages="userIDErrors"
                                        required
                                        @input="$v.userID.$touch()"
                                        @blur="$v.userID.$touch()"

                                ></v-text-field>

                                <v-text-field
                                        :append-icon="showpassword ? 'visibility' : 'visibility_off'"
                                        :type="showpassword ? 'text' : 'password'"
                                        v-model="password"
                                        :error-messages="passwordErrors"
                                        label="密码*"
                                        @click:append="showpassword = !showpassword"
                                        required
                                        @input="$v.password.$touch()"
                                        @blur="$v.password.$touch()"
                                ></v-text-field>

                                <v-checkbox
                                        v-model="rememberMe"
                                        label="记住我"
                                        required
                                ></v-checkbox>


                            </form>
                        </v-card-text>

                        <v-flex offset-xs5>
                            <v-btn flat color="primary" @click="submitForm" type="submit">登录</v-btn>
                            <v-btn flat @click="clear">清除</v-btn>
                        </v-flex>

                    </v-card>

                </v-flex>
            </v-layout>
        </v-parallax>

        <!--                统一的错误弹窗-->
        <div class="text-xs-center">
            <v-dialog v-model="errorDialog" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ errorDialogTitle }}
                    </v-card-title>
                    <v-card-text>
                        <v-alert
                                :value="true"
                                color="warning"
                                icon="priority_high"
                                outline
                        >
                            {{errorDialogContent}}
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>

    </v-app>

</template>

<script>
    import Axios from 'axios'
    import qs from 'qs'
    import {APIAdminLogin, APIGetDpNumberByUserID} from "../../global";
    import {validationMixin} from 'vuelidate'
    import {required} from 'vuelidate/lib/validators';

    export default {
        name: "login",
        mixins: [validationMixin],
        validations: {
            userID: {required},
            password: {required},
        },

        data: () => ({
            errorDialog: false, // 统一的弹窗
            errorDialogTitle: "",
            errorDialogContent: "",

            userID: "",
            password: "",
            rememberMe: true,

            showpassword: false,
        }),

        computed: {

            userIDErrors() {
                const errors = [];
                if (!this.$v.userID.$dirty) return errors;
                !this.$v.userID.required && errors.push('账号不能为空');
                return errors
            },

            passwordErrors() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.required && errors.push('密码不能为空');
                return errors
            }
        },

        methods: {
            clear() {
                this.$v.$reset();
                this.userID = '';
                this.password = '';
                this.rememberMe = false;
            },

            submitForm() {
                this.$v.$touch();

                const name = this.userID;
                const pass = this.password;
                if (name === "" || name == null || pass === "" || pass == null) {
                    return;
                }

                const ruleForm = {
                    userID: this.userID,
                    password: this.password
                };

                Axios.post(APIAdminLogin, qs.stringify(ruleForm))
                    .then(res => {
                        if (res.data.errno !== "1000") {
                            this.showErrorDialog("登录失败", "用户ID或密码错误，请重新输入");
                            this.userID = "";
                            this.password = "";
                            sessionStorage.setItem("userID", null);
                        } else {
                            sessionStorage.setItem("userID", this.userID);
                            if (this.rememberMe)
                                this.setCookie(this.userID, this.password, 5);
                            else this.clearCookie();
                            Axios.get(APIGetDpNumberByUserID, {params: {wk_number: this.userID}}).then(resp => {
                                sessionStorage.setItem("adminDpNumber", resp.data.data);
                                this.$router.push({name: 'Zggl'})
                            });

                        }
                    }).catch(error => {
                    if (error.toString().indexOf("timeout") !== -1)
                        this.showErrorDialog("登录失败", "服务器错误: 连接超时");
                    else
                        this.showErrorDialog("登录失败", "服务器错误: " + error);
                })
            },

            showErrorDialog(errorDialogTitle, errorDialogContent) {
                this.errorDialog = true;
                this.errorDialogTitle = errorDialogTitle;
                this.errorDialogContent = errorDialogContent;
            },

            setCookie(c_name, c_pwd, exdays) {
                const exdate = new Date();
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
                window.document.cookie = "userID" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            },

            getCookie: function () {
                if (document.cookie.length > 0) {
                    const arr = document.cookie.split('; ');
                    for (let i = 0; i < arr.length; i++) {
                        const arr2 = arr[i].split('=');
                        if (arr2[0] === 'userID') {
                            this.userID = arr2[1];
                        } else if (arr2[0] === 'password') {
                            this.password = arr2[1];
                        }
                    }
                }
            },

            clearCookie: function () {
                this.setCookie("", "", -1);
            },

        },

        mounted() {
            this.getCookie();
        }
    }
</script>

<style scoped>
    #Login-parallax {
        position: inherit;
        height: 100%
    }

    #card-text {
        width: 350px;
        margin-left: 5%;
        margin-right: 5%;
    }

    #card {
        width: 400px;
        margin: 0 auto;
    }
</style>
