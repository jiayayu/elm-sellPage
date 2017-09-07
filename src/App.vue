<template>
    <div class="root">
        <div class="header">
            <v-header v-bind:seller='seller'></v-header>
        </div>
        <div class="tab border-1px">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评价</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>

        <!-- 路由匹配到的组件将渲染在这里 -->
        <keep-alive>
            <router-view :seller="seller"></router-view>
        </keep-alive>

    </div>
</template>

<script>
    import header from './components/header/header.vue';
    import {urlParse, URL} from 'common/js/util';

    const ERR_OK = 0;

    export default {
        data() {
            return {
                seller: {
                    id: (() => {
                        let queryParam = urlParse();
                        return queryParam.id;
                    })()
                }
            };
        },
        created() {
            this.$http.get(URL + '/api/seller/?id=' + this.seller.id).then(response => {
                if (response.body.errno === ERR_OK) {
//                    this.seller = response.body.data;
                    this.seller = Object.assign({}, this.seller, response.body.data);
                }
            });
        },
        components: {
            'v-header': header
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "./common/stylus/mixin.styl"
    .root
        .tab
            display: flex
            width: 100%
            height: 40px
            line-height: 40px
            border-1px(rgba(7, 17, 27, .1))
            .tab-item
                flex: 1
                text-align: center
                & > a
                    display: block
                    width: 100%
                    font-size: 14px
                    color: rgb(77, 85, 93)
                    &.active
                        color: rgb(240, 20, 20)


</style>
