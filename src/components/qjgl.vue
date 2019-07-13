<template>
    <v-app id="qjgl-main">
        <Navigation></Navigation>

        <v-parallax
                height="100%"
                src="https://i.loli.net/2019/07/08/5d22fe520e42938158.jpg"
                id="qjgl-parallax"
        >
            <div id="leaveedit" style="margin-top: 50px">
                <v-toolbar flat color="white">
                    <v-toolbar-title>员工请假审批</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="all_agree">
                        同意
                        <v-icon dark right>check_circle</v-icon>
                    </v-btn>
                    <v-btn color="primary" v-if="flag===true" dark @click="upload">
                        提交
                        <v-icon dark right>send</v-icon>
                    </v-btn>
                    <v-btn disabled v-if="flag===false">
                        请至少审批一项内容
                        <v-icon dark right>not_interested</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-data-table
                        v-model="selected"
                        select-all
                        :headers="headers"
                        :items="tempobjects"
                        :item-key="id"
                        class="elevation-1"
                >
                    <template v-slot:items="props">
                        <td>
                            <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                        </td>
                        <td class="text-xs-left">{{ props.item.wk_number }}</td>
                        <td class="text-xs-left">{{ props.item.show_date }}</td>
                        <td class="text-xs-left">{{ props.item.qj_reason }}</td>

                        <td class="text-xs-left" v-if="props.item.qj_state===0">未审核</td>
                        <td class="text-xs-left" v-if="props.item.qj_state===1">审核通过</td>
                        <td class="text-xs-left" v-if="props.item.qj_state===2">审核未通过</td>

                        <td class="text-xs-left">
                            <v-btn color="info" @click="show(props.item)">查看图片</v-btn>
                        </td>
                        <td class="text-xs-left">
                            <v-btn color="success" @click="change(1,props.item)" v-if="props.item.qj_state===0">
                                同意
                                <v-icon dark right>thumb_up</v-icon>
                            </v-btn>
                            <v-btn color="error" @click="change(2, props.item)" v-if="props.item.qj_state===0">
                                不同意
                                <v-icon dark right>thumb_down</v-icon>
                            </v-btn>
                            <v-btn flat disabled v-if="props.item.qj_state!==0">已审批</v-btn>
                            <v-btn color="error" flat @click="change(0,props.item)" v-if="props.item.qj_state!==0">撤回
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
                <!--                <p>{{selected}}</p>-->
            </div>
        </v-parallax>

        <v-dialog v-model="showDialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>附件</v-card-title>
                <div v-if="imgurl!==''">
                    <img :src="imgurl" alt=""/>
                </div>
                <div v-else>
                    <p style="text-align: center">该职工未提供附件</p>
                </div>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="showDialog = false">知道了</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
    import Navigation from "./Navigation";
    import {
        APIUpdateQingjiaState,
        APIGetAllQingjiaByDpNumber
    } from "../../global";
    import axios from "axios";

    export default {
        name: "qjgl",
        components: {Navigation},
        data() {
            return {
                sendArray: [],
                showDialog: false,
                useable: false,
                tempobjects: [],
                objects: [],
                flag: false,
                imgurl: "",
                selected: [],

                headers: [
                    {text: "员工号", align: "left", value: "wk_number"},
                    {text: "请假时间", align: "left", value: "qj_date"},
                    {text: "请假理由", align: "left", value: "qj_reason"},
                    {text: "请假状态", align: "left", value: "qj_state"},
                    {text: "附件", align: "left", value: "dasd"},
                    {text: "审查", align: "left", value: "adassa"}
                ]
            };
        },

        methods: {
            show(obj) {
                const index = this.tempobjects.indexOf(obj);
                this.imgurl = this.tempobjects[index].qj_imgpath;
                this.showDialog = true;
            },

            change(newstatus, obj) {
                var returnobjects_ = {
                    wk_number: null,
                    qj_date: null,
                    permission: null
                };
                const index = this.tempobjects.indexOf(obj);
                this.tempobjects[index].qj_state = newstatus;
                returnobjects_.wk_number = this.tempobjects[index].wk_number;
                returnobjects_.qj_date = this.tempobjects[index].qj_date;
                returnobjects_.permission = this.tempobjects[index].qj_state;
                this.flag = true;
                this.sendArray.splice(index, 1, returnobjects_);

            },

            all_agree() {

                for (let i = 0; i < this.selected.length; i++) {
                    let returnobjects_ = {
                        wk_number: null,
                        qj_date: null,
                        permission: null
                    };
                    if (this.selected[i].qj_state !== 0) {
                        continue;
                    }
                    this.tempobjects[i].qj_state = 1;
                    returnobjects_.wk_number = this.selected[i].wk_number;
                    returnobjects_.qj_date = this.selected[i].qj_date;
                    returnobjects_.permission = this.selected[i].qj_state;
                    this.sendArray.splice(i, 1, returnobjects_);
                }
                this.flag = true;

            },

            upload() {
                const sent = this.sendArray;
                axios
                    .get(APIUpdateQingjiaState, {
                        params: {
                            data: JSON.stringify(sent)
                        }
                    })
                    .then(response => {
                        if (response.data.errno === "1000") {
                            alert("提交成功");

                            // location.reload()
                            this.get_action();
                            this.selected = []
                        } else {
                            alert("提交失败");
                        }
                    })
                    .catch(error => {
                        alert("提交失败" + error);
                    });
            },

            get_action() {
                axios
                    .get(APIGetAllQingjiaByDpNumber, {
                        params: {
                            dp_number: sessionStorage.getItem("adminDpNumber")
                        }
                    })
                    .then(resp => {
                        this.tempobjects = resp.data.data.result;
                        for (let i = 0; i < this.tempobjects.length; i++) {
                            const date = new Date(this.tempobjects[i].qj_date * 1000);
                            const Y = date.getFullYear() + "-";
                            const M =
                                (date.getMonth() + 1 < 10
                                    ? "0" + (date.getMonth() + 1)
                                    : date.getMonth() + 1) + "-";
                            const D = date.getDate();
                            this.tempobjects[i]["show_date"] = Y + M + D;
                            this.tempobjects[i]["id"] = i;
                        }
                    })
                    .catch(function (error) {
                        alert(error);
                    });
            }
        },


        mounted() {
            this.get_action();
        },

        created() {
            if (sessionStorage.getItem("userID") == null) {
                alert("非法登录!");
                this.$router.push({name: "Login"});
            }
        }
    };
</script>

<style scoped>
    #leaveedit {
        width: 90%;
        margin: 25px auto;
    }

    #qjgl-parallax {
        position: inherit;
        height: 100%;
    }
</style>
