Page({
  data: {
    rates: '',
    ci_ku: '',
    words: 0,
    num: 40
  },

  more: function () {
    wx.navigateTo({
      url: '/pages/test2/test2',
    })
  },

  back: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  onLoad: function (options) {
    if (options.score) {
      const score = options.score;
      console.log('接收到的 score:', score);
      this.setData({
        words: score,
      });
    }
  },

  onReady: function () {},

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
});
