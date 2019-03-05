var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schools:['北科', '清华', '农大', '地大'],
    index:0,
    inputValue:'',
    address:[

      
    ],
    newAddress:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindSchoolsChange: function (e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  saveAddress:function(){
    var that = this;
    console.log("inputValue", this.data.inputValue)
//保存到数据库
    let tableUser = new wx.BaaS.TableObject("User");
    let queryUser = new wx.BaaS.Query();
    queryUser.compare('Uid', '=', app.globalData.Uid)
    tableUser.setQuery(queryUser).find().then(res => {
      that.setData({
        address : res.data.objects[0].address
      })
      const newAddress = this.data.newAddress;
      let user = tableUser.getWithoutData(res.data.objects[0].id)
      var addressArray = that.data.address || [];
      that.setData({
        ['newAddress.school']: this.data.schools[this.data.index],
        ['newAddress.address_value']: this.data.schools[this.data.index]+this.data.inputValue})
      addressArray.push(newAddress);
      console.log("addressArray", addressArray)
      user.set('address', addressArray).update().then(res => {
        this.showCartToast()
      })
    })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
showCartToast: function () {
    console.log("showCartToast")
    wx.showToast({
      title: '地址已保存',
      icon: 'success',
      duration: 1000
    });
  }
})