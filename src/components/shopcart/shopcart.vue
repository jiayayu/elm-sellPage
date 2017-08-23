<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{highLight : foodsNum > 0}">
                            <i class="icon-shopping_cart" :class="{highLight : foodsNum > 0}"></i>
                            <div class="t-wrapper" v-for="(ball, index) in balls">
                                <transition
                                    v-on:before-enter="beforeEnter"
                                    v-on:enter="enter"
                                    v-on:after-enter="afterEnter">
                                    <div :key="index" class="ball" v-show="ball.ballShow">
                                        <div class="inner inner-hook"></div>
                                    </div>

                                </transition>
                            </div>

                        </div>
                        <div v-show="foodsNum > 0" class="num">{{foodsNum}}</div>
                    </div>
                    <div class="price" :class="{highLight : totalPrice > 0}">{{totalPrice}}元</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
                </div>
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="food in foodsSelect">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @cart-add="drop($event)" :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>

</template>

<script type="text/ecmascript-6">
    //    import Velocity from 'velocity-animate';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import BScroll from 'better-scroll';

    export default{
        props: {
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            },
            foodsSelect: {
                type: Array,
                default() {
                    return [
                        {price: 0, count: 0}
                    ];
                }
            }
        },
        data() {
            return {
                balls: [
                    {ballShow: false},
                    {ballShow: false},
                    {ballShow: false},
                    {ballShow: false},
                    {ballShow: false}
                ],
                dropBalls: [],
                fold: true
            };
        },
        components: {
            cartcontrol
        },
        computed: {
            listShow() {
                if (!this.foodsNum) {
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if (show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            },
            foodsNum() {
                let total = 0;
                this.foodsSelect.forEach(food => {
                    total += food.count;
                });
                return total;
            },
            totalPrice() {
                let price = 0;
                this.foodsSelect.forEach(food => {
                    price += food.price * food.count;
                });
                return price;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            }
        },
        methods: {
            pay() {
                if (this.payClass === 'not-enough') {
                    return;
                }
                window.alert(`您需要支付${this.totalPrice}元`);
            },
            hideList() {
                this.fold = true;
            },
            toggleList() {
                if (!this.foodsNum) {
                    return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.foodsSelect.forEach((food) => {
                    food.count = 0;
                });
            },
            drop(target) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.ballShow) {
                        const position = target.getBoundingClientRect();
                        ball.ballShow = true;
                        ball.position = position;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeEnter: function (el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.ballShow) {
                        let x = ball.position.left - 32;
                        let y = -(window.innerHeight - ball.position.top - 22);
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            enter: function (el, done) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterEnter: function (el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.ballShow = false;
                    el.style.display = 'none';
                }
            }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"
    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, .4);
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    vertical-align: top
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    background-color: #141d27
                    border-radius: 50%
                    .logo
                        position: relative
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.highLight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            color: #808581
                            &.highLight
                                color: #fff
                        .ball
                            position: absolute
                            z-index: 99
                            left: 11px
                            bottom: 11px
                            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                            .inner
                                height: 16px
                                width: 16px
                                background: #f01414
                                border-radius: 50%
                                transition: all 0.4s linear
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                        background: rgb(240, 20, 20)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, .1)
                    font-size: 16px
                    font-weight: 700
                    &.highLight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    background: #2b333b
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff


        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index: -1
            width: 100%
            transform: translate3d(0, -100%, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s
            &.fold-enter, &.fold-leave-active
                transform: translate3d(0, 0, 0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px)
        opacity: 1
        background: rgba(7, 17, 27, 0.6)
        &.fade-enter-active, &.fade-leave-active
            transition: all 0.5s
        &.fade-enter, &.fade-leave-active
            opacity: 0
            background: rgba(7, 17, 27, 0)
</style>
