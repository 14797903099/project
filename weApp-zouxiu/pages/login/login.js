// pages/login/login.js
Page({
  data:{
    username:"",
    password:"",
    tipUser:false,
    tipPwd:false
  },
  toReg:function(){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  loginCheck:function(){
    var that = this;
    var username = this.data.username;
    var password = this.data.password;
    wx.request({
      url: 'http://datainfo.duapp.com/shopdata/userinfo.php',
      data: {
        status:"login",
        userID:username,
        password:password
      },
      success: function(res) {
        if(res.data==0){
          that.setData({
            tipUser:true,
            tipPwd:false
          })
        }else if(res.data==2){
          that.setData({
            tipUser:false,
            tipPwd:true
          })
        }else{
          that.setData({
            tipUser:false,
            tipPwd:false
          })
          var appInstance = getApp();
          appInstance.globalData.username = username;
          wx.switchTab({
            url: '../home/home'
          })
        }
      }
    })
  },
  userChange:function(e){
    var username = e.detail.value;
    this.setData({
      username:username
    })
  },
  pwdChange:function(e){
    var password = e.detail.value;
    this.setData({
      password:password
    })
  }
})