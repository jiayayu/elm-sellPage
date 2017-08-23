<template>
    <div class="cartcontrol">
        <transition name="move">
            <div
                class="cart-decrease icon-remove_circle_outline"
                @click="decreaseCart"
                v-show="food.count>0">
            </div>
        </transition>
        <transition name="fade">
            <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        </transition>
        <div class="cart-add icon-add_circle" @click="addCart"></div>
    </div>

</template>

<script type="text/ecmascript-6">
    export default{
        data() {
            return {};
        },
        props: {
            food: {
                type: Object
            }
        },
        created() {

        },
        methods: {
            addCart(events) {
                if (!this.food.count) {
                    this.$set(this.food, 'count', 1);
                } else {
                    this.food.count += 1;
                }
                this.$emit('cart-add', events.target);
            },
            decreaseCart() {
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

    .move-enter-active, .move-leave-active {
        transition: all .5s ease;
    }
    .move-enter, .move-leave-to {
        transform: translate3d(30px, 0, 0) rotateZ(180deg);
        opacity: 0;
    }
    .fade-enter-active {
        transition: all .3s ease;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .cartcontrol
        font-size: 0
        .cart-decrease, .cart-add
            display: inline-block
            font-size: 24px
            line-height: 24px
            padding: 6px
            color: rgb(0, 160, 220)
        .cart-count
            display: inline-block
            vertical-align: top
            width: 12px
            padding-top: 6px
            line-height: 24px
            text-align: center
            font-size: 10px
            color: rgb(147, 153, 159)
        .cart-add
            display: inline-block
</style>
