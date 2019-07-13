<template>
    <v-app id="zggl-app">

        <Navigation></Navigation>

        <v-parallax
                height="100%"
                src="https://i.loli.net/2019/07/08/5d22fe520e42938158.jpg"
                id="zggl-parallax"
        >

            <div id="zggl-main" style="margin-top: 50px">
                <v-toolbar flat color="white">
                    <v-toolbar-title>所有职工</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                    <!--                    搜索栏-->
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" dark class="mb-2" v-show="selected.length"
                           @click="deleteSelectedWorkers">
                        <v-icon>delete</v-icon>
                        批量删除
                    </v-btn>

                    <!--                    上传状态圈-->
                    <v-progress-circular
                            indeterminate
                            color="primary"
                            v-show="showExcelUploadLoading"
                    ></v-progress-circular>

                    <!--                    导入按钮-->
                    <v-menu open-on-hover offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    color="primary"
                                    dark
                                    v-on="on"
                            >
                                <v-icon>group_add</v-icon>
                                导入
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-tile
                                    v-for="(item, index) in [{title: '下载模板(.xlsx)'}, {title: '导入文件(.xlsx)'}]"
                                    :key="index"
                                    @click="meunItemsEvent(index)"
                            >
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>

                        <input type="file" ref="uploadFile" style="display: none"
                               @change="update"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        >
                    </v-menu>

                    <template>
                        <v-btn color="primary" dark class="mb-2" @click="newUser">
                            <v-icon>person_add</v-icon>
                            新建职工
                        </v-btn>
                    </template>
                    <v-dialog v-model="dialog" max-width="500px" persistent id="dialog-0">
                        <v-card id="dialog-card">
                            <v-card-title id="dialog-card-title">
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text id="dialog-card-text">
                                <v-container grid-list-md id="dialog-container">
                                    <v-layout wrap>
                                        <v-flex xs12 sm6 md4>
                                            <v-text-field v-model="editedItem.wk_number" label="用户ID"
                                                          :disabled="editID"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md4>
                                            <v-text-field v-model="editedItem.wk_name" label="姓名"></v-text-field>
                                        </v-flex>

                                        <!--                                        FIXME: 功能移除-->
                                        <!--                                        <v-flex xs12 sm6 md4>-->
                                        <!--                                            <v-select-->
                                        <!--                                                    :items="['男', '女']"-->
                                        <!--                                                    :placeholder="editedItem.wk_sex"-->
                                        <!--                                                    v-model="editedItem.wk_sex"-->
                                        <!--                                                    label="性别"-->
                                        <!--                                            ></v-select>-->
                                        <!--                                        </v-flex>-->

                                        <v-flex xs12 sm6 md4>
                                            <v-text-field v-model="editedItem.dp_number" label="部门"
                                                          disabled></v-text-field>
                                        </v-flex>

                                        <v-flex xs12 sm6 md4>
                                            <v-text-field v-model="editedItem.wk_phonenumber" label="电话"></v-text-field>
                                        </v-flex>

                                        <v-flex xs12 sm6 md4>
                                            <v-text-field v-model="editedItem.wk_pass" label="密码"></v-text-field>
                                        </v-flex>

                                        <!--FIXME: 功能移除-->
                                        <!--                                    <v-flex xs12 sm6 md4>-->
                                        <!--                                        <v-select-->
                                        <!--                                                :items="['待审核', '未请假', '审核通过', '审核未通过']"-->
                                        <!--                                                :placeholder="qingjiaState2txt(editedItem.qingjiaState)"-->
                                        <!--                                                v-model="editedItem.qingjiaState"-->
                                        <!--                                                label="请假状态"-->
                                        <!--                                        ></v-select>-->
                                        <!--                                    </v-flex>-->

                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-card-actions id="dialog-v-card-actions">
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close">取消</v-btn>
                                <v-btn color="blue darken-1" flat @click="save">保存</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>

                <!--                复选框-->
                <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="user"
                        class="elevation-1"
                        item-key="wk_number"
                        :search="search"
                        select-all
                >
                    <template v-slot:items="props">
                        <td>
                            <v-checkbox
                                    v-model="props.selected"
                                    primary
                                    hide-details
                            ></v-checkbox>
                        </td>

                        <td>{{ props.item.wk_number }}</td>
                        <td>{{ props.item.wk_name }}</td>
                        <td>{{ props.item.dp_number }}</td>
                        <td>{{ props.item.wk_phonenumber }}</td>
                        <td>{{ props.item.wk_pass }}</td>

                        <!--                        FIXME: 功能移动-->
                        <!--                        <td>{{ qingjiaState2txt(props.item.qingjiaState) }}</td>-->
                        <!--                        <td>-->
                        <!--                            <v-btn icon @click="showQingjiaMore(props.item.wk_number)">-->
                        <!--                                <v-icon color="grey lighten-1">info</v-icon>-->
                        <!--                            </v-btn>-->
                        <!--                        </td>-->

                        <td class="layout px-0">

                            <!--                        FIXME: 功能移动-->
                            <!--                            &lt;!&ndash;                        请假批准&ndash;&gt;-->
                            <!--                            <v-btn flat icon color="blue lighten-2"-->
                            <!--                                   @click="qingjiaYES(props.item.wk_number)">-->
                            <!--                                <v-icon>thumb_up</v-icon>-->
                            <!--                            </v-btn>-->

                            <!--                            &lt;!&ndash;                        请假不批准&ndash;&gt;-->
                            <!--                            <v-btn flat icon color="red lighten-2"-->
                            <!--                                   @click="qingjiaNO(props.item.wk_number)">-->
                            <!--                                <v-icon>thumb_down</v-icon>-->
                            <!--                            </v-btn>-->

                            <v-icon class="mr-2" @click="editItem(props.item)">
                                edit
                            </v-icon>

                            <v-icon @click="deleteItem(props.item)">
                                delete_forever
                            </v-icon>
                        </td>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>

                    <template v-slot:no-data>
                        <v-btn color="primary" @click="getAllUsers">该部门未获取到职工，请尝试刷新</v-btn>
                    </template>

                </v-data-table>
            </div>


            <!--        ShowMoreDialog 对话框-->
            <div class="text-xs-center">
                <!--                FIXME: 功能移动-->
                <!--                <v-dialog-->
                <!--                        v-model="ShowMoreDialog"-->
                <!--                        width="500"-->
                <!--                >-->
                <!--                    <v-card>-->
                <!--                        <v-card-title-->
                <!--                                class="headline grey lighten-2"-->
                <!--                                primary-title-->
                <!--                        >-->
                <!--                            请假详情-->
                <!--                        </v-card-title>-->

                <!--                        <v-card-text>-->
                <!--                            {{this.selectedQingjiaMore.qingjia_reason}}-->
                <!--                        </v-card-text>-->
                <!--                        <p style="margin-left: 15px">附件：</p>-->
                <!--                        <div style="text-align:center;">-->
                <!--                            <img alt="Vue logo" src="../assets/logo.png" style="text-align: center">-->
                <!--                        </div>-->

                <!--                        <v-divider></v-divider>-->

                <!--                        <v-card-actions>-->
                <!--                            <v-spacer></v-spacer>-->
                <!--                            <v-btn-->
                <!--                                    color="success"-->
                <!--                                    flat-->
                <!--                                    @click="ShowMoreDialog_qingjiaYES"-->
                <!--                            >-->
                <!--                                批准-->
                <!--                            </v-btn>-->
                <!--                            <v-btn-->
                <!--                                    color="error"-->
                <!--                                    flat-->
                <!--                                    @click="ShowMoreDialog_qingjiaNO"-->
                <!--                            >-->
                <!--                                不批准-->
                <!--                            </v-btn>-->


                <!--                        </v-card-actions>-->
                <!--                    </v-card>-->
                <!--                </v-dialog>-->


                <!--                确认上传对话框-->
                <div class="text-xs-center">
                    <v-dialog v-model="confirmUpload" width="500">
                        <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                                确认上传文件?
                            </v-card-title>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="success" flat @click="confirm_upload">确认</v-btn>
                                <v-btn color="error" flat @click="re_select_excel">重新选择</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>

                <!--                上传反馈对话框-->
                <div class="text-xs-center">
                    <v-dialog v-model="showUploadCallBackDialog" width="500">
                        <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                                上传结果
                            </v-card-title>
                            <v-card-text>
                                {{UploadCallBackDialogContent }}
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </div>


                <!--                <p v-show="selected.length">{{selected}}</p>-->

                <!--                统一的错误弹窗-->
                <div class="text-xs-center">
                    <v-dialog v-model="errorDialog" width="500">
                        <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                                {{ errorDialogTitle }}
                            </v-card-title>
                            <v-card-text>
                                {{errorDialogContent }}
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </div>


            </div>
        </v-parallax>
    </v-app>
</template>

<script>
    import Navigation from "./Navigation";
    import qs from "qs";
    import axios from 'axios';

    axios.defaults.timeout = 5000;

    import {
        APIAddOneWorker,
        APIDeleteWorks,
        APIGetAllWorkers,
        APIUpdateOneWorker,
        APIuploadExcel,
        APIWorkerTemplete
    } from "../../global";

    export default {


        wk_name: "zggl",
        components: {Navigation},
        data: () => ({

            editID: false,
            errorDialog: false, // 统一的弹窗
            errorDialogTitle: "",
            errorDialogContent: "",

            adminDpNumber: sessionStorage.getItem("adminDpNumber"), //管理员部门号

            showUploadCallBackDialog: false,
            UploadCallBackDialogContent: "",

            showExcelUploadLoading: false,
            confirmUpload: false, // 确认上传，产生弹窗
            upload_file: new FormData(),

            // selectedQingjiaMore: {
            //     qingjia_reason: '',
            //     qingjia_img: '',
            // },
            selectedUserID: '',

            search: '',

            ShowMoreDialog: false,
            dialog: false,
            selected: [],
            headers: [
                {
                    text: '职工ID',
                    value: 'wk_number'
                },
                {
                    text: '姓名',
                    value: 'wk_name'
                },
                {
                    text: '部门',
                    value: 'dp_number'
                },
                {
                    text: '电话',
                    value: 'wk_phonenumber'
                },
                {
                    text: '密码',
                    value: "wk_pass",
                },
                // FIXME: 功能移动
                // {
                //     text: '请假状态',
                //     value: 'qingjiaState'
                // },
                // {
                //     text: '请假详情',
                //     sortable: false,
                //     value: 'qingjiaReason'
                // },
                {
                    text: '操作',
                    value: 'operates',
                    sortable: false
                }
            ],

            updateUserQingjiaState: [], // 准备修改的审核状态

            user: [],
            editedIndex: -1,
            editedItem: {
                wk_number: '',
                wk_name: '',
                // wk_sex: '',
                dp_number: sessionStorage.getItem("adminDpNumber"),
                wk_phonenumber: '',
                wk_pass: '',
                // qingjiaReason: {},
                // qingjiaState: ''
            },

            defaultItem: {
                wk_number: '',
                wk_name: null,
                dp_number: sessionStorage.getItem("adminDpNumber"),
                // wk_sex: null,
                wk_phonenumber: null,
                wk_pass: null,
                // qingjiaReason: null,
                // qingjiaState: "-1"
            }
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '新建职工' : '编辑职工'
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
        },

        created() {
            this.getAllUsers()
        },

        methods: {
            newUser() {
                this.dialog = true;
                this.editID = false;
            },

            showErrorDialog(errorDialogTitle, errorDialogContent) {
                this.errorDialog = true;
                this.errorDialogTitle = errorDialogTitle;
                this.errorDialogContent = errorDialogContent;
            },

            // 响应上传的change事件
            update(e) {
                let file = e.target.files[0];
                // alert("文件大小" + file.size + "\n文件名" + file.wk_name);
                if (file.name !== "WorkerTemplate.xlsx") {
                    alert("请将文件名命名为'WorkerTemplate.xlsx'!");
                    this.re_select_excel();
                    return
                }
                this.upload_file.set("dp_number", sessionStorage.getItem("adminDpNumber"));
                this.upload_file.set('excel', file);
                this.confirmUpload = true;
            },

            // 确认上传文件
            confirm_upload() {
                this.confirmUpload = false;
                this.showExcelUploadLoading = true;

                // POST
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };

                axios.post(APIuploadExcel, this.upload_file, config).then(response => {
                    this.confirmUpload = false;
                    // if (response.data.errno !== "3000") {
                        this.showUploadCallBackDialog = true;
                        if(response.data.errmsg.length === 0) this.UploadCallBackDialogContent="全部导入成功";
                        else this.UploadCallBackDialogContent = response.data.errmsg;
                    // }

                    this.showExcelUploadLoading = false;
                    this.re_select_excel();
                    this.getAllUsers();
                });

                // POSE END


            },

            re_select_excel() {
                this.$refs.uploadFile.value = null;
                this.upload_file.set('excel_file', null);
                this.confirmUpload = false
            },

            // 获得所有用户的GET
            getAllUsers() {
                axios.get(APIGetAllWorkers, {params: {dp_number: this.adminDpNumber}}).then(resp => {
                    // eslint-disable-next-line no-console
                    console.log(resp.data);
                    if (resp.data.errno === "3000") {
                        this.user = resp.data.res
                    } else {
                        alert(resp.data.errmsg);
                    }
                }).catch(error => {
                    alert(error)
                });
            },

            editItem(item) {
                this.editedIndex = this.user.indexOf(item);
                // eslint-disable-next-line no-console
                console.log("想要修改的信息:", item.wk_name);

                this.editedItem = Object.assign({}, item);
                this.editID = true;
                this.dialog = true;


                // POST
            },

            deleteSelectedWorkers() {
                const selectedArray = [];
                for (let i = 0, len = this.selected.length; i < len; i++) {
                    selectedArray.push(this.selected[i].wk_number);
                }

                axios.post(APIDeleteWorks, qs.stringify({wk_numbers: selectedArray.toString()})).then(resp => {
                    if (resp.data.errno !== "1000") {
                        alert(resp.data)
                    } else {
                        this.selected.forEach(v => (
                            this.user.splice(v, 1)
                        ));
                        this.selected = [];
                    }
                    this.getAllUsers();
                })
            },

            deleteItem(item) {
                const index = this.user.indexOf(item);
                // eslint-disable-next-line no-console
                console.log(item);
                let wk_number = this.user[index].wk_number;
                confirm('确认删除该员工吗?') && this.user.splice(index, 1);
                axios.post(APIDeleteWorks, qs.stringify({wk_numbers: wk_number.toString()})).then(resp => {
                    if (resp.data.errno !== "1000") {
                        alert(resp.data)
                    } else {
                        this.selected = [];
                        this.getAllUsers();
                    }
                });
            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },

            save() {
                if (this.editedItem.wk_number.length !== 8) {
                    this.showErrorDialog("更新职工信息错误", "职工ID需为8位!");
                    return
                }

                if(this.editedItem.wk_phonenumber.length !== 11) {
                    this.showErrorDialog("更新职工信息错误", "手机号码需为11位!");
                    return
                }

                if (this.editedIndex > -1) {
                    axios.post(APIUpdateOneWorker, qs.stringify({
                        wk_number: this.editedItem.wk_number,
                        wk_name: this.editedItem.wk_name,
                        dp_number: this.editedItem.dp_number,
                        wk_phonenumber: this.editedItem.wk_phonenumber,
                        wk_pass: this.editedItem.wk_pass,
                    })).then(resp => {
                        // eslint-disable-next-line no-console
                        console.log("请求更新信息, 返回值", resp.data.errno);
                        if (resp.data.errno !== "3000") {
                            // eslint-disable-next-line no-console
                            console.log("错误码:", resp.data.errno);
                            this.showErrorDialog('更新职工信息失败', resp.data.errmsg);
                        }
                        this.getAllUsers();
                        // Object.assign(this.user[this.editedIndex], this.editedItem);
                        // this.errorDialog = false;
                    }).catch(err => {
                        alert("出错了！", err);
                    })
                } else {
                    // 新增员工
                    // eslint-disable-next-line no-console
                    console.log("this.user", this.user);
                    // eslint-disable-next-line no-console
                    console.log("this.user type is", typeof (this.user));

                    axios.post(APIAddOneWorker, qs.stringify({
                        wk_number: this.editedItem.wk_number,
                        wk_name: this.editedItem.wk_name,
                        dp_number: this.editedItem.dp_number,
                        wk_phonenumber: this.editedItem.wk_phonenumber,
                        wk_pass: this.editedItem.wk_pass,
                    })).then(resp => {
                        if (resp.data.errno !== "3000") {
                            this.showErrorDialog('新增职工信息失败', resp.data.errmsg);
                        } else {
                            this.user.push(this.editedItem);
                            this.errorDialog = false;
                            this.getAllUsers();
                        }
                    }).catch(err => {
                        alert(err)
                    })
                }
                this.getAllUsers();
                this.close()
            },

            qingjiaYES(wk_number) {
                // POST
                for (let i = 0, len = this.user.length; i < len; i++) {
                    if (this.user[i].wk_number === wk_number) {
                        this.user[i].qingjiaState = this.txt2qingjiaState("审核通过")
                    }
                }
                alert("审核通过")
            },

            qingjiaNO(wk_number) {
                // POST
                for (let i = 0, len = this.user.length; i < len; i++) {
                    if (this.user[i].wk_number === wk_number) {
                        this.user[i].qingjiaState = this.txt2qingjiaState("审核未通过")
                    }
                }
                alert("审核未通过")
            },
            // FIXME: 功能移动
            // ShowMoreDialog_qingjiaYES() {
            //     this.ShowMoreDialog = false;
            //     this.qingjiaYES(this.selectedUserID)
            // },
            // FIXME: 功能移动
            // ShowMoreDialog_qingjiaNO() {
            //     this.ShowMoreDialog = false;
            //     this.qingjiaNO(this.selectedUserID)
            // },

            // FIXME: 功能移动
            // showQingjiaMore(wk_number) {
            //     this.selectedUserID = wk_number;
            //     this.selectedQingjiaMore.qingjia_reason = this.user[wk_number - 1].qingjiaReason.qingjia_reason;
            //     this.selectedQingjiaMore.qingjia_img = this.user[wk_number - 1].qingjiaReason.qingjia_img;
            //     this.ShowMoreDialog = true;
            //
            // },

            // FIXME: 功能移动
            /*qingjiaState2txt(qingjiaState) {
                switch (qingjiaState) {
                    case "-1":
                        return "未请假";
                    case "0":
                        return "待审核";
                    case "1":
                        return "审核通过";
                    case "2":
                        return "审核未通过";
                    default:
                        return "未请假"

                }
            },

            txt2qingjiaState(qingjiatxt) {
                switch (qingjiatxt) {
                    case "未请假":
                        return "-1";
                    case "待审核":
                        return "0";
                    case "审核通过":
                        return "1";
                    case "审核未通过":
                        return "2";
                    default:
                        return "99999"
                }
            },*/

            // 导入的下拉菜单事件
            meunItemsEvent(index) {
                if (index === 0) { // 下载模板
                    window.open(APIWorkerTemplete)
                } else if (index === 1) { // 上传文件
                    this.$refs.uploadFile.click();
                }
            },

        }
    }
</script>

<style scoped>
    #zggl-main {
        width: 90%;
        margin: 25px auto;
    }

    #dialog-0:not {
        max-height: inherit;
    }

    #zggl-parallax {
        position: inherit;
        height: 100%
    }
</style>


