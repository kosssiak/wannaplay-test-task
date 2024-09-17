export abstract class TweensEase {                      // This class provides various easing functions

    public static none: any = TweensEase.linearFn();
    public static linear: any = TweensEase.linearFn();

    public static quadIn: any = TweensEase.getPowIn(2);
    public static quadOut: any = TweensEase.getPowOut(2);
    public static quadInOut: any = TweensEase.getPowInOut(2);
    public static quadOutIn: any = TweensEase.quadOutInFn()

    public static cubicIn: any = TweensEase.getPowIn(3);
    public static cubicOut: any = TweensEase.getPowOut(3);
    public static cubicInOut: any = TweensEase.getPowInOut(3);
    public static cubicOutIn: any = TweensEase.cubicOutInFn()

    public static quartIn: any = TweensEase.getPowIn(4);
    public static quartOut: any = TweensEase.getPowOut(4);
    public static quartInOut: any = TweensEase.getPowInOut(4);
    public static quartOutIn: any = TweensEase.quartOutInFn()

    public static quintIn: any = TweensEase.getPowIn(5);
    public static quintOut: any = TweensEase.getPowOut(5);
    public static quintInOut: any = TweensEase.getPowInOut(5);
    public static quintOutIn: any = TweensEase.quintOutInFn()

    public static backIn: any = TweensEase.getBackIn(1.7);
    public static backOut: any = TweensEase.getBackOut(1.7);
    public static backInOut: any = TweensEase.getBackInOut(1.7);
    public static backOutIn: any = TweensEase.backOutInFn();

    public static elasticIn: any = TweensEase.getElasticIn(1, 0.4);
    public static elasticOut: any = TweensEase.getElasticOut(1, 0.4);
    public static elasticInOut: any = TweensEase.getElasticInOut(1, 0.4);
    public static elasticOutIn: any = TweensEase.elasticOutInFn();

    public static sineIn: any = TweensEase.sineInFn();
    public static sineOut: any = TweensEase.sineOutFn();
    public static sineInOut: any = TweensEase.sineInOutFn();
    public static sineOutIn: any = TweensEase.sineOutInFn();

    public static circIn: any = TweensEase.circInFn();
    public static circOut: any = TweensEase.circOutFn();
    public static circInOut: any = TweensEase.circInOutFn();
    public static circOutIn: any = TweensEase.circOutInFn();

    public static bounceIn: any = TweensEase.bounceInFn();
    public static bounceOut: any = TweensEase.bounceOutFn();
    public static bounceInOut: any = TweensEase.bounceInOutFn();
    public static bounceOutIn: any = TweensEase.bounceOutInFn();

    public static expoIn: any = TweensEase.exponentialInFn();
    public static expoOut: any = TweensEase.exponentialOutFn();
    public static expoInOut: any = TweensEase.exponentialInOutFn();
    public static expoOutIn: any = TweensEase.exponentialOutInFn();

    /**
     * Mimics the simple -100 to 100 easing in Adobe Flash/Animate.
     * @method get
     * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
     * @static
     * @return {Function}
     **/
    public static get(amount) {
        if (amount < -1) {
            amount = -1;
        } else if (amount > 1) {
            amount = 1;
        }
        return function Fn(t) {
            if (amount == 0) {
                return t;
            }
            if (amount < 0) {
                return t * (t * -amount + 1 + amount);
            }
            return t * ((2 - t) * amount + (1 - amount));
        };
    }

    /**
     * Configurable exponential ease.
     * @method getPowIn
     * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
     * @static
     * @return {Function}
     **/
    public static getPowIn(pow) {
        return function (t) {
            return Math.pow(t, pow);
        };
    }

    /**
     * Configurable exponential ease.
     * @method getPowOut
     * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
     * @static
     * @return {Function}
     **/
    public static getPowOut(pow) {
        return function (t) {
            return 1 - Math.pow(1 - t, pow);
        };
    }

    /**
     * Configurable exponential ease.
     * @method getPowInOut
     * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
     * @static
     * @return {Function}
     **/
    public static getPowInOut(pow) {
        return function (t) {
            if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
            return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
        };
    }

    /**
     * Configurable "back in" ease.
     * @method getBackIn
     * @param {Number} amount The strength of the ease.
     * @static
     * @return {Function}
     **/
    public static getBackIn(amount) {
        return function (t) {
            return t * t * ((amount + 1) * t - amount);
        };
    }

    /**
     * Configurable "back out" ease.
     * @method getBackOut
     * @param {Number} amount The strength of the ease.
     * @static
     * @return {Function}
     **/
    public static getBackOut(amount) {
        return function (t) {
            return --t * t * ((amount + 1) * t + amount) + 1;
        };
    }

    /**
     * Configurable "back in out" ease.
     * @method getBackInOut
     * @param {Number} amount The strength of the ease.
     * @static
     * @return {Function}
     **/
    public static getBackInOut(amount) {
        amount *= 1.525;
        return function (t) {
            if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
            return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
        };
    }

    /**
     * Configurable elastic ease.
     * @method getElasticIn
     * @param {Number} amplitude
     * @param {Number} period
     * @static
     * @return {Function}
     **/
    public static getElasticIn(amplitude, period) {
        const pi2 = Math.PI * 2;
        return function (t) {
            if (t == 0 || t == 1) return t;
            const s = (period / pi2) * Math.asin(1 / amplitude);
            return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * pi2) / period));
        };
    }

    /**
     * Configurable elastic ease.
     * @method getElasticOut
     * @param {Number} amplitude
     * @param {Number} period
     * @static
     * @return {Function}
     **/
    public static getElasticOut(amplitude, period) {
        const pi2 = Math.PI * 2;
        return function (t) {
            if (t == 0 || t == 1) return t;
            const s = (period / pi2) * Math.asin(1 / amplitude);
            return amplitude * Math.pow(2, -10 * t) * Math.sin(((t - s) * pi2) / period) + 1;
        };
    }

    /**
     * Configurable elastic ease.
     * @method getElasticInOut
     * @param {Number} amplitude
     * @param {Number} period
     * @static
     * @return {Function}
     **/
    public static getElasticInOut(amplitude, period) {
        const pi2 = Math.PI * 2;
        return function (t) {
            const s = (period / pi2) * Math.asin(1 / amplitude);
            if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * pi2) / period));
            return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t - s) * pi2) / period) * 0.5 + 1;
        };
    }
    /**
     * @method quadOutIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static quadOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.quadOut(t * 2) * 0.5;
            return TweensEase.quadIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }
    /**
     * @method cubicInOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static cubicOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.cubicOut(t * 2) * 0.5;
            return TweensEase.cubicIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method quartOutIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static quartOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.quartOut(t * 2) * 0.5;
            return TweensEase.quartIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method quintOutIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static quintOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.quintOut(t * 2) * 0.5;
            return TweensEase.quintIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method backOutIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static backOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.backOut(t * 2) * 0.5;
            return TweensEase.backIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method elasticOutIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static elasticOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.elasticOut(t * 2) * 0.5;
            return TweensEase.elasticIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method sineIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static sineInFn() {
        return function (t) {
            return 1 - Math.cos((t * Math.PI) / 2);
        };
    }

    /**
     * @method sineOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static sineOutFn() {
        return function (t) {
            return Math.sin((t * Math.PI) / 2);
        };
    }

    /**
     * @method sineInOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static sineInOutFn() {
        return function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        };
    }

    /**
     * @method sineInOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static sineOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.sineOut(t * 2) * 0.5;
            return TweensEase.sineIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method circIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static circInFn() {
        return function (t) {
            return -(Math.sqrt(1 - t * t) - 1);
        };
    }

    /**
     * @method circOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static circOutFn() {
        return function (t) {
            return Math.sqrt(1 - --t * t);
        };
    }

    /**
     * @method circInOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static circInOutFn() {
        return function (t) {
            if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        };
    }

    /**
     * @method circOutInFn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static circOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.circOut(t * 2) * 0.5;
            return TweensEase.circIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method bounceIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static bounceInFn() {
        return function (t) {
            return 1 - TweensEase.bounceOut(1 - t);
        };
    }

    /**
     * @method bounceOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static bounceOutFn() {
        return function (t) {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        };
    }

    /**
     * @method bounceInOut
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static bounceInOutFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.bounceIn(t * 2) * 0.5;
            return TweensEase.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method bounceOutIn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static bounceOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.bounceOut(t * 2) * 0.5;
            return TweensEase.bounceIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }


    /**
     * @method exponentialInFn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static exponentialInFn() {
        return function (t) {
            return t === 0 ? 0 : Math.pow(1024, t - 1);
        };
    }

    /**
     * @method exponentialOutFn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static exponentialOutFn() {
        return function (t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };
    }

    /**
     * @method exponentialInOutFn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static exponentialInOutFn() {
        return function (t) {
            if (t === 0) {
                return 0;
            }
            if (t === 1) {
                return 1;
            }
            if ((t *= 2) < 1) {
                return 0.5 * Math.pow(1024, t - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
        };
    }

    /**
     * @method exponentialOutInFn
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static exponentialOutInFn() {
        return function (t) {
            if (t < 0.5) return TweensEase.expoOut(t * 2) * 0.5;
            return TweensEase.expoIn(t * 2 - 1) * 0.5 + 0.5;
        };
    }

    /**
     * @method linear
     * @param {Number} t
     * @static
     * @return {Number}
     **/
    private static linearFn() {
        return (t) => {
            return t;
        };
    }
}
