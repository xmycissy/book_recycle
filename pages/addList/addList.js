
var app = getApp()
Page({
  data: {
    cards: [],
    minusStatuses: [],
    selectedAllStatus: false,
    total: '',
    startX: 0
  },
 bindMinus: function (e) {
    // loading提示
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.cards[index].quantity;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var cards = this.data.cards;
    cards[index].quantity=num;
    // 将数值与状态写回
    this.setData({
      cards: cards,
    });
    // update database
    let recordID = 0;
    let quantity = 0;
    let tableCard = new wx.BaaS.TableObject("Card");
    recordID = this.data.cards[index].id;
    quantity = num;
    let card = tableCard.getWithoutData(recordID)
        card.set('quantity', quantity)
        card.update().then(res => {
          // success
          wx.hideLoading();
        }, err => {
          // err
        })
    this.sum();
  },

bindPlus: function (e) {
       // loading提示
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.cards[index].quantity;
    // 不能大于99件
    if (num < 99) {
      num++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num >99? 'disabled' : 'normal';
    // 将数值与状态写回
    var cards = this.data.cards;
    cards[index].quantity=num;
    this.setData({
      cards: cards,
    });
    // update database
    let recordID = 0;
    let quantity = 0;
    let tableCard = new wx.BaaS.TableObject("Card");
    recordID = this.data.cards[index].id;
    quantity = num;
    let card = tableCard.getWithoutData(recordID)
        card.set('quantity', quantity)
        card.update().then(res => {
          // success
          wx.hideLoading();
        }, err => {
          // err
        })
    this.sum();
  },
  bindManual: function (e) {
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    var index = parseInt(e.currentTarget.dataset.index);
    var cards = this.data.cards;
    var num = parseInt(e.detail.value);
     // 将数值与状态写回
    cards[index].quantity=num;
    this.setData({
      cards: cards,
    });
// update database
    let recordID = 0;
    let quantity = 0;
    let tableCard = new wx.BaaS.TableObject("Card");
    recordID = this.data.cards[index].id;
    quantity = num;
    let card = tableCard.getWithoutData(recordID)
        card.set('quantity', quantity)
        card.update().then(res => {
          // success
          wx.hideLoading();
        }, err => {
          // err
        })

    this.sum();
  },
  reloadData: function () {
    // auto login
    var that = this;
    let tableCard = new wx.BaaS.TableObject("Card");
    let query = new wx.BaaS.Query();
    query.compare('Uid', '=', app.globalData.Uid)
    tableCard.setQuery(query).find().then(res =>{
      // success
        that.setData({
          cards: res.data.objects
        })
      this.sum();
    },
    err =>{
    })
  },
sum: function () {
    var cards = this.data.cards;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].selected) {
        total += cards[i].quantity * cards[i].recycPrice;
      }
    }
    total = total.toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      cards: cards,
      total: total
    });
  },
  bindCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在cards作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.cards[index].selected;
    var cards = this.data.cards;
    // 对勾选状态取反
    cards[index].selected=!selected;
    // 写回经点击修改后的数组
    this.setData({
      cards: cards,
    });
    // update database
    let tableCard = new wx.BaaS.TableObject("Card");
    this.data.cards[index].id;
    let card = tableCard.getWithoutData(this.data.cards[index].id)
    card.set('selected', cards[index].selected)
    card.update().then(res => {
        wx.hideLoading();
      }, err => {
    })
    this.sum();
  },
  bindSelectAll: function () {
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var cards = this.data.cards;
    // 遍历
    for (var i = 0; i < cards.length; i++) {
      cards[i].selected=selectedAllStatus;
      // update selected status to db
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      cards: cards,
    });
    this.sum();
    wx.hideLoading();
  },
  onShow: function () {
    this.reloadData();
  },
   showGoods: function (e) {
    // 点击购物车某件商品跳转到商品详情
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: '../goods/detail/detail?objectId=' + objectId
    });
  },
  touchStart: function (e) {
    var startX = e.touches[0].clientX;
    this.setData({
      startX: startX,
      itemLefts: []
    });
  },
  touchMove: function (e) {
    var index = e.currentTarget.dataset.index;
    var movedX = e.touches[0].clientX;
    var distance = this.data.startX - movedX;
    var itemLefts = this.data.itemLefts;
    itemLefts[index] = -distance;
    this.setData({
      itemLefts: itemLefts
    });
  },
  touchEnd: function (e) {
    var index = e.currentTarget.dataset.index;
    var endX = e.changedTouches[0].clientX;
    var distance = this.data.startX - endX;
    // button width is 60
    var buttonWidth = 60;
    if (distance <= 0) {
      distance = 0;
    } else {
      if (distance >= buttonWidth) {
        distance = buttonWidth;
      } else if (distance >= buttonWidth / 2) {
        distance = buttonWidth;
      } else {
        distance = 0;
      }
    }
    var itemLefts = this.data.itemLefts;
    itemLefts[index] = -distance;
    this.setData({
      itemLefts: itemLefts
    });
  },
  bindCheckout: function () {
    if(this.data.total>0)
{    wx.navigateTo({
      url: '../checkout/checkout?amount=' + this.data.total + "&cards=" + JSON.stringify(this.data.cards)
     });}
     else{
      wx.showToast({
        title: '没有任何书',
        icon: 'success',
        duration: 1000
      });
     }
  },
  delete: function (e) {
    var that = this;
    // 购物车单个删除
    var objectId = e.currentTarget.dataset.objectId;
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) {
        // update database
            let tableCard = new wx.BaaS.TableObject("Card");
          tableCard.delete(objectId).then(res => {
                  // success
                  wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 1000
                    });
                    that.reloadData();
                  wx.hideLoading();
                }, err => {
                  // err
                })
            that.sum();
          }
      }})}
})