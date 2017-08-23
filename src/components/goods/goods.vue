<template>
    <div class="root">
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item, index) in goods" class="menu-item border-1px"
                        :class="{'current':currentIndex===index}" v-on:click="selectMenu(index)">
                        <span class="text">
                            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>
                            {{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="item in goods" class="food-list food-list-hook">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li v-for="food in item.foods" class="food-item border-1px">
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}</span>
                                        <span>好评率{{food.rating}}</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol :food="food" @cart-add="drop($event)"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>
            <shopcart :delivery-price="seller.deliveryPrice"
                      :min-price="seller.minPrice"
                      :foodsSelect="foodsSelect"
                      ref="shopcart">
            </shopcart>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import shopcart from '../shopcart/shopcart.vue';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import BScroll from 'better-scroll';
    const ERR_OK = 0;
    export default{
        data() {
            return {
                classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                goods: [],
                listHeight: [],
                scrollY: 0,
                foodList: []
            };
        },
        props: {seller: Object},
        components: {
            shopcart,
            cartcontrol
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            },
            foodsSelect() {
                let foods = [];
                this.goods.forEach(good => {
                    good.foods.forEach(food => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        created() {
            this.$http.get('/api/goods').then(response => {
                if (response.body.errno === ERR_OK) {
                    this.goods = response.body.data;
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
        },
        methods: {
            drop(target) {
                // 体验优化，异步执行下落动画
                this.$nextTick(() => {
                    // 这里的target 事件触发事件的 加号 的dom对象
                    // position是 含有这个加号位置信息的对象
                    const position = target.getBoundingClientRect();
                    // shopcart shopcart 子组件对象
                    const shopcart = this.$refs.shopcart;
                    shopcart.drop(position, target);
                });
            },
            selectMenu(index) {
                this.foodsScroll.scrollToElement(this.foodList[index], 300);
            },
            _initScroll() {
                // console.log(this.$refs.menuWrapper);
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true  // 因为默认点击事件被阻止了，所以设置true派发一个 click 事件
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    probeType: 3, // 派发 scroll 事件监听滚动情况
                    click: true
                });
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calculateHeight() {
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                this.foodList = foodList;
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            }
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
                &.current
                    position: relative
                    z-index: 10
                    margin-top: -1px
                    background: #fff
                    font-weight: 700
                    .text
                        border-none()
                .text
                    display: table-cell
                    width: 56px
                    vertical-align: middle
                    border-1px(rgba(7, 17, 27, .1))
                    font-size: 12px
                    .icon
                        icon(3)
                        margin-right: 2px

        .foods-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147, 153, 159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7, 17, 27, .1))
                &:last-child
                    border-none()
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        height: 14px
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .desc, .extra
                        font-size: 10px
                        color: rgb(147, 153, 159)
                        line-height: 10px
                    .desc
                        margin-bottom: 8px
                        line-height: 14px
                    .extra
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            color: rgb(240, 20, 20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147, 153, 159)

                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>
