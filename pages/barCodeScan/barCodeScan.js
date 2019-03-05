var app = getApp()
Page({
  data: {
      cover:null,
      showView: true
  },
  scanCode: function () {
    var that =   this;
    wx.scanCode({
      success: function (res) {
        that.addCart(res);
        that.setData({
          result: res.result,
          showView:false
        })
      },
      fail: function (res) {
      }
    })
  },
  addCart: function (res) {
    this.insertCart(res);
  },
  insertCart: function (ISBN) {  
    var that = this;
    let tableCard = new wx.BaaS.TableObject("Card");
    let tableBook = new wx.BaaS.TableObject("Book");
    let queryBook = new wx.BaaS.Query();
    let queryCard = new wx.BaaS.Query();
    let bookName;
    let recycPrice;
    let total_count=0;
    var bookNameString = "book.bookName";
    var bookRPString = "book.RP";
    queryBook.compare('ISBN', '=', ISBN.result)
    queryCard.compare('ISBN', '=', ISBN.result)
    queryCard.compare('Uid', '=', app.globalData.Uid)
    // if count less then zero
    tableBook.setQuery(queryBook).find().then(res => {
      if (res.data.meta.total_count>0)
      {
        console.log("res",res);
        if (!res.data.objects[0].hasCover){
          console.log("API GET");
          this.querBookAPI(res.data.objects[0].ISBN, res.data.objects[0].id)
        }
        bookName = res.data.objects[0].bookName;
        recycPrice = res.data.objects[0].sellingPrice;
        that.setData({
          [bookNameString]: bookName,
          [bookRPString]: recycPrice,
          cover: res.data.objects[0].cover
        })
    tableCard.setQuery(queryCard).find().then(res => {
      // success
      total_count = res.data.meta.total_count;
      console.log("total_count is", total_count);
      let newRecord = tableCard.create();
      if (total_count == 0){
        newRecord.set('bookName', bookName)
        newRecord.set('ISBN', ISBN.result)
        newRecord.set('recycPrice', recycPrice)
        newRecord.set('quantity', 1)
        newRecord.set('Uid', app.globalData.Uid)
        newRecord.set('cover',this.data.cover)
        newRecord.save().then(res => {
          // success
          that.showCartToast();
        }, err => {
          // HError 对象
        })
      }
      else{
        let quantity = 0;
        let recordID = 0;
        recordID = res.data.objects[0].id;
        quantity = res.data.objects[0].quantity+1;
        let card = tableCard.getWithoutData(recordID)
        card.set('quantity', quantity)
        card.update().then(res => {
          // success
          that.showCartToast();
        }, err => {
          // err
        })
      }
    }, err => {
      // err
    })}
else{
        console.log("not this book")
        wx.showToast({
          title: '抱歉，不收购该书',
          icon: 'none',
          duration: 2500
        });
}
    })
  },
  showCartToast: function () {
    console.log("showCartToast")
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    });
  },
  querBookAPI: function (ISBN, objectsid){
    var that=this;
    var bookMPString = "book.MP";
    var bookCoverString = "book.cover";
    wx.request({
      url: 'https://isbn.market.alicloudapi.com/ISBN',
      data: {
        isbn: ISBN,
        is_info: 0
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { Authorization: 'APPCODE 32d3dfc877fe4cff81a7a7c08a863fc0' }, // 设置请求的 header
      success: function (res) {
        // success
        that.setData({
         [bookMPString]: res.data.result.price,
         [bookCoverString]: res.data.result.images_large,
          cover: res.data.result.images_large
        })
        let tableBook = new wx.BaaS.TableObject("Book");
        let book = tableBook.getWithoutData(objectsid)
        book.set('hasCover', true)
        book.set('cover', that.data.book.cover)
        book.set('marketPrice', parseInt(that.data.book.MP))
        book.update().then(res => {
          // success
        }, err => {
          // err
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})