// pages/goodsdetail/goodsdetail.js
Page({
  data:{
    goodsID:"",
    goodsInfo:{},
    goodsNum:1
  },
  onLoad:function(options){
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({goodsID:options.goodsID});
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/getGoods.php',
      data: {
        goodsID:that.data.goodsID
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        var res = res.data.replace("callback(","");
        var info = JSON.parse(res.slice(0,res.length-1));
        console.log(info)
        that.setGoodsInfo(info);
      }
    })
  },
  setGoodsInfo:function(info){
      var nowPrice = Number(info[0].discount==0?info[0].price:info[0].discount*info[0].price/10).toFixed(2);
      var newInfo = {
        goodsListImg:info[0].goodsListImg,
        goodsName:info[0].goodsName,
        nowPrice:nowPrice,
        price:info[0].price,
        goodsID:info[0].goodsID,
        goodsBenUrl:JSON.parse(info[0].goodsBenUrl),
        detail:info[0].detail,
        buynumber:info[0].buynumber
      }
    this.setData({
      goodsInfo:newInfo
    })
  },
  toDeepDetail:function(){
    wx.navigateTo({
      url: '../goodsdeepdetail/goodsdeepdetail'
    })
  },
  addCart:function(){
    var app = getApp();
    var that = this;
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/updatecar.php',
      data: {
        userID:app.globalData.username,
        goodsID:that.data.goodsID,
        number:that.data.goodsNum
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if(res.data==1){
          wx.showToast({
            title:"商品成功加入购物车"
          })
          wx.switchTab({
            url: '../shopcart/shopcart'
          })
        }
      }
    })
  },
  goodsNumChange:function(e){
    this.setData({
      goodsNum:e.detail.value
    })
  },
  changeNum:function(e){
    var type = e.currentTarget.dataset.type;
    var num = this.data.goodsNum;
    if(type=="-"){
      num--;
      if(num<=0){
        num=0;
      }
      this.setData({
        goodsNum:num
      })
    }else{
      num++;
      if(num>=99){
        num=99;
      }
      this.setData({
        goodsNum:num
      })
    }
    console.log(this.data.goodsNum)
  }
})