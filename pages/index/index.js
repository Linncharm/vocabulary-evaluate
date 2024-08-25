Page({
  data: {
    name: ''
  },
  
  // 处理输入框内容
  onNameInput(event) {
    this.setData({
      name: event.detail.value
    });
  },
  
  // 保存数据
  saveName() {
    const { name } = this.data;
    if (name) {
      wx.setStorageSync('userName', name);
      
      return true;
    } else {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },
  
  
  // 跳转到 Test2 页面并保存数据
  navigateToTest2() {
    if (this.saveName()) {
      wx.navigateTo({
        url: '/pages/test2/test2'
      });
    }
  }
});
