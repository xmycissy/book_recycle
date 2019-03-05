const app = getApp()
Page({
  data: {
    amount: 0,
    addressList: [],
    addressIndex: 0,
    cards:""
  },
  addressObjects: [],
  onLoad: function (options) {
    var that=this;
    let tableUser = new wx.BaaS.TableObject("User");
    let queryUser = new wx.BaaS.Query();
    queryUser.compare('Uid', '=', app.globalData.Uid)
    tableUser.setQuery(queryUser).find().then(res => {
      var addressObjectList= res.data.objects[0].address
      var addressList = that.data.addressList || [];
      for (var i = 0; i < addressObjectList.length; i++){
        addressList.push(addressObjectList[i].address_value)
      }
        that.setData({
          addressList: addressList
        })
    })
    this.setData({
      amount: options.amount,
      cards: JSON.parse(options.cards)
    });
    
  },
  onShow: function () {
  },
  bindPickerChange: function (e) {
    this.setData({
      addressIndex: e.detail.value
    })
  },
  bindCreateNew: function () {
    var addressList = this.data.addressList;
    if (addressList.length == 0) {
      wx.navigateTo({
        url: '../addressAdd/addressAdd'
      });
    }
  },
  confirmOrder:function(){
    let tableOrder = new wx.BaaS.TableObject("Order");
    let queryOrder = new wx.BaaS.Query();
    queryOrder.compare('Uid', '=', app.globalData.Uid)
    let newOrder = tableOrder.create();
    newOrder.set('Uid', app.globalData.Uid)
    newOrder.set('amount', parseInt(this.data.amount))
    newOrder.set('address', this.data.addressList[this.data.addressIndex])
    ///添加cards
    let cartArray=[];
    for(var i=0;i<this.data.cards.length;i++){
      var cart = this.data.cards[i];
      cartArray.push(cart)
    }
    newOrder.set('cards', JSON.stringify(cartArray))
      newOrder.save().then(res => {
      //that.showCartToast();
      ///删除cards
      let tableCard = new wx.BaaS.TableObject("Card");
      for(var i=0;i<this.data.cards.length;i++)
      {
        if (this.data.cards[i].selected){
          tableCard.delete(this.data.cards[i].id)
        }
    }
      }, err => {
        // HError 对象
      })
  },
  editAddress:function(){
    var addressList = this.data.addressList;
      wx.navigateTo({
        url: '../editAddress/editAddress'
      });
  }


})