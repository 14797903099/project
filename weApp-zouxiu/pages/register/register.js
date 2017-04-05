// pages/register/register.js
Page({
  data:{
    username:"",
    password:"",
    repPwd:"",
    tipRepPwd:false,
    tipUser:false,
    tipDataBase:false
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
  },
  repPwdChange:function(e){
    var repPwd = e.detail.value;
    this.setData({
      repPwd:repPwd
    })
  },
  registerCheck:function(){
    var password = this.data.password;
    var repPwd = this.data.repPwd;
    var that = this;
    var username = this.data.username;
    if(password==repPwd){
      this.setData({
        tipRepPwd:false
      })
      wx.request({
        url: 'http://datainfo.duapp.com/shopdata/userinfo.php',
        data: {
          status:"register",
          userID:username,
          password:password
        },
        success: function(res) {
          if(res.data==0){
            that.setData({
              tipUser:true,
              tipDataBase:false
            })
          }else if(res.data==1){
            that.setData({
              tipUser:false,
              tipDataBase:false
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            that.setData({
              tipUser:false,
              tipDataBase:true
            })
            wx.navigateTo({
              url: '../main/main'
            })
          }
        }
      })
    }else{
      this.setData({
        tipRepPwd:true
      })
    }
  }
})