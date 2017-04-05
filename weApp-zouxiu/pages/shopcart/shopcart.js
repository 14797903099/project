// pages/shopcart/shopcart.js
Page({
  data:{
    cartList:[],
    totalGoodsNum:0,
    total:0
  },
  onShow:function(options){
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/getCar.php',
      data: {
        userID:"shaoyizhi50"
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        var res = res.data.replace("callback(","");
        var info = JSON.parse(res.slice(0,res.length-1));
        that.updatetotal(info);
      }
    })
  },
  updatetotal:function(info){  
    var totalGoodsNum = 0;
    var total = 0;
    for(var i=0;i<info.length;i++){
      var price = info[i].discount==0?info[i].price:info[i].price*info[i].discount/10;
      var nowPrice = parseFloat(Number(price).toFixed(2));
      info[i].nowPrice = nowPrice;
      totalGoodsNum+=Number(info[i].number);
      total+=info[i].nowPrice*info[i].number;
    }
    this.setData({
      cartList:info,
      totalGoodsNum:totalGoodsNum,
      total:total
    })
  },
  changeNum:function(e){
    var that = this;
    var num = e.currentTarget.dataset.num;
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if(type=="+"){
      num++;
      if(num>=99){
        num = 99;
      }
    }else{
      num--;
      if(num<=1){
        num = 1;
      }
    }
    this.updateCart(id,num,function(){
      var info = that.data.cartList;
      for(var i=0;i<info.length;i++){
        if(info[i].goodsID == id){
          info[i].number = num;
        }
      }
      that.setData({
        cartList:info
      })
      that.updatetotal(that.data.cartList)
    });
  },
  updateCart:function(id,num,cb){
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/updatecar.php',
      data: {
        userID:"shaoyizhi50",
        goodsID:id,
        number:num
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if(res.data==1){
          cb()
        }else{
          wx.showToast({
            title:"购物车更新失败"
          })
        }
      }
    })
  },
  del:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    console.log(1)
    this.updateCart(id,0,function(){
      var info = that.data.cartList;
      for(var i=0;i<info.length;i++){
        if(info[i].goodsID == id){
          info.splice(i,1);
        }
      }
      that.setData({
        cartList:info
      })
      that.updatetotal(that.data.cartList);
    })
  }
})