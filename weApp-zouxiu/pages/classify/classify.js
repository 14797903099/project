// pages/classify/classify.js
Page({
  data:{
    classList:[],
    goodsList:[],
    initPageCode:0,
    canbeLoadMore:true
  },
  onLoad:function(options){
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/getclass.php',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        that.setData({
          classList:res.data
        }) 
      }
    })

    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/getGoods.php',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      data:{
        classID:1,
        pageCode:0
      },
      success: function(res){
        // success
        var middle = res.data.replace("callback(","");
        var info = JSON.parse(middle.substring(0,middle.length-1));
        that.setGoodsInfo(info);
      }
    })
  },
  setGoodsInfo:function(info){
    var newInfo = [];
    for(var i=0;i<info.length;i++){
      var nowPrice = Number(info[i].discount==0?info[i].price:info[i].discount*info[i].price/10).toFixed(2);
      newInfo.push({
        goodsListImg:info[i].goodsListImg,
        goodsName:info[i].goodsName,
        nowPrice:nowPrice,
        price:info[i].price,
        goodsID:info[i].goodsID
      })
    }
    this.setData({
      goodsList:newInfo
    })
  },
  onPullDownRefresh:function(){
    var that = this;
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/getGoods.php',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data:{
        classID:1,
        pageCode:0
      },
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        var middle = res.data.replace("callback(","");
        var info = JSON.parse(middle.substring(0,middle.length-1));
        that.setGoodsInfo(info);
        wx.stopPullDownRefresh();
        that.setData({
          canbeLoadMore:true,
          initPageCode:0
        })
      }
    })
  },
  onReachBottom:function(){
    var that = this;
    if(this.data.canbeLoadMore){
      var pageCode = this.data.initPageCode;
      console.log(pageCode)
      pageCode++;
      this.setData({
        initPageCode:pageCode
      })
      wx.request({
        url: 'http://datainfo.duapp.com/shopdata/getGoods.php',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        data:{
          classID:1,
          pageCode:pageCode
        },
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          var middle = res.data.replace("callback(","");
          var info = JSON.parse(middle.substring(0,middle.length-1));
          var newInfo = [];
          for(var i=0;i<info.length;i++){
            var nowPrice = Number(info[i].discount==0?info[i].price:info[i].discount*info[i].price/10).toFixed(2);
            newInfo.push({
              goodsListImg:info[i].goodsListImg,
              goodsName:info[i].goodsName,
              nowPrice:nowPrice,
              price:info[i].price,
              goodsID:info[i].goodsID
            })
          }
          var goodsList = that.data.goodsList;
          for(var i=0;i<info.length;i++){
            goodsList.push(newInfo[i]);
          }
          if(info==0){
            that.setData({
              canbeLoadMore:false
            })
          }else{
            that.setData({
              goodsList:goodsList
            })
          }
        }
      })
    }else{
      wx.showToast({
        title:"已经没有更多数据了"
      })
    }
  },
  toDetail:function(e){
    var goodsID = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?goodsID='+goodsID
    })
  }
})