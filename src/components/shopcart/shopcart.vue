<template>
    <div class="shopcart">
        <div class="content">
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
                <div class="pay" :class="payClass">{{payDesc}}</div>
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
//    import Velocity from 'velocity-animate';
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
                        {price: 11, count: 2}
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
                dropBalls: []
            };
        },
        computed: {
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
                    return 'not-enouth';
                } else {
                    return 'enough';
                }
            }
        },
        methods: {
            drop(position, target) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if(!ball.ballShow) {
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


</style>
