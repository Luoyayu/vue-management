<template>
    <v-app id="kqtj-app">
        <Navigation></Navigation>

        <v-parallax
                height="100%"
                src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
                id="kqtj-parallax"
        >

            <!--发送 日期（月份） 返回姓名 工号 日期（月份） 出勤次数 缺勤次数 请假次数-->
            <div id="kqtj-main">
                <v-data-table :headers="headers" :items="objects" class="elevation-1">
                    <template v-slot:items="props">
                        <td class="text-xs-left">{{ props.item.wk_number }}</td>
                        <td class="text-xs-left">{{ props.item.wk_name }}</td>
                        <td class="text-xs-left">{{ props.item.ontime }}</td>
                        <td class="text-xs-left">{{ props.item.late }}</td>
                        <td class="text-xs-left">{{ props.item.askleave }}</td>
                    </template>

                    <v-dialog v-model="dialog" width="500">
                        <v-card>
                            <v-card-title class="headline grey lighten-2">请假详情</v-card-title>
                            <p>请假详情</p>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat @click="dialog = false">我了解</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <template v-slot:footer>
                        <td :colspan="headers.length">
                            <v-layout row justify-center>
                                <v-dialog v-model="dialog" max-width="600px">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" dark v-on="on">发送日期</v-btn>
                                        <download-excel id="download-excel"
                                                        class="v-btn flat"
                                                        :data="objects"
                                                        worksheet="My Worksheet"
                                                        name="考勤统计.xls">

                                            导出成Excel

                                        </download-excel>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">发送日期</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container grid-list-md>
                                                <v-layout wrap>
                                                    <v-flex xs12>
                                                        <v-text-field label="year*" :rules="yearRules" v-model="year"
                                                                      required></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                        <v-text-field label="month*" :rules="monthRules" v-model="month"
                                                                      required></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn color="blue darken-1" flat @click="post_action">发送</v-btn>

                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-layout>
                        </td>
                    </template>
                </v-data-table>
            </div>
        </v-parallax>
    </v-app>
</template>

<script>
    import Navigation from "./Navigation";
    import {APIGetDepartmentMonthlyAttendanceRecord} from "../../global";

    import axios from 'axios';

    export default {
        name: "kqtj",
        components: {Navigation},
        data: () => ({
            selectedDate: new Date("2019/07/05"),
            search: null,
            dialog: false,
            objects: [],
            year: "",

            yearRules: [
                year => !!year || "year is required",
                year => year >= 1970 || "year must larger than 1970"
            ],

            month: "",
            monthRules: [
                month => !!month || "year is required",
                month => month >= 1 || "month should larger than 1",
                month => month <= 12 || "year should less than 12"
            ],
            postsource: new FormData(),
            headers: [
                {text: "工号", align: "left", value: "wk_number"},
                {text: "姓名", align: "left", value: "wk_name"},
                {text: "出勤次数", align: "left", value: "ontime"},
                {text: "缺勤次数", align: "left", value: "late"},
                {text: "请假次数", align: "left", value: "askleave"}
            ]
        }),

        methods: {
            back() {
                this.$router.replace("/index");
            },

            post_action() {
                // month year dp_number
                this.postsource.set("dp_number", sessionStorage.getItem("adminDpNumber"));
                this.postsource.set("month", this.month);
                this.postsource.set("year", this.year);

                axios.post(APIGetDepartmentMonthlyAttendanceRecord, this.postsource)
                    .then(response => {
                        if (response.data.errno === "3000") {
                            this.objects = response.data.res;
                            this.dialog = false
                        }
                    })
                    .catch(error => {
                        alert("失败" + error);
                    });
            }
        }
    }
</script>

<style scoped>
    #kqtj-parallax {
        position: inherit;
        height: 100%
    }

    #kqtj-main {
        width: 90%;
        margin: 25px auto;
    }

    #download-excel {
        width: 120px;
        margin: 4px 2px;
    }

</style>
