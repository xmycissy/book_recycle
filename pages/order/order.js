var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [

    ],
    mappingData2:[
        {
            mapping:{
              avatar:"https://img.alicdn.com/bao/uploaded/TB1xT1VMpXXXXaMXVXXXXXXXXXX_!!0-item_pic.jpg_180x180xzq90.jpg_.webp"
            }
        },
        {
          mapping: {
            avatar: "https://img.alicdn.com/bao/uploaded/TB2G60yjXXXXXbTXpXXXXXXXXXX_!!346761511-0-dgshop.jpg_180x180xzq90.jpg_.webp"

          },
          mapping2: {
            avatar: "https://img.alicdn.com/bao/uploaded/TB1gIx6o8TH8KJjy0FiXXcRsXXa_!!2-item_pic.png_180x180xzq90.jpg_.webp"
          }
        }
    ],
    mappingData: []


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
    this.reloadData();
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
  reloadData: function () 
  {
    var that = this;
    let tableOrder = new wx.BaaS.TableObject("Order");
    let queryOrder = new wx.BaaS.Query();
    //queryOrder.compare('Uid', '=', app.globalData.Uid)

    tableOrder.setQuery(queryOrder).find().then( res => 
    {
      that.setData({
        orders: res.data.objects,
      });
      var mappingData=[];
      for (var i = 0; i < this.data.orders.length; i++) 
      {
            mappingData.push(JSON.parse(this.data.orders[i].cards))
      }
      that.setData
        ({
          mappingData: mappingData
        })
    })
  }
  
})