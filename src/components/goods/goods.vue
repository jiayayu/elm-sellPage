<template>
    <div class="root">
        <div class="goods">
            <div class="menu-wrapper">
                <ul>
                    <li v-for="item in goods" class="menu-item border-1px">

                        <span class="text">
                            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>
                            {{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    const ERR_OK = 0;
    export default{
        data() {
            return {
                classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                goods: []
            };
        },
        props: {seller: Object},
        created() {
            this.$http.get('/api/goods').then(response => {
                if (response.body.errno === ERR_OK) {
                this.goods = response.body.data;
                // console.log(this.goods);
                }
            });
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"
    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
            .menu-item
                display: table
                height: 54px
                width: 56px
                line-height: 14px
                padding: 0 12px
                .text
                    display: table-cell
                    width: 56px
                    vertical-align: middle
                    border-1px(rgba(7,17,27,.1))
                    font-size: 12px
                    .icon
                        icon(3)
                        margin-right: 2px



</style>
