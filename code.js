// pages/appointment/appointment.js

var app = getApp();
var city=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    wuliaofei:0,
    wuliaofeiTax:0
  },
  onLoad: function (options) {
    console.log("363636")
    console.log(options.serviceType)
    wx.showToast({
      title: '请稍候',
      mask:true,
      icon:"loading",
      duration:2000
    })
    this.setData({
      serviceType: options.serviceType
    })
    var that=this;
    //查询税率
    wx.request({
      url: app.globalData.apiHttp + 'common/getServiceTaxRatio',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        accessToken: app.globalData.accessToken,
      },
      success: function (res) {
        console.log(res);
        //设置税率
        that.setData({
          serviceTaxRatio: parseFloat((parseFloat(res.data.data.serviceTaxRatio)/100).toFixed(2)),//服务费税率
          materialTaxRatio: parseFloat((parseFloat(res.data.data.materialTaxRatio) / 100).toFixed(2))//物料费税率
        })
        //服务提供者信息及初始价格信息
        that.setData({
          userInfo: JSON.parse(options.userInfo),
          buyInfo: JSON.parse(options.buyInfo),
          price: parseFloat(JSON.parse(options.buyInfo).servicePrice),
          taxPrice: parseFloat((parseFloat(JSON.parse(options.buyInfo).servicePrice) * that.data.serviceTaxRatio).toFixed(2)),
          total: parseFloat(JSON.parse(options.buyInfo).servicePrice) + parseFloat((parseFloat(JSON.parse(options.buyInfo).servicePrice) * that.data.serviceTaxRatio).toFixed(2))
        })
      }
    })
    
    //服务提供者id
    this.setData({
      providerId: options.id
    })
    
    console.log("555")
    console.log(this.data.userInfo);
    // 生命周期函数--监听页面加载
    showView: (options.showView == "true" ? true : false)
    city=wx.getStorageSync("city");
    //默认当前年月
    var obj = new Date();
    if (obj.getMonth() > 9) {
      var month = (obj.getMonth() + 1);

    } else {
      var month = '0' + (obj.getMonth() + 1);
    }
    if (obj.getDate() > 9) {
      var day = obj.getDate()
    } else {
      var day = '0' + obj.getDate()
    }
    this.setData({
      date: obj.getFullYear() + '-' + month + "-" + day,
      startYue:month,
      startDay: day,
      endYue: month,
      endDay: day,
    })
    console.log(this.data.date)
  }
  ,
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

 
  //选择开始时间
  chooseStart: function (e) {
    console.log(e.detail.value);
    //如果有结束时间,
    if(this.data.endTime){  
      this.setData({
        startTime:e.detail.value,
        startYue: e.detail.value.substring(5, 7),
        startDay: e.detail.value.substring(8, 10),
      })
      //设置结束时间为选中的结束时间
      this.setData({
        endYue: this.data.endTime.substring(5, 7),
        endDay: this.data.endTime.substring(8, 10),
        endTime: this.data.endTime,
      })
      //计算服务天数
      var cha = parseInt(this.datedifference(this.data.startTime, this.data.endTime)) + 1
      this.setData({
        diff:cha,
        price: cha * parseFloat(this.data.buyInfo.servicePrice),
        taxPrice: parseFloat((cha * parseFloat(this.data.buyInfo.servicePrice)*this.data.serviceTaxRatio).toFixed(2))
      })
      this.setData({
        total: this.data.price + this.data.taxPrice + this.data.wuliaofei+this.data.wuliaofeiTax
      })
    }else{
      
      this.setData({
        startTime: e.detail.value,
        startYue: e.detail.value.substring(5, 7),
        startDay: e.detail.value.substring(8, 10),   
      })
      //如果没有结束时间,设置结束时间为开始时间
      this.setData({
        endYue: e.detail.value.substring(5, 7),
        endDay: e.detail.value.substring(8, 10),
        endTime: e.detail.value,
      })
      var cha = parseInt(this.datedifference(this.data.startTime, this.data.endTime)) + 1
      this.setData({
        diff:cha,
        price: parseFloat(cha * parseFloat(this.data.buyInfo.servicePrice).toFixed(2)),
        taxPrice: parseFloat((cha * parseFloat(this.data.buyInfo.servicePrice) * this.data.serviceTaxRatio).toFixed(2))
      })
      this.setData({
        total: this.data.price + this.data.taxPrice + this.data.wuliaofei + this.data.wuliaofeiTax
      })
    }
    
  },
  
  //选择结束时间
  chooseEnd: function (e) {
   
    //如果选择了开始时间
    if (this.data.startTime){ 
      console.log(this.data.startTime) 
      this.setData({
        endYue: e.detail.value.substring(5, 7),
        endDay: e.detail.value.substring(8, 10),
        endTime: e.detail.value,
       
      })
      this.setData({
        startTime: this.data.startTime,
        startYue: this.data.startTime.substring(5, 7),
        startDay: this.data.startTime.substring(8, 10),
      })
      var cha = parseInt(this.datedifference(this.data.startTime, this.data.endTime)) + 1
      this.setData({
        diff:cha,
        price: parseFloat(cha * parseFloat(this.data.buyInfo.servicePrice).toFixed(2)),
        taxPrice: parseFloat((cha * parseFloat(this.data.buyInfo.servicePrice) * this.data.serviceTaxRatio).toFixed(2))
      })
      //计算总价
      this.setData({
        total: this.data.price + this.data.taxPrice + this.data.wuliaofei + this.data.wuliaofeiTax
      })
    }else{
      this.setData({
        endYue: e.detail.value.substring(5, 7),
        endDay: e.detail.value.substring(8, 10),
        endTime: e.detail.value,

      })
      //如果没选择开始时间,默认开始时间等于结束时间
      this.setData({
        startTime: this.data.endTime,
        startYue: this.data.endTime.substring(5, 7),
        startDay: this.data.endTime.substring(8, 10),
      })
      //计算服务天数
     var cha = parseInt(this.datedifference(this.data.startTime, this.data.endTime)) + 1
     this.setData({
       diff:cha,
       price: parseFloat(cha * parseFloat(this.data.buyInfo.servicePrice).toFixed(2)),
       taxPrice: parseFloat((cha * parseFloat(this.data.buyInfo.servicePrice) * this.data.serviceTaxRatio).toFixed(2)),
     })
     this.setData({
       total: this.data.price + this.data.taxPrice + this.data.wuliaofei + this.data.wuliaofeiTax
     })
    }
  
  },
  //监听工作内容输入
  listenContent:function(e){
      this.setData({
        content:e.detail.value
      })
  },
  //监听物料费输入
  wuliao:function(e){
    console.log(e.detail.value);
    if(e.detail.value.substr(2,1)=="￥"){
      e.detail.value = e.detail.value.substr(3)
    }
    console.log(e.detail.value+"ppp");
    this.setData({
      wuliaofei: e.detail.value?parseFloat(e.detail.value):0,
      
    })
  },
 //物料费失焦
  toblur:function(){
    this.setData({
      wuliao:"  ￥"+this.data.wuliaofei,
      wuliaofeiTax: parseFloat((parseFloat(this.data.wuliaofei) * this.data.materialTaxRatio).toFixed(2))
    })
    this.setData({
      total: this.data.price + this.data.taxPrice + this.data.wuliaofei + this.data.wuliaofeiTax
    })
  },
  //点击下单
  toPay: function (e) {
   console.log("下单")
   wx.showToast({
     title: '请稍后',
     icon:"loading",
     mask:true,
     duration:2000
   })
   var that=this
   //服务时间(开始结束)
   var startTime = this.data.startTime ? this.data.startTime:this.data.date
   var endTime = this.data.endTime ? this.data.endTime : this.data.date;
   //服务地(省市)
   var province = this.data.buyInfo.provinceId
   var city=this.data.buyInfo.cityId
   //协议服务费
   var serverTotal=this.data.price;
   //服务费税金
   var taxPrice=this.data.taxPrice;
   console.log(serverTotal)
   console.log(province)
   console.log(city)
   var content=this.data.content;
   //物料费
   var wuliaofei= this.data.wuliaofei
   //物料费税金
   var wlfsj = this.data.wuliaofeiTax
   //总金额
   var total = this.data.total
   var serviceType = this.data.serviceType
   console.log(wuliaofei+"333")
   //工作内容不能为空
   if(!content){
     wx.showModal({
       title: '提示',
       content: '请输入工作内容',
       showCancel:false
     })
     return;
   }
   //请求下单接口
   wx.request({
     url: app.globalData.apiHttp + 'order/addOrder',
     method: 'POST',
     header: {
       "Content-Type": "application/x-www-form-urlencoded"
     },
     data: {
       accessToken: app.globalData.accessToken,
       providerId: that.data.providerId,
       startDate: startTime,
       endDate: endTime,
       providerProvinceId: province,
       providerCityId: city,
       serviceContext: content,
       servicePrice: serverTotal,
       serviceTaxPrice: taxPrice,
       materialPrice: wuliaofei,
       materialTaxPrice: wlfsj,
       orderPrice:total,
       productType:serviceType
     },
     success: function (res) {
       console.log("888");
       console.log(res);
       if (res.data.status==100){
         wx.showToast({
           title: '下单成功',
           mask:true,
         })
         that.setData({
           orderId: res.data.data.orderNumber
         })
         setTimeout(function(){
           wx.navigateTo({
             url: '../order-show/order-content?orderId=' + res.data.data.orderNumber + "&status=10",
           })
         },1500)
         
       }else{
         wx.showModal({
           title: '提示',
           content: "系统错误",
           showCancel:false
         })
       }
     }
   })
   
   
  },
  //计算相差几天
  datedifference:function(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    var dateSpan,tempDate,iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
  },
  //联系他
  toConnect:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.userInfo.mobileNumber,
    })
  }

})
