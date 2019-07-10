<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed" id="md-app">
            <md-app-toolbar class="md-large md-dense md-primary">
                <div class="md-toolbar-row">
                    <v-btn flat icon color="blue lighten-2" @click="backLogin">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>

                    <div class="md-toolbar-section-start">
                        <span class="md-title">考勤管理后台</span>
                    </div>
                </div>

                <div class="md-toolbar-row">
                    <div>
                        <md-tabs md-sync-route class="md-primary">
                            <md-tab id="tab-home" md-label="职工管理"
                                    to="/admin/navigation/zggl" exact
                            ></md-tab>

                            <md-tab id="tab-pages" md-label="考勤统计"
                                    to="/admin/navigation/kqtj" exact
                            ></md-tab>

                            <md-tab id="tab-posts" md-label="请假管理"
                                    to="/admin/navigation/qjgl" exact
                            ></md-tab>
                        </md-tabs>
                    </div>
                </div>
            </md-app-toolbar>

        </md-app>
    </div>
</template>

<script>
    // import Home from "../layout/Home";
    // import zggl from "../components/zggl";
    // import kqtj from "../components/kqtj";
    // import qjgl from "../components/qjgl";

    export default {
        name: "Navigation",
        data: () => ({
            menuVisible: false,

            // PageHome: Home,
            // PageZggl: zggl,
            // PageKqtj: kqtj,
            // PageQjgl: qjgl,
            // currentView: Home

        }),
        // components: {
        //     Home,
        //     zggl,
        //     kqtj,
        //     qjgl
        //
        //
        // },
        methods: {
            backLogin() {
                this.$router.push({name: 'Login'})
            },
            // tabChange(tabItem) {
            //     this.currentView = tabItem;
            // }
        }
    }
</script>

<style scoped>
    #md-app {
        border: 0 solid;
    }

    .md-drawer {
        max-width: calc(100vw - 125px);
    }

</style>
